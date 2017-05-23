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
    .config(function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix = '!';

        $routeProvider
            .when('/search', {
                templateUrl: 'views/content/search.html',
                controller: 'ContentCtrl',
                controllerAs: 'content'
            })
            .when('/', {
                templateUrl: 'views/home/landingPage.html',
                controller: 'LoginCtrl',
                controllerAs: 'login'
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
