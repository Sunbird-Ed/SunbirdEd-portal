/**
 * @file        - Azure Storage Service
 * @exports     - `AzureStorageService`
 * @since       - 5.0.0
 * @version     - 1.0.0
 */

const BaseStorageService  = require('./BaseStorageService');
const envHelper           = require('./../../helpers/environmentVariablesHelper');
const azure               = require('azure-storage');
const blobService         = azure.createBlobService(envHelper.sunbird_azure_account_name, envHelper.sunbird_azure_account_key);
const { logger }          = require('@project-sunbird/logger');
const async               = require('async');
const _                   = require('lodash')
const dateFormat          = require('dateformat')
const uuidv1              = require('uuid/v1')
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
  /**
   * @description                                                     - Retrieves a shared access signature token
   * @param  { string } container                                     - Container name
   * @param  { string } blob                                          - Blob to be fetched
   * @param  { azure.common.SharedAccessPolicy } sharedAccessPolicy   - Shared access policy
   * @param  { azure.common.ContentSettingsHeaders } headers          - Optional header values to set for a blob returned wth this SAS
   * @return { string }                                               - The shared access signature
   */
  generateSharedAccessSignature(container, blob, sharedAccessPolicy, headers) {
    return blobService.generateSharedAccessSignature(container, blob, sharedAccessPolicy, headers);
  }

  /**
   * @description                                                    - Retrieves a blob or container URL
   * @param  { string } container                                    - Container name
   * @param  { string } blob                                         - Blob to be fetched
   * @param  { string } SASToken                                     - Shared Access Signature token
   * @return { string }                                              - Formatted URL string
   */
  getUrl(container, blob, SASToken) {
    return blobService.getUrl(container, blob, SASToken)
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
            let token = this.generateSharedAccessSignature(container, fileToGet, sharedAccessPolicy, azureHeaders);
            let sasUrl = this.getUrl(container, fileToGet, token);
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

  async getBlobProperties(request, callback) {
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

  getFileProperties(container = undefined, fileToGet = undefined) {
    return (req, res, next) => {
      const container = envHelper.sunbird_azure_report_container_name;
      const fileToGet = JSON.parse(req.query.fileNames);
      logger.info({ msg: 'AzureStorageService - getFileProperties called for container ' + container + ' for file ' + fileToGet });
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
            async.reflect((callback) => {
              this.getBlobProperties(req, callback)
            })
          );
        }
        async.parallel(getBlogRequest, (err, results) => {
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
    }
  }
}

module.exports = AzureStorageService;