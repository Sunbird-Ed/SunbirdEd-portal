let webService = require('request')
let _ = require('lodash')
let async = require('asyncawait/async')
let await = require('asyncawait/await')
let ObjectStore = require('./ObjectStore.js')

class ObjectStoreRest extends ObjectStore {
  constructor(modelMapping, modelConstant) {
  	super(modelMapping, modelConstant)
  }

  createObject(data) {
    return this.__createObject()(data)
  }

  __createObject() {
    return async((data) => {
      await (this.validateCreateObject(data))

      try {
        let result = await (this.httpService({}))
        return { data: result, status: 'created' }
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
      await (this.validateFindObject(data))

      try {
        let result = await (this.httpService({}))
        return { data: result, status: 'found' }
      } catch (error) {
        throw { msg: 'unable to find object', status: 'error' }
      }
    })
  }

  getObjectById(data) {
  	return this.__getObjectById()(data)
  }

  __getObjectById() {
  	return async((data) => {
  		await(this.validateGetObjectById(data))
  		return await (this.findObject({ table: data.table, query: { id: data.id } }))	
  	})
  }

  updateObjectById(data) {
  	return this.__updateObjectById()(data)
  }

  __updateObjectById() {
  	return async((data) => {
      await (this.validateUpdateObjectById(data))

      try {
        let result = await (this.httpService({}))
        return { data: result, status: 'updated' }
      } catch (error) {
        throw { msg: 'unable to update object', status: 'error' }
      }
    })
  }

  deleteObjectById(data) {
  	return this.__deleteObjectById()(data)
  }

  __deleteObjectById() {
  	return async((data) => {
      await (this.validateDeleteObjectById(data))

      try {
        let result = await (this.httpService({}))
        return { status: 'deleted' }
      } catch (error) {
        throw { msg: 'unable to delete object', status: 'error' }
      }
    })
  }

  httpService(options) {
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

module.exports = ObjectStoreRest
