/**
 * To provide external url related helper methods 
 */
const urlMetadata = require('url-metadata')
let express = require('express')
let router = express.Router()
let HttpStatus = require('http-status-codes')
let dateFormat = require('dateformat')
let uuidv1 = require('uuid/v1')

const API_ID_BASE = 'api.plugin.external-url-preview'
const API_IDS = {
  fetchMeta: 'fetch-meta'
}

const API_VERSION = '1.0'

function sendSuccessResponse (res, id, result, code = HttpStatus.OK) {
  res.status(code)
  res.send({
    'id': API_ID_BASE + '.' + id,
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

function sendErrorResponse (res, id, message, httpCode = HttpStatus.BAD_REQUEST) {
  let responseCode = getErrorCode(httpCode)

  res.status(httpCode)
  res.send({
    'id': API_ID_BASE + '.' + id,
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
module.exports = function (keycloak) {
  router.post('/fetchmeta', (requestObj, responseObj, next) => {
    // using 'url-metadata'module fetch meta data of given web link and return response
    urlMetadata(requestObj.body.url).then(
      function (metadata) {
        console.log(metadata)
        sendSuccessResponse(responseObj, API_IDS.fetchMeta, metadata, HttpStatus.OK)
      },
      function (error) {
        console.log(error)
        sendErrorResponse(responseObj, API_IDS.fetchMeta, error.message, HttpStatus.INTERNAL_SERVER_ERROR)
      })
  })
  return router
}
