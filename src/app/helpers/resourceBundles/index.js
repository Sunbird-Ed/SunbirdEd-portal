const envHelper = require('../environmentVariablesHelper.js')
let HttpStatus = require('http-status-codes')
let path = require('path')
let fs = require('fs')
const API_VERSION = '1.0'
const compression = require('compression');
const dateFormat        = require('dateformat');
const uuidv1            = require('uuid/v1');
const { logger }        = require('@project-sunbird/logger');
const StorageService    = require('../../helpers/cloudStorage/index');

function sendSuccessResponse (res, id, result, code = HttpStatus.OK) {
  res.status(code)
  res.send({
    'id': id,
    'ver': API_VERSION,
    'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo', true),
    'params': {
      'resmsgid': uuidv1(),
      'msgid': null,
      'status': 'successful',
      'err': '',
      'errmsg': ''
    },
    'responseCode': 'OK',
    'result': result
  })
  res.end()
}

function sendErrorResponse (res, id, message, httpCode = HttpStatus.BAD_REQUEST) {
  let responseCode = getErrorCode(httpCode)

  res.status(httpCode)
  res.send({
    'id': id,
    'ver': API_VERSION,
    'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo', true),
    'params': {
      'resmsgid': uuidv1(),
      'msgid': null,
      'status': 'failed',
      'err': '',
      'errmsg': message
    },
    'responseCode': responseCode,
    'result': {}
  })
  res.end()
}

function getErrorCode (httpCode) {
  let responseCode = 'UNKNOWN_ERROR'

  if (httpCode >= 500) {
    responseCode = 'SERVER_ERROR'
  }

  if ((httpCode >= 400) && (httpCode < 500)) {
    responseCode = 'CLIENT_ERROR'
  }

  if (httpCode === 404) {
    responseCode = 'NOT_FOUND'
  }

  return responseCode
}

module.exports = function (express) {
  var router = express.Router()
  router.get(['/readLang/:lang?', '/read/:lang?'], compression(), (requestObj, responseObj, next) => {
    logger.info({ msg: "Calling API - " + requestObj.url });
    let container;
    let blobName = requestObj['params']['lang'] ? requestObj['params']['lang'] : envHelper.sunbird_default_language;
    blobName += '.json';
    if (envHelper.sunbird_cloud_storage_provider === 'azure') {
      container = envHelper.sunbird_azure_resourceBundle_container_name;
    }
    if (envHelper.sunbird_cloud_storage_provider === 'aws') {
      container = envHelper.sunbird_aws_labels + '/';
    }
    if (envHelper.sunbird_cloud_storage_provider === 'gcloud') {
      container = envHelper.sunbird_gcloud_labels + '/';
    }
    StorageService.CLOUD_CLIENT.getFileAsText(container, blobName, function (error, result, response) {
      if (error && error.statusCode === 404) {
        logger.error({ msg: "readLang :: Blob %s wasn't found container %s", blobName, container });
        sendErrorResponse(responseObj, 'api.resoucebundles.read', '', 404);
      } else {
        try {
          const _parsedOutput = JSON.parse(result);
          sendSuccessResponse(responseObj, 'api.resoucebundles.read', _parsedOutput, HttpStatus.OK);
        } catch (err) {
          if (err.code === 'ENOENT') {
            sendErrorResponse(responseObj, 'api.resoucebundles.read', '', 404);
          } else {
            sendErrorResponse(responseObj, 'api.resoucebundles.read', '', 500);
          }
        }
      }
    });
  });
  return router
}
