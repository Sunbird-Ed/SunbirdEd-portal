let AnnouncementModel = require('./model/AnnouncementModel.js')
let AnnouncementTypeModel = require('./model/AnnouncementTypeModel.js')
let AttachmentModel = require('./model/AttachmentModel.js')
let MetricsModel = require('./model/MetricsModel.js')
let UserPermissionsModel = require('./model/UserPermissionsModel.js')
let Joi = require('joi')
let HttpStatus = require('http-status-codes')
const _ = require('lodash')
let async = require('asyncawait/async')
let await = require('asyncawait/await')
const ObjectStoreRest = require('./ObjectStore/ObjectStoreRest.js')
let uuidv1 = require('uuid/v1')

class AnnouncementController {

  constructor() {
    let tableMapping = {
      'Announcement': AnnouncementModel,
      'AnnouncementType': AnnouncementTypeModel,
      'Attachment': AttachmentModel,
      'Metrics': MetricsModel,
      'UserPermissions': UserPermissionsModel
    }

    let modelConstant = {
      'ANNOUNCEMENT': 'Announcement',
      'ANNOUNCEMENTTYPE': 'AnnouncementType',
      'ATTACHMENT': 'Attachment',
      'METRICS': 'Metrics',
      'USERPERMISSIONS': 'UserPermissions'
    }

    this.objectStoreRest = new ObjectStoreRest(tableMapping, modelConstant)
  }

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
        await (this.__createAnnouncementNotification( /*announcement data*/ ))
        return { data: newAnnouncementObj.data }
      } catch (e) {
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
    return new Promise((resolve, reject) => {
      let query = { table: this.objectStoreRest.MODEL.USERPERMISSIONS, query: { 'userid': data.user } }

      this.objectStoreRest.findObject(query)
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

      let query = { table: this.objectStoreRest.MODEL.ANNOUNCEMENT, values: { /*"id": "123-1-231-32-123", "sourceid": "bangalore.teachers.org", "createddate": "27-10-17", "userid": "123-123-12313-123"*/ } }
      this.objectStoreRest.createObject(query)
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
      resolve({ msg: 'notification sent!' })
    })
  }

  getAnnouncementById(requestObj) {
    return this.__getAnnouncementById()(requestObj)
  }

  __getAnnouncementById() {
    //TODO: complete implementation
    return async((requestObj) => ({
      "announcementId": requestObj.params.id,
      "sourceId": "some-organisation-id",
      "createdBy": "Creator1",
      "createdOn": "2017-10-24",
      "type": "announcement",
      "links": [
        "https://linksToOtheresources.com"
      ],
      "title": "Monthy Status",
      "description": "some description",
      "target": [
        "teachers"
      ],
      "attachments": [{
        "title": "circular.pdf",
        "downloadURL": "https://linktoattachment",
        "mimetype": "application/pdf"
      }]
    }))
  }

  getAnnouncementTypes() {
    let announcementTypes = ['announcement', 'circular']
    return new Promise((resolve, reject) => {
      resolve({ types: announcementTypes })
    })
  }

  cancelAnnouncementById(requestObj) {
    return this.__cancelAnnouncementById()(requestObj)
  }

  __cancelAnnouncementById() {
    return async((requestObj) => {
      //TODO: complete implementation 
      return { announcementId: requestObj.params.announcementId, status: 'cancelled' }
    })
  }

  getUserInbox(requestObj) {
    return this.__getUserInbox()(requestObj)
  }

  __getUserInbox() {
    //TODO: complete implementation
    return async((requestObj) => {
      return {"announcements": [{"announcementId": "2344-1234-1234-12312", "sourceId": "some-organisation-id", "createdBy": "Creator1", "createdOn": "2017-10-24", "type": "announcement", "links": ["https://linksToOtheresources.com"], "title": "Monthy Status", "description": "some description", "target": ["teachers"], "attachments": [{"title": "circular.pdf", "downloadURL": "https://linktoattachment", "mimetype": "application/pdf"} ] } ]} 
    })
  }

  getUserOutbox(requestObj) {
    return this.__getUserOutbox()(requestObj)
  }

  __getUserOutbox() {
    //TODO: complete implementation
    return async((requestObj) => {
      return {"announcements": [{"announcementId": "2344-1234-1234-12312", "sourceId": "some-organisation-id", "createdBy": "Creator1", "createdOn": "2017-10-24", "type": "announcement", "links": ["https://linksToOtheresources.com"], "title": "Monthy Status", "description": "some description", "target": ["teachers"], "attachments": [{"title": "circular.pdf", "downloadURL": "https://linktoattachment", "mimetype": "application/pdf"} ] } ]} 
    })
  }

  uploadAttachment(requestObj) {
    return this.__uploadAttachment()(requestObj)
  }

  __uploadAttachment() {
    //TODO: complete implementation
    return async((requestObj) => {
      let response = []
      _.forEach(requestObj.request.attachments, (attachment, index) => {
        attachment = _.omit(attachment, ["base64Data"])
        attachment.downloadURL = "https://pathto"+attachment.title
        attachment.id = uuidv1()
        response.push(attachment)
      })

      return response
    })
  }

  downloadAttachment(requestObj) {
    return this.__downloadAttachment()(requestObj)
  }

  __downloadAttachment() {
    //TODO: complete implementation
    return async((requestObj) => {
      return {}
    })
  }
}


module.exports = new AnnouncementController()
