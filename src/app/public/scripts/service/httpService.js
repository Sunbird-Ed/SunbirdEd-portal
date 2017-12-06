'use strict'

angular.module('loginApp')
  .service('httpService', ['$http', '$filter', 'uuid4', function ($http, $filter, uuid4) {
    function getHeader () {
      var headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Consumer-ID': 'X-Consumer-ID',
        'X-Device-ID': 'X-Device-ID',
        'X-msgid': uuid4.generate(),
        ts: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss:sssZ')

      }
        headers.Accept = 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,image/webp,*/*;q=0.8';// eslint-disable-line
      return headers
    }

    function httpCall (url, data, method, headers) {
      var header = headers || getHeader()
      var URL = url
      return $http({
        method: method,
        url: URL,
        headers: header,

        data: data
      })
    }

    function handleSuccess (response) {
      return (response.data)
    }

    function handleError (response) {
      return (response.data)
    }

    this.post = function (url, data, headers) {
      var request = httpCall(url, data, 'POST', headers)
      return (request.then(handleSuccess, handleError))
    }

    this.get = function (url, data, headers) {
      var request = httpCall(url, data, 'GET', headers)
      return (request.then(handleSuccess, handleError))
    }
  }])
