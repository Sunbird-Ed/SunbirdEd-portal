'use strict'

angular.module('playerApp').service('courseQuestionsAdapter', ['$rootScope', '$http',
  'httpAdapter', '$q', 'toasterService',
  function ($rootScope, $http, httpAdapter, $q, toasterService) {
    this.getQuestions = function () {
      var data = ''
      return handleHttpRequest('/discussions/v1/list', data, 'GET',
        'Error while loading questions, please try again later')
    }
    this.getQuestionById = function (threadId) {
      var data = ''
      return handleHttpRequest('/discussions/v1/thread/' + threadId, data, 'GET',
        'Error while loading questions, please try again later')
    }
    this.composeThread = function (obj) {
      var data = obj
      console.log(data)
      return handleHttpRequest('/discussions/v1/thread', data, 'POST',
        'Error while posting the question, please try again later')
    }

    this.replyThread = function (threadId, obj) {
      var data = obj
      console.log(data)
      return handleHttpRequest('/discussions/v1/thread/reply/' + threadId, data, 'POST',
        'Error while posting your reply, please try again later')
    }

    this.upVote = function (replyId) {
      var data = {}
      return handleHttpRequest('/discussions/v1/thread/likepost/'+replyId,data,'POST',
        'Error while voting, please try again')
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
        toasterService.error(errMsg)
        deferred.reject(err)
      })
      return deferred.promise
    }
  }
])
