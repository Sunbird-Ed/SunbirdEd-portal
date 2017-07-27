'use strict';

/**
 * @ngdoc overview
 * @name playerApp
 * @description
 * # playerApp
 *
 * Main module of the application.
 */
angular.module('loginApp', ['loginApp.labels', 'loginApp.errorMessages'])
    .controller('loginCtrl', function (labels, $rootScope, errorMessages) {
        $rootScope.errorMessages = errorMessages;
        $rootScope.labels = labels;
    });
