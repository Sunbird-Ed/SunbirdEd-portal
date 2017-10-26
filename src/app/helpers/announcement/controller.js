let Joi = require('joi')
let HttpStatus = require('http-status-codes')
const _ = require('lodash')
var async = require('asyncawait/async');
var await = require('asyncawait/await');

let create = async(function(requestObj) {
  // validate parameters
  let request = validateCreateRequest(requestObj)
  if (!request.isValid) throw { msg: request.error, httpCode: HttpStatus.BAD_REQUEST }

  let userPermissions = await (checkUserPermissions({ user: requestObj.body.request.createdBy }))  
  if (userPermissions.data.hasCreateAccess) {
    let announcementObj = await (createAnnouncement(requestObj.body.request))
    if (announcementObj.data) return { data: announcementObj.data }
  } else {
    throw { msg: 'user does not have create access', httpCode: HttpStatus.BAD_REQUEST }
  }
})

function validateCreateRequest(requestObj) {
  let validation = Joi.validate(requestObj.body.request, {
    'sourceId': Joi.string().required(),
    'createdBy': Joi.string().required(),
    'title': Joi.string().required(),
    'type': Joi.string().required(),
    'description': Joi.string().required(),
    'target': Joi.array().items(Joi.string().required()).required(),
    'links': Joi.array().items(Joi.string().required()) // optional
  }, { abortEarly: false })
  if (validation.error != null) {
    let messages = []
    _.forEach(validation.error.details, function(error, index) {
      messages.push({ field: error.path[0], description: error.message })
    })
    return { error: messages, isValid: false }
  }

  return { isValid: true }
}

function checkUserPermissions(data) {
  return new Promise(function(resolve, reject) {
    resolve({ data: { hasCreateAccess: true } })
    //reject({ msg: "user verfication failed" })
  })
}

function createAnnouncement(data) {
  return new Promise(function(resolve, reject) {
    resolve({ data: {} })
    //reject({ msg: 'unable to create announcement' })
  })
}

let getAnnouncementById = async(function(id) {
  return "you will get the announcement soon..."
})

module.exports = {
  create,
  getAnnouncementById
}
