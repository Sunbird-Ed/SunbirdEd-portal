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

router.get('/cancel/:announcementId', (requestObj, responseObj) => {
  announcementController.cancelAnnouncementById(requestObj)
  .then((data) => {
    sendSuccessResponse(responseObj, 'cancel.id', data)
  })
  .catch((err) => {
    sendErrorResponse(responseObj, 'cancel.id', err.msg)
  })
})

router.post('/user/inbox', (requestObj, responseObj) => {
  announcementController.getUserInbox(requestObj.body)
  .then((data) => {
    sendSuccessResponse(responseObj, 'user.inbox', data)
  })
  .catch((err) => {
    sendErrorResponse(responseObj, 'user.inbox', err.msg)
  })
})

router.post('/user/outbox', (requestObj, responseObj) => {
  announcementController.getUserOutbox(requestObj.body)
  .then((data) => {
    sendSuccessResponse(responseObj, 'user.outbox', data)
  })
  .catch((err) => {
    sendErrorResponse(responseObj, 'user.outbox', err.msg)
  })
})

/* router.post('/attachment/upload', (requestObj, responseObj) => {
  announcementController.uploadAttachment(requestObj.body)
  .then((data) => {
    sendSuccessResponse(responseObj, 'attachment.upload', data)
  })
  .catch((err) => {
    sendErrorResponse(responseObj, 'attachment.upload', err.msg)
  })
})

router.post('/attachment/download', (requestObj, responseObj) => {
  announcementController.downloadAttachment(requestObj.body)
  .then((data) => {
    sendSuccessResponse(responseObj, 'attachment.download', data)
  })
  .catch((err) => {
    sendErrorResponse(responseObj, 'attachment.download', err.msg)
  })
}) */

router.get('/types', (requestObj, responseObj) => {
  announcementController.getAnnouncementTypes(requestObj)
  .then((data) => {
    sendSuccessResponse(responseObj, 'types', data)
  })
  .catch((err) => {
    sendErrorResponse(responseObj, 'types', err.msg)
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
