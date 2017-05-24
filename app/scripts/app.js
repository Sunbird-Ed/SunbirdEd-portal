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
        'ui.router'
    ])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('Search', {
                url: '/search',
                templateUrl: '/views/content/search.html',
                controller: 'ContentCtrl as content'
            })
            .state('Home', {
                url:'/',
                templateUrl: '/views/home/landingPage.html',
                controller: 'LoginCtrl as login'
            })
            .state('UserContent', {
                url:'/content',
                templateUrl: '/views/usercontent.html',
                controller: 'UsercontentCtrl as userContent'
            });
            
    });
