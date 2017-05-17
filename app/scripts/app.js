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
        'ngRoute',
        'playerApp.config'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/search', {
                templateUrl: 'views/content/search.html',
                controller: 'ContentCtrl',
                controllerAs: 'content'
            })
            .when('/userContent', {
              templateUrl: 'views/usercontent.html',
              controller: 'UsercontentCtrl',
              controllerAs: 'userContent'
            })
            .otherwise({
                redirectTo: '/'
            });
    });