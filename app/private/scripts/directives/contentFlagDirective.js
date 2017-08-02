'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:contentFlag
 * @author Anuj Gupta
 * @description
 */

angular.module('playerApp')
    .directive('contentFlag', function () {
        return {
            templateUrl: 'views/common/contentFlagModal.html',
            restrict: 'E',
            scope: {
                courseid: '=',
                contentid: '=',
                contentname: '=',
                versionkey: '=',
                redirect: '='
            },
        link: function (scope, element, attrs) {// eslint-disable-line

        },
            controller: 'contentFlagController as contentFlag'
        };
    });
