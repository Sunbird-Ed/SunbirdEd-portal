const envHelper = require('./../helpers/environmentVariablesHelper.js')
const _ = require('lodash')
var azure = require('azure-storage')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const blobService = azure.createBlobService(envHelper.sunbird_azure_account_name, envHelper.sunbird_azure_account_key);

const validateSlug = (allowedFolders = []) => {
    return (req, res, next) => {
        if (_.includes([...allowedFolders, _.get(req, 'session.rootOrg.slug')], _.get(req, 'params.slug'))) {
            next();
        } else {
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
            next();
        } else {
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
        let fileToGet = req.params.slug + '/' + req.params.filename;
        if (fileToGet.includes('.json')) {
            const readStream = blobService.createReadStream(container, fileToGet);
            readStream.pipe(res);
            readStream.on('end', () => {
                res.end();
            })
            readStream.on('error', error => {
                if (error && error.statusCode === 404) {
                    console.log('Error with status code 404 - ', error);
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
                    console.log('Error without status code 404 - ', error);
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
                    console.log('Error with status code 404 - ', err);
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
                    var token = blobService.generateSharedAccessSignature(container, fileToGet, sharedAccessPolicy);
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

module.exports = {
    azureBlobStream,
    validateRoles,
    validateSlug
}
