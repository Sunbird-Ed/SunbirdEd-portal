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
            isadd: '='
        },
        link: function (scope, element, attrs) {
            
                scope.showAddNoteButton = scope.isadd;            
            
        },
        controller: 'NoteCtrl'
    };
});