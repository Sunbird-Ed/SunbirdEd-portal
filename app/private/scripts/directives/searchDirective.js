'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:contentPlayer
 * @description
 * # contentPlayer
 */
angular.module('playerApp').directive('search', function () {
    return {
        templateUrl: 'views/header/search.html',
        restrict: 'E',
        scope: {
            type: '=',           
        },
        link: function (scope, element, attrs) {
           
        },
        controller: 'SearchCtrl as search'
    };
});