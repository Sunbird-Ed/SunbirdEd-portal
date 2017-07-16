'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:contentPlayer
 * @description
 * # contentPlayer
 */
angular.module('playerApp').directive('pageSection', function () {
    return {
        templateUrl: 'views/common/pageSection.html',
        restrict: 'E',
        scope: {
            type: '=',           
        },
        link: function (scope, element, attrs) {
           
        },
        controller: 'pageSectionCtrl as section'
    };
});