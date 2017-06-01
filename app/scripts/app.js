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
            'ui.router',
            'ngStorage',
            'ui.pagedown',
            'slick'
        ])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
            $locationProvider.html5Mode(true);
            $urlRouterProvider.otherwise('/');
            $stateProvider
                    .state('Search', {
                        url: '/search',
                        templateUrl: '/views/content/search.html',
                        controller: 'ContentCtrl as content',
                        resolve: {
                            isLoggedIn: function (authService) {
                                authService.validUser();
                            }
                        }
                    })
                    .state('Home', {
                        url: '/',
                        templateUrl: '/views/home/landingPage.html',
                        controller: 'AuthCtrl as auth'
                    })
                    .state('UserContent', {
                        url: '/content',
                        templateUrl: '/views/content/usercontent.html',
                        controller: 'userContentCtrl as userContent'
                    })
                    .state('note', {
                        url: "/note",
                        templateUrl: 'views/note/noteList.html',
                        controller: 'NoteCtrl'
                    });
    });
