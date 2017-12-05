'use strict'

angular.module('playerApp')
    .directive('noteCard', function () {
      return {
        templateUrl: 'views/note/noteCard.html',
        restrict: 'E',
        scope: {
          shownotecard: '=',
          courseid: '=',
          contentid: '='
        },
        link: function (scope, element, attrs) {// eslint-disable-line
          scope.$watch('contentid', function () {
            scope.updateNoteMetaData(scope.contentid)
          })
        },
        controller: 'NoteCardCtrl as noteCard'
      }
    })
