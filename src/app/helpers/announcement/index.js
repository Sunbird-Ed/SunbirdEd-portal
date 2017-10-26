let express = require('express')
let router = express.Router()
let HttpStatus = require('http-status-codes')
let announcementController = require('./controller.js')
const API_ID = 'api.plugin.announcement'

router.post('/create', validateRequestStructure, function (requestObj, responseObj) {
  announcementController.create(requestObj)
  .then(function(data) {
    sendSuccessResponse(responseObj, 'create', data, HttpStatus.CREATED)
  })
  .catch(function(err) {
    sendErrorResponse(responseObj, 'create', err.msg, err.httpCode)    
  })
})

router.get('/get/:id', function (requestObj, responseObj) {
  announcementController.getAnnouncementById(requestObj)
  .then(function(data) {
    sendSuccessResponse(responseObj, 'get.id', data)
  })
  .catch(function(err) {
    sendErrorResponse(responseObj, 'create', err.msg)
  })
})

function validateRequestStructure (requestObj, responseObj, next) {
  if (typeof requestObj.body !== 'object' || typeof requestObj.body.request !== 'object') return Response.error(responseObj, 'Invalid request structure', HttpStatus.BAD_REQUEST)
  next()
}

function sendSuccessResponse (res, id, result, code) {
  res.status(code || HttpStatus.OK)
  res.send({
    'id': API_ID + '.' + id,
    'ver': '1.0',
    'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
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

function sendErrorResponse (res, id, message, code) {
  res.status(code || HttpStatus.NOT_FOUND)
  res.send({
    'id': API_ID + '.' + id,
    'ver': '1.0',
    'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
    'params': {
      'resmsgid': uuidv1(),
      'msgid': null,
      'status': 'failed',
      'err': '',
      'errmsg': message
    },
    'responseCode': 'ERROR',
    'result': {}
  })
  res.end()
}

module.exports = router
