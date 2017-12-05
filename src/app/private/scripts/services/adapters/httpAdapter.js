'use strict'

angular.module('playerApp')
  .service('httpAdapter', ['$http', '$q', 'toasterService', function ($http, $q, toasterService) {
    /**
     * @method httpCall
     * @desc Http call
     * @memberOf adapters.httpAdapter
     * @param {string}  url - Url
     * @param {Object}  data - Request
     * @param {string}  method - Methods (CURD)
     * @param {object}  header - Header
     * @instance
     */
    this.httpCall = function (url, data, method) {
      var headers = {
        'Content-Type': 'application/json'
      }
      var deferred = $q.defer()
      $http({
        method: method,
        url: url,
        headers: headers,
        data: data
      }).then(function (res) {
        deferred.resolve(res.data)
      }, function (err) {
        deferred.reject(err.data)
      })
      return deferred.promise
    }
  }])
