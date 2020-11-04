const envHelper = require('./../helpers/environmentVariablesHelper.js')
const _ = require('lodash')
var azure = require('azure-storage')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const blobService = azure.createBlobService(envHelper.sunbird_azure_account_name, envHelper.sunbird_azure_account_key);
const logger = require('sb_logger_util_v2');
const async = require('async');

const validateSlug = (allowedFolders = []) => {
    return (req, res, next) => {
        let paramsSlug = _.split(_.get(req, 'params.slug'), '__')[0];
        if (_.includes([...allowedFolders, _.get(req, 'session.rootOrg.slug')], paramsSlug)) {
            logger.info({ msg: 'validate slug passed' })
            next();
        } else {
            logger.error({ msg: 'validate slug failed', allowedFolders, sessionRootOrgDetails: _.get(req, 'session.rootOrg'), params: _.get(req, 'params') })
            const response = {
                responseCode: "FORBIDDEN",
                params: {
                    err: "FORBIDDEN",
                    status: "failed",
                    errmsg: "FORBIDDEN"
                },
                result: {}
            }
            res.status(403).send(apiResponse(response))
        }
    }
}

const validateRoles = (allowedRoles = []) => {
    return (req, res, next) => {
        const userRoles = _.get(req, 'session.roles');
        if (_.intersection(userRoles, allowedRoles).length > 0) {
            logger.info({ msg: 'validate roles passed' })
            next();
        } else {
            logger.error({ msg: 'validate roles failed', sessionRoles: _.get(req, 'session.roles'), allowedRoles })
            const response = {
                responseCode: "FORBIDDEN",
                params: {
                    err: "FORBIDDEN",
                    status: "failed",
                    errmsg: "FORBIDDEN"
                },
                result: {}
            }
            res.status(403).send(apiResponse(response))
        }
    }
}

const apiResponse = ({ responseCode, result, params: { err, errmsg, status } }) => {
    return {
        'id': 'api.report',
        'ver': '1.0',
        'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
        'params': {
            'resmsgid': uuidv1(),
            'msgid': null,
            'status': status,
            'err': err,
            'errmsg': errmsg
        },
        'responseCode': responseCode,
        'result': result
    }
}

function azureBlobStream() {
    return function (req, res, next) {
        let container = envHelper.sunbird_azure_report_container_name;
        let fileToGet = req.params.slug.replace('__', '\/') + '/' + req.params.filename;
        if (fileToGet.includes('.json')) {
            const readStream = blobService.createReadStream(container, fileToGet);
            readStream.pipe(res);
            readStream.on('end', () => {
                res.end();
            })
            readStream.on('error', error => {
                if (error && error.statusCode === 404) {
                    logger.error({ msg: 'Azure Blobstream : readStream error - Error with status code 404', error: error });
                    const response = {
                        responseCode: "CLIENT_ERROR",
                        params: {
                            err: "CLIENT_ERROR",
                            status: "failed",
                            errmsg: "Blob not found"
                        },
                        result: {}
                    }
                    res.status(404).send(apiResponse(response));
                } else {
                    logger.error({ msg: 'Azure Blobstream : readStream error - Error 500', error: error });
                    const response = {
                        responseCode: "SERVER_ERROR",
                        params: {
                            err: "SERVER_ERROR",
                            status: "failed",
                            errmsg: "Failed to display blob"
                        },
                        result: {}
                    }
                    res.status(500).send(apiResponse(response));
                }
            })
        } else {
            var startDate = new Date();
            var expiryDate = new Date(startDate);
            expiryDate.setMinutes(startDate.getMinutes() + 3600);
            startDate.setMinutes(startDate.getMinutes() - 3600);
            var sharedAccessPolicy = {
                AccessPolicy: {
                    Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
                    Start: startDate,
                    Expiry: expiryDate
                }
            };
            blobService.doesBlobExist(container, fileToGet, (err, resp) => {
                if (err || !(_.get(resp, 'exists'))) {
                    logger.error({ msg: 'Azure Blobstream : doesBlobExist error - Error with status code 404', error: err });
                    const response = {
                        responseCode: "CLIENT_ERROR",
                        params: {
                            err: "CLIENT_ERROR",
                            status: "failed",
                            errmsg: "Blob not found"
                        },
                        result: {}
                    }
                    res.status(404).send(apiResponse(response));
                } else {
                    let azureHeaders = {};
                    if (req.headers['content-disposition'] == 'attachment' && req.headers.filename) azureHeaders.contentDisposition = `attachment;filename=${req.headers.filename}`;
                    var token = blobService.generateSharedAccessSignature(container, fileToGet, sharedAccessPolicy, azureHeaders);
                    var sasUrl = blobService.getUrl(container, fileToGet, token);
                    const response = {
                        responseCode: "OK",
                        params: {
                            err: null,
                            status: "success",
                            errmsg: null
                        },
                        result: {
                            'signedUrl': sasUrl
                        }
                    }
                    res.status(200).send(apiResponse(response));
                }
            })

        }
    }
}

