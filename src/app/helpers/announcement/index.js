let express = require('express')
let router = express.Router()
let HttpStatus = require('http-status-codes')
let announcementController = require('./controller.js')
const API_ID = 'api.plugin.announcement'
let path = require('path')
let multer = require('multer')
let ApiInterceptor = require('sb_api_interceptor')
const _ = require('lodash')
let await = require('asyncawait/await')
let async = require('asyncawait/async')
const CREATE_ROLE = 'ANNOUNCEMENT_SENDER'


/*
for file upload
*/
const maxUploadFileSize = 1000000 // in bytes, 1MB
const AllowableUploadFileTypes = /jpeg|jpg|png|pdf/ // images/pdf
let storage = multer.memoryStorage()
let upload = multer({
    storage: storage,
    limits: {
        fileSize: maxUploadFileSize
    },
    fileFilter: uploadFileFilter
})
let singleFileUpload = upload.single('document')

function uploadFileFilter(req, file, cb) {
    var mimetype = AllowableUploadFileTypes.test(file.mimetype)
    var extname = AllowableUploadFileTypes.test(path.extname(file.originalname).toLowerCase())
    if (mimetype && extname) return cb(null, true)
    cb({
        msg: 'File upload only supports the following filetypes-' + AllowableUploadFileTypes,
        code: 'INVALID_FILETYPE'
    })
}

// router.post('/create', (requestObj, responseObj) => {
//   announcementController.create(requestObj)
//     .then((data) => {
//       sendSuccessResponse(responseObj, 'create', data, HttpStatus.CREATED)
//     })
//     .catch((err) => {
//       sendErrorResponse(responseObj, 'create', err.msg, err.statusCode)
//     })
// })

// router.get('/get/:id', (requestObj, responseObj) => {
//   announcementController.getAnnouncementById(requestObj)
//     .then((data) => {
//       sendSuccessResponse(responseObj, 'get.id', data, HttpStatus.OK)
//     })
//     .catch((err) => {
//       sendErrorResponse(responseObj, 'get.id', err.msg, err.statusCode)
//     })
// })

// router.delete('/cancel', (requestObj, responseObj) => {
//   announcementController.cancelAnnouncementById(requestObj)
//     .then((data) => {
//       sendSuccessResponse(responseObj, 'cancel.id', data, HttpStatus.OK)
//     })
//     .catch((err) => {
//       sendErrorResponse(responseObj, 'cancel.id', err.msg, err.statusCode)
//     })
// })

// router.post('/user/inbox', (requestObj, responseObj) => {
//   announcementController.getUserInbox(requestObj)
//     .then((data) => {
//       sendSuccessResponse(responseObj, 'user.inbox', data, HttpStatus.OK)
//     })
//     .catch((err) => {
//       sendErrorResponse(responseObj, 'user.inbox', err.msg, err.statusCode)
//     })
// })

// router.post('/user/outbox', (requestObj, responseObj) => {
//   announcementController.getUserOutbox(requestObj.body)
//     .then((data) => {
//       sendSuccessResponse(responseObj, 'user.outbox', data, HttpStatus.OK)
//     })
//     .catch((err) => {
//       sendErrorResponse(responseObj, 'user.outbox', err.msg, err.statusCode)
//     })
// })

// router.post('/attachment/upload', (requestObj, responseObj) => {
//   singleFileUpload(requestObj, responseObj, (error) => {
//     if (error) {
//       if (error.code == 'LIMIT_FILE_SIZE') {
//         sendErrorResponse(responseObj, 'attachment.upload', 'file size too large! allowable max file size is ' + maxUploadFileSize, HttpStatus.BAD_REQUEST)
//       } else if (error.code == 'INVALID_FILETYPE') {
//         sendErrorResponse(responseObj, 'attachment.upload', error.msg, HttpStatus.BAD_REQUEST)
//       } else {
//         sendErrorResponse(responseObj, 'attachment.upload', 'error while uploading!', HttpStatus.INTERNAL_SERVER_ERROR)
//       }
//       return
//     }

//     announcementController.uploadAttachment(requestObj)
//       .then((data) => {
//         sendSuccessResponse(responseObj, 'attachment.upload', data, HttpStatus.OK)
//       })
//       .catch((err) => {
//         sendErrorResponse(responseObj, 'attachment.upload', err.msg, err.statusCode)
//       })
//   })
// })

