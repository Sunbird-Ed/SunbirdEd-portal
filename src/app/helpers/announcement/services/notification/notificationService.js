/**
 * It provides a service to send a notification to enduser.
 */

let webService = require('request')
let envVariables = require('../../../environmentVariablesHelper.js')
let announcementController = require('../../controller.js')
const _ = require('lodash')
let _defaultReqBody = {request: {data: {notificationpayload: {} } } }
const _supportedType = 'fcm'

class notificationService {
  constructor (config) {
    this.suportedType = config.suportedType || _supportedType
    this.userAccessToken = config.userAccessToken
    this.uri = config.uri
    this.requestBody = config.body || _defaultReqBody
  }
  /**
   * Which is used to get the configuration.
   * @return {object}
   */
  __getConfig () {
    let config = {uri: envVariables.DATASERVICE_URL + this.uri, method: 'POST', json: true, body: this.requestBody }
    return config
  }
    /**
     * Which is used to get the current supported notification type.
     * @return {string}
     */
  __getSupportedType () {
    return this.suportedType
  }
    /**
     * Which is used to send a notification.
     * @param  {array} target  List of target id's.
     * @param  {object} payload request object structure.
     */
  send (target, payload) {
    return new Promise((resolve, reject) => {
      this.__forEachPromise(this.__getTargetIdsList(target), this.__httpService, this.__getUpdatedPayload(payload), this).then((data) => {
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  }

  __forEachPromise (items, fn, options) {
    return items.reduce(function (promise, item) {
      options.body.request.to = item
      return promise.then(function () {
        return fn(options)
      })
    }, Promise.resolve())
  }

    /**
     * Returns the target identifier list.
     * @param  {object} example: {geo:{ids:['34453-5345-63654574']}}
     * @return {array}        returns the target id list
     */
  __getTargetIdsList (target) {
    var targetIds = []
    if (target) {
      _.forIn(target, (value, key) => {
        if (_.isObject(value)) {
          _.forEach(value.ids, (v, k) => {
            targetIds.push(v)
          })
        }
      })
    }
    return targetIds
  }

  /**
   * It will add the notification payload and current supported notification type to the request body object.
   * @param  {object} payload object which is need to send in request body.
   * @return {object}        request object including body and headers.
   */
  __getUpdatedPayload (payload) {
    var config = this.__getConfig()
    config.headers = this.__getRequestHeader(this.userAccessToken)
    config.body.request.data.notificationpayload = payload
    config.body.request.type = this.__getSupportedType()
    return config
  }

  /**
   * Which is used to make a http request call
   * @param  {object} options request object
   * @return {object}         response or error object
   */
  __httpService (options) {
    return new Promise((resolve, reject) => {
      if (!options) reject('options required!')
      console.log('options', options.body.request)
      webService(options, (error, response, body) => {
        if (error || response.statusCode >= 400) {
          reject(response)
        } else {
          resolve(body)
        }
      })
    })
  }
  /**
   * Which is used to get the get the header object to make a http request call
   * @param  {string} key User access token
   * @return {object}
   */
  __getRequestHeader (key) {
    return {
      'x-device-id': 'x-device-id',
      'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
      'x-consumer-id': envVariables.PORTAL_API_AUTH_TOKEN,
      'content-type': 'application/json',
      'accept': 'application/json',
      'x-authenticated-user-token': key,
      'Authorization': 'Bearer ' + envVariables.PORTAL_API_AUTH_TOKEN
    }
  }
}

module.exports = notificationService
