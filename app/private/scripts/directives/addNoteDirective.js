'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:addNote
 * @description
 * # contentPlayer
 */

angular.module('playerApp').directive('addNote', function () {
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
                scope.updateContentId();
            });
        },
        controller: 'NoteCardCtrl as noteCard'
    };
});
