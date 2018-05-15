/**
 * @author Manjunathd@ilimi.in <manjunathd@ilimi.in>
 */

let webService = require('request')
let envVariables = require('../../environmentVariablesHelper.js')
let AppError = require('./ErrorInterface.js')
let HttpStatus = require('http-status-codes')
let dateFormat = require('dateformat')

/**
 * It used to invoke http request calls
 */
class HttpWrapper {
  /**
     * It used to invoke the http request
     * @param  {object} options - Request object it should have header and body.
     */
  static call (options) {
    return new Promise((resolve, reject) => {
      try {
        if (!options) reject('options required!')

        let token = options.token || ''
        options.headers = options.headers || this.getRequestHeader(token)

        console.log('Announcement - Httpwrapper - Request', options)

        webService(options, (error, response, body) => {
          if (error || response.statusCode >= 400) {
            console.log('Announcement - Httpwrapper - Call Error', error)
            console.log('Announcement - Httpwrapper - Call ErrorResponse', response)

            const msg = response && response.params ? response.params.errmsg : 'Internal Server Error'
            const statusCode = response.statusCode ? response.statusCode : HttpStatus.INTERNAL_SERVER_ERROR
            reject(new AppError({message: msg, status: statusCode}))
          } else {
            resolve({ response, body })
          }
        })
      } catch (error) {
        console.log('Announcement - Httpwrapper - Error', error)
        reject(new AppError({message: 'Unable to fetch from server!', status: HttpStatus.INTERNAL_SERVER_ERROR}))
      }
    })
  }

  /**
     * Which is used to get the request header object structure
     * @param  {string} token - User authenticated token
     * @return {object}       request header
     */
  static getRequestHeader (token) {
    return {
      'x-device-id': 'x-device-id',
      'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo', true),
      'x-consumer-id': envVariables.PORTAL_API_AUTH_TOKEN,
      'content-type': 'application/json',
      'accept': 'application/json',
      'Authorization': 'Bearer ' + envVariables.PORTAL_API_AUTH_TOKEN,
      'x-authenticated-user-token': token || ''
    }
  }
}
module.exports = HttpWrapper
