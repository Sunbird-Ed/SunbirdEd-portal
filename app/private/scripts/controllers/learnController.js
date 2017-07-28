'use strict';

angular.module('playerApp')
    .controller('LearnCtrl', function (learnService, $scope, $state, $rootScope,
         sessionService) {
        var learn = this;
        var uid = $rootScope.userId;
    //   $rootScope.searchResult = [];
        $scope.contentPlayer = {
            isContentPlayerEnabled: false
        };

        function showLoaderWithMessage(headerMessage, loaderMessage) {
            var loader = {};
            loader.showLoader = true;
            loader.headerMessage = headerMessage;
            loader.loaderMessage = loaderMessage;
            return loader;
        }

        function showErrorMessage(isClose, message, messageType) {
            var error = {};
            error.showError = true;
            error.isClose = isClose;
            error.message = message;
            error.messageType = messageType;
            return error;
        }

        learn.openCourseView = function (course, courseType) {
            var showLectureView = 'no';
            $rootScope.enrolledCourseIds[course.courseId || course.identifier] ? showLectureView = 'no' : showLectureView = 'yes'; //eslint-disable-line

            var params = {
                courseType: courseType,
                courseId: course.courseId || course.identifier,
                tocId: course.courseId || course.identifier,
                lectureView: showLectureView,
                progress: course.progress,
                total:
                $rootScope.enrolledCourseIds[course.courseId].leafNodesCount,
                courseName: course.courseName || course.name,
                lastReadContentId: course.lastReadContentId
            };

            sessionService.setSessionData('COURSE_PARAMS', params);
            $rootScope.isPlayerOpen = true;
            $state.go('Toc', params);
        };

        learn.courses = function () {
            var api = 'enrollCourseApi';
            learn[api] = {};
            learn[api].loader = showLoaderWithMessage('', $rootScope
                .errorMessages.Courses.ENROLLED.START);

            learnService.enrolledCourses(uid).then(function (successResponse) {
                if (successResponse && successResponse.responseCode === 'OK') {
                    learn[api].loader.showLoader = false;
                    $rootScope.enrolledCourses = successResponse.result.courses;
                    $rootScope.enrolledCourseIds = $rootScope
                    .arrObjsToObject($rootScope.enrolledCourses, 'courseId');
                    learn.enrolledCourses = $rootScope.enrolledCourses;
                } else {
                    learn[api].loader.showLoader = false;
                    learn[api].error
                    = showErrorMessage(true,
                        $rootScope.errorMessages.Courses.ENROLLED.FAILED,
                        $rootScope.errorMessages.COMMON.ERROR);
                }
            })
                .catch(function () {
                    learn[api].loader.showLoader = false;
                    learn[api].error = showErrorMessage(
                        true, $rootScope.errorMessages.Courses.ENROLLED.FAILED,
                        $rootScope.errorMessages.COMMON.ERROR);
                });
        };

        if ($rootScope.enrolledCourseIds) {
            learn.enrolledCourses = $rootScope.enrolledCourses;
        } else {
            learn.courses();
        }
    });
