'use strict';

angular.module('playerApp')
    .controller('SearchCourseCtrl', function(sessionService, searchService, $scope, $timeout, $rootScope, $stateParams, $state, $location) {
        var search = this;
        search.searchResult = [];
        search.initSearch = function() {
            search.searchRequest = JSON.parse($stateParams.query);
            search.searchType = $stateParams.searchType;
            search.searchQuery = search.searchRequest.query;
            console.log('search req', search.searchQuery);
        };

        //play course
        search.openCourseView = function(course, courseType) {
            var showLectureView = 'no';
            var params = { courseType: courseType, courseId: course.contentId, tocId: course.courseId, lectureView: showLectureView, progress: course.progress, total: course.total };
            sessionService.setSessionData('COURSE_PARAMS', params);
            $state.go('Toc', params);
        };

        // corseSearch
        search.handleCourseSearch = function(courses) {
            if (courses.result.response.length) {
                search.searchResult = courses.result.response;
            } else {
                courses.responseCode = 'RESOURCE_NOT_FOUND';
            }
        };
        // mainSearch
        search.search = function() {
            search.initSearch();
            var req = search.searchRequest;

            searchService.courseSearch(req).then(function(res) {
                if (res != null && res.responseCode === 'OK') {
                    search.handleCourseSearch(res);
                }
            }).catch(function(error) {
                handleFailedResponse(error);
            });
        };

        search.search();
    });