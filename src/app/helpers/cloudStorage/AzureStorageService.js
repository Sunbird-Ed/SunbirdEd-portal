/**
 * @file        - Azure Storage Service
 * @exports     - `AzureStorageService`
 * @since       - 5.0.0
 * @version     - 1.0.0
 */

const BaseStorageService  = require('./BaseStorageService');
const envHelper           = require('./../../helpers/environmentletiablesHelper.js');
const azure               = require('azure-storage');
const blobService         = azure.createBlobService(envHelper.sunbird_azure_account_name, envHelper.sunbird_azure_account_key);
const { logger }          = require('@project-sunbird/logger');

class AzureStorageService extends BaseStorageService {

  fileExists(container, fileToGet, callback) {
    if (!container || !fileToGet || !callback) throw new Error('Invalid arguments');
    logger.info({ msg: 'AzureStorageService - fileExists called for container ' + container + ' for file ' + fileToGet });
    blobService.doesBlobExist(container, fileToGet, (err, response) => {
      if (err) {
        callback(err);
      } else {
        callback(null, response)
      }
    });
  }

  fileReadStream(container = undefined, fileToGet = undefined) {
    return (req, res, next) => {
      let container = envHelper.sunbird_azure_report_container_name;
      let fileToGet = req.params.slug.replace('__', '\/') + '/' + req.params.filename;
      logger.info({ msg: 'AzureStorageService - fileReadStream called for container ' + container + ' for file ' + fileToGet });
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
        let startDate = new Date();
        let expiryDate = new Date(startDate);
        expiryDate.setMinutes(startDate.getMinutes() + 3600);
        startDate.setMinutes(startDate.getMinutes() - 3600);
        let sharedAccessPolicy = {
          AccessPolicy: {
            Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
            Start: startDate,
            Expiry: expiryDate
          }
        };
        this.fileExists(container, fileToGet, (err, resp) => {
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
            let token = blobService.generateSharedAccessSignature(container, fileToGet, sharedAccessPolicy, azureHeaders);
            let sasUrl = blobService.getUrl(container, fileToGet, token);
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

  
}

module.exports = AzureStorageService;