'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:ContentCtrl
 * @description
 * # ContentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ContentCtrl', function(contentService, courseService, $scope, $timeout, $rootScope, $stateParams, $state) {
        var content = this;

        content.keyword = '';
        content.filters = {};
        // content.filters = { 'status': ['Live'], 'contentType': ['Story', 'Worksheet', 'Game', 'Collection', 'TextBook'] };
        $scope.selectedSearchKey = $stateParams.searchKey;
        $timeout(function() {
            $('#headerSearchdd').dropdown('set selected', $scope.selectedSearchKey);
        });
        $scope.$watch('searchKey', function() {
            $scope.selectedSearchKey = $rootScope.searchKey;
            content.filters = {};
            content.keyword = '';
        });
        $scope.contentPlayer = {
            isContentPlayerEnabled: false
        };
        $scope.close = function() {
            $rootScope.searchResult = [];
        };

        content.languages = [
            'Bengali', 'English', 'Gujarati', 'Hindi', 'Kannada', 'Marathi', 'Punjabi', 'Tamil', 'Telugu'
        ];
        content.contentTypes = [
            'Story', 'Worksheet', 'Collections', 'Game', 'Plugin', 'Template'
        ];
        content.subjects = [
            'Maths', 'English', 'Hindi', 'Assamese', 'Bengali', 'Gujarati', 'Kannada', 'Malayalam', 'Marathi', 'Nepali', 'Oriya', 'Punjabi', 'Tamil', 'Telugu', 'Urdu'
        ];
        content.boards = [
            'NCERT', 'CBSE', 'ICSE', 'MSCERT'
        ];
        content.searchSelectionKeys = [{ id: 'Courses', name: 'Courses' }, { id: 'Resources', name: 'Resources' }];
        content.selectedLanguage = '';
        content.selectedContentType = '';
        content.selectedSubject = '';
        content.selectedBoard = '';
        content.autosuggest_data = { content: [] };
        content.listView = false;

        $scope.contentPlayer = {
            isContentPlayerEnabled: false
        };
        $rootScope.showIFrameContent = false;
        $rootScope.content = content;
        content.openCourseView = function(courseId) {
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
        content.handleSuccessResponse = function(successResponse, $event) {
            if (successResponse.result.count > 0) {
                //if $event is passed then search is to get only autosuggest else to get the content
                if ($event !== undefined && content.keyword !== '') {
                    content.autosuggest_data = $scope.selectedSearchKey === 'Courses' ?
                        successResponse.result.course :
                        successResponse.result.content;
                } else {
                    $rootScope.searchKey = $scope.selectedSearchKey;
                    content.autosuggest_data = [];
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

        content.searchContent = function($event) {
            content.enableLoader(true);

            var req = {
                'query': content.keyword,
                'filters': content.filters,
                'params': {
                    'cid': '12'
                },
                'limit': 20
            };
            // req.limit = 20;
            $rootScope.searchKeyword = content.keyword;
            if ($scope.selectedSearchKey === 'Resources') {
                contentService.search(req).then(function(res) {
                    content.enableLoader(false);
                    if (res != null && res.responseCode === 'OK') {
                        content.handleSuccessResponse(res, $event);
                    } else {
                        handleFailedResponse(res);
                    }
                }).catch(function(error) {
                    handleFailedResponse(error);
                });
            } else if ($scope.selectedSearchKey === 'Courses') {
                courseService.search(req).then(function(res) {
                    content.enableLoader(false);
                    if (res != null && res.responseCode === 'OK') {
                        content.handleSuccessResponse(res, $event);
                    } else {
                        handleFailedResponse(res);
                    }
                }).catch(function(error) {
                    handleFailedResponse(error);
                });
            }
        };

        content.applyFilter = function() {
            if (content.selectedLanguage) {
                content.filters['language'] = content.selectedLanguage;
            }
            if (content.selectedContentType) {
                content.filters['contentType'] = content.selectedContentType;
            }
            if (content.selectedSubject) {
                content.filters['subject'] = content.selectedSubject;
            }
            if (content.selectedBoard) {
                content.filters['board'] = content.selectedBoard;
            }
            content.keyword = $rootScope.searchKeyword;
            content.searchContent();
        };
        content.resetFilter = function() {
            $('.dropdown').dropdown('clear');
            content.filters = {};
            content.selectedLanguage = '';
            content.selectedContentType = '';
            content.selectedSubject = '';
            content.selectedBoard = '';
            content.keyword = $rootScope.searchKeyword;
            content.searchContent();
        };
        //to show/hide in-search loading bar
        content.enableLoader = function(isEnabled) {
            if (isEnabled) {
                $('#search-input-container').addClass('loading');
                content.autosuggest_data = [];
            } else {
                $('#search-input-container').removeClass('loading');
            }
        };
        // to apply star rating and more.. popup once content is ready
        content.loadRating = function() {
            $('.ui.rating')
                .rating({
                    maxRating: 5
                }).rating('disable', true);
            $('.popup-button').popup();
        };
        //if any item is selected from autosuggest search then set that as keyword
        content.setSearchText = function(text) {
            content.keyword = text;
            content.searchContent();
        };
    });