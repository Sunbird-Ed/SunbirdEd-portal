let express = require('express')
let router = express.Router()
let HttpStatus = require('http-status-codes')
let announcementController = require('./controller.js')
const API_ID = 'api.plugin.announcement'
let path = require('path')
let multer = require('multer')

/*
for file upload
*/
const maxUploadFileSize = 1000000 // in bytes, 1MB
const AllowableUploadFileTypes = /jpeg|jpg|png|gif|bmp|ico|pdf/ // images/pdf
let storage = multer.memoryStorage()
let upload = multer({ storage: storage, limits: { fileSize: maxUploadFileSize }, fileFilter: uploadFileFilter })
let singleFileUpload = upload.single('document')

function uploadFileFilter (req, file, cb) {
  var mimetype = AllowableUploadFileTypes.test(file.mimetype)
  var extname = AllowableUploadFileTypes.test(path.extname(file.originalname).toLowerCase())
  if (mimetype && extname) return cb(null, true)
  cb({msg: 'File upload only supports the following filetypes-' + AllowableUploadFileTypes, code: 'INVALID_FILETYPE' })
}

router.post('/create', (requestObj, responseObj) => {
  announcementController.create(requestObj)
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
      sendSuccessResponse(responseObj, 'get.id', data, HttpStatus.OK)
    })
    .catch((err) => {
      sendErrorResponse(responseObj, 'get.id', err.msg, err.statusCode)
    })
})

router.get('/cancel/:announcementId', (requestObj, responseObj) => {
  announcementController.cancelAnnouncementById(requestObj)
    .then((data) => {
      sendSuccessResponse(responseObj, 'cancel.id', data, HttpStatus.OK)
    })
    .catch((err) => {
      sendErrorResponse(responseObj, 'cancel.id', err.msg, err.statusCode)
    })
})

router.post('/user/inbox', (requestObj, responseObj) => {
  announcementController.getUserInbox(requestObj.body)
    .then((data) => {
      sendSuccessResponse(responseObj, 'user.inbox', data, HttpStatus.OK)
    })
    .catch((err) => {
      sendErrorResponse(responseObj, 'user.inbox', err.msg, err.statusCode)
    })
})

router.post('/user/outbox', (requestObj, responseObj) => {
  announcementController.getUserOutbox(requestObj.body)
    .then((data) => {
      sendSuccessResponse(responseObj, 'user.outbox', data, HttpStatus.OK)
    })
    .catch((err) => {
      sendErrorResponse(responseObj, 'user.outbox', err.msg, err.statusCode)
    })
})

router.post('/attachment/upload', (requestObj, responseObj) => {
  singleFileUpload(requestObj, responseObj, (error) => {
    if (error) {
      if (error.code == 'LIMIT_FILE_SIZE') {
        sendErrorResponse(responseObj, 'attachment.upload', 'file size too large! allowable max file size is ' + maxUploadFileSize, HttpStatus.BAD_REQUEST)
      } else if (error.code == 'INVALID_FILETYPE') {
        sendErrorResponse(responseObj, 'attachment.upload', error.msg, HttpStatus.BAD_REQUEST)
      } else {
        sendErrorResponse(responseObj, 'attachment.upload', 'error while uploading!', HttpStatus.INTERNAL_SERVER_ERROR)
      }
      return
    }

    announcementController.uploadAttachment(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, 'attachment.upload', data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, 'attachment.upload', err.msg, err.statusCode)
      })
  })
})

/* router.post('/attachment/download', (requestObj, responseObj) => {
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
      sendSuccessResponse(responseObj, 'types', data, HttpStatus.OK)
    })
    .catch((err) => {
      sendErrorResponse(responseObj, 'types', err.msg, err.statusCode)
    })
})

function sendSuccessResponse (res, id, result, code = HttpStatus.OK) {
  res.status(code)
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

function sendErrorResponse (res, id, message, code = HttpStatus.BAD_REQUEST) {
  res.status(code)
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
    'responseCode': (code <= 499) ? 'CLIENT_ERROR' : 'SERVER_ERROR',
    'result': {}
  })
  res.end()
}

module.exports = router
