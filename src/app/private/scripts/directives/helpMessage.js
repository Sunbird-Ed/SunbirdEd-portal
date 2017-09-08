'use strict';

angular.module('playerApp')
    .directive('helpMessage', function () {
        return {
            templateUrl: 'views/common/loaderWithMessage.html',
            restrict: 'E',
            scope: {
                data: '='
            },
            link: function postLink(scope, element, attrs) {// eslint-disable-line
                scope.$watch('data', function () {
                    scope.messageClass = scope.data.messageClass;
                    scope.showMetaLoader = scope.data.showMetaLoader;
                    scope.message = scope.data.message;
                });
            }
        };
    });
