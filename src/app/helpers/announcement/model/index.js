let AnnouncementModel = require('./AnnouncementModel.js')
let AnnouncementTypeModel = require('./AnnouncementTypeModel.js')
let AttachmentModel = require('./AttachmentModel.js')
let MetricsModel = require('./MetricsModel.js')
let UserPermissionsModel = require('./UserPermissionsModel.js')
let Joi = require('joi')
let webService = require('request')
let _ = require('lodash')
let async = require('asyncawait/async')
let await = require('asyncawait/await')

class ObjectStore {

  constructor() {
    this.TableModelMapping = {
      'Announcement': AnnouncementModel,
      'AnnouncementType': AnnouncementTypeModel,
      'Attachment': AttachmentModel,
      'Metrics': MetricsModel,
      'UserPermissions': UserPermissionsModel
    }

    this.__MODEL = {
      'ANNOUNCEMENT': 'Announcement',
      'ANNOUNCEMENTTYPE': 'AnnouncementType',
      'ATTACHMENT': 'Attachment',
      'METRICS': 'Metrics',
      'USERPERMISSIONS': 'UserPermissions'
    }
  }

  get MODEL() {
    return this.__MODEL
  }

  createObject(data) {
    return this.__createObject()(data)
  }

  __createObject() {
    return async((data) => {
      if (!this.__validateRequest(data)) throw { msg: 'invalid request!', status: 'error' }
      if (!data.values) throw { msg: 'values required!', status: 'error' }

      let validation = Joi.validate(data.values, this.TableModelMapping[data.table], { abortEarly: false })
      if (validation.error != null) {
        let messages = []
        _.forEach(validation.error.details, (error, index) => {
          messages.push({ field: error.path[0], description: error.message })
        })
        throw { msg: messages, status: 'error' }
      }

      //TODO: make API request to cassandra CRUD API
      //TODO: create document name same as table name
      try {
        let createdObject = await (this.__httpService({}))
        return { data: createdObject, status: 'created' }
      } catch (error) {
      	throw { msg: 'unable to create object', status: 'error' }
      }
    })
  }

  findObject(data) {
    return this.__findObject()(data)
  }

  __findObject() {
    return async((data) => {
      if (!this.__validateRequest(data)) throw { msg: 'table not found!' }
      if (!data.query) throw { msg: 'invalid query!' }

      try {
        _.forIn(data.query, (value, key) => {
          let subSchema = Joi.reach(this.TableModelMapping[data.table], key)
          let validation = Joi.validate(value, subSchema)
          if (validation.error) throw { msg: 'invalid query fields!' }
        })
      } catch (error) {
        throw { msg: 'invalid query fields!' }
      }

      //TODO: make API request to cassandra CRUD API
      return { status: 'success' }
    })
  }

  __validateRequest(data) {
    if (data && this.TableModelMapping[data.table]) return true
    return false
  }

  getObjectById(data) {
    return this.__getObjectById()(data)
  }

  __getObjectById() {
    return async((data) => {
      if (!this.__validateRequest(data)) throw { msg: 'table not found!' }
      if (!data.id) throw { msg: 'Id is required!!' }

      return await (this.findObject({ table: data.table, query: { id: data.id } }))
    })
  }

  updateObjectById(data) {
    return this.__updateObjectById()(data)
  }

  __updateObjectById() {
    return async((data) => {
      if (!this.__validateRequest(data)) throw { msg: 'table not found!' }
      if (!data.data) throw { msg: 'invalid query!' }
      if (!data.id) throw { msg: 'Id is required!' }

      try {
        _.forIn(data.data, (value, key) => {
          let subSchema = Joi.reach(this.TableModelMapping[data.table], key)
          let validation = Joi.validate(value, subSchema)
          if (validation.error) throw { msg: 'invalid query fields!' }
        })
      } catch (error) {
        throw { msg: 'invalid query fields!' }
      }

      //TODO: make API request to cassandra CRUD API
      return { status: 'success' }
    })
  }

  deleteObjectById(data) {
    return this.__deleteObjectById()(data)
  }

  __deleteObjectById() {
    return async((data) => {
      if (!this.__validateRequest(data)) throw { msg: 'table not found!' }
      if (!data.id) throw { msg: 'Id is required!' }

      //TODO: make API request to cassandra CRUD API
      return { status: 'success' }
    })
  }

  __httpService(options) {
    return new Promise((resolve, reject) => {
      if (!options) reject('options required!')
      resolve({ "column1": "data1" })
      /*webService(options, (error, response, body) => {
        if (error) reject(error)
        if (response) resolve({ response, body })
      })*/
    })
  }


}

module.exports = new ObjectStore()
