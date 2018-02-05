'use strict'

angular.module('playerApp').component('courseQuestions', {
  templateUrl: 'views/course/courseQuestions.html',
  controller: ['$scope', '$rootScope', '$timeout', 'courseQuestionsAdapter', '$stateParams', '$interval', function($scope, $rootScope,
    $timeout, courseQuestionsAdapter, $stateParams, $interval) {
    console.log('username', $rootScope.userName)
    $scope.userName = $rootScope.userName
    $scope.successMessage = true
    $scope.date = new Date()
    $scope.contextId = $stateParams.courseId || $stateParams.contentId
    $scope.loadQuestions = function() {
      
     // $scope.loading = true
      $scope.widget = ''
      courseQuestionsAdapter.getQuestions($scope.contextId).then(function(data) {
        //$scope.loading = false
        $scope.widget = 'list-thread'
        $scope.thread = null
        $scope.threads = data.result.threads

        console.log("in load quesitons: ", $scope.threads);
           $('.ui.dimmer').dimmer('hide');


       var c=0;
        $scope.message="Load new Questions.";   
        var timer=$interval(function(){
        $scope.message="Load  new Questions.";

        //c++;
        if(c===100)
          {
            //$scope.message="Restarting the timer again :-)";
            c=0;
          }
      },1000);

       
       
      
        
      }, function(err) {
      // $scope.loading = false
        console.log('err', err)
      })
    }
    $scope.loadQuestions()

    $scope.changeWidget = function(widgetName) {
      $scope.widget = widgetName
    }

    $scope.gotoThread = function(id) {
      $scope.threadId = id
      $scope.changeWidget('reply-thread')
      $scope.loadThread(id)
      console.log("hide dimmer ",$('.ui.dimmer').dimmer('hide'));
    }
    /*$scope.showThreads = function() {
      $scope.changeWidget('list-threads')
    }*/

    $scope.loadReplyActions = function(replies) {
      $scope.replyActions = {};
      _.forEach(replies, function(reply) {
        $scope.replyActions[reply.id] = {};
        var actions = _.filter(reply.actions_summary, function(action) {
          if (action.acted === true && action.can_undo == true) {
            $scope.replyActions[reply.id][action.id] = 'acted'
          } else {
            $scope.replyActions[reply.id][action.id] = 'can_act'
          }
        })

      })

    }

    $scope.showAction = function(replyId, actionTypeId) {
      var action = $scope.replyActions[replyId][actionTypeId]
      return action;
    }

    $scope.actions = function(replyId, actionTypeId) {
      courseQuestionsAdapter.actions(replyId, actionTypeId).then(function(result) {
        // $scope.loadThread($scope.threadId)
        $scope.replyActions[replyId][actionTypeId] = 'acted'
      }, function(err) {
        console.log('error while voting', err)
      })
    }
    $scope.markAsCorrect = function(replyId) {
      courseQuestionsAdapter.markAsCorrect(replyId).then(function(result) {
       var replyIndex =  _.indexOf(_.pluck($scope.thread.replies, 'id'), replyId);
       $scope.thread.replies[replyIndex].accepted_answer = true; 
       
      }, function(err) {
        console.log('error while voting', err)
      })
    }
    $scope.undoActions = function(replyId, actionId) {
      courseQuestionsAdapter.undoActions(replyId, actionId).then(function(result) {
         $scope.replyActions[replyId][actionTypeId] = 'can_act'
      }, function(err) {
        console.log('error while voting', err)
      })
    }

    $scope.loadThread = function(threadId) {
      //$scope.loading = true
      $scope.widget = ''
      courseQuestionsAdapter.getQuestionById(threadId).then(function(data) {
        $scope.loading = false
        $scope.widget = 'reply-thread'
        console.log('data', data)
        $scope.loadReplyActions(data.result.thread.replies)
        $scope.thread = data.result.thread
       
      }, function(err) {
        //$scope.loading = false
        console.log('err', err)
      })
       $('.ui.dimmer').dimmer('hide');
    }

    $scope.markCorrect = function (userId){
      $scope.selectedAnswer = false
      if (userId == '5001'){
          $scope.selectedAnswer = true
      }
    }

    $scope.unMarkCorrect = function (){
      $scope.selectedAnswer = false
    }

    $scope.formSubmit = function (isValid) {
      var obj = {
        'contextId': $scope.contextId,
        'title': $scope.threadTitle,
        'description': $scope.threadDesc
      }
      //$scope.loading = true
       $('.ui.dimmer').dimmer('show');
      courseQuestionsAdapter.composeThread(obj).then(function(result) {
        console.log(obj)
        $scope.loading = false
        $scope.loadQuestions()
      }, function(err) {
        console.log('eeee', err)
      })
    }

    $scope.submitAnswer = function() {
      $scope.reply = {
        'contextId': $scope.contextId,
        'description': $scope.replyAnswer
      }
     // $scope.loading = true
     console.log("$scope.thread.id: ",$scope.thread.id)
      courseQuestionsAdapter.replyThread($scope.thread.id, $scope.reply).then(function(result) {
        //$scope.loading = false
        $scope.successMessage = false
        $timeout(function() {
          $scope.successMessage = true
        }, 3000)
        //$scope.loadQuestions()
        $scope.loadReplies($scope.thread.id)
        console.log("Result only: ", result)

        console.log("Result of submit replies ", result.result)
      }, function(err) {
        $scope.loading = false
        console.log('eeee', err)
      })
    }



    $scope.loadReplies = function (threadId){

    courseQuestionsAdapter.getQuestionById(threadId).then(function(data) {
            //$scope.loading = false
            //$scope.widget = 'reply-thread'
            console.log('load replies data', data)
            $scope.loadReplyActions(data.result.thread.replies)
            $scope.thread = data.result.thread
            $scope.replyAnswer = ''
          }, function(err) {
            //$scope.loading = false
            console.log('err', err)
          })

    }


    $scope.flagAnswer = function (replyId){
      console.log('replyId',replyId)
      /*var obj = {
        'actionType': replyId
      }*/
      courseQuestionsAdapter.updateFlag(replyId).then(function (data) {
         console.log('result of updateFlag: ',data)
      }, function (err) {
        console.log('Error in flagAnswer', err)
      })      
    }

  }]
})
