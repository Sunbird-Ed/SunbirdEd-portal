'use strict';

angular.module('playerApp')
    .directive('profileVisibility', function () {
        return {
            templateUrl: 'views/common/profilePrivateField.html',
            restrict: 'E',
            scope: {
               field:'=',
               update:'='
            },
        link: function (scope, element, attrs) {// eslint-disable-line

        },
            controller: 'profileVisibilityController as profVisCtrl'
        };
    });