const getLastModifiedDate = async (req, res) => {
    const container = envHelper.sunbird_azure_report_container_name;
    const fileToGet = JSON.parse(req.query.fileNames);
    const responseData = {};
    if (Object.keys(fileToGet).length > 0) {
        const getBlogRequest = [];
        for (const [key, file] of Object.entries(fileToGet)) {
            const req = {
                container: container,
                file: file,
                reportname: key
            }
            getBlogRequest.push(
                async.reflect(function (callback) {
                    getBlobProperties(req, callback)
                })
            );
        }
        async.parallel(getBlogRequest, function (err, results) {
            if (results) {
                results.forEach(blob => {
                    if (blob.error) {
                        responseData[(_.get(blob, 'error.reportname'))] = blob.error
                    } else {
                        responseData[(_.get(blob, 'value.reportname'))] = {
                            lastModified: _.get(blob, 'value.lastModified'),
                            reportname: _.get(blob, 'value.reportname'),
                            statusCode: _.get(blob, 'value.statusCode'),
                            fileSize: _.get(blob, 'value.contentLength')
                        }
                    }
                });
                const finalResponse = {
                    responseCode: "OK",
                    params: {
                        err: null,
                        status: "success",
                        errmsg: null
                    },
                    result: responseData
                }
                res.status(200).send(apiResponse(finalResponse))
            }
        });
    }
};
const getBlobProperties = async (request, callback) => {
    blobService.getBlobProperties(request.container, request.file, function (err, result, response) {
        if (err) {
            logger.error({ msg: 'Azure Blobstream : readStream error - Error with status code 404' })
            callback({ msg: err.message, statusCode: err.statusCode, filename: request.file, reportname: request.reportname });
        }
        else if (!response.isSuccessful) {
            console.error("Blob %s wasn't found container %s", file, containerName)
            callback({ msg: err.message, statusCode: err.statusCode, filename: request.file, reportname: request.reportname });
        }
        else {
            result.reportname = request.reportname;
            result.statusCode = 200;
            callback(null, result);
        }
    });
}

const isReportParameterized = (report) => _.get(report, 'parameters.length') > 0 && _.isArray(report.parameters);

const getHashedValue = (val) => Buffer.from(val).toString("base64");

const getParameterValue = (param, user) => {
    const parametersMapping = {
        $slug: _.get(user, 'rootOrg.slug'),
        $board: _.get(user, 'framework.board'),
        $state: _.get(_.find(_.get(user, 'userLocations'), ['type', 'state']), 'name'),
        $channel: _.get(user, 'rootOrg.hashTagId')
    };
    return parametersMapping[param];
}

const getParametersHash = (report, user) => {
    const parameters = _.get(report, 'parameters');
    const result = _.map(parameters, param => {
        const userParamValue = getParameterValue(_.toLower(param), user);
        if (!userParamValue) return null;
        if (!_.isArray(userParamValue)) return getHashedValue(userParamValue);
        return _.map(userParamValue, val => getHashedValue(val));
    });
    return _.flatMap(_.compact(result));
}

const isUserAdmin = (user) => {
    const userRoles = _.uniq(_.flatMap(_.map(user.organisations, org => org.roles)));
    return _.includes(userRoles, 'REPORT_ADMIN')
};

const isUserSuperAdmin = (user) => {
    const isAdmin = isUserAdmin(user);
    if (!isAdmin) return false;
    return _.get(user, 'rootOrg.slug') === envHelper.sunbird_super_admin_slug;
}

const getReports = (reports, user) => {
    return _.reduce(reports, (results, report) => {
        const isParameterized = isReportParameterized(report);
        report.isParameterized = isParameterized;
        if (isParameterized) {
            const hash = getParametersHash(report, user);
            if (isUserSuperAdmin(user)) {
                results.push(report);
            } else if (isUserAdmin(user)) {
                const childReports = _.uniqBy(_.concat(_.filter(report.children, child => hash.includes(child.hashed_val)), _.map(hash, hashed_val => ({
                    hashed_val,
                    status: "draft",
                    reportid: _.get(report, 'reportid'),
                    materialize: true
                }))), 'hashed_val');
                if (childReports.length) {
                    if (childReports.length === 1) {
                        delete report.children;
                        results.push(_.assign(report, _.omit(childReports[0], 'id')));
                    } else {
                        report.children = childReports;
                        results.push(report);
                    }
                }
            } else {
                const childReports = _.filter(report.children, child => hash.includes(child.hashed_val) && child.status === 'live');
                if (childReports.length) {
                    if (childReports.length === 1) {
                        delete report.children;
                        results.push(_.assign(report, _.omit(childReports[0], 'id')));
                    } else {
                        report.children = childReports;
                        results.push(report);
                    }
                }
            }
        }
        else {
            delete report.children;
            if (!isUserAdmin(user)) {
                if (report.status === 'live') {
                    results.push(report);
                }
            } else {
                results.push(report);
            }
        }
        return results;
    }, []);
}

module.exports = {
    azureBlobStream,
    validateRoles,
    validateSlug,
    getLastModifiedDate,
    getReports
}
