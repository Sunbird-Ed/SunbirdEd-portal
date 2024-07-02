const envHelper         = require('./../helpers/environmentVariablesHelper.js');
const dateFormat        = require('dateformat');
const uuidv1            = require('uuid/v1');
const { logger }        = require('@project-sunbird/logger');
const StorageService    = require('../helpers/cloudStorage/index');

const getGeneralisedResourcesBundles = (req, res) => {
    let container, blobName = req.params.fileName;
    container = envHelper.cloud_storage_resourceBundle_bucketname;
    StorageService.CLOUD_CLIENT.getFileAsText(container, blobName, function (error, result, response) {
        if (error && error.statusCode === 404) {
            logger.error({ msg: "Blob %s wasn't found container %s", blobName, container })
            const response = {
                responseCode: "CLIENT_ERROR",
                params: {
                    err: "CLIENT_ERROR",
                    status: "failed",
                    errmsg: "Blob not found"
                },
                result: error
            }
            res.status(404).send(apiResponse(response));
        } else {
            const response = {
                responseCode: "OK",
                params: {
                    err: null,
                    status: "success",
                    errmsg: null
                },
                result: result
            }
            res.setHeader("Content-Type", "application/json");
            res.status(200).send(apiResponse(response));
        }
    });
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

module.exports = {
    getGeneralisedResourcesBundles
}
