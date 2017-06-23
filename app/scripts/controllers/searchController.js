'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('SearchCtrl', function(searchService, $scope, $timeout, $rootScope, $stateParams, $state) {
        var search = this;
        search.keyword = '';
        search.filters = {};
        search.sortBy = {};
        $scope.selectedSearchKey = $stateParams.searchKey;
        $timeout(function() {
            $('#headerSearchdd').dropdown('set selected', $scope.selectedSearchKey);
        });
        $scope.$watch('searchKey', function() {
            $scope.selectedSearchKey = $rootScope.searchKey;
            search.keyword = '';
            search.filters = {};
        });
        $scope.contentPlayer = {
            isContentPlayerEnabled: false
        };
        $scope.close = function() {
            $rootScope.searchResult = [];
        };

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

        search.searchSelectionKeys = [{ id: 'Courses', name: 'Courses' }, { id: 'Resources', name: 'Resources' }];
        search.selectedLanguage = '';
        search.selectedContentType = '';
        search.selectedSubject = '';
        search.selectedBoard = '';
        search.selectedOrder = '';
        search.orderBy = {};
        search.autosuggest_data = { content: [] };
        search.listView = false;
        search.sortIcon = true;
        $scope.contentPlayer = {
            isContentPlayerEnabled: false
        };
        $rootScope.showIFrameContent = false;
        $rootScope.search = search;
        search.openCourseView = function(courseId) {
            var isEnrolledCourse = $rootScope.enrolledCourseIds.some(function(id) {
                return id === courseId;
            });
            var courseType = isEnrolledCourse === true ? 'ENROLLED_COURSE' : 'OTHER_COURSE';
            var showLectureView = 'no';
            var params = {
                courseType: courseType,
                courseId: courseId,
                lectureView: showLectureView
            };
            $state.go('Toc', params);
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
        search.handleSuccessResponse = function(successResponse, $event) {
            if (successResponse.result.count > 0) {
                //if $event is passed then search is to get only autosuggest else to get the content
                if ($event !== undefined && search.keyword !== '') {
                    search.autosuggest_data = $scope.selectedSearchKey === 'Courses' ?
                        successResponse.result.course :
                        successResponse.result.content;
                } else {
                    $rootScope.searchKey = $scope.selectedSearchKey;
                    search.autosuggest_data = [];
                    $rootScope.searchResult = $scope.selectedSearchKey === 'Courses' ?
                        successResponse.result.course :
                        successResponse.result.content;
                }
            } else {
                $rootScope.searchResult = [];

                successResponse.responseCode = 'RESOURCE_NOT_FOUND';
                handleFailedResponse(successResponse);
            }
        };

        search.searchContent = function($event) {
            search.enableLoader(true);
            var req = {
                'query': search.keyword,
                'filters': search.filters,
                'params': {
                    'cid': '12'
                },
                'limit': 20,
                'sort_by': search.sortBy
            };
            // req.limit = 20;
            $rootScope.searchKeyword = search.keyword;
            $rootScope.searchFilters = search.filters;
            if ($scope.selectedSearchKey === 'Resources') {
                searchService.contentSearch(req).then(function(res) {
                    search.enableLoader(false);
                    if (res != null && res.responseCode === 'OK') {
                        search.handleSuccessResponse(res, $event);
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
                        search.handleSuccessResponse(res, $event);
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
            search.keyword = $rootScope.searchKeyword;
            search.filters = $rootScope.searchFilters;
            var sortByField = search.sortByOption.field;

            search.sortBy[sortByField] = (search.sortIcon === true) ? 'asc' : 'desc';
            search.searchContent();
        };
        search.resetFilter = function() {
            $('.dropdown').dropdown('clear');
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
    });