let Joi = require('joi')
let HttpStatus = require('http-status-codes')
const _ = require('lodash')
let async = require('asyncawait/async')
let await = require('asyncawait/await')
const ObjectStore = require('./model')

let create = async(function(requestObj) {
  // validate parameters
  let request = validateCreateRequest(requestObj)
  if (!request.isValid) throw { msg: request.error, httpCode: HttpStatus.BAD_REQUEST }

  try {
    var userPermissions = await (checkUserPermissions({ user: requestObj.body.request.createdBy }))      
  } catch(error) {
    throw { msg: 'user does not exist!', httpCode: HttpStatus.BAD_REQUEST }
  }

  if (!userPermissions.data.hasCreateAccess) throw { msg: 'user does not have create access', httpCode: HttpStatus.BAD_REQUEST }

  try {  
    let announcementObj = await (createAnnouncement(requestObj.body.request))
    if (announcementObj.data) return { data: announcementObj.data }
  } catch(error) {
    throw { msg: 'unable to process the request!' }
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
    if (!data) reject({ msg: 'invalid request'})

    let query = { table: ObjectStore.MODEL.ANNOUNCEMENT, values: { /*"id": "123-1-231-32-123", "sourceid": "bangalore.teachers.org", "createddate": "27-10-17", "userid": "123-123-12313-123"*/ } }
    ObjectStore.createObject(query)
    .then(function(data) {
      resolve({ data: data })
    })
    .catch(function(error) {
      reject({ msg: 'unable to create announcement' })
    })
    
  })
}

let getAnnouncementById = async(function(id) {
  return "you will get the announcement soon..."
})

module.exports = {
  create,
  getAnnouncementById
}
