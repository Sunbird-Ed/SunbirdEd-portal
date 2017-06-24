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
    .module('playerApp')
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        
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
                    $rootScope.courseActive = 'active';
                },
                onExit: function($rootScope) {
                    $rootScope.isLearnPage = false;
                    $('#content-search-filter-accordion').accordion('close', 0);
                    $rootScope.courseActive = '';
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
                onEnter: function($rootScope) {
                    $rootScope.searchKey = 'Resources';
                    $rootScope.isResourcesPage = true;
                    $rootScope.searchKeyword = '';
                    $rootScope.resourcesActive = 'active';
                },
                onExit: function($rootScope) {
                    $rootScope.isResourcesPage = false;
                    $rootScope.resourcesActive = '';
                    $('#content-search-filter-accordion').accordion('close', 0);
                },
                resolve: {
                    isLoggedIn: function(authService) {
                        authService.validUser();
                    }
                },
                params: { searchKey: 'Resources' }
            })
            .state('CourseNote', {
                url: '/note/:courseId',
                templateUrl: 'views/note/noteList.html',
                controller: 'NoteListCtrl as noteList',
                onEnter: function($rootScope) {
                    $rootScope.searchKey = 'Courses';
                    $rootScope.searchKeyword = '';
                    $rootScope.isNotePage = true;
                    $rootScope.courseActive = 'active';
                },
                onExit: function($rootScope) {
                    $rootScope.isNotePage = false;
                    $('#content-search-filter-accordion').accordion('close', 0);
                    $rootScope.courseActive = '';
                },
                resolve: {
                    isLoggedIn: function(authService) {
                        authService.validUser();
                    }
                }
            })
            .state('ContentNote', {
                url: '/note/:contentId',
                templateUrl: 'views/note/noteList.html',
                controller: 'NoteListCtrl as noteList',
                onEnter: function($rootScope) {
                    $rootScope.searchKey = 'Resources';
                    $rootScope.isNotePage = true;
                    $rootScope.searchKeyword = '';
                    $rootScope.resourcesActive = 'active';
                },
                onExit: function($rootScope) {
                    $rootScope.isNotePage = false;
                    $('#content-search-filter-accordion').accordion('close', 0);
                    $rootScope.resourcesActive = '';
                },
                resolve: {
                    isLoggedIn: function(authService) {
                        authService.validUser();
                    }
                }
            })
            .state('CourseContentNote', {
                url: '/note/:courseId/:contentId',
                templateUrl: 'views/note/noteList.html',
                controller: 'NoteListCtrl as noteList',
                onEnter: function($rootScope) {
                    $rootScope.searchKey = 'Courses';
                    $rootScope.searchKeyword = '';
                    $rootScope.isNotePage = true;
                    $rootScope.courseActive = 'active';
                },
                onExit: function($rootScope) {
                    $rootScope.isNotePage = false;
                    $('#content-search-filter-accordion').accordion('close', 0);
                    $rootScope.courseActive = '';
                },
                resolve: {
                    isLoggedIn: function(authService) {
                        authService.validUser();
                    }
                }
            })
            .state('Toc', {
                url: '/toc/:tocId/:courseId/:lectureView',
                templateUrl: 'views/course/toc.html',
                controller: 'courseScheduleCtrl as toc',
                onEnter: function($rootScope) {
                    $rootScope.searchKey = 'Courses';
                    $rootScope.searchKeyword = '';
                    $rootScope.isTocPage = true;
                    $rootScope.courseActive = 'active';
                },
                onExit: function($rootScope) {
                    $rootScope.isTocPage = false;
                    $('#content-search-filter-accordion').accordion('close', 0);
                    $rootScope.courseActive = '';
                },
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
            })
            .state('Player',{
                 url: '/player',
                templateUrl: 'views/common/player.html',
                controller: 'playerCtrl as player',
                params:{content:null}
            })
    });
