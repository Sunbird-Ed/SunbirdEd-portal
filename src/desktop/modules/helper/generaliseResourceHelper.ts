import azure from 'azure-storage';
const uuidv1 = require('uuid/v1')
const { logger } = require('@project-sunbird/logger');

export class GeneraliseResourceHelper {

    public async getGeneralisedResourcesBundles(req, res) {
        const that = this;
        const blobService = azure.createBlobService(process.env.sunbird_azure_account_name, process.env.sunbird_azure_account_key);
        const container = process.env.sunbird_azure_resourceBundle_container_name;
        const blobName = req.params.fileName;
        blobService.getBlobToText(container, blobName, function (error, result, response) {
            if (error) {
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
                res.status(404).send(that.apiResponse(response));
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
                res.status(200).send(that.apiResponse(response));
            }
        });
    }

    public async apiResponse({ responseCode, result, params: { err, errmsg, status } }) {
        return {
            'id': 'api.report',
            'ver': '1.0',
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
}
