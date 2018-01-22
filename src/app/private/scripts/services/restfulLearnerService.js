'use strict'

angular.module('playerApp')
  .service('restfulLearnerService', ['$http', '$rootScope', '$filter', 'config', 'uuid4',
    function ($http, $rootScope, $filter, config, uuid4) {
      /**
     * @class restfulLearnerService
     * @desc Service to manages learner API calls.
     * @memberOf Services
     */
      /**
             * @method getHeader
             * @desc Headers for api calls
             * @memberOf Services.restfulLearnerService
             * @returns {Object} headers - Headers
             * @instance
             */
      function getHeader () {
        $rootScope.userId = $rootScope.userId || $('#userId').attr('value')
        var headers = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Consumer-ID': 'X-Consumer-ID',
          'X-Device-ID': 'X-Device-ID',
          'X-msgid': uuid4.generate(),
          ts: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss:sssZ'),
          'X-Source': 'web',
          'X-Org-code': 'AP'
        }
        headers.Accept = 'text/html,application/xhtml+xml,application/xml,' +
                             'application/json;q=0.9,image/webp,*/*;q=0.8'
        return headers
      }
      /**
             * @method httpCall
             * @desc Http call
             * @memberOf Services.restfulLearnerService
             * @param {string}  url - Url
             * @param {Object}  data - Request
             * @param {string}  method - Methods (CURD)
             * @param {object}  header - Header
             * @instance
             */
      function httpCall (url, data, method, header) {
        var headers = header || getHeader()
        var URL = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + url
        return $http({
          method: method,
          url: URL,
          headers: headers,
          // data: { request: data },
          data: data
        })
      }
      /**
             * @method handleSuccess
             * @desc Http call
             * @memberOf Services.restfulLearnerService
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
             * @memberOf Services.restfulLearnerService
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
             * @memberOf Services.restfulLearnerService
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
             * @memberOf Services.restfulLearnerService
             * @param {string}  url - API url
             * @param {object}  data - Requested data
             * @param {object}  headers - API headers
             * @returns {Promise} Promise object represent response of api
             * @instance
             */
      this.get = function (url, data, headers) {
        var request = httpCall(url, data, 'GET', headers)
        return (request.then(handleSuccess, handleError))
      }
      /**
             * @method remove
             * @desc HTTP DELETE method
             * @memberOf Services.restfulLearnerService
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
      /**
             * @method patch
             * @desc HTTP PATCH method
             * @memberOf Services.restfulLearnerService
             * @param {string}  url - API url
             * @param {object}  data - Requested data
             * @param {object}  headers - API headers
             * @returns {Promise} Promise object represent response of api
             * @instance
             */
      this.patch = function (url, data, headers) {
        var request = httpCall(url, data, 'PATCH', headers)
        return (request.then(handleSuccess, handleError))
      }

      this.upload = function (url, data) {
        var URL = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + url
        var headers = {
          'Content-Type': undefined,
          'X-Consumer-ID': 'X-Consumer-ID',
          'X-Device-ID': 'X-Device-ID',
          'X-msgid': uuid4.generate(),
          ts: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss:sssZ'),
          'X-Source': 'web',
          'X-Org-code': 'AP'
        }
        var request = $http({
          method: 'POST',
          url: URL,
          headers: headers,
          data: data
        })
        return (request.then(handleSuccess, handleError))
      }
    }])
