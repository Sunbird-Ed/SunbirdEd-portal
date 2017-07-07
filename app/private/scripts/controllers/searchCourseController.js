'use strict';

angular.module('playerApp')
    .controller('SearchCourseCtrl', function(config, sessionService, searchService, $scope, $timeout, $rootScope, $stateParams, $state) {
        var search = this;
        search.searchResult = [];
        search.initSearch = function() {
            search.searchRequest = JSON.parse($stateParams.query);
            search.searchType = $stateParams.searchType;
            search.searchQuery = search.searchRequest.query;
            console.log('search req', search.searchQuery);
        };
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

        //play course
        search.openCourseView = function(course, courseType) {
            var showLectureView = 'no';
            var params = { courseType: courseType, courseId: course.identifier, tocId: course.identifier, lectureView: showLectureView, progress: course.progress, total: course.total };
            sessionService.setSessionData('COURSE_PARAMS', params);
            $state.go('Toc', params);
        };

        // corseSearch
        search.handleCourseSearch = function(courses) {
            if (courses.result.course && courses.result.course.length) {
                search.searchResult = courses.result.course;
            } else {
                search.error = showErrorMessage(true, config.MESSAGES.SEARCH.COURSE.NO_RESULT, config.MESSAGES.COMMON.INFO);
            }
        };
        // mainSearch
        search.search = function() {
            search.initSearch();
            var req = search.searchRequest;
            search.loader = showLoaderWithMessage('', config.MESSAGES.SEARCH.COURSE.START);
            searchService.courseSearch(req).then(function(res) {
                search.loader.showLoader = false;
                if (res != null && res.responseCode === 'OK') {
                    search.handleCourseSearch(res);
                } else throw new Error('');
            }).catch(function() {
                search.loader.showLoader = false;
                search.error = showErrorMessage(true, config.MESSAGES.SEARCH.COURSE.FAILED, config.MESSAGES.COMMON.ERROR);
            });
        };
        // /close
        search.close = function() {
            $state.go('Courses');
        };
        search.search();
    });