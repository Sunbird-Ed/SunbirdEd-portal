'use strict';

angular.module('playerApp')

.controller('LearnCtrl', function(learnService, $log, $scope, $sessionStorage, $timeout, $state, $rootScope, sessionService, $location, $window, config) {
    var learn = this;
    var uid = $rootScope.userId ? $rootScope.userId : $window.localStorage.getItem('userId');
    $rootScope.searchResult = [];
    $scope.contentPlayer = {
        isContentPlayerEnabled: false
    };

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

    learn.openCourseView = function(course, courseType) {
        var showLectureView = 'no';
        var params = { courseType: courseType, courseId: course.contentId,tocId:course.courseId, lectureView: showLectureView, progress: course.progress, total: course.total };
        sessionService.setSessionData('COURSE_PARAMS', params);
        $rootScope.isPlayerOpen = true;
        $state.go('Toc', params);
    };

    learn.courses = function() {
        
        var api = 'enrollCourseApi';
        learn[api] = {};
        learn[api].loader = showLoaderWithMessage("", config.MESSAGES.COURSE.ENROLLED.START);

        learnService.enrolledCourses(uid).then(function(successResponse) {
                if (successResponse && successResponse.responseCode === 'OK') {
                    learn[api].loader.showLoader = false;
                    learn.enrolledCourses = successResponse.result.courses;
                    $rootScope.enrolledCourseIds = [];

                    var isEnrolled = learn.enrolledCourses.forEach(function(course) {
                        $rootScope.enrolledCourseIds.push(course.courseId);
                    });
                } else {
                learn[api].loader.showLoader = false;
            }
        })
        .catch(function (error) {
            learn[api].loader.showLoader = false;
        });
    };
    
    learn.courses();
    
    learn.otherSection = function() {
        var req = {
            'request': {
                'context': {
                    'userId': uid
                }
            }
        };
        var api = 'pageApi';
        learn[api] = {};
        learn[api].loader = showLoaderWithMessage("", config.MESSAGES.COURSE.PAGE_API.START);
        
        learnService.otherSections(req).then(function(successResponse) {
            if (successResponse && successResponse.responseCode === 'OK' && successResponse.result.response) {
                learn[api].loader.showLoader = false;
                learn.page = successResponse.result.response.sections;
            } else {
                learn[api].loader.showLoader = false;
            }
        })
        .catch(function (error) {
            learn[api].loader.showLoader = false;
        });
    };
    learn.otherSection();
});
