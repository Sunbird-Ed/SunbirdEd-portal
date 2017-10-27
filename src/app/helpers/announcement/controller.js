let Joi = require('joi')
let HttpStatus = require('http-status-codes')
const _ = require('lodash')
let async = require('asyncawait/async')
let await = require('asyncawait/await')
const ObjectStore = require('./model')

class AnnouncementController {
  create(requestObj) {
    return this.__create()(requestObj)
  }

  __create() {
    return async((requestObj) => {
      // validate parameters
      let request = this.__validateCreateRequest(requestObj)
      if (!request.isValid) throw { msg: request.error, statusCode: HttpStatus.BAD_REQUEST }

      try {
        var userPermissions = await (this.__getUserPermissions({ user: requestObj.request.createdBy }))
      } catch (error) {
        throw { msg: 'user does not exist!', statusCode: HttpStatus.BAD_REQUEST }
      }

      if (!userPermissions.data.hasCreateAccess) throw { msg: 'user does not have create access', statusCode: HttpStatus.BAD_REQUEST }

      try {
        var newAnnouncementObj = await (this.__createAnnouncement(requestObj.request))               
      } catch (error) {
        throw { msg: 'unable to process the request!', statusCode: HttpStatus.BAD_REQUEST }
      }

      try {
        await(this.__createAnnouncementNotification(/*announcement data*/))
        return { data: newAnnouncementObj.data }
      } catch(e) {
        // even if notification fails, it should still send annoucement in response
        return { data: newAnnouncementObj.data }
      }


    })
  }

  __validateCreateRequest(requestObj) {
    let validation = Joi.validate(requestObj, Joi.object().keys({
      "request": Joi.object().keys({
          'sourceId': Joi.string().required(),
          'createdBy': Joi.string().required(),
          'title': Joi.string().required(),
          'type': Joi.string().required(),
          'description': Joi.string().required(),
          'target': Joi.object().min(1).pattern(/\w/, Joi.string().required()).required(),
          'links': Joi.array().items(Joi.string().required()) // optional
        }).required()
    }), { abortEarly: false })

    if (validation.error != null) {
      let messages = []
      _.forEach(validation.error.details, (error, index) => {
        messages.push({ field: error.path[0], description: error.message })
      })
      //console.log('request has errors ',  messages)
      return { error: messages, isValid: false }
    }
    //console.log('validation is passed')
    return { isValid: true }
  }

  __getUserPermissions(data) {
    return new Promise((resolve, reject)  => {
      let query = { table: ObjectStore.MODEL.USERPERMISSIONS, query: { 'userid': data.user } }

      ObjectStore.findObject(query)
        .then((data) => {
          resolve({ data: data })
        })
        .catch((error) => {
          reject({ msg: 'user does not exist!' })
        })
    })
  }

  __createAnnouncement(data) {
    return new Promise((resolve, reject) => {
      if (!data) reject({ msg: 'invalid request' })

      let query = { table: ObjectStore.MODEL.ANNOUNCEMENT, values: { /*"id": "123-1-231-32-123", "sourceid": "bangalore.teachers.org", "createddate": "27-10-17", "userid": "123-123-12313-123"*/ } }
      ObjectStore.createObject(query)
        .then((data) => {
          resolve({ data: data })
        })
        .catch((error) => {
          reject({ msg: 'unable to create announcement' })
        })
    })
  }

  __createAnnouncementNotification() {
    return new promise((resolve, reject) => {
      resolve({ msg: 'notification sent!'})
    })
  }

  getAnnouncementById(id) {
    return this.__getAnnouncementById()(id)
  }

  __getAnnouncementById() {
    return async((id) => "you will get the announcement soon...")
  }
}


module.exports = new AnnouncementController()