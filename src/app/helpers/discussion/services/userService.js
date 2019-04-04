
let ApiInterceptor = require('sb_api_interceptor')
let envVariables = require('../../environmentVariablesHelper.js')
let AppError = require('./ErrorInterface.js')
let httpWrapper = require('./httpWrapper.js')
let HttpStatus = require('http-status-codes')
const _ = require('lodash')
let async = require('asyncawait/async')
let await = require('asyncawait/await') //eslint-disable-line

class UserService {
    constructor() {
      /**
       * @property {instance} httpService - Instance of httpservice which is used to make a http service call
       */    
      this.httpService = httpWrapper
    }

/**
   * To get a user's profile data
   * @param  String authUserToken User's access token
   * @return Object               Profile data
   */
  getUserProfile(authUserToken) {
    return new Promise((resolve, reject) => {
      try {
        let tokenDetails = await (this.getTokenDetails(authUserToken))

        if (!tokenDetails) {
          throw {
            message: 'Unauthorized User!',
            status: HttpStatus.UNAUTHORIZED,
            isCustom: true
          }
        }
        let options = {
          method: 'GET',
          uri: envVariables.DATASERVICE_URL + 'user/v1/read/' + tokenDetails.userId,
          headers: this.httpService.getRequestHeader(authUserToken)
        }

        this.httpService.call(options).then((data) => {
            let body = JSON.parse(data.body)
            resolve(body.result.response)
          })
          .catch((error) => {

            if (_.get(error, 'body.params.err') === 'USER_NOT_FOUND') {
              reject(this.customError({
                message: 'User not found!',
                status: HttpStatus.NOT_FOUND,
                isCustom: true
              }))
            } else if (_.get(error, 'body.params.err') === 'UNAUTHORIZE_USER') {
              reject(this.customError({
                message: 'Unauthorized User!',
                status: HttpStatus.UNAUTHORIZED,
                isCustom: true
              }))
            } else {
              reject(this.customError({
                message: 'Unknown Error!',
                status: HttpStatus.BAD_GATEWAY,
                isCustom: true
              }))
            }
          })
      } catch (error) {
        reject(this.customError(error))
      }
    })
  }

  /**
   * Get logged in user id
   * @return {[type]} [description]
   */
  getLoggedinUserId() {
    return async ((requestObj) => {
      let authUserToken = this.getToken(requestObj)
      let tokenDetails = await (this.getTokenDetails(authUserToken))
      if (tokenDetails) {
        return tokenDetails.userId
      }
      return false
    })
  }

  /**
   * Get the logged in user's suth token or the token passed in API call
   * @return String Token
   */
  getToken(requestObj) {
    return _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
  }

  /**
   * Validates the token and fetch the userId
   * @param  String authUserToken Auth user token
   * @return Object               For a valid token return token and user id.
   */
  getTokenDetails(authUserToken) {
    return new Promise((resolve, reject) => {
      var keyCloak_config = {
        'authServerUrl': envVariables.PORTAL_AUTH_SERVER_URL,
        'realm': envVariables.KEY_CLOAK_REALM,
        'clientId': envVariables.PORTAL_AUTH_SERVER_CLIENT,
        'public': envVariables.KEY_CLOAK_PUBLIC
      }
      var cache_config = {
        store: envVariables.sunbird_cache_store,
        ttl: envVariables.sunbird_cache_ttl
      }
      if (authUserToken) {
        var apiInterceptor = new ApiInterceptor(keyCloak_config, cache_config)
        apiInterceptor.validateToken(authUserToken, function (err, token) {
          if (token) {
            resolve(token)
          } else {
            resolve(false)
          }
        })
      } else {
        resolve(false)
      }
    })
  }

/**
   * Which is used to create a custom error object
   * @param  {Object} error  - Error object it should contain message and status attribute
   *                           For example error = {message:'Invalid request object', status:'400'}
   * @return {Object}        - Error object
   */
  customError(error) {
    console.log("419 error ", error)
    if (error.isCustom) {
      return new AppError({
        message: error.message || 'Unable to process the request!',
        status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      })
    } else {
      return new AppError({
        message: 'Unable to process the request!',
        status: HttpStatus.INTERNAL_SERVER_ERROR
      })
    }
  }

}
module.exports = UserService
