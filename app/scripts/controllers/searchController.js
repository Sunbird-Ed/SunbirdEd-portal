'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('SearchCtrl', function(sessionService, searchService, $scope, $timeout, $rootScope, $stateParams, $state, $location) {
        var search = this;
        search.initSearch = function() {
            search.query = $stateParams.query;
            search.searchType = $stateParams.searchType;
            // search.searchContent();
        };
        var currentState = $state.current.name;

        search.keyword = '';
        search.filters = {};
        search.sortBy = {};
        search.searchSelectionKeys = [{ id: 'Courses', name: 'Courses' }, { id: 'Resources', name: 'Resources' }, { id: 'All', name: 'All' }];
        search.languages = [
            'Bengali', 'English', 'Gujarati', 'Hindi', 'Kannada', 'Marathi', 'Punjabi', 'Tamil', 'Telugu'
        ];
        search.contentTypes = [
            'Story', 'Worksheet', 'Collections', 'Game', 'Plugin', 'Template'
        ];
        search.subjects = [
            'Maths', 'English', 'Hindi', 'Assamese', 'Bengali', 'Gujarati', 'Kannada', 'Malayalam', 'Marathi', 'Nepali', 'Oriya', 'Punjabi', 'Tamil', 'Telugu', 'Urdu'
        ];
        search.boards = [
            'NCERT', 'CBSE', 'ICSE', 'MSCERT'
        ];
        search.sortingOptions = [{ field: 'lastUpdatedOn', name: 'Updated On' }, { field: 'createdOn', name: 'Created On' }];

        search.selectedLanguage = '';
        search.selectedContentType = '';
        search.selectedSubject = '';
        search.selectedBoard = '';
        search.selectedOrder = '';
        search.orderBy = {};
        search.autosuggest_data = { content: [] };
        search.sortIcon = true;

        $rootScope.showIFrameContent = false;
        $rootScope.search = search;
        // $timeout(function() {
        //     $('#headerSearchdd').dropdown('set selected', $scope.selectedSearchKey.length ? $scope.selectedSearchKey : 'All');
        // });
        search.playContent = function(item) {
            var params = { content: item };
            $state.go('Player', params);
        };

        $scope.$watch('searchKey', function() {
            console.log('$rootScope.searchKey ', $rootScope.searchKey, 'current State', currentState);
            $scope.selectedSearchKey = $rootScope.searchKey;
            search.keyword = '';
            search.filters = {};
            $('#headerSearch').dropdown('set selected', $rootScope.searchKey ? $rootScope.searchKey : 'All');
        });
        search.contentPlayer = {
            isContentPlayerEnabled: false
        };

        function handleFailedResponse(errorResponse) {
            var isSearchError = {};
            isSearchError.isError = true;
            isSearchError.message = '';
            isSearchError.responseCode = errorResponse.responseCode;
            $rootScope.isSearchError = isSearchError;
            // $scope.$apply();
            $timeout(function() {
                $rootScope.isSearchError = {};
                isSearchError.isError = false;
            }, 2000);
        }
        search.handleContentSearch = function(contents, $event) {
            var params = { searchType: 'resources', query: search.searchQuery, searchKey: 'Resources' };
            if (contents.result.count > 0) {
                //if $event is passed then search is to get only autosuggest else to get the content
                if ($event !== undefined && search.keyword !== '') {
                    search.autosuggest_data =
                        contents.result.content;
                } else {
                    $rootScope.searchKey = $scope.selectedSearchKey;
                    search.autosuggest_data = [];

                    $state.go('Search', params);

                    $rootScope.searchResult = contents.result.content;
                }
            } else {
                $rootScope.searchResult = [];

                contents.responseCode = 'RESOURCE_NOT_FOUND';
                handleFailedResponse(contents);
            }
        };
        search.handleCourseSearch = function(courses, $event) {
            if (courses.result.response.length) {
                //if $event is passed then search is to get only autosuggest else to get the content
                if ($event !== undefined && search.keyword !== '') {
                    search.autosuggest_data = courses.result.response;
                } else {
                    $rootScope.searchKey = $scope.selectedSearchKey;
                    search.autosuggest_data = [];

                    $rootScope.searchResult = courses.result.response;
                    var params = { searchType: 'courses', query: 'query' };
                    $state.go('Search', params);
                }
            } else {
                $rootScope.searchResult = [];

                courses.responseCode = 'RESOURCE_NOT_FOUND';
                handleFailedResponse(courses);
            }
        };

        search.searchContent = function($event) {
            search.searchQuery = search.keyword ? search.keyword : search.query;
            search.enableLoader(true);
            var req = {
                'query': search.searchQuery,
                'filters': search.filters,
                'params': {
                    'cid': '12'
                },
                'limit': 20,
                'sort_by': search.sortBy
            };
            $rootScope.searchKeyword = search.keyword;
            $rootScope.searchFilters = search.filters;
            if ($scope.selectedSearchKey === 'Resources') {
                searchService.contentSearch(req).then(function(res) {
                    search.enableLoader(false);
                    if (res != null && res.responseCode === 'OK') {
                        search.handleContentSearch(res, $event);
                    } else {
                        handleFailedResponse(res);
                    }
                }).catch(function(error) {
                    handleFailedResponse(error);
                });
            } else if ($scope.selectedSearchKey === 'Courses') {
                searchService.courseSearch(req).then(function(res) {
                    search.enableLoader(false);
                    if (res != null && res.responseCode === 'OK') {
                        search.handleCourseSearch(res, $event);
                    } else {
                        handleFailedResponse(res);
                    }
                }).catch(function(error) {
                    handleFailedResponse(error);
                });
            }
        };

        search.applyFilter = function() {
            if (search.selectedLanguage) {
                search.filters['language'] = search.selectedLanguage;
            }
            if (search.selectedContentType) {
                search.filters['contentType'] = search.selectedContentType;
            }
            if (search.selectedSubject) {
                search.filters['subject'] = search.selectedSubject;
            }
            if (search.selectedBoard) {
                search.filters['board'] = search.selectedBoard;
            }

            search.keyword = $rootScope.searchKeyword;
            search.searchContent();
        };

        search.applySorting = function() {
            search.keyword = $rootScope.searchKeyword ? $rootScope.searchKeyword : '';
            search.filters = $rootScope.searchFilters ? $rootScope.searchFilters : {};
            var sortByField = search.sortByOption.field;

            search.sortBy[sortByField] = (search.sortIcon === true) ? 'asc' : 'desc';
            search.searchContent();
        };
        search.resetFilter = function() {
            $('.content-search-filter').dropdown('clear');
            search.filters = {};
            search.selectedLanguage = '';
            search.selectedContentType = '';
            search.selectedSubject = '';
            search.selectedBoard = '';
            search.keyword = $rootScope.searchKeyword;
            search.searchContent();
        };
        //to show/hide in-search loading bar
        search.enableLoader = function(isEnabled) {
            if (isEnabled) {
                $('#search-input-container').addClass('loading');
                search.autosuggest_data = [];
            } else {
                $('#search-input-container').removeClass('loading');
            }
        };
        // to apply star rating and more.. popup once content is ready
        search.loadRating = function() {
            $('.ui.rating')
                .rating({
                    maxRating: 5
                }).rating('disable', true);
            $('.popup-button').popup();
        };
        //if any item is selected from autosuggest search then set that as keyword
        search.setSearchText = function(text) {
            search.keyword = text;
            search.searchContent();
        };
        $('.search-dropdown').dropdown();

        search.ngInit = function() {
            search.keyword = $('#keyword').val();
            if (search.keyword) {
                search.searchContent();
            }
        };
        search.openCourseView = function(course, courseType) {
            var showLectureView = 'no';
            var params = { courseType: courseType, courseId: course.contentId, tocId: course.courseId, lectureView: showLectureView, progress: course.progress, total: course.total };
            sessionService.setSessionData('COURSE_PARAMS', params);
            $state.go('Toc', params);
        };
        $scope.close = function() {
            $rootScope.searchResult = [];
        };
    });