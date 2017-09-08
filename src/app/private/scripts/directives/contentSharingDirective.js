'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:contentShare
 * @author Anuj Gupta
 * @description
 */

angular.module('playerApp')
    .directive('contentShare', function () {
        return {
            templateUrl: 'views/common/contentSharing.html',
            restrict: 'E',
            scope: {
                id: '=',
                type: '='
            },
        link: function (scope, element, attrs) {// eslint-disable-line

        },
            controller: 'contentSharingController as contentShare'
        };
    });
