let AnnouncementModel = require('./AnnouncementModel.js')
let Joi = require('joi')
let request = require('request')
let _ = require('lodash')

const TableMapping = {
  "announcement": AnnouncementModel
}

function createObject(data, callback) {
  if (!data) {
    callback && callback("invalid create request!")
    return
  } else if (!TableMapping[data.table]) {
    callback && callback("invalid table name!")
    return
  } else if (!data.values) {
    callback && callback("values not found!")
    return
  }

  let validation = Joi.validate(data.values, TableMapping[data.table], { abortEarly: false })
  if (validation.error != null) {
    let messages = []
    _.forEach(validation.error.details, function(error, index) {
      messages.push({ field: error.path[0], description: error.message })
    })
    callback && callback(messages)
    return
  }

  //TODO: make API request to cassandra CRUD API
  callback && callback(undefined, { status: "success" })
}

function findObject(data, callback) {

}

function getObjectById(data, callback) {

}

function updateObjectById(data, callback) {

}

function deleteObjectById(data, callback) {

}

module.exports = {
  createObject,
  findObject,
  getObjectById,
  updateObjectById,
  deleteObjectById
}
