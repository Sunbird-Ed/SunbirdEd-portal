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
let dateFormat = require('dateformat')

class AnnouncementController {

  constructor() {
    //table name should be same as the name in database table    
    let tableMapping = {
      'announcement': AnnouncementModel,
      'announcementtype': AnnouncementTypeModel,
      'attachment': AttachmentModel,
      'metrics': MetricsModel,
      'userpermissions': UserPermissionsModel
    }

    let modelConstant = {
      'ANNOUNCEMENT': 'announcement',
      'ANNOUNCEMENTTYPE': 'announcementtype',
      'ATTACHMENT': 'attachment',
      'METRICS': 'metrics',
      'USERPERMISSIONS': 'userpermissions'
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
        var newAnnouncementObj = await (this.__createAnnouncement(requestObj.request))
      } catch (error) {
        throw { msg: 'unable to process the request!', statusCode: HttpStatus.BAD_REQUEST }
      }

      try {
        await (this.__createAnnouncementNotification( /*announcement data*/ ))
        return newAnnouncementObj.data
      } catch (e) {
        // even if notification fails, it should still send annoucement in response
        return newAnnouncementObj.data
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
      let announcementId = uuidv1()
      if (!data) reject({ msg: 'invalid request' })
      let query = {
        table: this.objectStoreRest.MODEL.ANNOUNCEMENT,
        values: {
          'id': announcementId,
          'sourceid': data.sourceId,
          'createddate': dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
          'userid': data.createdBy,
          'details': {
            'title': data.title,
            'type': data.type,
            'description': data.description
          },
          'target': JSON.stringify(data.target),
          'links': data.links
        }
      }

      console.log(query)

      this.objectStoreRest.createObject(query)
        .then((data) => {                    
          resolve({ data: {announcementId} })
        })
        .catch((error) => {
          console.log(error)
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
    return new Promise((resolve, reject) => {
      let query = {
        table: this.objectStoreRest.MODEL.ANNOUNCEMENT,
        query: {
          'id': requestObj.params.id          
        }
      }

      this.objectStoreRest.findObject(query)
        .then((data) => {
          _.forEach(data.data, (announcementObj) => {
            if(_.isString(announcementObj.target)) announcementObj.target = JSON.parse(announcementObj.target)  
          })          
          resolve(data.data)
        })
        .catch((error) => {
          console.log(error)
          reject({ msg: 'unable to fetch announcement' })
        })
    })
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
      return { "announcements": [{ "announcementId": "2344-1234-1234-12312", "sourceId": "some-organisation-id", "createdBy": "Creator1", "createdOn": "2017-10-24", "type": "announcement", "links": ["https://linksToOtheresources.com"], "title": "Monthy Status", "description": "some description", "target": ["teachers"], "attachments": [{ "title": "circular.pdf", "downloadURL": "https://linktoattachment", "mimetype": "application/pdf" }] }] }
    })
  }

  getUserOutbox(requestObj) {
    return this.__getUserOutbox()(requestObj)
  }

  __getUserOutbox() {
    //TODO: complete implementation
    return async((requestObj) => {
      return { "announcements": [{ "announcementId": "2344-1234-1234-12312", "sourceId": "some-organisation-id", "createdBy": "Creator1", "createdOn": "2017-10-24", "type": "announcement", "links": ["https://linksToOtheresources.com"], "title": "Monthy Status", "description": "some description", "target": ["teachers"], "attachments": [{ "title": "circular.pdf", "downloadURL": "https://linktoattachment", "mimetype": "application/pdf" }] }] }
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
        attachment.downloadURL = "https://pathto" + attachment.title
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
