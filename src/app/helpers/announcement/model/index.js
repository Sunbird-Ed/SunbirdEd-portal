let AnnouncementModel = require('./AnnouncementModel.js')
let AnnouncementTypeModel = require('./AnnouncementTypeModel.js')
let AttachmentModel = require('./AttachmentModel.js')
let MetricsModel = require('./MetricsModel.js')
let UserPermissionsModel = require('./UserPermissionsModel.js')
let Joi = require('joi')
let request = require('request')
let _ = require('lodash')
let async = require('asyncawait/async')
let await = require('asyncawait/await')

const TableModelMapping = {
  'Announcement': AnnouncementModel,
  'AnnouncementType': AnnouncementTypeModel,
  'Attachment': AttachmentModel,
  'Metrics': MetricsModel,
  'UserPermissions': UserPermissionsModel
}

const MODEL = {
  'ANNOUNCEMENT': 'Announcement',
  'ANNOUNCEMENTTYPE': 'AnnouncementType',
  'ATTACHMENT': 'Attachment',
  'METRICS': 'Metrics',
  'USERPERMISSIONS': 'UserPermissions'	
}

Object.freeze(MODEL)

function validateRequest(data) {
  if (data && TableModelMapping[data.table]) return true
  return false
}

let createObject = async(function(data) {
  if (!validateRequest(data)) throw { msg: 'invalid request!' }
  if (!data.values) throw { msg: 'values required!' } 

  let validation = Joi.validate(data.values, TableModelMapping[data.table], { abortEarly: false })
  if (validation.error != null) {
    let messages = []
    _.forEach(validation.error.details, function(error, index) {
      messages.push({ field: error.path[0], description: error.message })
    })
    throw { msg: messages }
  }

  //TODO: make API request to cassandra CRUD API
  //TODO: create document name same as tabel name
  return { status: 'success' }
})

let findObject = async(function(data) {
  if (!validateRequest(data)) throw { msg: 'table not found!' }
  if (!data.query) throw { msg: 'invalid query!' }

  try {
    _.forIn(data.query, function(value, key) {
      let subSchema = Joi.reach(TableModelMapping[data.table], key)
      let validation = Joi.validate(value, subSchema)
      if (validation.error) throw { msg: 'invalid query fields!' }
    })
  } catch (error) {
    throw { msg: 'invalid query fields!' }
  }

  //TODO: make API request to cassandra CRUD API
  return { status: 'success' }
})

let getObjectById = async(function(data) {
  if (!validateRequest(data)) throw { msg: 'table not found!' }
  if (!data.id) throw { msg: 'Id is required!!' }

  return await (findObject({ table: data.table, query: { id: data.id } }))
})

let updateObjectById = async(function(data) {
  if (!validateRequest(data)) throw { msg: 'table not found!' }
  if (!data.data) throw { msg: 'invalid query!' }
  if (!data.id) throw { msg: 'Id is required!' }

  try {
    _.forIn(data.data, function(value, key) {
      let subSchema = Joi.reach(TableModelMapping[data.table], key)
      let validation = Joi.validate(value, subSchema)
      if (validation.error) throw { msg: 'invalid query fields!' }
    })
  } catch (error) {
    throw { msg: 'invalid query fields!' }
  }

  //TODO: make API request to cassandra CRUD API
  return { status: 'success' }
})

let deleteObjectById = async(function(data) {
  if (!validateRequest(data)) throw { msg: 'table not found!' }
  if (!data.id) throw { msg: 'Id is required!' }

  //TODO: make API request to cassandra CRUD API
  return { status: 'success' }
})

module.exports = {
  createObject,
  findObject,
  getObjectById,
  updateObjectById,
  deleteObjectById,
  MODEL
}
