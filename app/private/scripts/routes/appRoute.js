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
                        onEnter: function ($rootScope, portalTelemetryService) {
                            $rootScope.searchKey = 'Home';
                            $rootScope.breadCrumbsData = null;
                            portalTelemetryService.fireImpressions({
                                "env": "home",
                                "type": "default",
                                "pageid": org.sunbird.portal.appid + "_Home",
                                "id": "",
                                "name": "",
                                "url": "/private/index#!/home"
                            });
                        }
                    })
                    .state('UserContent', {
                        url: '/content',
                        views: {
                            'mainView': {
                                templateUrl: '/views/content/usercontent.html',
                                controller: 'userContentCtrl as userContent'
                            }
                        },
                        onEnter: function (portalTelemetryService) {
                            portalTelemetryService.fireImpressions({
                                "env": "content",
                                "type": "list",
                                "pageid": org.sunbird.portal.appid + "_UserContent",
                                "id": "",
                                "name": "",
                                "url": "/private/index#!/content"
                            });
                        }
                    })
                    .state('Courses', {
                        url: '/learn',
                        views: {
                            'mainView': {
                                templateUrl: '/views/learn/learn.html',
                                controller: 'LearnCtrl as learn'
                            }
                        },
                        onEnter: function ($rootScope, portalTelemetryService) {
                            $rootScope.searchKey = 'Courses';
                            $rootScope.searchKeyword = '';
                            $rootScope.isLearnPage = true;
                            $rootScope.isSearchPage = true;
                            $rootScope.showFilter = true;
                            $rootScope.courseActive = 'active';
                            //filters section
                            if ($rootScope.search) {
                                $rootScope.search.selectedLanguage = [];
                                $rootScope.search.selectedContentType = [];
                                $rootScope.search.selectedSubject = [];
                                $rootScope.search.selectedBoard = [];
                                $rootScope.search.filters = {};
                                $rootScope.search.sortBy={};
                            }
                            //filters section -- ends
                            $rootScope.breadCrumbsData = [{name: 'Home', link: 'home'}, {'name': 'Courses', 'link': 'learn'}];
                            portalTelemetryService.fireImpressions({
                                "env": "course",
                                "type": "list",
                                "pageid": org.sunbird.portal.appid + "_Courses",
                                "id": "",
                                "name": "",
                                "url": "/private/index#!/learn"
                            });
                        },
                        onExit: function ($rootScope) {
                            $rootScope.isLearnPage = false;
                            $rootScope.isSearchPage = false;
                            $('#content-search-filter-accordion').accordion('close', 0);
                            $rootScope.courseActive = '';
                            $rootScope.breadCrumbsData = null;
                            $rootScope.isSearchPage = false;
                            $rootScope.showFilter = false;
                        },
                        params: {searchKey: 'Courses'}
                    })
                    .state('Resources', {
                        url: '/resources',
                        views: {
                            'mainView': {
                                templateUrl: '/views/resource/resource.html'
                            }
                        },
                        onEnter: function ($rootScope, portalTelemetryService) {
                            $rootScope.breadCrumbsData = [{name: 'Home', link: 'home'}, {'name': 'Resources', 'link': 'resources'}];
                            $rootScope.searchKey = 'Resources';
                            $rootScope.isResourcesPage = true;
                            $rootScope.searchKeyword = '';
                            $rootScope.resourcesActive = 'active';
                            $rootScope.isSearchPage = true;
                            $rootScope.showFilter = true;
                            //filters section
                            if ($rootScope.search) {
                                $rootScope.search.selectedLanguage = [];
                                $rootScope.search.selectedContentType = [];
                                $rootScope.search.selectedSubject = [];
                                $rootScope.search.selectedBoard = [];
                                $rootScope.search.filters = {};
                                $rootScope.search.sortBy={};
                            }
                            //filters section -- ends                         
                            portalTelemetryService.fireImpressions({
                                "env": "content",
                                "type": "list",
                                "pageid": org.sunbird.portal.appid + "_Resources",
                                "id": "",
                                "name": "",
                                "url": "/private/index#!/resources"
                            });
                        },
                        onExit: function ($rootScope) {
                            $rootScope.isResourcesPage = false;
                            $rootScope.resourcesActive = '';
                            $('#content-search-filter-accordion').accordion('close', 0);
                            $rootScope.breadCrumbsData = null;
                            $rootScope.isSearchPage = false;
                            $rootScope.showFilter = false;
                        },
                        params: {searchKey: 'Resources'}
                    })
                    .state('CourseNote', {
                        url: '/course/note/:tocId/:courseId',
                        views: {
                            'mainView': {
                                templateUrl: 'views/note/noteList.html',
                                controller: 'NoteListCtrl as noteList'
                            }
                        },
                        onEnter: function ($state, $rootScope, sessionService, portalTelemetryService) {
                            $rootScope.searchKey = 'Courses';
                            $rootScope.searchKeyword = '';
                            $rootScope.isSearchPage = true;
                            $rootScope.isNotePage = true;
                            $rootScope.courseActive = 'active';
                            var courseParams = sessionService.getSessionData('COURSE_PARAMS');
                            $rootScope.breadCrumbsData = [{name: 'Courses', link: 'learn'}, {'name': courseParams.courseName, 'link': '/toc/' + courseParams.tocId + '/' + courseParams.courseId + '/' + courseParams.lectureView}, {name: 'Notes', link: ''}];
                            portalTelemetryService.fireImpressions({
                                "env": "notes",
                                "type": "detail",
                                "pageid": org.sunbird.portal.appid + "_CourseNote",
                                "id": "",
                                "name": "",
                                "url": "/private/index#!/course/note/" + $state.params["tocId"] + "/" + $state.params["courseId"]
                            });
                        },
                        onExit: function ($rootScope) {
                            $rootScope.breadCrumbsData = null;
                            $rootScope.isNotePage = false;
                            $rootScope.isSearchPage = false;
                            $('#content-search-filter-accordion').accordion('close', 0);
                            $rootScope.courseActive = '';
                        }
                    })
                    .state('ContentNote', {
                        url: '/resourse/note/:contentId/:contentName',
                        views: {
                            'mainView': {
                                templateUrl: 'views/note/noteList.html',
                                controller: 'NoteListCtrl as noteList'
                            }
                        },
                        onEnter: function ($state, $rootScope, $stateParams, portalTelemetryService) {
                            $rootScope.breadCrumbsData = [{'name': 'Resources', 'link': 'resources'}, {'name': $stateParams.contentName, link: 'player/' + $stateParams.contentId + '/' + $stateParams.contentName}, {name: 'Notes', link: ''}];
                            $rootScope.searchKey = 'Resources';
                            $rootScope.isNotePage = true;
                            $rootScope.isSearchPage = true;
                            $rootScope.searchKeyword = '';
                            $rootScope.resourcesActive = 'active';
                            portalTelemetryService.fireImpressions({
                                "env": "notes",
                                "type": "detail",
                                "pageid": org.sunbird.portal.appid + "_ContentNote",
                                "id": $state.params["contentId"],
                                "name": $state.params["contentName"],
                                "url": "/private/index#!/resourse/note/" + $state.params["contentId"] + "/" + $state.params["contentName"]
                            });
                        },
                        onExit: function ($rootScope) {
                            $rootScope.isNotePage = false;
                            $('#content-search-filter-accordion').accordion('close', 0);
                            $rootScope.resourcesActive = '';
                            $rootScope.breadCrumbsData = null;
                            $rootScope.isSearchPage = false;
                        }
                    })
                    .state('CourseContentNote', {
                        url: '/note/:tocId/:courseId/:contentId',
                        views: {
                            'mainView': {
                                templateUrl: 'views/note/noteList.html',
                                controller: 'NoteListCtrl as noteList'
                            }
                        },
                        onEnter: function ($rootScope, sessionService, portalTelemetryService, $state) {
                            var courseParams = sessionService.getSessionData('COURSE_PARAMS');
                            var courseLink = '/toc/' + courseParams.tocId + '/' + courseParams.courseId + '/' + courseParams.lectureView;
                            var contentLink = courseLink + '/' + courseParams.contentId + '/' + courseParams.contentIndex;
                            $rootScope.breadCrumbsData = [{'name': courseParams.courseName, 'link': courseLink}, {name: courseParams.contentName, link: contentLink}, {name: 'Notes', link: ''}];
                            $rootScope.searchKey = 'Courses';
                            $rootScope.searchKeyword = '';
                            $rootScope.isNotePage = true;
                            $rootScope.courseActive = 'active';
                            $rootScope.isSearchPage = true;
                            portalTelemetryService.fireImpressions({
                                "env": "notes",
                                "type": "default",
                                "pageid": org.sunbird.portal.appid + "_CourseContentNote",
                                "id": $state.params["contentId"],
                                "name": "",
                                "url": "/private/index#!/note/" + $state.params["tocId"] + "/" + $state.params["courseId"] + "/" + $state.params["contentId"]
                            });
                        },
                        onExit: function ($rootScope) {
                            $rootScope.isNotePage = false;
                            $rootScope.isSearchPage = false;
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
                        onEnter: function ($state, $rootScope, sessionService, portalTelemetryService) {
                            var courseParams = sessionService.getSessionData('COURSE_PARAMS');
                            $rootScope.breadCrumbsData = [{name: 'Home', link: 'home'}, {name: 'Courses', link: 'learn'}, {'name': courseParams.courseName, 'link': ''}];
                            $rootScope.searchKey = 'Courses';
                            $rootScope.isSearchPage = true;
                            $rootScope.searchKeyword = '';
                            $rootScope.isTocPage = true;
                            $rootScope.courseActive = 'active';
                            portalTelemetryService.fireImpressions({
                                "env": "course",
                                "type": "detail",
                                "pageid": org.sunbird.portal.appid + "_Toc",
                                "id": "",
                                "name": "",
                                "url": "/private/index#!/toc/" + $state.params["tocId"] + "/" + $state.params["courseId"] + "/" + $state.params["lectureView"]
                            });
                        },
                        onExit: function ($rootScope) {
                            $rootScope.searchKey = 'All';
                            $rootScope.isSearchPage = false;
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
                        onEnter: function ($rootScope, portalTelemetryService) {
                            $rootScope.searchKey = 'Community';
                            portalTelemetryService.fireImpressions({
                                "env": "community",
                                "type": "default",
                                "pageid": org.sunbird.portal.appid + "_Community",
                                "id": "",
                                "name": "",
                                "url": "/private/index#!/community"
                            });
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
                        onEnter: function ($rootScope, portalTelemetryService) {
                            $rootScope.breadCrumbsData = [{name: 'Home', link: 'home'}, {name: 'Profile', link: ''}];
                            $rootScope.searchKey = 'Profile';
                            $rootScope.profileActive = 'active';
                            portalTelemetryService.fireImpressions({
                                "env": "profile",
                                "type": "default",
                                "pageid": org.sunbird.portal.appid + "_Profile",
                                "id": "",
                                "name": "",
                                "url": "/private/index#!/profile"
                            });
                        },
                        onExit: function ($rootScope) {
                            $rootScope.breadCrumbsData = null;
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
                        onEnter: function ($state, $rootScope, $stateParams, portalTelemetryService) {
                            $rootScope.breadCrumbsData = [{name: 'Home', link: 'home'}, {'name': 'Resources', 'link': 'resources'}, {'name': $stateParams.contentName, link: ''}];
                            $rootScope.searchKey = 'Resources';
                            $rootScope.isSearchPage = true;
                            $rootScope.isPlayerPage = true;
                            $rootScope.searchKeyword = '';
                            $rootScope.resourcesActive = 'active';
                            portalTelemetryService.fireImpressions({
                                "env": "player",
                                "type": "default",
                                "pageid": org.sunbird.portal.appid + "_Player",
                                "id": $state.params["contentId"],
                                "name": $state.params["contentName"],
                                "url": "/private/index#!/player/" + $state.params["contentId"] + "/" + $state.params["contentName"]
                            });
                        },
                        onExit: function ($rootScope) {
                            $rootScope.isPlayerPage = false;
                            $('#content-search-filter-accordion').accordion('close', 0);
                            $rootScope.resourcesActive = '';
                            $rootScope.breadCrumbsData = null;
                            $rootScope.searchKey = 'All';
                            $rootScope.isSearchPage = false;
                        }
                    })
                    .state('Search', {
                        url: '/search/:type/:query/:filters/:sort',
                        views: {
                            'mainView': {
                                templateUrl: 'views/search/search.html',
                                controller: 'SearchCtrl as search'
                            }
                        },
                        params: {type: null, query: null, filters: null, sort: null},
                        onEnter: function ($state, $rootScope, portalTelemetryService, $stateParams) {
                            $rootScope.breadCrumbsData = [{name: 'Home', link: 'home'}, {'name': 'Search', 'link': ''}];
                            $rootScope.isSearchPage = true;
                            $rootScope.isSearchResultsPage = true;
                            $rootScope.showFilter = true;
                            $rootScope.searchKey = $stateParams.type;
                            if ($stateParams.type == 'Courses') {
                                $rootScope.courseActive = 'active';
                            } else {
                                $rootScope.resourcesActive = 'active';
                            }
                            portalTelemetryService.fireImpressions({
                                "env": "course",
                                "type": "search",
                                "pageid": org.sunbird.portal.appid + "_SearchCourse",
                                "id": "",
                                "name": "",
                                "url": "/private/index#!/" + $state.params["searchType"] + "/search/" + $state.params["query"] + "/"
                            });
                        },
                        onExit: function ($rootScope) {
                            $rootScope.courseActive = $rootScope.resourcesActive = '';
                            $rootScope.isSearchPage = false;
                            $rootScope.breadCrumbsData = null;
                            $rootScope.isSearchResultsPage = false;
                            $rootScope.showFilter = false;
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
                        onEnter: function ($rootScope, portalTelemetryService, $state) {
                            $rootScope.breadCrumbsData = [{name: 'Home', link: 'home'}, {'name': 'Resources', 'link': 'resources'}, {name: 'Search', link: ''}];
                            $rootScope.isSearchPage = true;
                            $rootScope.searchKey = 'Resources';
                            $rootScope.resourcesActive = 'active';
                            portalTelemetryService.fireImpressions({
                                "env": "content",
                                "type": "search",
                                "pageid": org.sunbird.portal.appid + "_SearchResource",
                                "id": "",
                                "name": "",
                                "url": "/private/index#!/resources/search/" + $state.params["query"] + "/" + $state.params["searchType"] + "/"
                            });
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
                        controller: 'courseScheduleCtrl as toc'
                    }
                },
                onEnter: function ($state, $rootScope, sessionService, portalTelemetryService) {
                    var courseParams = sessionService.getSessionData('COURSE_PARAMS');
                    $rootScope.breadCrumbsData = [{name: 'Home', link: 'home'}, {name: 'Courses', link: 'learn'}, {'name': courseParams.courseName, 'link': ''}];
                    $rootScope.searchKey = 'Courses';
                    $rootScope.isSearchPage = true;
                    $rootScope.searchKeyword = '';
                    $rootScope.isTocPage = true;
                    $rootScope.courseActive = 'active';
                    portalTelemetryService.fireImpressions({
                        "env": "player",
                        "type": "detail",
                        "pageid": org.sunbird.portal.appid + "_TocPlayer",
                        "id": "",
                        "name": "",
                        "url": "/private/index#!/toc/" + $state.params["tocId"] + "/" + $state.params["courseId"] + "/" + $state.params["lectureView"] + "/" + $state.params["contentId"] + "/" + $state.params["contentIndex"]
                    });
                },
                onExit: function ($rootScope) {
                    $rootScope.searchKey = 'All';
                    $rootScope.isSearchPage = false;
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
                            $rootScope.breadCrumbsData = [{name: 'Home', link: 'home'}, {name: 'Profile', link: 'profile'}, {name: 'Workspace', link: 'workspace/content/create'}];
                            if ($state.current.name === "WorkSpace") {
                                $state.go('WorkSpace.ContentCreation');
                            }
                        }
                    }
                },
                onEnter: function ($rootScope, portalTelemetryService) {
                    $rootScope.profileActive = 'active';
                    $rootScope.breadCrumbsData = null;
                    portalTelemetryService.fireImpressions({
                        "env": "workspace",
                        "type": "default",
                        "pageid": org.sunbird.portal.appid + "_WorkSpace",
                        "id": "",
                        "name": "",
                        "url": "/private/index#!/workspace"
                    });
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
                },
                onEnter: function (portalTelemetryService) {
                    portalTelemetryService.fireImpressions({
                        "env": "content",
                        "type": "creation",
                        "pageid": org.sunbird.portal.appid + "_WorkSpace.ContentCreation",
                        "id": "",
                        "name": "",
                        "url": "/private/index#!/content/create"
                    });
                }
            }).state('WorkSpace.DraftContent', {
                url: '/content/draft',
                views: {
                    'contentView': {
                        templateUrl: 'views/workSpace/draftContent.html',
                        controller: 'DraftContentController as draftContent'
                    }
                },
                onEnter: function (portalTelemetryService) {
                    portalTelemetryService.fireImpressions({
                        "env": "content",
                        "type": "list",
                        "pageid": org.sunbird.portal.appid + "_WorkSpace.DraftContent",
                        "id": "",
                        "name": "",
                        "url": "/private/index#!/content/draft"
                    });
                }
            }).state('WorkSpace.ReviewContent', {
                url: '/content/review',
                views: {
                    'contentView': {
                        templateUrl: 'views/workSpace/reviewContent.html',
                        controller: 'ReviewContentController as reviewContent'
                    }
                },
                onEnter: function (portalTelemetryService) {
                    portalTelemetryService.fireImpressions({
                        "env": "content",
                        "type": "list",
                        "pageid": org.sunbird.portal.appid + "_WorkSpace.ReviewContent",
                        "id": "",
                        "name": "",
                        "url": "/private/index#!/content/review"
                    });
                }
            }).state('WorkSpace.PublishedContent', {
                url: '/content/published',
                views: {
                    'contentView': {
                        templateUrl: 'views/workSpace/publishedContent.html',
                        controller: 'PublishedContentController as publishedContent'
                    }
                },
                onEnter: function (portalTelemetryService) {
                    portalTelemetryService.fireImpressions({
                        "env": "content",
                        "type": "list",
                        "pageid": org.sunbird.portal.appid + "_WorkSpace.PublishedContent",
                        "id": "",
                        "name": "",
                        "url": "/private/index#!/content/published"
                    });
                }
            }).state('WorkSpace.AllUploadedContent', {
                url: '/content/uploaded',
                views: {
                    'contentView': {
                        templateUrl: 'views/workSpace/allUploadedContent.html',
                        controller: 'AllUploadedContentController as allUploadedContent'
                    }
                },
                onEnter: function (portalTelemetryService) {
                    portalTelemetryService.fireImpressions({
                        "env": "content",
                        "type": "list",
                        "pageid": org.sunbird.portal.appid + "_WorkSpace.AllUploadedContent",
                        "id": "",
                        "name": "",
                        "url": "/private/index#!/content/uploaded"
                    });
                }
            }).state('WorkSpace.UpForReviewContent', {
                url: '/content/upForReview',
                views: {
                    'contentView': {
                        templateUrl: 'views/workSpace/upForReviewContent.html',
                        controller: 'UpForReviewContentController as upForReviewContent'
                    }
                },
                onEnter: function (portalTelemetryService) {
                    portalTelemetryService.fireImpressions({
                        "env": "content",
                        "type": "list",
                        "pageid": org.sunbird.portal.appid + "_WorkSpace.UpForReviewContent",
                        "id": "",
                        "name": "",
                        "url": "/private/index#!/content/upForReview"
                    });
                }
            }).state('CreateLesson', {
                url: '/create/lesson',
                views: {
                    'mainView': {
                        templateUrl: '/views/workSpace/createLesson.html',
                        controller: 'ContentLessonController as contentLesson'
                    }
                },
                onEnter: function ($rootScope, portalTelemetryService) {
                    $rootScope.profileActive = 'active';
                    portalTelemetryService.fireImpressions({
                        "env": "content",
                        "type": "creation",
                        "pageid": org.sunbird.portal.appid + "_CreateLesson",
                        "id": "",
                        "name": "",
                        "url": "/private/index#!/create/lesson"
                    });
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
                onEnter: function ($state, $rootScope, portalTelemetryService) {
                    $rootScope.profileActive = 'active';
                    portalTelemetryService.fireImpressions({
                        "env": "content",
                        "type": "creation",
                        "pageid": org.sunbird.portal.appid + "_ContentEditor",
                        "id": $state.params["contentId"],
                        "name": "",
                        "url": "/private/index#!/content/editor/" + $state.params["contentId"]
                    });
                },
                onExit: function ($rootScope) {
                    $rootScope.profileActive = '';
                }
            }).state('EditContent', {
                url: '/content/edit/:contentId',
                views: {
                    'mainView': {
                        templateUrl: '/views/workSpace/editContent.html',
                        controller: 'EditContentController as editContent'
                    }
                },
                params: {contentId: null, backState: null},
                onEnter: function ($rootScope, portalTelemetryService, $state) {
                    $rootScope.profileActive = 'active';
                    $rootScope.breadCrumbsData = [{name: 'Home', link: 'home'}, {name: 'Profile', link: 'profile'}, {name: 'Workspace', link: 'workspace/content/create'}, {name: 'Edit Content', link: ''}];
                    portalTelemetryService.fireImpressions({
                        "env": "content",
                        "type": "edit",
                        "pageid": org.sunbird.portal.appid + "_EditContent",
                        "id": $state.params["contentId"],
                        "name": "",
                        "url": "/private/index#!/content/edit/" + $state.params["contentId"]
                    });
                },
                onExit: function ($rootScope) {
                    $rootScope.breadCrumbsData = null;
                    $rootScope.profileActive = '';
                }

            }).state('profileStartCreate', {
                url: '/create/workspace',
                views: {
                    'mainView': {
                        templateUrl: '/views/workSpace/createContent.html'
                    }
                },
                onEnter: function (portalTelemetryService) {
                    portalTelemetryService.fireImpressions({
                        "env": "content",
                        "type": "creation",
                        "pageid": org.sunbird.portal.appid + "_profileStartCreate",
                        "id": "",
                        "name": "",
                        "url": "/private/index#!/create/workspace"
                    });
                }
            }).state('CreateTextbook', {
                url: '/create/textbook',
                views: {
                    'mainView': {
                        templateUrl: '/views/workSpace/createTextBook.html',
                        controller: 'TextBookController as textbook'
                    }
                },
                onEnter: function ($rootScope, portalTelemetryService) {
                    $rootScope.profileActive = 'active';
                    portalTelemetryService.fireImpressions({
                        "env": "textbook",
                        "type": "creation",
                        "pageid": org.sunbird.portal.appid + "_CreateTextbook",
                        "id": "",
                        "name": "",
                        "url": "/private/index#!/create/textbook"
                    });
                },
                onExit: function ($rootScope) {
                    $rootScope.profileActive = '';
                }
            }).state('CreateCollection', {
                url: '/create/collection',
                views: {
                    'mainView': {
                        templateUrl: '/views/workSpace/createCollection.html',
                        controller: 'CollectionController as collection'
                    }
                },
                onEnter: function ($rootScope, portalTelemetryService) {
                    $rootScope.profileActive = 'active';
                    portalTelemetryService.fireImpressions({
                        "env": "collection",
                        "type": "creation",
                        "pageid": org.sunbird.portal.appid + "_CreateCollection",
                        "id": "",
                        "name": "",
                        "url": "/private/index#!/create/collection"
                    });
                },
                onExit: function ($rootScope) {
                    $rootScope.profileActive = '';
                }
            }).state('CreateCourse', {
                url: '/create/course',
                views: {
                    'mainView': {
                        templateUrl: '/views/workSpace/createCourse.html',
                        controller: 'CourseController as course'
                    }
                },
                onEnter: function ($rootScope, portalTelemetryService) {
                    $rootScope.profileActive = 'active';
                    portalTelemetryService.fireImpressions({
                        "env": "course",
                        "type": "creation",
                        "pageid": org.sunbird.portal.appid + "_CreateCourse",
                        "id": "",
                        "name": "",
                        "url": "/private/index#!/create/course"
                    });
                },
                onExit: function ($rootScope) {
                    $rootScope.profileActive = '';
                }
            }).state('CollectionEditor', {
                url: '/collection/editor/:contentId/:type/:state',
                views: {
                    'mainView': {
                        templateUrl: 'views/common/collectionEditor.html',
                        controller: 'CollectionEditorController as collectionEditor'
                    }
                },
                params: {contentId: null, type: null, state: null},
                onEnter: function ($rootScope, portalTelemetryService) {
                    $rootScope.profileActive = 'active';
                    portalTelemetryService.fireImpressions({
                        "env": "collectioneditor",
                        "type": "edit",
                        "pageid": org.sunbird.portal.appid + "_CollectionEditor",
                        "id": "",
                        "name": "",
                        "url": "/private/index#!/collection/editor/"
                    });
                },
                onExit: function ($rootScope) {
                    $rootScope.profileActive = '';
                }
            }).state('PreviewContent', {
                url: '/preview/content/:contentId/:backState',
                views: {
                    'mainView': {
                        templateUrl: 'views/workSpace/previewContent.html',
                        controller: 'PreviewContentController as previewContent'
                    }
                },
                params: {contentId: null, backState: null},
                onEnter: function ($state, $rootScope, portalTelemetryService) {
                    $rootScope.profileActive = 'active';
                    portalTelemetryService.fireImpressions({
                        "env": "content",
                        "type": "preview",
                        "pageid": org.sunbird.portal.appid + "_PreviewContent",
                        "id": $state.params["contentId"],
                        "name": "",
                        "url": "/private/index#!/preview/content/" + $state.params["contentId"] + "/" + $state.params["backState"]
                    });
                },
                onExit: function ($rootScope) {
                    $rootScope.profileActive = '';
                }
            }).state('PreviewCollection', {
                url: '/preview/collection/:Id/:name',
                views: {
                    'mainView': {
                        templateUrl: 'views/collectionplayer/collectionPlayer.html',
                        controller: 'CollectionPlayerCtrl as cpvm'
                    }
                },
                params: {Id: null, name: null},
                onEnter: function ($stateParams, $rootScope, portalTelemetryService) {
                    $rootScope.resourcesActive = 'active';
                    $rootScope.breadCrumbsData = [{name: 'Home', link: 'home'}, {'name': 'Resources', 'link': 'resources'}, {'name': $stateParams['name'], link: ''}];
                    $rootScope.searchKey = 'Resources';
                    $rootScope.isSearchPage = true;
                    $rootScope.isPlayerPage = true;
                    $rootScope.searchKeyword = '';
                    portalTelemetryService.fireImpressions({
                        "env": "collection",
                        "type": "preview",
                        "pageid": org.sunbird.portal.appid + "_PreviewCollection",
                        "id": $stateParams["Id"],
                        "name": "",
                        "url": "/private/index#!/preview/collection/" + $stateParams["Id"] + "/" + $stateParams["name"]
                    });
                },
                onExit: function ($rootScope) {
                    $rootScope.resourcesActive = '';
                }
            });
        })
        .run(function ($urlRouter, $http, $state, permissionsService, $rootScope, $location, config) {



            permissionsService.getPermissionsData('/permissions')
                    .then(function (res) {
                        var permissions = res.data;
                        if (res && res.responseCode === 'OK') {
                            permissionsService.setRolesAndPermissions(res.result);
                        } else {
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
                            case "WorkSpace":
                                if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
                                    $rootScope.accessDenied = $rootScope.errorMessages.COMMON.UN_AUTHORIZED;
                                    event.preventDefault();
                                    $state.go('Home');
                                }
                                break;
                            case "WorkSpace.ContentCreation":
                                if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
                                    $rootScope.accessDenied = $rootScope.errorMessages.COMMON.UN_AUTHORIZED;
                                    event.preventDefault();
                                    $state.go('Home');
                                }
                                break;
                            case "CreateLesson":
                                if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
                                    $rootScope.accessDenied = $rootScope.errorMessages.COMMON.UN_AUTHORIZED;
                                    event.preventDefault();
                                    $state.go('Home');
                                }
                                break;
                            case "ContentEditor":
                                if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
                                    $rootScope.accessDenied = $rootScope.errorMessages.COMMON.UN_AUTHORIZED;
                                    event.preventDefault();
                                    $state.go('Home');
                                }
                                break;
                            case "EditContent":
                                if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
                                    $rootScope.accessDenied = $rootScope.errorMessages.COMMON.UN_AUTHORIZED;
                                    event.preventDefault();
                                    $state.go('Home');
                                }
                                break;
                            case "CreateTextbook":
                                if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
                                    $rootScope.accessDenied = $rootScope.errorMessages.COMMON.UN_AUTHORIZED;
                                    event.preventDefault();
                                    $state.go('Home');
                                }
                                break;
                            case "CreateCollection":
                                if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
                                    $rootScope.accessDenied = $rootScope.errorMessages.COMMON.UN_AUTHORIZED;
                                    event.preventDefault();
                                    $state.go('Home');
                                }
                                break;
                            case "CreateCourse":
                                if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
                                    $rootScope.accessDenied = $rootScope.errorMessages.COMMON.UN_AUTHORIZED;
                                    event.preventDefault();
                                    $state.go('Home');
                                }
                                break;
                            case "CollectionEditor":
                                if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
                                    $rootScope.accessDenied = $rootScope.errorMessages.COMMON.UN_AUTHORIZED;
                                    event.preventDefault();
                                    $state.go('Home');
                                }
                                break;
                            case "PreviewContent":
                                if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
                                    $rootScope.accessDenied = $rootScope.errorMessages.COMMON.UN_AUTHORIZED;
                                    event.preventDefault();
                                    $state.go('Home');
                                }
                                break;
                            case "PreviewCollection":
                                if (permissionsService.checkRolesPermissions(config.COMMON_ROLES_CHECK, false)) {
                                    $rootScope.accessDenied = $rootScope.errorMessages.COMMON.UN_AUTHORIZED;
                                    event.preventDefault();
                                    $state.go('Home');
                                }
                                break;
                            case "WorkSpace.UpForReviewContent":
                                if (permissionsService.checkRolesPermissions(['CONTENT_REVIEWER', 'CONTENT_REVIEW'], false)) {
                                    $rootScope.accessDenied = $rootScope.errorMessages.COMMON.UN_AUTHORIZED;
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
