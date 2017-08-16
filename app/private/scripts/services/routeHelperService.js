'use strict';

angular.module('playerApp')
        .service('routeHelperService', ['$rootScope', '$stateParams', '$timeout', 'sessionService',
            'permissionsService', 'toasterService', '$state',
            function ($rootScope, $stateParams, $timeout, sessionService, permissionsService,
            toasterService, $state) {
                this.loadRouteConfig = function (stateName, $stateParamsData) {
                    $stateParams = $stateParamsData;
                    var searchEnabledStates = ['Home', 'Courses', 'Resources', 'CourseNote',
                        'ContentNote', 'CourseContentNote', 'Toc', 'Player',
                        'Search', 'TocPlayer', 'PreviewCollection', 'Profile'];
                    var filterEnabledStates = ['Courses', 'Resources', 'Search'];
                    var searchKey = {
                        Home: 'All',
                        Courses: 'Courses',
                        Resources: 'Resources',
                        CourseNote: 'Courses',
                        ContentNote: 'Resources',
                        CourseContentNote: 'Courses',
                        Toc: 'Courses',
                        Player: 'Resources',
                        Search: $stateParams ? $stateParams.type : 'All',
                        TocPlayer: 'Courses',
                        PreviewCollection: 'Resources',
                        Profile: 'Users' };
                    if (searchEnabledStates.indexOf(stateName) >= 0) {
                        $rootScope.isSearchPage = true;
                        $rootScope.searchKey = searchKey[stateName];
                    } else {
                        $rootScope.isSearchPage = false;
                    }
                    if (filterEnabledStates.indexOf(stateName) >= 0) {
                        $rootScope.showFilter = true;
                    } else {
                        $rootScope.showFilter = false;
                    }
                    this.clearSearchSettings();
                    this.setBreaCrumbs(stateName);
                };
                this.setBreaCrumbs = function (stateName) {
                    switch (stateName) {
                    case 'Home':
                        $rootScope.breadCrumbsData = null;
                        break;
                    case 'Courses':
                        $rootScope.breadCrumbsData = [{
                            name: 'Home',
                            link: 'home'
                        }, {
                            name: 'Courses',
                            link: 'learn'
                        }];

                        break;
                    case 'Resources':

                        $rootScope.breadCrumbsData = [{
                            name: 'Home',
                            link: 'home'
                        }, {
                            name: 'Resources',
                            link: 'resources'
                        }];

                        break;
                    case 'CourseNote':

                        var courseParams = sessionService.getSessionData('COURSE_PARAMS');
                        $rootScope.breadCrumbsData = [{
                            name: 'Courses',
                            link: 'learn'
                        }, {
                            name: courseParams.courseName,
                            link: '/toc/' + courseParams.courseId + '/' + courseParams.lectureView
                        }, {
                            name: 'Notes',
                            link: ''
                        }];

                        break;
                    case 'ContentNote':

                        $rootScope.breadCrumbsData = [{
                            name: 'Resources',
                            link: 'resources'
                        }, {
                            name: $stateParams.contentName,
                            link: 'player/' + $stateParams.contentId + '/' + $stateParams.contentName
                        }, {
                            name: 'Notes',
                            link: ''
                        }];

                        break;
                    case 'CourseContentNote':

                        var courseParams = sessionService.getSessionData('COURSE_PARAMS');
                        var courseLink = '/toc/' + courseParams.courseId + '/' + courseParams.lectureView;
                        var contentLink = courseLink + '/' + courseParams.contentId + '/' + courseParams.contentIndex;
                        $rootScope.breadCrumbsData = [{
                            name: courseParams.courseName,
                            link: courseLink
                        }, {
                            name: courseParams.contentName,
                            link: contentLink
                        }, {
                            name: 'Notes',
                            link: ''
                        }];

                        break;
                    case 'Toc':

                        var courseParams = sessionService.getSessionData('COURSE_PARAMS');
                        $rootScope.breadCrumbsData = [{
                            name: 'Home',
                            link: 'home'
                        }, {
                            name: 'Courses',
                            link: 'learn'
                        }, {
                            name: courseParams.courseName,
                            link: ''
                        }];

                        break;
                    case 'Profile':

                        $rootScope.breadCrumbsData = [{
                            name: 'Home',
                            link: 'home'
                        }, {
                            name: 'Profile',
                            link: ''
                        }];

                        break;
                    case 'Player':

                        $rootScope.breadCrumbsData = [{
                            name: 'Home',
                            link: 'home'
                        }, {
                            name: 'Resources',
                            link: 'resources'
                        }, {
                            name: $stateParams.contentName,
                            link: ''
                        }];

                        break;
                    case 'Search':
                        if ($rootScope.searchKey === 'Users'
                            || $rootScope.searchKey === 'Organisations') {
                            $rootScope.breadCrumbsData = [{
                                name: 'Home',
                                link: 'home'
                            }, { name: 'Profile',
                                link: 'profile'
                            }, {
                                name: 'Search',
                                link: ''
                            }];
                        } else {
                            $rootScope.breadCrumbsData = [{
                                name: 'Home',
                                link: 'home'
                            }, {
                                name: 'Search',
                                link: ''
                            }];
                        }

                        break;
                    case 'TocPlayer':
                        var courseParams = sessionService.getSessionData('COURSE_PARAMS');
                        $rootScope.breadCrumbsData = [{
                            name: 'Home',
                            link: 'home'
                        }, {
                            name: 'Courses',
                            link: 'learn'
                        }, {
                            name: courseParams.courseName,
                            link: ''
                        }];

                        break;
                    case 'WorkSpace':

                        $rootScope.breadCrumbsData = [{
                            name: 'Home',
                            link: 'home'
                        }, {
                            name: 'Profile',
                            link: 'profile'
                        }, {
                            name: 'Workspace',
                            link: 'workspace/content/create'
                        }];

                        break;
                    case 'EditContent':

                        $rootScope.breadCrumbsData = [{
                            name: 'Home',
                            link: 'home'
                        }, {
                            name: 'Profile',
                            link: 'profile'
                        }, {
                            name: 'Workspace',
                            link: 'workspace/content/create'
                        }, {
                            name: 'Edit Content',
                            link: ''
                        }];

                        break;
                    case 'PreviewCollection':

                        $rootScope.breadCrumbsData = [{
                            name: 'Home',
                            link: 'home'
                        }, {
                            name: 'Resources',
                            link: 'resources'
                        }, {
                            name: $stateParams.name,
                            link: ''
                        }];

                        break;
                    case 'orgDashboard':

                        $rootScope.breadCrumbsData = [{
                            name: 'Home',
                            link: 'home'
                        }, {
                            name: 'Profile',
                            link: 'profile'
                        }, {
                            name: 'Organisation Admin Dashboard',
                            link: ''
                        }];

                        break;
                    default:
                        {
                            $rootScope.breadCrumbsData = null;
                        }
                    }
                };

                this.checkStateAccess = function (data, flag, event) {
                    if (permissionsService.checkRolesPermissions(data, flag)) {
                        toasterService.warning($rootScope.errorMessages.COMMON.UN_AUTHORIZED);
                        event.preventDefault();
                        $state.go('Home');
                    }
                };

                this.clearSearchSettings = function () {
                    if ($rootScope.search) {
                        $rootScope.search.selectedLanguage = [];
                        $rootScope.search.selectedContentType = [];
                        $rootScope.search.selectedSubject = [];
                        $rootScope.search.selectedBoard = [];
                        $rootScope.search.selectedConcepts = [];
                        $rootScope.search.broadCastConcepts();
                        $rootScope.search.filters = {};
                        $rootScope.search.sortBy = {};
                        $rootScope.search.sortByOption = {};
                        $timeout(function () {
                            $('#multi-select-sort').dropdown('clear');
                            $('#content-search-filter-accordion').accordion('close', 0);
                        }, 0);
                    }
                };
            }]);
