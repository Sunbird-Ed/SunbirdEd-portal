'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:contentPlayer
 * @description
 * # contentPlayer
 */
angular.module('playerApp').directive('search', function () {
    var controller = ['$scope', '$rootScope', 'config', '$timeout', '$state', '$stateParams', 'searchService', '$location', 'sessionService', '$window', function ($scope, $rootScope, config, $timeout, $state, $stateParams, searchService, $location, sessionService, $window) {
            $rootScope.search = {};
            $rootScope.search.searchKeyword = '';
            $rootScope.search.filters = {};

            $rootScope.search.languages = config.FILTER.RESOURCES.languages;
            $rootScope.search.contentTypes = config.FILTER.RESOURCES.contentTypes;
            $rootScope.search.subjects = config.FILTER.RESOURCES.subjects;
            $rootScope.search.boards = config.FILTER.RESOURCES.boards;
            $rootScope.search.searchTypeKeys = ['Courses', 'Resources'];
            $rootScope.search.sortingOptions = [{field: 'lastUpdatedOn', name: 'Updated On'}, {field: 'createdOn', name: 'Created On'}];
            $rootScope.search.sortBy = {'createdOn': 'asc'};
            $rootScope.search.searchSelectionKeys = [{id: 'Courses', name: 'Courses'}, {id: 'Resources', name: 'Resources'}, {id: 'All', name: 'All'}];
            $rootScope.search.sortIcon = true;
            $rootScope.search.selectedLanguage = [];
            $rootScope.search.selectedContentType = [];
            $rootScope.search.selectedSubject = [];
            $rootScope.search.selectedBoard = [];
            $rootScope.search.sortByOption = {};

            // search select dropdown changes
            $rootScope.$watch('searchKey', function () {
                $timeout(function () {
                    $rootScope.search.selectedSearchKey = $rootScope.searchKey;
                    $rootScope.search.isSearchTypeKey = $rootScope.search.searchTypeKeys.includes($rootScope.search.selectedSearchKey);
                    $('#headerSearch').dropdown('set selected', $rootScope.search.isSearchTypeKey === true ? $rootScope.search.selectedSearchKey : 'All');
                    $('.content-search-filter').dropdown('clear');
                }, 0);

            });
            $rootScope.$on('initSearch', function (event, args) {
                $rootScope.search.initSearch();
            });

            $rootScope.search.selectFilter = function (filterType, value, $event, defaultVal) {
                $timeout(function () {
                    var itemIndex = $rootScope.search[filterType].indexOf(value);
                    if (itemIndex == -1) {
                        $rootScope.search[filterType].push(value);
                        $($event.target).addClass('active');
                    } else {
                        $rootScope.search[filterType].splice(itemIndex, 1);
                        $($event.target).removeClass('active');
                    }
                    var selText = $rootScope.search[filterType].length > 0 ? $rootScope.search[filterType].length + ' selected' : defaultVal;
                    $($event.target).closest('.filtersearch').find('.filter-sel-text').text(selText).removeClass('default');
                }, 0);

            }
            /**
             * This function called when api failed, and its show failed response for 2 sec.
             * @param {String} message
             */
            function showErrorMessage(isClose, message, messageType) {
                var error = {};
                error.showError = true;
                error.isClose = isClose;
                error.message = message;
                error.messageType = messageType;
                return error;
            }

            /**
             * This function helps to show loader with message.
             * @param {String} headerMessage
             * @param {String} loaderMessage
             */
            function showLoaderWithMessage(headerMessage, loaderMessage) {
                var loader = {};
                loader.showLoader = true;
                loader.headerMessage = headerMessage;
                loader.loaderMessage = loaderMessage;
                return loader;
            }
            $rootScope.search.initSearch = function () {
                var searchParams = $stateParams;
                $rootScope.searchKey = $rootScope.search.selectedSearchKey = searchParams.type;
                $rootScope.search.searchKeyword = $rootScope.search.searchKeyword || searchParams.query;
                $rootScope.search.filters = JSON.parse(atob(searchParams.filters));
                $rootScope.search.sortBy = JSON.parse(atob(searchParams.sort));
                $rootScope.search.selectedLanguage = $rootScope.search.filters.language || [];
                $rootScope.search.selectedContentType = $rootScope.search.filters.contentType || [];
                $rootScope.search.selectedBoard = $rootScope.search.filters.board || [];
                $rootScope.search.selectedSubject = $rootScope.search.filters.subject || [];
                // $rootScope.search.sortBy=$rootScope.search.sortBy;
                $rootScope.search.searchRequest();
            };

            $rootScope.search.openCourseView = function (course, courseType) {
                var showLectureView = 'no';
                //  var params = { courseType: courseType, courseId: course.courseId || course.identifier, tocId: course.courseId || course.identifier, lectureView: showLectureView, progress: course.progress, total: course.total };
                var params = {courseType: courseType, courseId: course.courseId || course.identifier, tocId: course.courseId || course.identifier, lectureView: showLectureView, progress: course.progress, total: course.total, courseName: course.courseName || course.name, lastReadContentId: course.lastReadContentId};
                sessionService.setSessionData('COURSE_PARAMS', params);
                $state.go('Toc', params);
            };

            $rootScope.search.playContent = function (item) {
                var params = {content: item, contentName: item.name, contentId: item.identifier};
                $state.go('Player', params);
            };
            $rootScope.search.setSearchText = function (searchText) {
                $rootScope.search.searchKeyword = searchText;
                $rootScope.search.searchRequest(false);
            }
            $rootScope.search.searchRequest = function (auto) {

                if ($rootScope.search.searchKeyword != '') {
                    if (($rootScope.isSearchResultsPage && ($rootScope.search.searchKeyword == $stateParams.query)) || auto) {
                        $rootScope.search.autoSuggest = auto;
                        if ($scope.curSearchText != $rootScope.search.searchKeyword) {
                            $rootScope.search.handleSearch();
                        } else if (!auto || auto == undefined) {
                            $rootScope.search.handleSearch();
                        }
                    } else {
                        $rootScope.search.autoSuggest = false;
                        var searchParams = {
                            type: $rootScope.search.selectedSearchKey,
                            query: $rootScope.search.searchKeyword,
                            filters: btoa(JSON.stringify($rootScope.search.filters)),
                            sort: btoa(JSON.stringify($rootScope.search.sortBy))
                        };
                        //$state.go('Search', searchParams);
                        $location.path('search/' + searchParams.type + '/' + searchParams.query + '/' + searchParams.filters + '/' + searchParams.sort);
                    }
                } else
                {
                    $rootScope.$emit('initPageSearch', {});
                }

            }
            $rootScope.search.handleSearch = function () {

                ($rootScope.search.autoSuggest == false || $rootScope.search.autoSuggest == undefined) ? $rootScope.search.loader = showLoaderWithMessage('', config.MESSAGES.SEARCH.COURSE.START) : 0;

                var req = {
                    'query': $rootScope.search.searchKeyword,
                    'filters': $rootScope.search.filters,
                    'params': {
                        'cid': '12'
                    },
                    'limit': 20,
                    'sort_by': $rootScope.search.sortBy

                };

                if ($rootScope.search.selectedSearchKey == "Courses") {
                    $rootScope.search.searchFn = searchService.courseSearch(req);
                    $rootScope.search.resultType = 'course';
                } else if ($rootScope.search.selectedSearchKey == "Resources") {
                    $rootScope.search.searchFn = searchService.contentSearch(req);
                    $rootScope.search.resultType = 'content';
                }

                $rootScope.search.searchFn.then(function (res) {
                    $scope.curSearchText = $rootScope.search.searchKeyword;
                    if (res != null && res.responseCode === 'OK') {
                        $rootScope.search.autosuggest_data = [];
                        if ($rootScope.search.autoSuggest) {
                            $rootScope.search.autosuggest_data = res.result[$rootScope.search.resultType];

                        } else
                        {
                            $rootScope.search.autosuggest_data = [];
                            $rootScope.search.loader.showLoader = false;

                            if (res.result.count == 0) {
                                $rootScope.search.error = showErrorMessage(true, config.MESSAGES.SEARCH.RESOURCE.NO_RESULT, config.MESSAGES.COMMON.INFO);
                            } else {
                                $rootScope.search.error.showError = false;                                
                                $rootScope.search.searchResult = res.result;
                            }
                        }
                    } else {
                        $rootScope.search.loader.showLoader = false;
                        $rootScope.search.error = showErrorMessage(true, config.MESSAGES.SEARCH.COURSE.FAILED, config.MESSAGES.COMMON.ERROR);
                        throw new Error('');
                    }
                }).catch(function (e) {
                    $rootScope.search.loader.showLoader = false;
                    $rootScope.search.error = showErrorMessage(true, config.MESSAGES.SEARCH.COURSE.FAILED, config.MESSAGES.COMMON.ERROR);
                });

            }


            $rootScope.search.applyFilter = function () {
                $rootScope.search.filters['language'] = $rootScope.search.selectedLanguage ? $rootScope.search.selectedLanguage : [];
                $rootScope.search.filters['contentType'] = $rootScope.search.selectedContentType ? $rootScope.search.selectedContentType : [];
                $rootScope.search.filters['subject'] = $rootScope.search.selectedSubject ? $rootScope.search.selectedSubject : [];
                $rootScope.search.filters['board'] = $rootScope.search.selectedBoard ? $rootScope.search.selectedBoard : [];
                $rootScope.search.searchRequest();
            };
            $rootScope.search.resetFilter = function () {
                $('.content-search-filter').dropdown('clear');
                $rootScope.search.selectedLanguage = [];
                $rootScope.search.selectedContentType = [];
                $rootScope.search.selectedSubject = [];
                $rootScope.search.selectedBoard = [];
                $rootScope.isSearchPage = false;
                $rootScope.isSearchPage = true;
                $rootScope.search.filters = {};
                // $rootScope.search.searchRequest();
                $state.go($rootScope.search.selectedSearchKey);

            };
            $rootScope.search.applySorting = function () {
                var sortByField = $rootScope.search.sortByOption;
                $rootScope.search.sortBy = {};
                $rootScope.search.sortBy[sortByField] = ($rootScope.search.sortIcon === true) ? 'asc' : 'desc';
                $rootScope.search.searchRequest();
            };


        }];
    return {
        templateUrl: 'views/header/search.html',
        restrict: 'E',
        scope: {
            type: '=',
        },
        link: function (scope, element, attrs) {

        },
        controller: controller
    };
});