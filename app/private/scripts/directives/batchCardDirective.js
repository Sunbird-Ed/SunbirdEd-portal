'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:batchCard
 * @description
 */

angular.module('playerApp')
    .directive('batchCard', function () {
        return {
            templateUrl: 'views/batch/batchCard.html',
            restrict: 'E',
            scope: {
                showbatchcard: '=',
                courseid: '='
            },
        link: function (scope, element, attrs) {
            $('#batchCardDropDown').dropdown('set selected ', 1);
            scope.getCouserBatches();
        },
        controller: 'BatchController as batch'
        };
    });