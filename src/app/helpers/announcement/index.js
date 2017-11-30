let express = require('express')
let router = express.Router()
let HttpStatus = require('http-status-codes')
let controller = require('./controller.js')
let metricsModel = require('./model/MetricsModel.js')
let announcementModel = require('./model/AnnouncementModel.js')
let announcementTypeModel = require('./model/AnnouncementTypeModel.js')
let httpService = require('./services/httpWrapper.js')
let path = require('path')
let multer = require('multer')
const _ = require('lodash')
let await = require('asyncawait/await')
let async = require('asyncawait/async')
const CREATE_ROLE = 'ANNOUNCEMENT_SENDER'
const API_ID_BASE = 'api.plugin.announcement'
const API_IDS = {
    create: 'create',
    getbyid: 'get.id',
    cancel: 'cancel',
    userinbox: 'user.inbox',
    useroutbox: 'user.outbox',
    definitions: 'definitions',
    received: 'received',
    read: 'read',
    getresend: 'getresend.id',
    resend: 'resend'
}

let announcementController = new controller({
    metricsModel: metricsModel,
    announcementModel: announcementModel,
    announcementTypeModel: announcementTypeModel,
    service:httpService
})

const API_VERSION = '1.0'

function sendSuccessResponse(res, id, result, code = HttpStatus.OK) {
    res.status(code)
    res.send({
        'id': API_ID_BASE + '.' + id,
        'ver': API_VERSION,
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
        'id': API_ID_BASE + '.' + id,
        'ver': API_VERSION,
        'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
        'params': {
            'resmsgid': uuidv1(),
            'msgid': null,
            'status': 'failed',
            'err': '',
            'errmsg': message
        },
        'responseCode': code,
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
        let userProfile = undefined
        let authUserToken = _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
        try {
            var tokenDetails = await (announcementController.__getTokenDetails(authUserToken))
            if(tokenDetails){
                userProfile = await (announcementController.__getUserProfile(authUserToken))
            }
            let isAuthorized = isCreateRolePresent(userProfile, config.sourceid);
            if (isAuthorized) {
                next()
            } else {
                throw "User has no create access"
            }
        } catch (error) {
            if (error === 'USER_NOT_FOUND') {
                sendErrorResponse(responseObj, config.apiid, "USER_NOT_FOUND", HttpStatus.BAD_REQUEST)
            } else if (error === 'UNAUTHORIZED_USER') {
                 sendErrorResponse(responseObj, config.apiid, "UNAUTHORIZED_USER", HttpStatus.UNAUTHORIZED)
            } else {
                 sendErrorResponse(responseObj, config.apiid, "UNAUTHORIZED_USER", HttpStatus.UNAUTHORIZED)
            }
        }
    })
}

function validate() {
    return async((requestObj, responseObj, next, keycloak, config) => {
        let authUserToken = _.get(requestObj, "headers['x-authenticated-user-token']")
        if (authUserToken) {
            var tokenDetails = await (announcementController.__getTokenDetails(authUserToken))
            console.log("tokenDetails",tokenDetails)
            if (tokenDetails) {
                next()
            } else {
                sendErrorResponse(responseObj, config.apiid, "UNAUTHORIZED_USER", HttpStatus.UNAUTHORIZED)
            }
        } else {
            if (keycloak) {
                keycloak.protect()(requestObj, responseObj, next)
            } else {
                sendErrorResponse(responseObj, config.apiid, "UNAUTHORIZED_USER", HttpStatus.UNAUTHORIZED)
            }
        }
    });
}

