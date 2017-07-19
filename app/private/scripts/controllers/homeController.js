'use strict';
/**
 * @ngdoc function
 * @name playerApp.controller:communityController
 * @description
 * # communityController
 * Controller of the playerApp
 */
angular.module('playerApp')
        .controller('HomeController', function ($state, learnService, $rootScope, sessionService, config, $scope) {
            var homeCtrl = this;
            var uid = $rootScope.userId;
            if ($rootScope.accessDenied) {
                homeCtrl.roleAccessError = {};
                homeCtrl.roleAccessError.error = showErrorMessage(true, $rootScope.accessDenied, $rootScope.errorMessages.COMMON.ERROR);
            }

            $scope.$watch("homeCtrl.roleAccessError.error.showError", function () {
                $rootScope.accessDenied = null;
            });

            homeCtrl.loadCarousel = function () {
                $('.ui .progress .course-progress').progress();
                $('.ui.rating')
                        .rating({
                            maxRating: 5
                        }).rating('disable', true);
            };
            homeCtrl.loadFeaturedCarousel = function () {
                $('.ui.rating')
                        .rating({
                            maxRating: 5
                        }).rating('disable', true);
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

            homeCtrl.courses = function () {
                var api = 'enrollCourseApi';
                homeCtrl[api] = {};
                homeCtrl[api].loader = showLoaderWithMessage("", $rootScope.errorMessages.HOME.ENROLLED.START);
                learnService.enrolledCourses(uid).then(function (successResponse) {
                    if (successResponse && successResponse.responseCode === 'OK') {
                        homeCtrl[api].loader.showLoader = false;
                        $rootScope.enrolledCourses = successResponse.result.courses;
                        $rootScope.enrolledCourseIds = $rootScope.arrObjsToObject($rootScope.enrolledCourses, 'courseId');
                        homeCtrl.enrolledCourses = $rootScope.enrolledCourses;
                    } else {
                        homeCtrl[api].loader.showLoader = false;
                        homeCtrl[api].error = showErrorMessage(true, $rootScope.errorMessages.HOME.ENROLLED.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                    }
                })
                        .catch(function (error) {
                            homeCtrl[api].loader.showLoader = false;
                            homeCtrl[api].error = showErrorMessage(true, $rootScope.errorMessages.HOME.ENROLLED.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                        });
            };
            $rootScope.enrolledCourseIds ? homeCtrl.enrolledCourses = $rootScope.enrolledCourses : homeCtrl.courses();

            homeCtrl.otherSection = function () {
                var req = {
                    'request': {
                        "recommendType": "course"
                    }
                };
                var api = 'pageApi';
                homeCtrl[api] = {};
                homeCtrl[api].loader = showLoaderWithMessage("", $rootScope.errorMessages.HOME.PAGE_API.START);
                learnService.recommendedCourses(req).then(function (successResponse) {
                    if (successResponse && successResponse.responseCode === 'OK') {
                        homeCtrl.recommendedCourse = successResponse.result.response;
                        homeCtrl[api].loader.showLoader = false;
                    } else {
                        homeCtrl[api].loader.showLoader = false;
                        homeCtrl[api].error = showErrorMessage(true, $rootScope.errorMessages.HOME.PAGE_API.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                    }
                })
                        .catch(function (error) {
                            homeCtrl[api].loader.showLoader = false;
                            homeCtrl[api].error = showErrorMessage(true, $rootScope.errorMessages.HOME.PAGE_API.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                        });
            };
            homeCtrl.otherSection();
            homeCtrl.openCourseView = function (course, courseType) {
                // courseId = 'do_112265805439688704113';
                var showLectureView = 'no';
                var params = {courseType: courseType, courseId: course.courseId || course.identifier, tocId: course.courseId || course.identifier, lectureView: showLectureView, progress: course.progress, total: course.total, courseRecordId: course.id, courseName: course.courseName || course.name, lastReadContentId: course.lastReadContentId};
                sessionService.setSessionData('COURSE_PARAMS', params);
                $state.go('Toc', params);
            };
        });
