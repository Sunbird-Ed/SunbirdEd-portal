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
        'pdf',
        'pascalprecht.translate',
        'ngSanitize'
    ])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider, $provide) {

        $provide.provider('setResourceBundle', function() {
            this.$get = function() {
                return function(language, resourceBundle) {
                    $translateProvider.translations(language, resourceBundle);
                    $translateProvider.preferredLanguage(language);
                    $translateProvider.useSanitizeValueStrategy('sanitize');
                    return true;
                };
            };
        });

        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('Search', {
                url: '/search',
                templateUrl: '/views/content/search.html',
                controller: 'ContentCtrl as content',
                resolve: {
                    isLoggedIn: function(authService) {
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
                controller: 'userContentCtrl as userContent',
                resolve: {
                    isLoggedIn: function(authService) {
                        authService.validUser();
                    }
                }
            })
            .state('Learn', {
                url: '/learn',
                templateUrl: '/views/learn/learn.html',
                controller: 'LearnCtrl as learn',
                resolve: {
                    isLoggedIn: function(authService) {
                        authService.validUser();
                    }
                }
            })
            .state('Resource', {
                url: '/resources',
                templateUrl: '/views/resource/resource.html',
                controller: 'resourceCtrl as resource',
                resolve: {
                    isLoggedIn: function(authService) {
                        authService.validUser();
                    }
                }
            })
            .state('note', {
                url: '/note',
                templateUrl: 'views/note/noteList.html',
                controller: 'NoteCtrl',
            })
//            .state('Course', {
//                url: '/course/:courseId',
//                templateUrl: 'views/course/courses.html',
//                controller: 'CourseCtrl as courses'
//            })
            .state('Toc', {
                url: '/toc/:courseId/:lectureView',
                templateUrl: 'views/course/toc.html',
                controller: 'courseScheduleCtrl as toc'
            });
    });