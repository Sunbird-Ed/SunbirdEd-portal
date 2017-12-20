'use strict'

angular.module('loginApp').directive('courseDiscussions', [function () {
  return {
    templateUrl: 'views/course/courseDiscussions.html',
    restrict: 'E',
    scope: {
      showaskquestion: '='
    },
        link: function (scope, element, attrs) {// eslint-disable-line
      scope.showAskQuestion = scope.showaskquestion
    }
  }
}])
