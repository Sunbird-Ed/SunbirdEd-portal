/**
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 */

let envVariables = require('../../environmentVariablesHelper.js')
let httpWrapper = require('./httpWrapper.js')
let HttpStatus = require('http-status-codes')
const _ = require('lodash')
let AppError = require('./ErrorInterface.js')
let telemetry = require('./../telemetry/telemetryHelper')

/**
 * Class which privides a services for dataService calls
 */
class DataService {
  /**
     * Caller of the constructor as follows
     * Eg: let dataServiceInstance = new DataService({service:httpServiceInst})
     */
  constructor ({service} = {}) {
    /**
     * @param {Class}  - Which is used to invoke a http service call, Default it's making httpService call
     */
    this.service = service || httpWrapper
  }

  /**
     * Which is used ge the sentCount details
     * @param  {Array} locationIds  - List of location identifiers ex: ['32432','43423']
     * @param {String} token        - Optional, User access token
     * @return {Int}                - Which returns sum of userCount
     */
  getAudience (locationIds, token, reqID) {
    return new Promise((resolve, reject) => {
      const DEFAULT_ENDPOINT = 'data/v1/notification/audience'
      let options = {
        method: 'POST',
        uri: envVariables.DATASERVICE_URL + DEFAULT_ENDPOINT,
        headers: this.service.getRequestHeader(token),
        body: {
          'request': {
            'locationIds': locationIds,
            'userListReq': false,
            'estimatedCountReq': false
          }
        },
        json: true
      }
      telemetry.generateApiCallLogEvent(reqID, options, 'data/v1/notification/audience')
      console.log('Announcement - get audience - Request', JSON.stringify(options))

      this.service.call(options).then((data) => {
        let locations = _.get(data, 'body.result.locations')
        resolve(_.sumBy(locations, 'userCount'))
      }).catch((error) => {
        console.log('Announcement - get audience - Error', error)
        reject(new AppError({
          message: 'Unable to get the sent count',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        }))
      })
    })
  }

  /**
   * Which is used to get the geo location
   * @param  {Array} orgIds  - List of org identifiers
   * @param {String} token  - Optional, User access token
   * @return {Object}        - Which returns the org details.
   */
  getGeoLocations (orgIds, token, reqID) {
    return new Promise((resolve, reject) => {
      try {
        const DEFAULT_ENDPOINT = 'org/v1/search'
        let requestObj = {
          'filters': {
            'id': orgIds
          },
          'fields': ['id', 'locationId']
        }

        let options = {
          'method': 'POST',
          'uri': envVariables.DATASERVICE_URL + DEFAULT_ENDPOINT,
          'body': {
            'request': requestObj
          },
          'json': true
        }
        options.headers = this.service.getRequestHeader(token)
        telemetry.generateApiCallLogEvent(reqID, options, 'org/v1/search')
        console.log('Announcement - get geolocations - Request', JSON.stringify(options))

        let data = new Promise((resolve, reject) => {
          this.service.call(options).then((data) => {
            resolve(data.body.result.response)
          }).catch((error) => {
            console.log('Announcement - get geolocations - Error', error)
            reject(error)
          })
        })
        resolve(data)
      } catch (error) {
        console.log('Announcement - get geolocations - Error', error)
        throw error
      }
    })
  }
}
module.exports = DataService
