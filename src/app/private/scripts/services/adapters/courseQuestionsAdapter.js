'use strict'

angular.module('playerApp').service('courseQuestionsAdapter', ['$rootScope', '$http',
  'httpAdapter', '$q',
  function ($rootScope, $http, httpAdapter, $q) {
    this.getQuestions = function () {
      var data = ''
      return handleHttpRequest('http://www.mocky.io/v2/5a6877c02e00008b0ad5b3f6', data, 'GET',
        $rootScope.messages.fmsg.m0070)
    }

    this.composeThread = function (obj) {
      console.log('inside compose', obj)
      var data = {
        'request': obj
      }
      console.log(data)
      return handleHttpRequest('http://www.mocky.io/v2/5a6877c02e00008b0ad5b3f6', data, 'POST',
        $rootScope.messages.fmsg.m0070)
    }

    function handleHttpRequest (url, data, type, errMsg) {
      var deferred = $q.defer()
      var response = httpAdapter.httpCall(url, data, type)
      response.then(function (res) {
        deferred.resolve(res)
      }, function (err) {
        deferred.reject(err)
      })
      return deferred.promise
    }
  }
])
