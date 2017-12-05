'use strict'

angular.module('playerApp')
    .directive('addNote', function () {
      return {
        templateUrl: 'views/note/noteAddCardModal.html',
        restrict: 'E',
        scope: {
          shownoteinlecture: '=',
          shownoteincourse: '=',
          courseid: '=',
          contentid: '=',
          visibility: '='
        },
        link: function (scope, element, attrs) {// eslint-disable-line
          scope.$watch('contentid', function () {
            scope.updateContentId(scope.contentid)
          })
        },
        controller: 'NoteCardCtrl as noteCard'
      }
    })
