let dateFormat = require('dateformat')
const envHelper = require('../environmentVariablesHelper.js')
let HttpStatus = require('http-status-codes')
const { v1: uuidv1 } = require('uuid')
let path = require('path')
let fs = require('fs')
const API_VERSION = '1.0'
const compression = require('compression')

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
  router.get('/read/:lang?', compression(), (requestObj, responseObj, next) => {
    var lang = requestObj.params['lang'] || envHelper.sunbird_default_language

    try {
      var bundles = JSON.parse(fs.readFileSync(path.join(__dirname, '/./../../resourcebundles/json/', lang + '.json')))
      sendSuccessResponse(responseObj, 'api.resoucebundles.read', bundles, HttpStatus.OK)
    } catch (err) {
      if (err.code === 'ENOENT') {
        sendErrorResponse(responseObj, 'api.resoucebundles.read', '', 404)
      } else {
        sendErrorResponse(responseObj, 'api.resoucebundles.read', '', 500)
      }
    }
  })
  router.get('/readLang/:lang?', compression(), (requestObj, responseObj, next) => {
    var lang = requestObj.params['lang'] || envHelper.sunbird_default_language
    console.log(lang);
    try {
      var bundles = JSON.parse(fs.readFileSync(path.join(__dirname, '/./../../resourcebundles/json/', lang + '.json')))
      sendSuccessResponse(responseObj, 'api.resoucebundles.read', bundles, HttpStatus.OK)
    } catch (err) {
      if (err.code === 'ENOENT') {
        sendErrorResponse(responseObj, 'api.resoucebundles.read', '', 404)
      } else {
        sendErrorResponse(responseObj, 'api.resoucebundles.read', '', 500)
      }
    }
  })
  return router
}