const envHelper = require('./../helpers/environmentVariablesHelper.js')
const _ = require('lodash')
const azure = require('azure-storage')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const blobService = azure.createBlobService(envHelper.desktop_azure_account_name, envHelper.desktop_azure_account_key);
const logger = require('sb_logger_util_v2');
const getStream = require('into-stream');
const containerName = envHelper.desktop_azure_crash_container_name;

function storeCrashLogsToAzure() {
    return function (req, res) {
        if (!_.get(req, 'file')) {
            const response = {
                responseCode: "BAD_REQUEST",
                params: {
                    err: "BAD_REQUEST",
                    status: "Bad Request",
                    errmsg: "File missing"
                },
                result: req.file
            }
            logger.error({ msg: 'File missing in desktop crash reporter' });
            return res.status(400).send(apiResponse(response));
        }
        const
            blobName = getBlobName(_.get(req, 'file.originalname'), _.get(req, 'body.deviceId')),
            stream = getStream(_.get(req, 'file.buffer')),
            streamLength = _.get(req, 'file.buffer').length;

        blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, error => {
            if (error && error.statusCode === 403) {
                const response = {
                    responseCode: "FORBIDDEN",
                    params: {
                        err: "FORBIDDEN",
                        status: "failed",
                        errmsg: "Unable to authorize to azure blob"
                    },
                    result: req.file
                }
                logger.error({ msg: 'Unable to authorize to azure blob for uploading desktop crash logs', error: error });
                return res.status(403).send(apiResponse(response));
            } else if (error) {
                const response = {
                    responseCode: "SERVER_ERROR",
                    params: {
                        err: "SERVER_ERROR",
                        status: "failed",
                        errmsg: "Failed to upload to blob"
                    },
                    result: {}
                }
                logger.error({ msg: 'Failed to upload desktop crash logs to blob', error: error });
                return res.status(500).send(apiResponse(response));
            } else {
                const response = {
                    responseCode: "OK",
                    params: {
                        err: null,
                        status: "success",
                        errmsg: null
                    },
                    result: {
                        'message': 'Successfully uploaded to blob'
                    }
                }
                return res.status(200).send(apiResponse(response));
            }
        });
    }
}

const getBlobName = (originalName, deviceId) => {
    const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
    return `${deviceId}_${identifier}-${originalName}`;
};

const apiResponse = ({ responseCode, result, params: { err, errmsg, status } }) => {
    return {
        'id': 'api.desktop.upload.crash.log',
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

module.exports = {
  storeCrashLogsToAzure
}
