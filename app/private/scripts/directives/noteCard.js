'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:contentPlayer
 * @description
 * # contentPlayer
 */
angular.module('playerApp').directive('noteCard', function () {
    return {
        templateUrl: 'views/note/noteCard.html',
        restrict: 'E',
        scope: {
            shownotecard: '='
        },
        link: function (scope, element, attrs) {// eslint-disable-line
            scope.showNoteCard = scope.shownotecard;
        },
        controller: 'NoteCtrl'
    };
});
