let webService = require('request')
let _ = require('lodash')
let async = require('asyncawait/async')
let await = require('asyncawait/await')
let ObjectStore = require('./ObjectStore.js')
let envVariables = require('../../environmentVariablesHelper.js')
let dateFormat = require('dateformat')

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

      let options = {
        method: 'POST',
        uri: envVariables.DATASERVICE_URL + 'data/v1/object/create',
        body: {
          request: {
            'tableName': data.table,
            'documentName': data.table, // keeping tableName and documentName as same
            'payload': data.values
          }
        },
        json: true
      }

      try {
        let result = await (this.httpService(options))
        return { data: _.get(result, 'body.result'), status: 'created' }
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

      let options = {
        method: 'POST',
        uri: envVariables.DATASERVICE_URL + 'data/v1/object/search',
        body: {
          request: {
            'documentName': data.table,
            'filters': data.query
          }
        },
        json: true
      }

      try {
        let result = await (this.httpService(options))
        if (_.get(result, 'body.result.response.count') > 0) {
          return { data: _.get(result, 'body.result.response.content'), status: 'success' }
        } else {
          return { data: [], status: 'success' }
        }
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
      await (this.validateGetObjectById(data))
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
      options.headers = options.headers || this.getRequestHeader()
      webService(options, (error, response, body) => {
        if (error || response.statusCode >= 400) {
          reject(error)
        } else {
          resolve({ response, body })
        }
      })
    })
  }

  getRequestHeader() {
    return {
      'x-device-id': 'x-device-id',
      'ts': dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
      'x-consumer-id': envVariables.PORTAL_API_AUTH_TOKEN,
      'content-type': 'application/json',
      'accept': 'application/json',
      'Authorization': 'Bearer ' + envVariables.PORTAL_API_AUTH_TOKEN
    }
  }
}

module.exports = ObjectStoreRest
