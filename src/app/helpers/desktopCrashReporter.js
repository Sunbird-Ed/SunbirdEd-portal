const envHelper = require('./../helpers/environmentVariablesHelper.js')
const _ = require('lodash')
const azure = require('azure-storage')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const blobService = azure.createBlobService(envHelper.sunbird_azure_account_name, envHelper.sunbird_azure_account_key);
const { logger } = require('@project-sunbird/logger');
const multiparty = require('multiparty');
const containerName = envHelper.desktop_azure_crash_container_name;

function storeCrashLogsToAzure() {
  return function (req, res) {
    try {
      const blobFolderName = new Date().toLocaleDateString()
      let form = new multiparty.Form();
      form.on('part', function (part) {
        if (part.filename) {
          var size = part.byteCount - part.byteOffset;
          var name = `${_.get(req, 'query.deviceId')}_${Date.now()}.${_.get(part, 'filename')}`;
          blobService.createBlockBlobFromStream(containerName, `${blobFolderName}/${name}`, part, size, (error) => {
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
              logger.error({
                msg: 'Unable to authorize to azure blob for uploading desktop crash logs',
                error: error
              });
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
              logger.error({
                msg: 'Failed to upload desktop crash logs to blob',
                error: error
              });
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
      });
      form.parse(req);
    } catch (error) {
      const response = {
        responseCode: "SERVER_ERROR",
        params: {
          err: "SERVER_ERROR",
          status: "failed",
          errmsg: "Failed to upload to blob"
        },
        result: {}
      }
      logger.error({
        msg: 'Failed to upload desktop crash logs to blob',
        error: error
      });
      return res.status(500).send(apiResponse(response));
    }
  }
}

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
