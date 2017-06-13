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
                onEnter: function($rootScope) {
                    $rootScope.searchKey = 'Course';
                    console.log('$rootScope.key', $rootScope.searchKey);
                },
                resolve: {
                    isLoggedIn: function(authService) {
                        authService.validUser();
                    }
                },
                params: { searchKey: 'Course' }
            })
            .state('Resource', {
                url: '/resources',
                templateUrl: '/views/resource/resource.html',
                controller: 'resourceCtrl as resource',
                onEnter: function($rootScope) {
                    $rootScope.searchKey = 'Resources';
                    console.log('$rootScope.key', $rootScope.searchKey);
                },
                resolve: {
                    isLoggedIn: function(authService) {
                        authService.validUser();
                    }
                },
                params: { searchKey: 'Resources' }
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
                url: '/toc',
                templateUrl: 'views/course/toc.html',
                params: { courseType: null, courseId: null, lectureView: null },
                controller: 'courseScheduleCtrl as toc'
            });
    });