const envHelper = require('./../helpers/environmentVariablesHelper.js')
var azure = require('azure-storage')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const blobService = azure.createBlobService(envHelper.sunbird_azure_account_name, envHelper.sunbird_azure_account_key);
const { logger } = require('@project-sunbird/logger');

const getGeneralisedResourcesBundles = (req, res) => {
    const container = envHelper.sunbird_azure_resourceBundle_container_name;
    const blobName = req.params.fileName;
    blobService.getBlobToText(container, blobName, function (error, result, response) {
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
