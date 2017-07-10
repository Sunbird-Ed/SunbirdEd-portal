'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:contentPlayer
 * @description
 * # contentPlayer
 */
angular.module('playerApp').directive('contentPlayer', function() {
    return {
        templateUrl: 'views/contentplayer/player.html',
        restrict: 'E',
        scope: {
            id: '=',
            body: '=',
            visibility: '=',
            isshowmetaview: '=',
            isclose: '=',
            isheader: '=',
            height: '=',
            width: '=',
            ispercentage: '=',
            closeurl: '='
        },
        link: function(scope, element, attrs) {
            if (scope.ispercentage) {
                $('#contentPlayer').css('height', scope.height + '%');
                $('#contentPlayer').css('width', scope.width + '%');
            } else {
                $('#contentPlayer').css('height', scope.height + 'px');
                $('#contentPlayer').css('width', scope.width + 'px');
            }

            scope.$watch('body', function() {
                scope.updateDataOnWatch(scope);
            });
            scope.$watch('id', function() {
                scope.updateDataOnWatch(scope);
            });
        },
        controller: 'contentPlayerCtrl'
    };
});
