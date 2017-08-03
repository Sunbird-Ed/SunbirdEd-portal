'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:userSearch
 * @description
 * # userSearch
 */
angular.module('playerApp').directive('userSearch', function () {
    return {
        templateUrl: 'views/admin/user.html',
        restrict: 'E',
        scope: {
            data: '=',
            type: '='
        },
        link: function (scope, element, attrs) {
        },
        controller: 'adminController as admin'
    };
});
