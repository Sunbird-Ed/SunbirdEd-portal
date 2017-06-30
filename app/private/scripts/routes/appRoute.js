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
    .config(function($stateProvider, $urlRouterProvider, $translateProvider, $provide) {
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

        $urlRouterProvider.otherwise('/home');
        $stateProvider
            .state('LandingPage', {
                url: '/',
                views: {
                    'contentView': {
                        templateUrl: '/views/home/landingPage.html',
                        controller: 'AuthCtrl as auth'
                    }
                }
            })
            .state('Home', {
                url: '/home',
                views: {
                    'contentView': {
                        templateUrl: '/views/home/home.html',
                        controller: 'HomeController as homeCtrl'
                    }
                },
                onEnter: function($rootScope) {
                    $rootScope.searchKey = 'Home';
                }
            })
            .state('UserContent', {
                url: '/content',
                views: {
                    'contentView': {
                        templateUrl: '/views/content/usercontent.html',
                        controller: 'userContentCtrl as userContent',
                    }
                }
            })
            .state('Courses', {
                url: '/learn',
                views: {
                    'contentView': {
                        templateUrl: '/views/learn/learn.html',
                        controller: 'LearnCtrl as learn',
                    }
                },
                onEnter: function($rootScope) {
                    $rootScope.searchKey = 'Courses';
                    $rootScope.searchKeyword = '';
                    $rootScope.isLearnPage = true;
                    $rootScope.courseActive = 'active';
                    $('.content-search-filter').dropdown('clear');
                },
                onExit: function($rootScope) {
                    $rootScope.isLearnPage = false;
                    $('#content-search-filter-accordion').accordion('close', 0);
                    $rootScope.courseActive = '';
                },
                params: { searchKey: 'Courses' }
            })
            .state('Resources', {
                url: '/resources',
                views: {
                    'contentView': {
                        templateUrl: '/views/resource/resource.html',
                    }
                },
                onEnter: function($rootScope) {
                    $rootScope.searchKey = 'Resources';
                    $rootScope.isResourcesPage = true;
                    $rootScope.searchKeyword = '';
                    $rootScope.resourcesActive = 'active';
                    $('.content-search-filter').dropdown('clear');
                },
                onExit: function($rootScope) {
                    $rootScope.isResourcesPage = false;
                    $rootScope.resourcesActive = '';
                    $('#content-search-filter-accordion').accordion('close', 0);
                },
                params: { searchKey: 'Resources' }
            })
            .state('CourseNote', {
                url: '/course/note/:tocId/:courseId',
                views: {
                    'contentView': {
                        templateUrl: 'views/note/noteList.html',
                        controller: 'NoteListCtrl as noteList',
                    }
                },
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
                }
            })
            .state('ContentNote', {
                url: '/resourse/note/:contentId',
                views: {
                    'contentView': {
                        templateUrl: 'views/note/noteList.html',
                        controller: 'NoteListCtrl as noteList',
                    }
                },
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
                }
            })
            .state('CourseContentNote', {
                url: '/note/:tocId/:courseId/:contentId',
                views: {
                    'contentView': {
                        templateUrl: 'views/note/noteList.html',
                        controller: 'NoteListCtrl as noteList',
                    }
                },
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
                }
            })
            .state('Toc', {
                url: '/toc/:tocId/:courseId/:lectureView',
                views: {
                    'contentView': {
                        templateUrl: 'views/course/toc.html',
                        controller: 'courseScheduleCtrl as toc',
                    }
                },
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
                }
            })
            .state('Community', {
                url: '/community',
                views: {
                    'contentView': {
                        templateUrl: 'views/community/communityList.html',
                        controller: 'CommunityController as commCtrl'
                    }
                },
                onEnter: function($rootScope) {
                    $rootScope.searchKey = 'Community';
                }
            })
            .state('Profile', {
                url: '/profile',
                views: {
                    'contentView': {
                        templateUrl: 'views/profile/profile.html',
                        controller: 'ProfileController as profileCtrl'
                    }
                },
                onEnter: function($rootScope) {
                    $rootScope.searchKey = 'Profile';
                }
            })
            .state('Player', {
                url: '/player',
                views: {
                    'contentView': {
                        templateUrl: 'views/common/player.html',
                        controller: 'playerCtrl as player'
                    }
                },
                params: { content: null, contentId: null },
                onEnter: function($rootScope) {
                    $rootScope.searchKey = 'Resources';
                    $rootScope.isPlayerPage = true;
                    $rootScope.searchKeyword = '';
                    $rootScope.resourcesActive = 'active';
                },
                onExit: function($rootScope) {
                    $rootScope.isPlayerPage = false;
                    $('#content-search-filter-accordion').accordion('close', 0);
                    $rootScope.resourcesActive = '';
                }
            })
            .state('SearchCourse', {
                url: '/:searchType/search/:query/',
                views: {
                    'contentView': {
                        templateUrl: 'views/search/search.html',
                        controller: 'SearchCourseCtrl as search',
                    }
                },
                params: { searchType: null, query: null, searchKey: null, event: null },
                onEnter: function($rootScope) {
                    $rootScope.isSearchPage = true;
                    $rootScope.searchKey = 'Courses';
                    $rootScope.courseActive = 'active';
                },
                onExit: function($rootScope) {
                    $rootScope.isSearchPage = false;
                    $rootScope.courseActive = '';
                }
            })
            .state('SearchResource', {
                url: '/resources/search/:query/:searchType/',
                views: {
                    'contentView': {
                        templateUrl: 'views/search/search.html',
                        controller: 'SearchResourcesCtrl as search'
                    }
                },
                params: { searchType: null, query: null, event: null },
                onEnter: function($rootScope) {
                    $rootScope.isSearchPage = true;
                    $rootScope.searchKey = 'Resources';
                    $rootScope.resourcesActive = 'active';
                },
                onExit: function($rootScope) {
                    $rootScope.isSearchPage = false;
                    $rootScope.resourcesActive = '';
                }
            });
    });