'use strict'

angular.module('playerApp')
        .service('httpService', ['$http', 'config', function ($http, config) {
    /**
    * @class httpService
     * @desc Service to manages content API calls.
     * @memberOf Services
     */
            /**
             * @method getHeader
             * @desc Headers for api calls
             * @memberOf Services.httpService
             * @returns {Object} headers - Headers
             * @instance
             */
          function getHeader () {
            var headers = {
              'Content-Type': 'application/json',
              cid: 'sunbird'
            }
            headers.Accept = 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,image/webp,*/*;q=0.8'
            return headers
          }
            /**
             * @method httpCall
             * @desc Http call
             * @memberOf Services.httpService
             * @param {string}  url - Url
             * @param {Object}  data - Request
             * @param {string}  method - Methods (CURD)
             * @param {object}  header - Header
             * @instance
             */
          function httpCall (url, data, method, header, qs) {
            var headers = header || getHeader()
            var URL = config.URL.BASE_PREFIX + config.URL.CONTENT_PREFIX + url
            return $http({
              method: method,
              url: URL,
              headers: headers,
              params: qs,
              data: { request: data }
                // data: data
            })
          }
            /**
             * @method handleSuccess
             * @desc Http call
             * @memberOf Services.httpService
             * @param {object}  response - HTTP call response
             * @returns {Object} response.data - Success Response data
             * @instance
             */

          function handleSuccess (response) {
            return (response.data)
          }
            /**
             * @method handleError
             * @desc Handle error response - session expire Or error message
             * @memberOf Services.httpService
             * @param {object}  response - HTTP call response
             * @returns {Object} response.data - Error Response data
             * @instance
             */

          function handleError (response) {
            if (response.data && response.status === 440) {
              alert('Session expired, please login again...')
              window.document.location.replace('/logout')
            }
            return (response.data)
          }
            /**
             * @method post
             * @desc HTTP POST method
             * @memberOf Services.httpService
             * @param {string}  url - API url
             * @param {object}  data - Requested data
             * @param {object}  headers - API headers
             * @returns {Promise} Promise object represent response of api
             * @instance
             */
          this.post = function (url, data, headers) {
            var request = httpCall(url, data, 'POST', headers)
            return (request.then(handleSuccess, handleError))
          }

            /**
             * @method get
             * @desc HTTP GET method
             * @memberOf Services.httpService
             * @param {string}  url - API url
             * @param {object}  data - Requested data
             * @param {object}  headers - API headers
             * @returns {Promise} Promise object represent response of api
             * @instance
             */
          this.get = function (url, data, headers, qs) {
            var request = httpCall(url, data, 'GET', headers, qs)
            return (request.then(handleSuccess, handleError))
          }
            /**
             * @method remove
             * @desc HTTP DELETE method
             * @memberOf Services.httpService
             * @param {string}  url - API url
             * @param {object}  data - Requested data
             * @param {object}  headers - API headers
             * @returns {Promise} Promise object represent response of api
             * @instance
             */

          this.remove = function (url, data, headers) {
            var request = httpCall(url, data, 'DELETE', headers)
            return (request.then(handleSuccess, handleError))
          }
        }])
