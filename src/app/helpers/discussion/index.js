let express = require('express')
const bodyParser = require('body-parser')
let router = express.Router()
let HttpStatus = require('http-status-codes')
let ThreadController = require('./threadController.js')
let threadModel = require('./models/threadModel')
let replyModel = require('./models/replyModel')
let actionsModel = require('./models/actionsModel.js')
let httpService = require('./services/httpWrapper.js')
let dateFormat = require('dateformat')
let uuidv1 = require('uuid/v1')
const multer = require('multer')
const crypto = require("crypto")
let path = require("path")
let fs = require("fs")
// var multiparty = require("multiparty");
// var storage = multer.memoryStorage()
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },

  filename: function (req, file, cb) {
    // console.log(req)
    // console.log(req, cb);
    console.log("====================================================");

    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)
      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
    // cb(null, file.fieldname + '-' + Date.now(), file)
  }
})
const upload = multer({
  storage: storage
}).single('files')



const API_ID_BASE = 'api.plugin.discussions'
const API_IDS = {
  createthread: 'create-thread',
  listthreads: 'list-threads',
  replythread: 'reply-thread',
  getthreadbyid: 'get-thread-by-id',
  actions: 'actions',
  markassolution: 'mark-answer',
  creategroup: 'create-group',
  archiveThread: 'archive-thread',
  lockThread: 'lock-thread',
  voteThread: 'vote-thread',
  flagThread: 'flag-thread',
  editReply: 'edit-reply',
  editThread: 'edit-thread'
}

let threadController = new ThreadController({
  threadModel,
  replyModel,
  actionsModel
})

const API_VERSION = '1.0'

function sendSuccessResponse(res, id, result, code = HttpStatus.OK) {
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

function getErrorCode(httpCode) {
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

function sendErrorResponse(res, id, message, httpCode = HttpStatus.BAD_REQUEST) {
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
  router.post('/files/service', (requestObj, responseObj, next) => {
    // console.log(requestObj, responseObj, next)
    console.log("file service Called!!")
    // responseObj.send({});
    return upload(requestObj, responseObj, function (r, q) {
      // console.log(requestObj.body, requestObj.file, requestObj.files)
      console.log("++++", requestObj.file)
      console.log("++++", requestObj.body)
      threadController.fileService(requestObj)
        .then((data) => {
          sendSuccessResponse(responseObj, API_IDS.archiveThread, data, HttpStatus.OK)
        })
        .catch((err) => {
          sendErrorResponse(responseObj, API_IDS.archiveThread, err.message, err.status)
        })
    })

  })

  router.post('/list', (requestObj, responseObj, next) => {
    threadController.getThreads(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.listthreads, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.listthreads, err.message, err.status)
      })
  })
  router.get('/thread/:id/', (requestObj, responseObj, next) => {
    threadController.getThreadById(requestObj)
      .then((data) => {
        console.log('thread data', data);

        sendSuccessResponse(responseObj, API_IDS.getthreadbyid, data, HttpStatus.OK)
      })
      .catch((err) => {
        console.log('thread data error', err);
        sendErrorResponse(responseObj, API_IDS.getthreadbyid, err.message, err.status)
      })
  })
  router.post('/thread/create', (requestObj, responseObj, next) => {
    threadController.createThread(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.createthread, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.createthread, err.message, err.status)
      })
  })
  router.post('/thread/reply', (requestObj, responseObj, next) => {
    threadController.replyThread(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.replythread, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.replythread, err.message, err.status)
      })
  })
  router.post('/thread/vote', (requestObj, responseObj, next) => {
    threadController.voteThread(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.voteThread, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.voteThread, err.message, err.status)
      })
  })
  router.post('/thread/flag', (requestObj, responseObj, next) => {
    threadController.flagThread(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.flagThread, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.flagThread, err.message, err.status)
      })
  })
  router.post('/thread/markanswer', (requestObj, responseObj, next) => {
    console.log("markanswer");

    threadController.markAsAnswer(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.markassolution, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.markassolution, err.message, err.status)
      })
  })

  router.put('/thread/edit', (requestObj, responseObj, next) => {
    threadController.editThread(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.editThread, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.editThread, err.message, err.status)
      })
  })

  router.post('/thread/checkmoderation', (requestObj, responseObj, next) => {
    threadController.checkModeration(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.actions, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.actions, err.message, err.status)
      })
  })

  router.put('/reply/edit', (requestObj, responseObj, next) => {
    threadController.editReply(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.editReply, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.editReply, err.message, err.status)
      })
  })
  router.delete('/thread/lock', (requestObj, responseObj, next) => {
    threadController.lockThread(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.lockThread, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.lockThread, err.message, err.status)
      })
  })
  router.delete('/thread/archive', (requestObj, responseObj, next) => {
    threadController.archiveThread(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.archiveThread, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.archiveThread, err.message, err.status)
      })
  })





  return router
}
// module.exports = router
