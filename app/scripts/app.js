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
        'ngSanitize',
        'Scope.safeApply'
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
            .state('LandingPage', {
                url: '/',
                templateUrl: '/views/home/landingPage.html',
                controller: 'AuthCtrl as auth'
            })
            .state('Home', {
                url: '/home',
                templateUrl: '/views/home/home.html',
                controller: 'HomeController as homeCtrl',
                resolve: {
                    isLoggedIn: function(authService) {
                        authService.validUser();
                    }
                }
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
                    $rootScope.searchKey = 'Courses';
                    $rootScope.searchKeyword = '';
                    $rootScope.isLearnPage = true;
                },
                onExit: function($rootScope) {
                    $rootScope.isLearnPage = false;
                    $('#content-search-filter-accordion').accordion('close', 0);
                },
                params: { searchKey: 'Courses' },
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
                onEnter: function($rootScope) {
                    $rootScope.searchKey = 'Resources';
                    $rootScope.isResourcesPage = true;
                    $rootScope.searchKeyword = '';
                },
                onExit: function($rootScope) {
                    $rootScope.isResourcesPage = false;
                    $('#content-search-filter-accordion').accordion('close', 0);
                },
                resolve: {
                    isLoggedIn: function(authService) {
                        authService.validUser();
                    }
                },
                params: { searchKey: 'Resources' }
            })
            .state('Note', {
                url: '/note/:courseId/:contentId',
                templateUrl: 'views/note/noteList.html',
                controller: 'NoteListCtrl as noteList',
            })
            .state('Toc', {
                url: '/toc/:courseId/:lectureView',
                templateUrl: 'views/course/toc.html',
                controller: 'courseScheduleCtrl as toc',
                resolve: {
                    isLoggedIn: function(authService) {
                        authService.validUser();
                    }
                }
            })
            .state('Community', {
                url: '/community',
                templateUrl: 'views/community/communityList.html',
                controller: 'CommunityController as commCtrl',
                resolve: {
                    isLoggedIn: function(authService) {
                        authService.validUser();
                    }
                }
            })
            .state('Profile', {
                url: '/profile',
                templateUrl: 'views/profile/profile.html',
                controller: 'ProfileController as profileCtrl',
                resolve: {
                    isLoggedIn: function(authService) {
                        authService.validUser();
                    }
                }
            });
    });