// /* router.post('/attachment/download', (requestObj, responseObj) => {
//   announcementController.downloadAttachment(requestObj.body)
//   .then((data) => {
//     sendSuccessResponse(responseObj, 'attachment.download', data)
//   })
//   .catch((err) => {
//     sendErrorResponse(responseObj, 'attachment.download', err.msg)
//   })
// }) */

// router.post('/definitions', (requestObj, responseObj) => {
//   announcementController.getDefinitions(requestObj)
//         .then((data) => {
//           sendSuccessResponse(responseObj, 'definitions', data, HttpStatus.OK)
//         })
//         .catch((err) => {
//           sendErrorResponse(responseObj, 'definitions', err.msg, err.statusCode)
//         })
// })
// router.post('/received', (requestObj, responseObj) => {
//   announcementController.received(requestObj.body)
//     .then((data) => {
//       sendSuccessResponse(responseObj, 'received', data, HttpStatus.CREATED)
//     })
//     .catch((err) => {
//       sendErrorResponse(responseObj, 'received', err.msg, err.statusCode)
//     })
// })

// router.post('/read', (requestObj, responseObj) => {
//   announcementController.read(requestObj.body)
//     .then((data) => {
//       sendSuccessResponse(responseObj, 'read', data, HttpStatus.CREATED)
//     })
//     .catch((err) => {
//       sendErrorResponse(responseObj, 'read', err.msg, err.statusCode)
//     })
// })

// router.get('/resend/:announcementId', (requestObj, responseObj) => {
//   announcementController.getResend(requestObj)
//     .then((data) => {
//       sendSuccessResponse(responseObj, 'getresend.id', data, HttpStatus.OK)
//     })
//     .catch((err) => {
//       sendErrorResponse(responseObj, 'getresend.id', err.msg, err.statusCode)
//     })
// })

// router.post('/resend', (requestObj, responseObj) => {
//   announcementController.resend(requestObj)
//     .then((data) => {
//       sendSuccessResponse(responseObj, 'resend', data, HttpStatus.CREATED)
//     })
//     .catch((err) => {
//       sendErrorResponse(responseObj, 'resend', err.msg, err.statusCode)
//     })
// })

