'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:communityController
 * @description
 * # communityController
 * Controller of the playerApp
 */
angular.module('playerApp')
        .controller('HomeController', function ($scope, $state, learnService, $sessionStorage, $log, $timeout, $rootScope, sessionService, $window, config) {
            var homeCtrl = this;
            var uid = $rootScope.userId ? $rootScope.userId : $window.localStorage.getItem('userId');
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
                homeCtrl[api].loader = showLoaderWithMessage("", config.MESSAGES.HOME.ENROLLED.START);

                learnService.enrolledCourses(uid).then(function (successResponse) {

                    if (successResponse && successResponse.responseCode === 'OK') {
                        homeCtrl[api].loader.showLoader = false;
                        homeCtrl.enrolledCourses = successResponse.result.courses;
                        $rootScope.enrolledCourseIds = [];

                        var isEnrolled = homeCtrl.enrolledCourses.forEach(function (course) {
                            $rootScope.enrolledCourseIds.push(course.courseId);
                        });
                    } else {
                        homeCtrl[api].loader.showLoader = false;
                        homeCtrl[api].error = showErrorMessage(true, config.MESSAGES.HOME.ENROLLED.FAILED, config.MESSAGES.COMMON.ERROR);
                    }
                })
                .catch(function (error) {
                    homeCtrl[api].loader.showLoader = false;
                    homeCtrl[api].error = showErrorMessage(true, config.MESSAGES.HOME.ENROLLED.FAILED, config.MESSAGES.COMMON.ERROR);
                });
            };
            homeCtrl.courses();

            homeCtrl.otherSection = function () {
                var req = {
                    'request': {
                        'context': {
                            'userId': uid
                        }
                    }
                };
                var api = 'pageApi';
                homeCtrl[api] = {};
                homeCtrl[api].loader = showLoaderWithMessage("", config.MESSAGES.HOME.PAGE_API.START);
                learnService.otherSections(req).then(function (successResponse) {
                    if (successResponse && successResponse.responseCode === 'OK') {
                        homeCtrl.recommendedCourse = successResponse.result.response.sections[0].contents.response;
                        homeCtrl[api].loader.showLoader = false;
                    } else {
                        homeCtrl[api].loader.showLoader = false;
                        homeCtrl[api].error = showErrorMessage(true, config.MESSAGES.HOME.PAGE_API.FAILED, config.MESSAGES.COMMON.ERROR);
                    }
                })
                .catch(function (error) {
                    homeCtrl[api].loader.showLoader = false;
                    homeCtrl[api].error = showErrorMessage(true, config.MESSAGES.HOME.PAGE_API.FAILED, config.MESSAGES.COMMON.ERROR);
                });
            };
            homeCtrl.otherSection();

            homeCtrl.openCourseView = function (course, courseType) {
                // courseId = 'do_112265805439688704113';
                var showLectureView = 'no';
                var params = {courseType: courseType, courseId: course.contentId, tocId: course.courseId, lectureView: showLectureView, progress: course.progress, total: course.total};
                sessionService.setSessionData('HOME_PARAMS', params);
                $state.go('Toc', params);
            };
        });