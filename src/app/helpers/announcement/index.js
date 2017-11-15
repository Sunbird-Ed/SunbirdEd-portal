let express = require('express')
let router = express.Router()
let HttpStatus = require('http-status-codes')
let announcementController = require('./controller.js')
const API_ID = 'api.plugin.announcement'
let path = require('path')
let multer = require('multer')
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

function isCreateRolePresent(userProfile, sourceid) {
    let organisationId = _.map(userProfile.organisations, "organisationId")
    let organisation = undefined;
    for (var i = 0; i <= organisationId.length; i++) {
        if (organisationId[i]) {
            organisation = _.find(userProfile.organisations, {
                organisationId: organisationId[i]
            })
            if (organisation && _.indexOf(organisation.roles, CREATE_ROLE) == 1) {
                return true
            }
        } else {
            return false
        }
    }
}

function validateRoles() {
    return async((requestObj, responseObj, next, config) => {
        let authUserToken = _.get(requestObj, "headers['x-authenticated-user-token']")
        try {
            // TODO: verify  Is logged in userid matching with senderid
            let userProfile = await (announcementController.__getUserProfile({
                id: config.userid
            }, authUserToken))
            let isAuthorized = isCreateRolePresent(userProfile, config.sourceid);
            if (isAuthorized) {
                next()
            } else {
                throw "User has no create access"
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
                console.log("Error", error);
                responseObj.status(400).json({
                    'error': 'NO_CREATE_ACCESS',
                    statusCode: 400
                })
            }
        }
    })
}

function validate() {
    return async((requestObj, responseObj, next, keycloak) => {
        let authUserToken = _.get(requestObj, "headers['x-authenticated-user-token']")
        if (authUserToken) {
            var tokenDetails = await (announcementController.__getTokenDetails(authUserToken))
            if (tokenDetails) {
                next()
            } else {
                responseObj.status(400).json({
                    'error': 'UNAUTHORIZED',
                    statusCode: 400
                })
            }
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
    });
}

module.exports = function(keycloak) {
        router.post('/create', (requestObj, responseObj, next) => {
            validate()(requestObj, responseObj, next, keycloak)
        }, (requestObj, responseObj, next) => {
            let config = {
                userid: _.get(requestObj, 'body.request.createdBy'),
                sourceid: _.get(requestObj, 'body.request.sourceId')
            }
            validateRoles()(requestObj, responseObj, next, config)
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
            validate()(requestObj, responseObj, next, keycloak)
        }, (requestObj, responseObj, next) => {
            let config = {
                userid: _.get(requestObj, 'body.request.userid')
            }
            validateRoles()(requestObj, responseObj, next, config)
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
            validate()(requestObj, responseObj, next, keycloak)
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
            validate()(requestObj, responseObj, next, keycloak)
        }, (requestObj, responseObj, next) => {
            announcementController.getUserOutbox(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, 'user.outbox', data, HttpStatus.OK)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, 'user.outbox', err.msg, err.statusCode)
                })
        })

        router.post('/definitions', (requestObj, responseObj, next) => {
            validate()(requestObj, responseObj, next, keycloak)
        }, (requestObj, responseObj, next) => {
            let config = {
                userid: _.get(requestObj, 'body.request.userid')
            }
            validateRoles()(requestObj, responseObj, next, config)
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
            validate()(requestObj, responseObj, next, keycloak)
        }, (requestObj, responseObj, next) => {
            announcementController.received(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, 'received', data, HttpStatus.CREATED)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, 'received', err.msg, err.statusCode)
                })
        })

        router.post('/read', (requestObj, responseObj, next) => {
            validate()(requestObj, responseObj, next, keycloak)
        }, (requestObj, responseObj, next) => {
            announcementController.read(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, 'read', data, HttpStatus.CREATED)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, 'read', err.msg, err.statusCode)
                })
        })

        router.get('/resend/:announcementId', (requestObj, responseObj, next) => {
            validate()(requestObj, responseObj, next, keycloak)
        }, (requestObj, responseObj, next) => {
            announcementController.getResend()(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, 'getresend.id', data, HttpStatus.OK)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, 'getresend.id', err.msg, err.statusCode)
                })


        })

        router.post('/resend', (requestObj, responseObj, next) => {
            validate()(requestObj, responseObj, next, keycloak)
        }, (requestObj, responseObj, next) => {
            let config = {
                userid: _.get(requestObj, 'body.request.createdBy')
            }
            validateRoles()(requestObj, responseObj, next, config)
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