function sendSuccessResponse(res, id, result, code = HttpStatus.OK) {
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

function sendErrorResponse(res, id, message, code = HttpStatus.BAD_REQUEST) {
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

function validateRoles() {
    return async((requestObj, responseObj, next, role) => {
        let authUserToken = _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
        try {
            // TODO: verify  Is logged in userid matching with senderid
            let userProfile = await (announcementController.__getUserProfile({
                id: _.get(requestObj, 'body.request.createdBy')
            }, authUserToken))
            console.log("userProfile", userProfile);
            let organisation = _.find(userProfile.organisations, {
                organisationId: _.get(requestObj, 'body.request.sourceId')
            })

            if (_.isEmpty(organisation) || _.indexOf(organisation.roles, role) == -1) {
                throw "User has no create access"
            } else {
               console.log("User have create access");
                next()
            }
        } catch (error) {
            if (error === 'USER_NOT_FOUND') {
                responseObj.status(400).json({
                    'error': 'USER_NOT_FOUND',
                    statusCode: 400
                })
            } else if (error === 'UNAUTHORIZE_USER') {
                responseObj.status(400).json({
                    'error': 'UNAUTHORIZE_USER',
                    statusCode: 400
                })
            } else {
                responseObj.status(400).json({
                    'error': 'NO_CREATE_ACCESS',
                    statusCode: 400
                })
            }
        }
    })
}

function validate(requestObj, responseObj, next, keycloak) {
    let authUserToken = _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
    var keyCloak_config = {
        'authServerUrl': process.env.sunbird_keycloak_auth_server_url ? process.env.sunbird_keycloak_auth_server_url : 'https://dev.open-sunbird.org/auth',
        'realm': process.env.sunbird_keycloak_realm ? process.env.sunbird_keycloak_realm : 'sunbird',
        'clientId': process.env.sunbird_keycloak_client_id ? process.env.sunbird_keycloak_client_id : 'portal',
        'public': process.env.sunbird_keycloak_public ? process.env.sunbird_keycloak_public : true
    }

    var cache_config = {
        stroe: process.env.sunbird_cache_store ? process.env.sunbird_cache_store : 'memory',
        ttl: process.env.sunbird_cache_ttl ? process.env.sunbird_cache_ttl : 1800
    }

    if (authUserToken) {
        var apiInterceptor = new ApiInterceptor(keyCloak_config, cache_config)
        apiInterceptor.validateToken(authUserToken, function(err, token) {
            console.log('token', token)
            if (token) {
                next()
            } else {
                responseObj.status(400).json({
                    'error': 'UNAUTHORIZED',
                    statusCode: 400
                })
            }
        })
    } else {
        if (keycloak) {
            keycloak.protect()(requestObj, responseObj, next)
        } else {
            responseObj.status(400).json({
                'error': 'UNAUTHORIZED',
                statusCode: 400
            })
        }
    }
}

module.exports = function(keycloak) {
        router.post('/create', (requestObj, responseObj, next) => {
            validate(requestObj, responseObj, next, keycloak)
        }, (requestObj, responseObj, next) => {
            validateRoles()(requestObj, responseObj, next, CREATE_ROLE)
        }, (requestObj, responseObj, next) => {
            announcementController.create(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, 'create', data, HttpStatus.CREATED)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, 'create', err.msg, err.statusCode)
                })
        })

        router.get('/get/:id', (requestObj, responseObj, next) => {
            announcementController.getAnnouncementById(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, 'get.id', data, HttpStatus.OK)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, 'get.id', err.msg, err.statusCode)
                })
        })

        router.delete('/cancel', (requestObj, responseObj, next) => {
            validate(requestObj, responseObj, next, keycloak)
        }, (requestObj, responseObj, next) => {
            validateRoles()(requestObj, responseObj, next, CREATE_ROLE)
        }, (requestObj, responseObj, next) => {
            announcementController.cancelAnnouncementById(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, 'cancel.id', data, HttpStatus.OK)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, 'cancel.id', err.msg, err.statusCode)
                })
        })

        router.post('/user/inbox', (requestObj, responseObj, next) => {
            validate(requestObj, responseObj, next, keycloak)
        }, (requestObj, responseObj, next) => {
            announcementController.getUserInbox(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, 'user.inbox', data, HttpStatus.OK)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, 'user.inbox', err.msg, err.statusCode)
                })
        })

        router.post('/user/outbox', (requestObj, responseObj, next) => {
            validate(requestObj, responseObj, next, keycloak)
        }, (requestObj, responseObj, next) => {
            announcementController.getUserOutbox(requestObj.body)
                .then((data) => {
                    sendSuccessResponse(responseObj, 'user.outbox', data, HttpStatus.OK)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, 'user.outbox', err.msg, err.statusCode)
                })
        })

        router.post('/definitions', (requestObj, responseObj, next) => {
            validate(requestObj, responseObj, next, keycloak)
        }, (requestObj, responseObj, next) => {
            validateRoles()(requestObj, responseObj, next, CREATE_ROLE)
        }, (requestObj, responseObj, next) => {
            announcementController.getDefinitions(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, 'definitions', data, HttpStatus.OK)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, 'definitions', err.msg, err.statusCode)
                })
        })

        router.post('/received', (requestObj, responseObj, next) => {
            validate(requestObj, responseObj, next, keycloak)
        }, (requestObj, responseObj, next) => {
            announcementController.received(requestObj.body)
                .then((data) => {
                    sendSuccessResponse(responseObj, 'received', data, HttpStatus.CREATED)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, 'received', err.msg, err.statusCode)
                })
        })

        router.post('/read', (requestObj, responseObj, next) => {
            validate(requestObj, responseObj, next, keycloak)
        }, (requestObj, responseObj, next) => {
            announcementController.read(requestObj.body)
                .then((data) => {
                    sendSuccessResponse(responseObj, 'read', data, HttpStatus.CREATED)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, 'read', err.msg, err.statusCode)
                })
        })

        router.get('/resend/:announcementId', (requestObj, responseObj, next) => {
            validate(requestObj, responseObj, next, keycloak)
        }, (requestObj, responseObj, next) => {
            validateRoles()(requestObj, responseObj, next, CREATE_ROLE)
        }, (requestObj, responseObj, next) => {
            announcementController.getResend(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, 'getresend.id', data, HttpStatus.OK)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, 'getresend.id', err.msg, err.statusCode)
                })
        })

        router.post('/resend', (requestObj, responseObj, next) => {
            validate(requestObj, responseObj, next, keycloak)
        }, (requestObj, responseObj, next) => {
            validateRoles()(requestObj, responseObj, next, CREATE_ROLE)
        }, (requestObj, responseObj, next) => {
            announcementController.resend(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, 'resend', data, HttpStatus.CREATED)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, 'resend', err.msg, err.statusCode)
                })
        })

        return router
    }
    // module.exports = router