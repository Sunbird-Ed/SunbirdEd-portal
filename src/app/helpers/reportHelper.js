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
                    logger.error({ msg: 'Azure Blobstream : readStream error - Error with status code 404', error: error});
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
                    logger.error({ msg: 'Azure Blobstream : readStream error - Error 500', error: error});
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
            blobService.doesBlobExist(container,fileToGet, (err, resp) => {
                if (err || ! (_.get(resp,'exists')) ) {
                    logger.error({ msg: 'Azure Blobstream : doesBlobExist error - Error with status code 404', error: err});
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
                    if (req.headers['content-disposition'] == 'attachment' && req.headers.filename) azureHeaders.contentDisposition =  `attachment;filename=${req.headers.filename}`;
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
    if(Object.keys(fileToGet).length > 0) {
        const getBlogRequest = [];
        for (const [key, file] of Object.entries(fileToGet)) {
            const req = {
                container: container,
                file: file,
                reportname: key
            }
            getBlogRequest.push(
                async.reflect(function(callback) {
                    getBlobProperties(req, callback)
                })
            );
        }
        async.parallel(getBlogRequest, function(err, results) {
            if(results) {
                results.forEach(blob => {
                    if(blob.error) {
                        responseData[(_.get(blob, 'error.reportname'))] = blob.error
                    } else {
                        responseData[(_.get(blob, 'value.reportname'))] = {
                            lastModified: _.get(blob, 'value.lastModified'),
                            reportname: _.get(blob, 'value.reportname'),
                            statusCode: _.get(blob, 'value.statusCode'),
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
            callback({ msg: err.message, statusCode: err.statusCode, filename: request.file, reportname: request.reportname});
        }
        else if (!response.isSuccessful) {
            console.error("Blob %s wasn't found container %s", file, containerName)
            callback({ msg: err.message, statusCode: err.statusCode, filename: request.file, reportname: request.reportname});
        }
        else {
            result.reportname = request.reportname;
            result.statusCode = 200;
            callback(null, result);
        }
    });
}

module.exports = {
    azureBlobStream,
    validateRoles,
    validateSlug,
    getLastModifiedDate
}
