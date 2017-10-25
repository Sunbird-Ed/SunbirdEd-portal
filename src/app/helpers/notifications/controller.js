let Joi = require('joi')
let HttpStatus = require('http-status-codes')
const _ = require('lodash')
let MockNotificationData = {
    "notifications": [{
        "titile": "Notification 1",
        "description": " This is about description of notification1",
        "createdOn": "DD/MM/YYYY",
        "from": "Author Name",
        "status": "read",
        "priority": "high",
        "language": "English",
        "resource": {
            entity: "Announcement",
            id: "AnnouncementId",
            type: "AnnouncementType"
        }
    }]
}

function pull(requestObj, callback) {
    let mandtoryFields = {
        'userId': Joi.string().required(),
        'limit': Joi.string().required(),
        'filters': Joi.object({
            'status': Joi.string(),
            'fromDate': Joi.string(),
            'toDate': Joi.string(),
            'from': Joi.string()
        }).allow(null)
    }
    let req = validateRequestObj(requestObj, mandtoryFields);
    if (!req.isValid) {
        callback && callback({
            message: req.error,
            httpCode: HttpStatus.BAD_REQUEST
        })
        return
    } else {
        // fetch from the db
        callback && callback(undefined, {
            data: MockNotificationData
        })
    }
};


function create(requestObj, callback) {
    let mandtoryFields = {
        'userId': Joi.string(),
        'limit': Joi.string().required(),
        'filters': Joi.object({
            'status': Joi.string(),
            'fromDate': Joi.string(),
            'toDate': Joi.string(),
            'from': Joi.string()
        }).allow(null)
    }
    let req = validateRequestObj(requestObj, mandtoryFields);
    if (!req.isValid) {
        callback && callback({
            message: req.error,
            httpCode: HttpStatus.BAD_REQUEST
        })
        return
    } else {
        callback && callback(undefined, {
            data: {
                status: "Sucessfully created."
            }
        })
    }
}

function validateRequestObj(requestObj, mandtoryFields) {
    let validation = Joi.validate(requestObj.body.request, mandtoryFields, {
        abortEarly: false
    })
    if (validation.error != null) {
        let messages = []
        _.forEach(validation.error.details, function(error, index) {
            messages.push({
                field: error.path[0],
                description: error.message
            })
        })
        return {
            error: messages,
            isValid: false
        }
    }
    return {
        isValid: true
    }
}
module.exports = {
    pull,
    create
}