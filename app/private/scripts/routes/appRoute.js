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
        .config(function ($stateProvider, $urlRouterProvider, $translateProvider, $provide) {
            $provide.provider('setResourceBundle', function () {
                this.$get = function () {
                    return function (language, resourceBundle) {
                        $translateProvider.translations(language, resourceBundle);
                        $translateProvider.preferredLanguage(language);
                        $translateProvider.useSanitizeValueStrategy('sanitize');
                        return true;
                    };
                };
            });
            $urlRouterProvider.deferIntercept();
            $urlRouterProvider.otherwise('/home');
            $stateProvider
                    .state('LandingPage', {
                        url: '/',
                        views: {
                            'mainView': {
                                templateUrl: '/views/home/landingPage.html',
                                controller: 'AuthCtrl as auth'
                            }
                        }
                    })
                    .state('Home', {
                        url: '/home',
                        views: {
                            'mainView': {
                                templateUrl: '/views/home/home.html',
                                controller: 'HomeController as homeCtrl'
                            }
                        },
                        onEnter: function ($rootScope) {
                            $rootScope.searchKey = 'Home';
                            $rootScope.breadCrumbsData = null;
                        }
                    })
                    .state('UserContent', {
                        url: '/content',
                        views: {
                            'mainView': {
                                templateUrl: '/views/content/usercontent.html',
                                controller: 'userContentCtrl as userContent',
                            }
                        }
                    })
                    .state('Courses', {
                        url: '/learn',
                        views: {
                            'mainView': {
                                templateUrl: '/views/learn/learn.html',
                                controller: 'LearnCtrl as learn',
                            }
                        },
                        onEnter: function ($rootScope) {
                            $rootScope.searchKey = 'Courses';
                            $rootScope.searchKeyword = '';
                            $rootScope.isLearnPage = true;
                            $rootScope.courseActive = 'active';
                            $rootScope.breadCrumbsData = [{name: 'Home', link: 'home'}, {'name': 'Courses', 'link': 'learn'}];
                            $('.content-search-filter').dropdown('clear');
                        },
                        onExit: function ($rootScope) {
                            $rootScope.isLearnPage = false;
                            $('#content-search-filter-accordion').accordion('close', 0);
                            $rootScope.courseActive = '';
                            $rootScope.breadCrumbsData = null;
                        },
                        params: {searchKey: 'Courses'}
                    })
                    .state('Resources', {
                        url: '/resources',
                        views: {
                            'mainView': {
                                templateUrl: '/views/resource/resource.html',
                            }
                        },
                        onEnter: function ($rootScope) {
                            $rootScope.breadCrumbsData = [{name: 'Home', link: 'home'}, {'name': 'Resources', 'link': 'resources'}];
                            $rootScope.searchKey = 'Resources';
                            $rootScope.isResourcesPage = true;
                            $rootScope.searchKeyword = '';
                            $rootScope.resourcesActive = 'active';
                            $('.content-search-filter').dropdown('clear');
                        },
                        onExit: function ($rootScope) {
                            $rootScope.isResourcesPage = false;
                            $rootScope.resourcesActive = '';
                            $('#content-search-filter-accordion').accordion('close', 0);
                            $rootScope.breadCrumbsData = null;
                        },
                        params: {searchKey: 'Resources'}
                    })
                    .state('CourseNote', {
                        url: '/course/note/:tocId/:courseId',
                        views: {
                            'mainView': {
                                templateUrl: 'views/note/noteList.html',
                                controller: 'NoteListCtrl as noteList',
                            }
                        },
                        onEnter: function ($rootScope, sessionService) {
                            $rootScope.searchKey = 'Courses';
                            $rootScope.searchKeyword = '';
                            $rootScope.isNotePage = true;
                            $rootScope.courseActive = 'active';
                            var courseParams = sessionService.getSessionData('COURSE_PARAMS');
                            $rootScope.breadCrumbsData = [{name: 'Courses', link: 'learn'}, {'name': courseParams.courseName, 'link': '/toc/' + courseParams.tocId + '/' + courseParams.courseId + '/' + courseParams.lectureView}, {name: 'Notes', link: ''}];
                        },
                        onExit: function ($rootScope) {
                            $rootScope.breadCrumbsData = null;
                            $rootScope.isNotePage = false;
                            $('#content-search-filter-accordion').accordion('close', 0);
                            $rootScope.courseActive = '';
                        }
                    })
                    .state('ContentNote', {
                        url: '/resourse/note/:contentId/:contentName',
                        views: {
                            'mainView': {
                                templateUrl: 'views/note/noteList.html',
                                controller: 'NoteListCtrl as noteList',
                            }
                        },
                        onEnter: function ($rootScope, $stateParams) {
                            $rootScope.breadCrumbsData = [{'name': 'Resources', 'link': 'resources'}, {'name': $stateParams.contentName, link: 'player/' + $stateParams.contentId + '/' + $stateParams.contentName}, {name: 'Notes', link: ''}];
                            $rootScope.searchKey = 'Resources';
                            $rootScope.isNotePage = true;
                            $rootScope.searchKeyword = '';
                            $rootScope.resourcesActive = 'active';
                        },
                        onExit: function ($rootScope) {
                            $rootScope.isNotePage = false;
                            $('#content-search-filter-accordion').accordion('close', 0);
                            $rootScope.resourcesActive = '';
                            $rootScope.breadCrumbsData = null;
                        }
                    })
                    .state('CourseContentNote', {
                        url: '/note/:tocId/:courseId/:contentId',
                        views: {
                            'mainView': {
                                templateUrl: 'views/note/noteList.html',
                                controller: 'NoteListCtrl as noteList',
                            }
                        },
                        onEnter: function ($rootScope, sessionService) {
                            var courseParams = sessionService.getSessionData('COURSE_PARAMS');
                            var courseLink = '/toc/' + courseParams.tocId + '/' + courseParams.courseId + '/' + courseParams.lectureView;
                            var contentLink = courseLink + '/' + courseParams.contentId + '/' + courseParams.contentIndex;
                            $rootScope.breadCrumbsData = [{'name': courseParams.courseName, 'link': courseLink}, {name: courseParams.contentName, link: contentLink}, {name: 'Notes', link: ''}];
                            console.log($rootScope.breadCrumbsData);
                            $rootScope.searchKey = 'Courses';
                            $rootScope.searchKeyword = '';
                            $rootScope.isNotePage = true;
                            $rootScope.courseActive = 'active';
                        },
                        onExit: function ($rootScope) {
                            $rootScope.isNotePage = false;
                            $('#content-search-filter-accordion').accordion('close', 0);
                            $rootScope.courseActive = '';
                            $rootScope.breadCrumbsData = null;
                        }
                    })
                    .state('Toc', {
                        url: '/toc/:tocId/:courseId/:lectureView',
                        views: {
                            'mainView': {
                                templateUrl: 'views/course/toc.html',
                                controller: 'courseScheduleCtrl as toc'
                            }
                        },
                        onEnter: function ($rootScope, sessionService) {
                            var courseParams = sessionService.getSessionData('COURSE_PARAMS');
                            $rootScope.breadCrumbsData = [{name: 'Home', link: 'home'}, {name: 'Courses', link: 'learn'}, {'name': courseParams.courseName, 'link': ''}];
                            $rootScope.searchKey = 'Courses';
                            $rootScope.searchKeyword = '';
                            $rootScope.isTocPage = true;
                            $rootScope.courseActive = 'active';
                        },
                        onExit: function ($rootScope) {
                            $rootScope.breadCrumbsData = null;
                            $rootScope.isTocPage = false;
                            $('#content-search-filter-accordion').accordion('close', 0);
                            $rootScope.courseActive = '';
                        }
                    })
                    .state('Community', {
                        url: '/community',
                        views: {
                            'mainView': {
                                templateUrl: 'views/community/communityList.html',
                                controller: 'CommunityController as commCtrl'
                            }
                        },
                        onEnter: function ($rootScope) {
                            $rootScope.searchKey = 'Community';
                        }
                    })
                    .state('Profile', {
                        url: '/profile',
                        views: {
                            'mainView': {
                                templateUrl: 'views/profile/profile.html',
                                controller: 'ProfileController as profileCtrl'
                            }
                        },
                        onEnter: function ($rootScope) {
                            $rootScope.searchKey = 'Profile';
                            $rootScope.profileActive = 'active';
                        },
                        onExit: function ($rootScope) {
                            $rootScope.profileActive = '';
                        }
                    })
                    .state('Player', {
                        url: '/player/:contentId/:contentName',
                        views: {
                            'mainView': {
                                templateUrl: 'views/common/player.html',
                                controller: 'playerCtrl as player'
                            }
                        },
                        params: {content: null, contentId: null, contentName: null},
                        onEnter: function ($rootScope, $stateParams) {
                            $rootScope.breadCrumbsData = [{name: 'Home', link: 'home'}, {'name': 'Resources', 'link': 'resources'}, {'name': $stateParams.contentName, link: ''}];
                            $rootScope.searchKey = 'Resources';
                            $rootScope.isPlayerPage = true;
                            $rootScope.searchKeyword = '';
                            $rootScope.resourcesActive = 'active';
                        },
                        onExit: function ($rootScope) {
                            $rootScope.isPlayerPage = false;
                            $('#content-search-filter-accordion').accordion('close', 0);
                            $rootScope.resourcesActive = '';
                            $rootScope.breadCrumbsData = null;
                        }
                    })
                    .state('SearchCourse', {
                        url: '/:searchType/search/:query/',
                        views: {
                            'mainView': {
                                templateUrl: 'views/search/search.html',
                                controller: 'SearchCourseCtrl as search',
                            }
                        },
                        params: {searchType: null, query: null, searchKey: null, event: null},
                        onEnter: function ($rootScope) {
                            $rootScope.breadCrumbsData = [{name: 'Home', link: 'home'}, {'name': 'Courses', 'link': 'learn'}, {name: 'Search', link: ''}];
                            $rootScope.isSearchPage = true;
                            $rootScope.searchKey = 'Courses';
                            $rootScope.courseActive = 'active';
                        },
                        onExit: function ($rootScope) {
                            $rootScope.isSearchPage = false;
                            $rootScope.courseActive = '';
                            $rootScope.breadCrumbsData = null;
                        }
                    })
                    .state('SearchResource', {
                        url: '/resources/search/:query/:searchType/',
                        views: {
                            'mainView': {
                                templateUrl: 'views/search/search.html',
                                controller: 'SearchResourcesCtrl as search'
                            }
                        },
                        params: {searchType: null, query: null, event: null},
                        onEnter: function ($rootScope) {
                            $rootScope.breadCrumbsData = [{name: 'Home', link: 'home'}, {'name': 'Resources', 'link': 'resources'}, {name: 'Search', link: ''}];
                            $rootScope.isSearchPage = true;
                            $rootScope.searchKey = 'Resources';
                            $rootScope.resourcesActive = 'active';
                        },
                        onExit: function ($rootScope) {
                            $rootScope.isSearchPage = false;
                            $rootScope.resourcesActive = '';
                            $rootScope.breadCrumbsData = null;
                        }
                    }).state('TocPlayer', {
                url: '/toc/:tocId/:courseId/:lectureView/:contentId/:contentIndex',
                views: {
                    'mainView': {
                        templateUrl: 'views/course/toc.html',
                        controller: 'courseScheduleCtrl as toc',
                    }
                },
                onEnter: function ($rootScope, sessionService) {
                    var courseParams = sessionService.getSessionData('COURSE_PARAMS');
                    $rootScope.breadCrumbsData = [{name: 'Home', link: 'home'}, {name: 'Courses', link: 'learn'}, {'name': courseParams.courseName, 'link': ''}];
                    $rootScope.searchKey = 'Courses';
                    $rootScope.searchKeyword = '';
                    $rootScope.isTocPage = true;
                    $rootScope.courseActive = 'active';
                },
                onExit: function ($rootScope) {
                    $rootScope.breadCrumbsData = null;
                    $rootScope.isTocPage = false;
                    $('#content-search-filter-accordion').accordion('close', 0);
                    $rootScope.courseActive = '';
                }
            }).state('WorkSpace', {
                url: '/workspace',
                views: {
                    'mainView': {
                        templateUrl: '/views/workSpace/workSpace.html',
                        controller: function ($state, $rootScope) {
                            $rootScope.profileActive = 'active';
                            if ($state.current.name === "WorkSpace") {
                                $state.go('WorkSpace.ContentCreation');
                            }
                        }
                    }
                },
                onEnter: function ($rootScope) {
                    $rootScope.profileActive = 'active';
                },
                onExit: function ($rootScope) {
                    $rootScope.profileActive = '';
                }
            }).state('WorkSpace.ContentCreation', {
                url: '/content/create',
                views: {
                    'contentView': {
                        templateUrl: 'views/workSpace/createContent.html',
                        controller: 'ContentCreationController as contentCreation'
                    }
                }
            }).state('WorkSpace.DraftContent', {
                url: '/content/draft',
                views: {
                    'contentView': {
                        templateUrl: 'views/workSpace/draftContent.html',
                        controller: 'DraftContentController as draftContent'
                    }
                }
            }).state('WorkSpace.ReviewContent', {
                url: '/content/review',
                views: {
                    'contentView': {
                        templateUrl: 'views/workSpace/reviewContent.html',
                        controller: 'ReviewContentController as reviewContent'
                    }
                }
            }).state('WorkSpace.PublishedContent', {
                url: '/content/published',
                views: {
                    'contentView': {
                        templateUrl: 'views/workSpace/publishedContent.html',
                        controller: 'PublishedContentController as publishedContent'
                    }
                }
            }).state('WorkSpace.AllUploadedContent', {
                url: '/content/uploaded',
                views: {
                    'contentView': {
                        templateUrl: 'views/workSpace/allUploadedContent.html',
                        controller: 'AllUploadedContentController as allUploadedContent'
                    }
                }
            }).state('CreateSlideShow', {
                url: '/create/slideShow',
                views: {
                    'mainView': {
                        templateUrl: '/views/slideShow/createSlideShow.html',
                        controller: 'CreateSlideShowController as createSlideShow'
                    }
                },
                onEnter: function ($rootScope) {
                    $rootScope.profileActive = 'active';
                },
                onExit: function ($rootScope) {
                    $rootScope.profileActive = '';
                }
            }).state('ContentEditor', {
                url: '/content/editor/:contentId',
                views: {
                    'mainView': {
                        templateUrl: 'views/common/contentEditor.html',
                        controller: 'ContentEditorController as contentEditor'
                    }
                },
                params: {contentId: null},
                onEnter: function ($rootScope) {
                    $rootScope.profileActive = 'active';
                },
                onExit: function ($rootScope) {
                    $rootScope.profileActive = '';
                }
            }).state('EditSlideShow', {
                url: '/slideshow/edit',
                views: {
                    'mainView': {
                        templateUrl: '/views/slideShow/editSlideShow.html'
                    }
                },
                onEnter: function ($rootScope) {
                    $rootScope.profileActive = 'active';
                },
                onExit: function ($rootScope) {
                    $rootScope.profileActive = '';
                }

            }).state('profileStartCreate', {
                url: '/create/workspace',
                views: {
                    'mainView': {
                        templateUrl: '/views/workSpace/createContent.html'
                    }
                }
            });
        })
        .run(function ($urlRouter, $http, $state, permissionsService, $rootScope, $location) {
            
            permissionsService.getPermissionsData('/permissions')
                    .then(function (res) {
                        var permissions = res.data;
                        if (res && res.responseCode === 'OK') {
                            permissionsService.setRolesAndPermissions(res.result);
                            permissionsService.setCurrentUserRoles(["CONTENT_REVIEWER"])
                        } else{
                            //TODO: allow only public permissions
                        }
                    })
                    .then(function () {
                        $urlRouter.sync();
                        $urlRouter.listen();
                    });

            $rootScope.$on('$stateChangeStart',
                    function (event, toState, toParams, fromState, fromParams) {

                        switch (toState.name) {
                            case "WorkSpace.ContentCreation":
                                if (!permissionsService.checkRolesPermissions(['CONTENT_CREATER', 'CONTENT_REVIEW', 'CONTENT_CREATION'], false)) {
                                    $rootScope.accessDenied = "You are not authorized to access this resource";
                                    event.preventDefault();
                                    $state.go('Home');
                                }
                                break;
                            default:
                                // statements_def
                                break;
                        }
                    });

        });
