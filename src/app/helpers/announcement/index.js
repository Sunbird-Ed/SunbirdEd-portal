let express = require('express')
let router = express.Router()
let HttpStatus = require('http-status-codes')
let announcementController = require('./controller.js')
const API_ID = 'api.plugin.announcement'

router.post('/create', (requestObj, responseObj) => {
  announcementController.create(requestObj.body)
  .then((data) => {
    sendSuccessResponse(responseObj, 'create', data, HttpStatus.CREATED)
  })
  .catch((err) => {
    sendErrorResponse(responseObj, 'create', err.msg, err.statusCode)
  })
})

router.get('/get/:id', (requestObj, responseObj) => {
  announcementController.getAnnouncementById(requestObj)
  .then((data) => {
    sendSuccessResponse(responseObj, 'get.id', data)
  })
  .catch((err) => {
    sendErrorResponse(responseObj, 'get.id', err.msg)
  })
})

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
