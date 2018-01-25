'use strict'

angular.module('playerApp').component('courseQuestions', {
  templateUrl: 'views/course/courseQuestions.html',
  controller: ['$scope', '$rootScope', '$timeout', 'courseQuestionsAdapter', function($scope, $rootScope, $timeout, courseQuestionsAdapter) {
    $scope.successMessage = true;
    $scope.date = new Date();

    courseQuestionsAdapter.getQuestions().then(function(data) {
      console.log("data", data);
      $scope.threads = data.threads;
    }, function(err) {
      console.log("err", err);

    })

    $scope.widget = 'list-thread';
    $scope.changeWidget = function(widgetName) {
      $scope.widget = widgetName;
    }
    $scope.gotoThread = function(title, reply, description) {
      $scope.threadTitle = title;
      $scope.threadReply = reply;
      $scope.threadDesc = description;
      $scope.changeWidget('reply-thread');
    }


    $scope.formSubmit = function(isValid) {
      var obj = {
        id: 123123,
        title: $scope.threadTitle,
        desc: $scope.threadDesc,
        replies: []
      }
      console.log('obj', obj)
      courseQuestionsAdapter.composeThread(obj).then(function(result) {
        console.log('gotilla', result);
      }, function(err) {
        console.log('eeee', err)
      })
      $scope.changeWidget('list-thread');
    }

    $scope.submitAnswer = function() {
      var answer = $scope.replyAnswer;
      for (var i = 0; i < $scope.threadReply.length; i++) {
        console.log("Threads : ", $scope.threadReply[i].topic_id);
        var x = $scope.threadReply[i].topic_id;
      }

      $scope.threadReply.push({ id: 33333, topic_id: $scope.x, post_id: 634567, description: answer, created_date: $scope.date });
      $scope.successMessage = false;
      $timeout(function() {
        $scope.successMessage = true;
      }, 3000);
    }
  }]
})
