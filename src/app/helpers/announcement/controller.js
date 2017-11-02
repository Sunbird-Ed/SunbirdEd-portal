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

  /**
   * Public method to accept create announcement call
   *
   * @param   {[type]}  requestObj  [description]
   *
   * @return  {[type]}              [description]
   */
  create(requestObj) {
    return this.__create()(requestObj)
  }

  __create() {
    return async((requestObj) => {
      // validate parameters
      let request = this.__validateCreateRequest(requestObj)
      if (!request.isValid) throw { msg: request.error, statusCode: HttpStatus.BAD_REQUEST }

      // TODO: validate user permission to create

      try {
        var newAnnouncementObj = await (this.__createAnnouncement(requestObj.request))
      } catch (error) {
        throw { msg: 'unable to process the request!', statusCode: HttpStatus.INTERNAL_SERVER_ERROR }
      }

      try {
        await (this.__createAnnouncementNotification( /*announcement data*/ ))
        return { announcement: newAnnouncementObj.data }
      } catch (e) {
        // even if notification fails, it should still send annoucement in response
        return { announcement: newAnnouncementObj.data }
      }
    })
  }

  /**
   * Validate the incoming request for creating an announcement
   *
   * @param   {[type]}  requestObj  [description]
   *
   * @return  {[type]}              [description]
   */
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

  /**
   * Get permissions list of the given user
   *
   * @param   {[type]}  data  [description]
   *
   * @return  {[type]}        [description]
   */
  __getUserPermissions(data) {
    //TODO: Get the permissions from Sunbird
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
          if (!_.isObject(data)) {
            reject({ msg: 'unable to create announcement' })
          } else {
            resolve({ data: { id: announcementId } })
          }
        })
        .catch((error) => {
          reject({ msg: 'unable to create announcement' })
        })
    })
  }

  /**
   * Call the notification service to send notifications about the announcement.
   *
   * @return  {[type]}  [description]
   */
  __createAnnouncementNotification() {
    return new promise((resolve, reject) => {
      resolve({ msg: 'notification sent!' })
    })
  }

  /**
   * Get announcement
   *
   * @param   {[type]}  requestObj  [description]
   *
   * @return  {[type]}              [description]
   */
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
          if (!_.isObject(data)) {
            reject({ msg: 'unable to fetch announcement', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
          } else {
            _.forEach(data.data, (announcementObj) => {
              if (_.isString(announcementObj.target)) announcementObj.target = JSON.parse(announcementObj.target)
            })
            resolve(data.data)
          }
        })
        .catch((error) => {
          console.log(error)
          reject({ msg: 'unable to fetch announcement', statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
        })
    })
  }

  /**
   * Get a list of announcement types
   *
   * @return  {[type]}  [description]
   */
  getAnnouncementTypes() {
    let announcementTypes = ['announcement', 'circular']
    return new Promise((resolve, reject) => {
      resolve({ types: announcementTypes })
    })
  }

  /**
   * Cancel announcement
   *
   * @param   {[type]}  requestObj  [description]
   *
   * @return  {[type]}              [description]
   */
  cancelAnnouncementById(requestObj) {
    return this.__cancelAnnouncementById()(requestObj)
  }

  __cancelAnnouncementById() {
    return async((requestObj) => {
      //TODO: complete implementation
      return { announcementId: requestObj.params.announcementId, status: 'cancelled' }
    })
  }

  /**
   * Get inbox of announcements for a given user
   *
   * @param   {[type]}  requestObj  [description]
   *
   * @return  {[type]}              [description]
   */
  getUserInbox(requestObj) {
    return this.__getUserInbox()(requestObj)
  }

  __getUserInbox() {
    //TODO: complete implementation
    return async((requestObj) => {
      return { "announcements": [{ "announcementId": "2344-1234-1234-12312", "sourceId": "some-organisation-id", "createdBy": "Creator1", "createdOn": "2017-10-24", "type": "announcement", "links": ["https://linksToOtheresources.com"], "title": "Monthy Status", "description": "some description", "target": ["teachers"], "attachments": [{ "title": "circular.pdf", "downloadURL": "https://linktoattachment", "mimetype": "application/pdf" }] }] }
    })
  }

  /**
   * Get outbox of announcements for a given user
   *
   * @param   {[type]}  requestObj  [description]
   *
   * @return  {[type]}              [description]
   */
  getUserOutbox(requestObj) {
    return this.__getUserOutbox()(requestObj)
  }

  __getUserOutbox() {
    //TODO: complete implementation
    return async((requestObj) => {
      return { "announcements": [{ "announcementId": "2344-1234-1234-12312", "sourceId": "some-organisation-id", "createdBy": "Creator1", "createdOn": "2017-10-24", "type": "announcement", "links": ["https://linksToOtheresources.com"], "title": "Monthy Status", "description": "some description", "target": ["teachers"], "attachments": [{ "title": "circular.pdf", "downloadURL": "https://linktoattachment", "mimetype": "application/pdf" }] }] }
    })
  }

  /**
   * Process the uploaded file (while creating announcement)
   *
   * @param   {[type]}  requestObj  [description]
   *
   * @return  {[type]}              [description]
   */
  uploadAttachment(requestObj) {
    return this.__uploadAttachment()(requestObj)
  }

  __uploadAttachment() {
    //TODO: complete implementation
    return async((requestObj) => {
      if (!_.isObject(requestObj.file)) throw { msg: 'invalid request!', statusCode: HttpStatus.BAD_REQUEST }
      
      let attachmentId = uuidv1()
      let query = {
        table: this.objectStoreRest.MODEL.ATTACHMENT,
        values: {
          'id': attachmentId,
          'file': requestObj.file.buffer.toString('utf8'),
          'filename': requestObj.file.originalname,
          'mimetype': requestObj.file.mimetype,
          'status': 'created',
          'size': requestObj.file.size,
          'createddate': dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo")
        }
      }

      if (!_.isEmpty(requestObj.body.createdBy)) query.values.createdBy = requestObj.body.createdBy

      console.log(_.omit(requestObj.file, ['buffer']))
    
      try {
        return await (this.objectStoreRest.createObject(query)
          .then((data) => {
            if (!_.isObject(data)) {
              reject()
            } else {
              resolve({ attachment: { id: attachmentId } })
            }
          })
          .catch((error) => {
            reject(error)
          }))
      } catch (e) {
        throw { msg: 'unable to upload!', statusCode: HttpStatus.INTERNAL_SERVER_ERROR }
      }
    })
  }

  /**
   * Process the attachment download request
   *
   * @param   {[type]}  requestObj  [description]
   *
   * @return  {[type]}              [description]
   */
  downloadAttachment(requestObj) {
    return this.__downloadAttachment()(requestObj)
  }

  __downloadAttachment() {
    //TODO: complete implementation
    return async((requestObj) => {
      return {}
    })
  }

  /**
   * Get a list of senders on whose behalf the user can send announcement
   *
   * @param   {[type]}  requestObj  [description]
   *
   * @return  {[type]}              [description]
   */
  getSenderList(requestObj) {
    return this.__getSenderList()(requestObj)
  }

  __getSenderList() {
    //TODO: complete implementation
    return async((requestObj) => {
      return {}
    })
  }
}


module.exports = new AnnouncementController()