module.exports = function(keycloak) {
        router.post('/create', (requestObj, responseObj, next) => {
            let config = {apiid: API_IDS.create}
            validate()(requestObj, responseObj, next, keycloak, config)
        }, (requestObj, responseObj, next) => {
            let config = {
                sourceid: _.get(requestObj, 'body.request.sourceId'),
                apiid: API_IDS.create
            }
            validateRoles()(requestObj, responseObj, next, config)
        }, (requestObj, responseObj, next) => {
            announcementController.create(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, API_IDS.create, data, HttpStatus.CREATED)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, API_IDS.create, err.message, err.status)
                })
        })

        router.get('/get/:id', (requestObj, responseObj, next) => {
            announcementController.getAnnouncementById(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, API_IDS.getbyid, data, HttpStatus.OK)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, API_IDS.getbyid, err.message, err.status)
                })
        })

        router.delete('/cancel', (requestObj, responseObj, next) => {
            let config = {apiid: API_IDS.cancel}
            validate()(requestObj, responseObj, next, keycloak, config)
        }, (requestObj, responseObj, next) => {
            let config = {
                apiid: API_IDS.cancel
            }
            validateRoles()(requestObj, responseObj, next, config)
        }, (requestObj, responseObj, next) => {
            announcementController.cancelAnnouncementById(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, API_IDS.cancel, data, HttpStatus.OK)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, API_IDS.cancel, err.message, err.status)
                })
        })

        router.post('/user/inbox', (requestObj, responseObj, next) => {
            let config = {apiid: API_IDS.userinbox}
            validate()(requestObj, responseObj, next, keycloak, config)
        }, (requestObj, responseObj, next) => {
            announcementController.getUserInbox(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, API_IDS.userinbox, data, HttpStatus.OK)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, API_IDS.userinbox, err.message, err.status)
                })
        })

        router.post('/user/outbox', (requestObj, responseObj, next) => {
            let config = {apiid: API_IDS.useroutbox}
            validate()(requestObj, responseObj, next, keycloak, config)
        }, (requestObj, responseObj, next) => {
            announcementController.getUserOutbox(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, API_IDS.useroutbox, data, HttpStatus.OK)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, API_IDS.useroutbox, err.message, err.status)
                })
        })

        router.post('/definitions', (requestObj, responseObj, next) => {
            let config = {apiid: API_IDS.definitions}
            validate()(requestObj, responseObj, next, keycloak, config)
        }, (requestObj, responseObj, next) => {
            let config = {
                apiid: API_IDS.definitions
            }
            validateRoles()(requestObj, responseObj, next, config)
        }, (requestObj, responseObj, next) => {
            announcementController.getDefinitions(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, API_IDS.definitions, data, HttpStatus.OK)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, API_IDS.definitions, err.message, err.status)
                })
        })

        router.post('/received', (requestObj, responseObj, next) => {
            let config = {apiid: API_IDS.received}
            validate()(requestObj, responseObj, next, keycloak, config)
        }, (requestObj, responseObj, next) => {
            announcementController.received(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, API_IDS.received, data, HttpStatus.CREATED)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, API_IDS.received, err.message, err.status)
                })
        })

        router.post('/read', (requestObj, responseObj, next) => {
            let config = {apiid: API_IDS.read}
            validate()(requestObj, responseObj, next, keycloak, config)
        }, (requestObj, responseObj, next) => {
            announcementController.read(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, API_IDS.read, data, HttpStatus.CREATED)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, API_IDS.read, err.message, err.status)
                })
        })

        router.get('/resend/:announcementId', (requestObj, responseObj, next) => {
            let config = {apiid: API_IDS.getresend}
            validate()(requestObj, responseObj, next, keycloak, config)
        }, (requestObj, responseObj, next) => {
            announcementController.getResend()(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, API_IDS.getresend, data, HttpStatus.OK)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, API_IDS.getresend, err.message, err.status)
                })

        })

        router.post('/resend', (requestObj, responseObj, next) => {
            let config = {apiid: API_IDS.resend}
            validate()(requestObj, responseObj, next, keycloak, config)
        }, (requestObj, responseObj, next) => {
            let config = {
                apiid: API_IDS.resend
            }
            validateRoles()(requestObj, responseObj, next, config)
        }, (requestObj, responseObj, next) => {
            announcementController.resend(requestObj)
                .then((data) => {
                    sendSuccessResponse(responseObj, API_IDS.resend, data, HttpStatus.CREATED)
                })
                .catch((err) => {
                    sendErrorResponse(responseObj, API_IDS.resend, err.message, err.status)
                })
        })

        return router
    }
    // module.exports = router