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

  createObject(data, indexStore) {
    return this.__createObject()(data, indexStore)
  }

  __createObject() {
    return async((data, indexStore) => {
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
      if (indexStore == false) {
          options.body.request = _.omit(options.body.request, ['documentName']);
      }
      try {
        let result = await (this.httpService(options))
        return { data: _.get(result, 'body.result'), status: 'created' }
      } catch (error) {
        throw { msg: 'unable to create object', status: 'error' }
      }
    })
  }

  findObject(data, indexStore) {
    return this.__findObject()(data, indexStore)
  }

  __findObject() {
    return async((data, indexStore) => {
      //await (this.validateFindObject(data))
      let options = {
        method: 'POST',
        uri: envVariables.DATASERVICE_URL + 'data/v1/object/search',
        body: {
          request: {
            'filters': data.query,
            'documentName':data.table,
            "facets":data.facets,
          }
        },
        json: true
      }
      options.body.request = _.pickBy(options.body.request, _.identity); // Removes all falsey values
      if (indexStore == false) {
          options.body.request = _.omit(options.body.request, ['documentName']);
          options.body.request.tableName = data.table;
      }
      try {
        let result = await (this.httpService(options))
        if (_.get(result, 'body.result.response.count') > 0) {
          return { data: _.get(result, 'body.result.response'), status: 'success' }
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
            let options = {
                method: 'POST',
                uri: envVariables.DATASERVICE_URL + 'data/v1/object/update',
                body: {
                    request: {
                        'tableName': data.table,
                        'documentName': data.table,
                        'payload': data.values
                    }
                },
                json: true
            }
            try {
                let result = await (this.httpService(options))
                return {data: result, status: 'updated'}
            } catch (error) {
                throw {msg: 'unable to update object', status: 'error', error: error }
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
        console.log("response",response.statusCode)
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
