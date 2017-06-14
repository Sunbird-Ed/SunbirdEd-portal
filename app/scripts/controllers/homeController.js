'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:communityController
 * @description
 * # communityController
 * Controller of the playerApp
 */
angular.module('playerApp')
        .controller('HomeController', function ($scope, learnService, $sessionStorage, $log) {

            var homeCtrl = this;
            var uid = $sessionStorage.userId;
            homeCtrl.loadCarousel = function () {
                $('.regular').not('.slick-initialized').slick({
                    infinite: false,
                    slidesToShow: 4,
                    slidesToScroll: 4
                });

                // $('.ui .progress').progress();

                $('.ui.rating')
                        .rating({
                            maxRating: 5
                        }).rating('disable', true);
            };
            homeCtrl.loadFeaturedCarousel = function () {
                
                $('.regular').not('.slick-initialized').slick({
                    infinite: false,
                    slidesToShow: 3,
                    slidesToScroll: 3
                });

                // $('.ui .progress').progress();

                $('.ui.rating')
                        .rating({
                            maxRating: 5
                        }).rating('disable', true);
            };
            
            homeCtrl.loadProgress = function () {
                $('course-progress').progress();
            };

            function handleFailedResponse(errorResponse) {
                var error = {};
                error.isError = true;
                error.message = '';
                error.responseCode = errorResponse.responseCode;
                homeCtrl.error = error;
                $timeout(function () {
                    $scope.error = {};
                }, 2000);
            }

            homeCtrl.courses = function () {
                $scope.loading = true;

                learnService.enrolledCourses(uid).then(function (successResponse) {
                    $scope.loading = false;
                    if (successResponse && successResponse.responseCode === 'OK') {
                        var course = successResponse.result.courses;
                        var addedCourse = new Array();
                        addedCourse.push(course[1]);
                        addedCourse.push(course[0]);
                        addedCourse.push(course[1]);
                        addedCourse.push(course[0]);
                        addedCourse.push(course[1]);
                        addedCourse.push(course[0]);
                        homeCtrl.toDoCourses = addedCourse;
                    } else {
                        $log.warn('enrolledCourses', successResponse);
                        handleFailedResponse(successResponse);
                    }
                })
                        .catch(function (error) {
                            $log.warn(error);
                            p;
                            handleFailedResponse(error);
                        });
            };
            homeCtrl.courses();
            homeCtrl.otherSection = function () {
                var req = {
                    'request': {
                        'context': {
                            'userId': 'user1'
                        }
                    }
                };
                learnService.otherSections(req).then(function (successResponse) {
                    if (successResponse && successResponse.responseCode === 'OK') {
                        
                        homeCtrl.recommendedCourse = successResponse.result.page.sections[1].course;
                        console.log(homeCtrl.recommendedCourse);
                    } else {
                        $log.warn('enrolledCourses', successResponse);
                        handleFailedResponse(successResponse);
                    }
                }).catch(function (error) {
                    $log.warn(error);
                    handleFailedResponse(error);
                });
            };
            homeCtrl.otherSection();



        });