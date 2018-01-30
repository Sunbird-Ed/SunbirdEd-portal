'use strict'

angular.module('playerApp').service('courseQuestionsAdapter', ['$rootScope', '$http',
  'httpAdapter', '$q', 'toasterService',
  function ($rootScope, $http, httpAdapter, $q, toasterService) {
    this.getQuestions = function () {
      var data = ''
      return handleHttpRequest('/discussions/v1/list', data, 'GET',
        $rootScope.messages.fmsg.m0070)
    }
    this.getQuestionById = function (threadId) {
      var data = ''
      return handleHttpRequest('/discussions/v1/thread/' + threadId, data, 'GET',
        $rootScope.messages.fmsg.m0070)
    }
    this.composeThread = function (obj) {
      var data = obj
      console.log(data)
      return handleHttpRequest('/discussions/v1/thread', data, 'POST',
        $rootScope.messages.fmsg.m0070)
    }

    this.replyThread = function (threadId, obj) {
      var data = obj
      console.log(data)
      return handleHttpRequest('/discussions/v1/thread/reply/' + threadId, data, 'POST',
        $rootScope.messages.fmsg.m0070)
    }

    function handleHttpRequest (url, data, type, errMsg) {
      var deferred = $q.defer()
      var response = httpAdapter.httpCall(url, data, type)
      response.then(function (res) {
        if (res && res.responseCode === 'OK') {
          deferred.resolve(res)
        } else {
          toasterService.error(errMsg)
          deferred.reject(res)
        }
      }, function (err) {
        if (type === 'POST') {
          toasterService.error('Error while submitting, please try again later')
        } else if (type === 'GET') {
          toasterService.error('Error while fetching, please try again later')
        }
        deferred.reject(err)
      })
      return deferred.promise
    }
  }
])
