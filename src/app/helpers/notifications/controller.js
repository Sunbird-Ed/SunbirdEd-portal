let Joi = require('joi')
let HttpStatus = require('http-status-codes')
const _ = require('lodash')
let MockNotificationData = {"notifications": [{"titile": "Notification 1", "description": " This is about description of notification1", "createdOn": "DD/MM/YYYY", "from": "Author Name", "status": "read", "priority": "high", "language": "English", "resource": {entity: "Announcement", id: "AnnouncementId", type: "AnnouncementType"} }] }

function pull(requestObj, callback) {
    let mandatoryFields = {
        'userId': Joi.string().required(),
        'limit': Joi.string().required(),
        'filters': Joi.object({
            'status': Joi.string(),
            'since': Joi.string(),
            'till': Joi.string(),
            'from': Joi.string()
        }).allow(null)
    }
    let req = validateRequestObj(requestObj, mandatoryFields);
    if (!req.isValid) {
        callback && callback({message: req.error, httpCode: HttpStatus.BAD_REQUEST }) 
        return
    } else {
        // fetch from the db
        callback && callback(undefined, {data: MockNotificationData }) 
    }
};

function create(requestObj, callback) {
    let mandatoryFields = {
        'title': Joi.string().required(),
        'description': Joi.string().required(),
        'createdDate':Joi.string().required(),
        'priority':Joi.string(),
        'language':Joi.string(),
        'sender':Joi.object({
            'name':Joi.string(),
            'id':Joi.string().required(),
            'type':Joi.string()
        }),
        "origin":Joi.object({
            "entity": Joi.string(),
            "id": Joi.string()
        }),
        'recevier':Joi.array().items(Joi.object({
            'id':Joi.string().required(),
            'name':Joi.string(),
            'type':Joi.string()
        }).required())
    }
    let req = validateRequestObj(requestObj, mandatoryFields);
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

function validateRequestObj(requestObj, mandatoryFields) {
    let validation = Joi.validate(requestObj.body.request, mandatoryFields, {
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
        return {error: messages, isValid: false } 
    }
    return {isValid: true } 
}
module.exports = {pull, create }