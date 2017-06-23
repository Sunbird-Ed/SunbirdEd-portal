'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:communityController
 * @description
 * # communityController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('HomeController', function($scope, $state, learnService, $sessionStorage, $log, $timeout, $rootScope, sessionService, $window) {
        var homeCtrl = this;
        var uid = $rootScope.userId ? $rootScope.userId : $window.localStorage.getItem('userId');
        homeCtrl.loadCarousel = function() {
            $('.ui .progress .course-progress').progress();
            $('.ui.rating')
                .rating({
                    maxRating: 5
                }).rating('disable', true);
        };
        homeCtrl.loadFeaturedCarousel = function() {
            $('.ui.rating')
                .rating({
                    maxRating: 5
                }).rating('disable', true);
        };

        function handleFailedResponse(errorResponse) {
            var error = {};
            error.isError = true;
            error.message = '';
            error.responseCode = errorResponse.responseCode;
            homeCtrl.error = error;
            $timeout(function() {
                $scope.error = {};
            }, 2000);
        }

        homeCtrl.courses = function() {
            $scope.loading = true;

            learnService.enrolledCourses(uid).then(function(successResponse) {
                    $scope.loading = false;
                    if (successResponse && successResponse.responseCode === 'OK') {
                        homeCtrl.enrolledCourses = successResponse.result.courses;
                        $rootScope.enrolledCourseIds = [];

                        var isEnrolled = homeCtrl.enrolledCourses.forEach(function(course) {
                            $rootScope.enrolledCourseIds.push(course.courseId);
                        });
                    } else {
                        $log.warn('enrolledCourses', successResponse);
                        handleFailedResponse(successResponse);
                    }
                })
                .catch(function(error) {
                    $log.warn(error);

                    handleFailedResponse(error);
                });
        };
        homeCtrl.courses();

        homeCtrl.otherSection = function() {
            var req = {
                'request': {
                    'context': {
                        'userId': 'user1'
                    }
                }
            };
            learnService.otherSections(req).then(function(successResponse) {
                if (successResponse && successResponse.responseCode === 'OK') {
                    homeCtrl.recommendedCourse = successResponse.result.page.sections[1].course;
                    console.log(homeCtrl.recommendedCourse);
                } else {
                    handleFailedResponse(successResponse);
                }
            }).catch(function(error) {
                $log.warn(error);
                handleFailedResponse(error);
            });
        };
        homeCtrl.otherSection();

        homeCtrl.openCourseView = function(courseId, courseType, courseProgress, courseTotal) {
            // courseId = 'do_112265805439688704113';
            var showLectureView = 'no';
            var params = { courseType: courseType, courseId: courseId, lectureView: showLectureView, progress: courseProgress, total: courseTotal };
            sessionService.setSessionData('COURSE_PARAMS', params);
            $state.go('Toc', params);
        };
    });