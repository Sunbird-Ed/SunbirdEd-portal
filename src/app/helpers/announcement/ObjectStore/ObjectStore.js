let Joi = require('joi')
let webService = require('request')
let _ = require('lodash')
let async = require('asyncawait/async')
let await = require('asyncawait/await')

class ObjectStore {

  constructor(modelMapping = {}, modelConstant = {}) {
    this.TableModelMapping = modelMapping
    this.__MODEL = modelConstant
  }

  get MODEL() {
    return this.__MODEL
  }

  createObject() {
    return new Promise((resolve, reject) => {
      reject('cannot call abstract method')
    })
  }

  findObject() {
    return new Promise((resolve, reject) => {
      reject('cannot call abstract method')
    })
  }

  getObjectById() {
    return new Promise((resolve, reject) => {
      reject('cannot call abstract method')
    }) 
  }

  updateObjectById() {
    return new Promise((resolve, reject) => {
      reject('cannot call abstract method')
    }) 
  }

  deleteObjectById() {
    return new Promise((resolve, reject) => {
      reject('cannot call abstract method')
    }) 
  }

  __validateRequest(data) {
    if (data && this.TableModelMapping[data.table]) return true
    return false
  }

  validateCreateObject(data) {
    return this.__validateCreateObject()(data)
  }

  __validateCreateObject() {
    return async((data) => {
      if (!this.__validateRequest(data)) throw { msg: 'table not found!', status: 'error' }
      if (!data.values) throw { msg: 'values required!', status: 'error' }

      let validation = Joi.validate(data.values, this.TableModelMapping[data.table], { abortEarly: false })
      if (validation.error != null) {
        let messages = []
        _.forEach(validation.error.details, (error, index) => {
          messages.push({ field: error.path[0], description: error.message })
        })
        throw { msg: messages, status: 'error' }
      }

      return true
    })
  }

  validateFindObject(data) {
    return this.__validateFindObject()(data)
  }

  __validateFindObject() {
    return async((data) => {
      if (!this.__validateRequest(data)) throw { msg: 'table not found!', status: 'error' }
      if (!data.query) throw { msg: 'invalid query!', status: 'error' }

      try {
        _.forIn(data.query, (value, key) => {
          let subSchema = Joi.reach(this.TableModelMapping[data.table], key)
          let validation = Joi.validate(value, subSchema)
          if (validation.error) throw { msg: 'invalid query fields!', status: 'error' }
        })
      } catch (error) {
        throw { msg: 'invalid query fields!', status: 'error' }
      }

      return true
    })
  }  

  validateGetObjectById(data) {
    return this.__validateGetObjectById()(data)
  }

  __validateGetObjectById() {
    return async((data) => {
      if (!this.__validateRequest(data)) throw { msg: 'table not found!', status: 'error' }
      if (typeof data.id != 'string') throw { msg: 'Id should be of type string!', status: 'error' }
      return true
    })
  }

  validateUpdateObjectById(data) {
    return this.__validateUpdateObjectById()(data)
  }  

  __validateUpdateObjectById() {
    return async((data) => {
      if (!this.__validateRequest(data)) throw { msg: 'table not found!', status: 'error' }
      if (typeof data.data != 'object') throw { msg: 'invalid query!', status: 'error' }
      if (typeof data.id != 'string') throw { msg: 'Id should be of type string!', status: 'error' }

      try {
        _.forIn(data.data, (value, key) => {
          let subSchema = Joi.reach(this.TableModelMapping[data.table], key)
          let validation = Joi.validate(value, subSchema)
          if (validation.error) throw { msg: 'invalid query fields!', status: 'error' }
        })
      } catch (error) {
        throw { msg: 'invalid query fields!', status: 'error' }
      }

      return true
    })
  }

  validateDeleteObjectById(data) {
    return this.__validateDeleteObjectById()(data)
  }

  __validateDeleteObjectById() {
    return async((data) => {
      if (!this.__validateRequest(data)) throw { msg: 'table not found!', status: 'error' }
      if (!data.id) throw { msg: 'Id should be of type string!', status: 'error' }
      return true
    })
  }
}

module.exports = ObjectStore
