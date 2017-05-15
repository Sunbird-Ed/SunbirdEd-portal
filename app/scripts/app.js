'use strict';

/**
 * @ngdoc overview
 * @name playerApp
 * @description
 * # playerApp
 *
 * Main module of the application.
 */
angular
    .module('playerApp', [
        'ngCookies',
        'ngRoute'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/search', {
                templateUrl: 'views/content/search.html',
                controller: 'ContentCtrl',
                controllerAs: 'content'
            })
            .otherwise({
                redirectTo: '/'
            });
    });