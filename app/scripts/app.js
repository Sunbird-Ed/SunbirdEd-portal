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
        'playerApp.config',
        'angularMoment'
    ])
    .config(function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        // $locationProvider.hashPrefix = '!';

        $routeProvider
            .when('/search', {
                templateUrl: 'views/content/search.html',
                controller: 'ContentCtrl',
                controllerAs: 'content',
                activeTab: 'search',
            })
            .when('/', {
                templateUrl: 'views/home/landingPage.html',
                controller: 'UserCtrl',
                controllerAs: 'user'
            })
            .when('/userContent', {
                templateUrl: 'views/usercontent.html',
                controller: 'UsercontentCtrl',
                controllerAs: 'userContent',
                activeTab: 'userContent',
            })
            .otherwise({
                redirectTo: '/',
                activeTab: '',
            });
    }).run(function($rootScope, $route) {
        $rootScope.$route = $route;
    });