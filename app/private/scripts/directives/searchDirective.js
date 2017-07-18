'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:contentPlayer
 * @description
 * # contentPlayer
 */
angular.module('playerApp').directive('search', function () {
    var controller = ['$scope', '$rootScope', 'config', '$timeout', '$state', '$stateParams', 'searchService', '$location', 'sessionService', '$window', function ($scope, $rootScope, config, $timeout, $state, $stateParams, searchService, $location, sessionService, $window) {
            $scope.search = {};
            $rootScope.search = {};
            $rootScope.search.searchKeyword = '';
            $rootScope.search.filters = {};
            $rootScope.search.typingTimer;                //timer identifier
            $rootScope.search.doneTypingInterval = 500;
            $rootScope.search.languages = config.FILTER.RESOURCES.languages;
            $rootScope.search.contentTypes = config.FILTER.RESOURCES.contentTypes;
            $rootScope.search.subjects = config.FILTER.RESOURCES.subjects;
            $rootScope.search.boards = config.FILTER.RESOURCES.boards;
            $scope.search.searchTypeKeys = ['Courses', 'Resources'];
            $rootScope.search.sortingOptions = [{field: 'lastUpdatedOn', name: 'Updated On'}, {field: 'createdOn', name: 'Created On'}];
            $scope.search.sortBy = {'createdOn': 'asc'};
            $scope.search.searchSelectionKeys = [{id: 'Courses', name: 'Courses'}, {id: 'Resources', name: 'Resources'}, {id: 'All', name: 'All'}];
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
                    $scope.search.isSearchTypeKey = $scope.search.searchTypeKeys.includes($rootScope.search.selectedSearchKey);
                    $('#headerSearch').dropdown('set selected', $scope.search.isSearchTypeKey === true ? $rootScope.search.selectedSearchKey : 'All');
                    $('.content-search-filter').dropdown('clear');
                }, 0);

            });
            $rootScope.$on('initSearch', function (event, args) {
                $scope.search.initSearch();
            });

            $rootScope.search.selectFilter = function (filterType, value, $event) {
                $timeout(function () {
                    var itemIndex = $rootScope.search[filterType].indexOf(value);
                    if (itemIndex == -1) {
                        $rootScope.search[filterType].push(value);
                        $($event.target).addClass('active');
                    } else {
                        $rootScope.search[filterType].splice(itemIndex, 1);
                        $($event.target).removeClass('active');
                    }
                }, 0);

            }
            $rootScope.search.removeFilterSelection = function (filterType, value) {
                var itemIndex = $rootScope.search[filterType].indexOf(value);
                if (itemIndex != -1) {
                    $rootScope.search[filterType].splice(itemIndex, 1);
                }
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
            $scope.search.initSearch = function () {
                var searchParams = $stateParams;
                $rootScope.searchKey = $rootScope.search.selectedSearchKey = searchParams.type;
                $scope.curSearchText = $rootScope.search.searchKeyword = $rootScope.search.searchKeyword || searchParams.query;
                $rootScope.search.filters = JSON.parse(atob(searchParams.filters));
                $scope.search.sortBy = JSON.parse(atob(searchParams.sort));
                $rootScope.search.selectedLanguage = $rootScope.search.filters.language || [];
                $rootScope.search.selectedContentType = $rootScope.search.filters.contentType || [];
                $rootScope.search.selectedBoard = $rootScope.search.filters.board || [];
                $rootScope.search.selectedSubject = $rootScope.search.filters.subject || [];
                // $scope.search.sortBy=$scope.search.sortBy;
                $scope.search.searchRequest();
            };

            $rootScope.search.openCourseView = function (course, courseType) {
                var showLectureView = 'no';
                //  var params = { courseType: courseType, courseId: course.courseId || course.identifier, tocId: course.courseId || course.identifier, lectureView: showLectureView, progress: course.progress, total: course.total };
                var params = {courseType: courseType, courseId: course.courseId || course.identifier, tocId: course.courseId || course.identifier, lectureView: showLectureView, progress: course.progress, total: course.total, courseName: course.courseName || course.name, lastReadContentId: course.lastReadContentId};
                sessionService.setSessionData('COURSE_PARAMS', params);
                $state.go('Toc', params);
            };

            $rootScope.search.playContent = function (item) {
                if (item.mimeType === "application/vnd.ekstep.content-collection") {
                    $state.go('PreviewCollection', {Id: item.identifier, name: item.name})
                } else {
                    $state.go('Player', {content: item, contentName: item.name, contentId: item.identifier});
                }
            };

            $scope.search.setSearchText = function (searchText) {
                $rootScope.search.searchKeyword = searchText;
                $scope.search.searchRequest(false);
            }
            $scope.search.autoSuggestSearch = function () {
                if ($scope.search.autoSuggest && $rootScope.isSearchPage && $rootScope.search.searchKeyword.length > 2) {

                    $scope.search.handleSearch();
                }
            }
            $scope.search.keyUp = function () {
                clearTimeout($rootScope.search.typingTimer);
                $rootScope.search.typingTimer = setTimeout($scope.search.autoSuggestSearch, $rootScope.search.doneTypingInterval);
                //$scope.search.autoSuggest=true;
            };


            $scope.search.keyDown = function () {
                clearTimeout($rootScope.search.typingTimer);
            };

            $scope.search.searchRequest = function ($event) {
                clearTimeout($rootScope.search.typingTimer);
                if (!$event || $event.charCode == 13) {
                    $scope.search.autoSuggest = false;
                    if ($rootScope.search.searchKeyword != '' && $rootScope.isSearchPage) {
                        if ($rootScope.isSearchResultsPage && $rootScope.search.searchKeyword == $stateParams.query) {
                            $rootScope.search.loader = showLoaderWithMessage('', $rootScope.errorMessages.SEARCH.DATA.START);
                            $scope.search.handleSearch();
                        } else {
                            $scope.search.autoSuggest = false;
                            var searchParams = {
                                type: $rootScope.search.selectedSearchKey,
                                query: $rootScope.search.searchKeyword,
                                filters: btoa(JSON.stringify($rootScope.search.filters)),
                                sort: btoa(JSON.stringify($scope.search.sortBy))
                            };
                            //$state.go('Search', searchParams);
                            $location.path('search/' + searchParams.type + '/' + searchParams.query + '/' + searchParams.filters + '/' + searchParams.sort);
                        }
                    } else
                    {
                        $rootScope.$emit('initPageSearch', {});
                    }
                }

            }
            $scope.search.handleSearch = function () {
                var req = {
                    'query': $rootScope.search.searchKeyword,
                    'filters': $rootScope.search.filters,
                    'params': {
                        'cid': '12'
                    },
                    'limit': 20,
                    'sort_by': $scope.search.sortBy

                };

                if ($rootScope.search.selectedSearchKey == "Courses") {
                    $scope.search.searchFn = searchService.courseSearch(req);
                    $scope.search.resultType = 'course';
                } else if ($rootScope.search.selectedSearchKey == "Resources") {
                    $scope.search.searchFn = searchService.contentSearch(req);
                    $scope.search.resultType = 'content';
                }

                $scope.search.searchFn.then(function (res) {
                    $scope.curSearchText = $rootScope.search.searchKeyword;
                    if (res != null && res.responseCode === 'OK') {
                        $scope.search.autosuggest_data = [];
                        if ($scope.search.autoSuggest && $rootScope.search.searchKeyword != $stateParams.query) {
                            $scope.search.autosuggest_data = res.result[$scope.search.resultType];

                        } else
                        {
                            $scope.search.autosuggest_data = [];
                            $rootScope.search.loader.showLoader = false;

                            if (res.result.count == 0) {
                                $rootScope.search.error = showErrorMessage(true, $rootScope.errorMessages.SEARCH.DATA.NO_CONTENT, $rootScope.errorMessages.COMMON.INFO);
                            } else {
                                $rootScope.search.error = {};
                                $rootScope.search.searchResult = res.result;
                            }
                        }
                        $scope.search.autoSuggest = true;
                    } else {
                        $rootScope.search.loader.showLoader = false;
                        $rootScope.search.error = showErrorMessage(true, $rootScope.errorMessages.SEARCH.DATA.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                        throw new Error('');
                        $scope.search.autoSuggest = true;
                    }
                }).catch(function (e) {
                    $rootScope.search.loader.showLoader = false;
                    $rootScope.search.error = showErrorMessage(true, $rootScope.errorMessages.SEARCH.DATA.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                });

            }


            $rootScope.search.applyFilter = function () {
                $rootScope.search.filters['language'] = $rootScope.search.selectedLanguage ? $rootScope.search.selectedLanguage : [];
                $rootScope.search.filters['contentType'] = $rootScope.search.selectedContentType ? $rootScope.search.selectedContentType : [];
                $rootScope.search.filters['subject'] = $rootScope.search.selectedSubject ? $rootScope.search.selectedSubject : [];
                $rootScope.search.filters['board'] = $rootScope.search.selectedBoard ? $rootScope.search.selectedBoard : [];
                $rootScope.isSearchResultsPage = false;
                $scope.search.searchRequest();
            };
            $rootScope.search.resetFilter = function () {
                $rootScope.isSearchPage = false;
                $('.content-search-filter').dropdown('clear');
                $rootScope.search.selectedLanguage = [];
                $rootScope.search.selectedContentType = [];
                $rootScope.search.selectedSubject = [];
                $rootScope.search.selectedBoard = [];
                $rootScope.search.filters = {};
                $rootScope.isSearchResultsPage = false;
                $rootScope.isSearchPage = true;
                $scope.search.searchRequest();
                //$state.go($rootScope.search.selectedSearchKey);

            };
            $rootScope.search.applySorting = function () {
                var sortByField = $rootScope.search.sortByOption;
                $scope.search.sortBy = {};
                $scope.search.sortBy[sortByField] = ($rootScope.search.sortIcon === true) ? 'asc' : 'desc';
                $scope.search.searchRequest();
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