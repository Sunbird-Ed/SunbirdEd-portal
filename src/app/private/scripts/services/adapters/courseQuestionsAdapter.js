'use strict'

angular.module('playerApp').service('courseQuestionsAdapter', ['$rootScope', '$http',
<<<<<<< HEAD
  'httpAdapter', '$q', 'toasterService',
  function ($rootScope, $http, httpAdapter, $q, toasterService) {
    this.getQuestions = function (contextId) {

      var data = ''
      return handleHttpRequest('/discussions/v1/list/'+ contextId, data, 'GET',
        'Error while loading questions, please try again later')
    }
    this.getQuestionById = function (threadId, postedBy) {
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
=======
'httpAdapter', '$q', 'toasterService',
function($rootScope, $http, httpAdapter, $q, toasterService) {
  this.getQuestions = function(contextId) {
    var data = ''
    return handleHttpRequest('/discussions/v1/list/' + contextId, data, 'GET',
      'Error while loading questions, please try again later')
  }
  this.getQuestionById = function(threadId) {
    var data = ''
    return handleHttpRequest('/discussions/v1/thread/' + threadId, data, 'GET',
      'Error while loading questions, please try again later')
  }
  this.composeThread = function(obj) {
    var data = obj
    console.log(data)
    return handleHttpRequest('/discussions/v1/thread', data, 'POST',
      'Error while posting the question, please try again later')
  }
>>>>>>> 25d7a08b26451db5cfdb9553c32c97bf21d021dc

  this.replyThread = function(threadId, obj) {
    var data = obj
    console.log(data)
    return handleHttpRequest('/discussions/v1/thread/reply/' + threadId, data, 'POST',
      'Error while posting your reply, please try again later')
  }

  this.actions = function(replyId, actionTypeId) {
    var data = {
      'actionTypeId': actionTypeId
    }
    return handleHttpRequest('/discussions/v1/thread/actions/' + replyId, data, 'POST',
      'Error while up voting, please try again')
  }

  this.undoActions = function(replyId, actionTypeId) {
    var data = {
      'actionTypeId': actionTypeId,
      'undo': 'true'
    }
<<<<<<< HEAD

    this.updateFlag = function (replyId, obj) {
      var data = ''
      return handleHttpRequest('/discussions/v1/thread/flag/' + replyId, data, 'POST',
        'Error in flag')
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
=======
    return handleHttpRequest('/discussions/v1/thread/actions/' + replyId, data, 'POST',
      'Error while down voting, please try again')
  }
  this.markAsCorrect = function(replyId,isUndo) {
    var data = {
      'id': replyId
>>>>>>> 25d7a08b26451db5cfdb9553c32c97bf21d021dc
    }
    return handleHttpRequest('/discussions/v1/thread/replies/marksolution', data, 'POST',
      'Error while marking answer, please try again')
  }


function handleHttpRequest(url, data, type, errMsg) {
  var deferred = $q.defer()
  var response = httpAdapter.httpCall(url, data, type)
  response.then(function(res) {
    if (res && res.responseCode === 'OK') {
      deferred.resolve(res)
    } else {
      toasterService.error(errMsg)
      deferred.reject(res)
    }
  }, function(err) {
    toasterService.error(errMsg)
    deferred.reject(err)
  })
  return deferred.promise
}
}])
