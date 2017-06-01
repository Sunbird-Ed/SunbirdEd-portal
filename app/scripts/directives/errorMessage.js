'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:errorMessage
 * @description
 * # errorMessage
 */
angular.module('playerApp')
    .directive('errorMessage', function() {
        return {
            template: '<div class="ui {{errorClass}} message" ng-if="message">{{message}}</div>',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                attrs.data = attrs.data ? JSON.parse(attrs.data) : undefined;
                if (attrs.data && attrs.data.responseCode === 'CLIENT_ERROR') {
                    scope.message = attrs.data.message.length ? attrs.data.message : 'Something wrong try in sometime :(';
                    scope.errorClass = 'orange';
                } else if (attrs.data && attrs.data.responseCode === 'RESOURCE_NOT_FOUND') {
                    scope.message = attrs.data.message.length ? attrs.data.message : 'No result found :(';
                    scope.errorClass = 'violet';
                } else if (attrs.data && attrs.data.responseCode === 'SERVER_ERROR') {
                    scope.message = attrs.data.message.length ? attrs.data.message : 'Server Error :(';
                    scope.errorClass = 'red';
                } else if (attrs.data && attrs.data.responseCode === undefined) {
                    scope.message = attrs.data.message.length ? attrs.data.message : 'connection error';
                    scope.errorClass = 'yellow';
                }
            }
        };
    });