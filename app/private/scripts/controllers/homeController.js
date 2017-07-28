'use strict';
/**
 * @ngdoc function
 * @name playerApp.controller:communityController
 * @description
 * # communityController
 * Controller of the playerApp
 */
angular.module('playerApp')
  .controller('HomeController', function($state, learnService, $rootScope, sessionService, config, $scope, toasterService) {
    var homeCtrl = this;
    var uid = $rootScope.userId;

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

    homeCtrl.courses = function() {
      var api = 'enrollCourseApi';
      homeCtrl[api] = {};
      homeCtrl[api].loader = toasterService.loader("", $rootScope.errorMessages.HOME.ENROLLED.START);
      learnService.enrolledCourses(uid).then(function(successResponse) {
        if (successResponse && successResponse.responseCode !== 'OK') {
          homeCtrl[api].loader.showLoader = false;
          $rootScope.enrolledCourses = successResponse.result.courses;
          $rootScope.enrolledCourseIds = $rootScope.arrObjsToObject($rootScope.enrolledCourses, 'courseId');
          homeCtrl.enrolledCourses = $rootScope.enrolledCourses;
        } else {
          homeCtrl[api].loader.showLoader = false;
          toasterService.error($rootScope.errorMessages.HOME.ENROLLED.FAILED);
        }
      }).catch(function(error) {
        homeCtrl[api].loader.showLoader = false;
        toasterService.error($rootScope.errorMessages.HOME.ENROLLED.FAILED);
      });
    };
    $rootScope.enrolledCourseIds ? homeCtrl.enrolledCourses = $rootScope.enrolledCourses : homeCtrl.courses();

    homeCtrl.otherSection = function() {
      var req = {
        'request': {
          "recommendType": "course"
        }
      };
      var api = 'pageApi';
      homeCtrl[api] = {};
      homeCtrl[api].loader = toasterService.loader("", $rootScope.errorMessages.HOME.PAGE_API.START);
      learnService.recommendedCourses(req).then(function(successResponse) {
        if (successResponse && successResponse.responseCode === 'OK') {
          homeCtrl.recommendedCourse = successResponse.result.response;
          homeCtrl[api].loader.showLoader = false;
        } else {
          homeCtrl[api].loader.showLoader = false;
          toasterService.error($rootScope.errorMessages.HOME.PAGE_API.FAILED);
        }
      }).catch(function(error) {
        homeCtrl[api].loader.showLoader = false;
        toasterService.error($rootScope.errorMessages.HOME.PAGE_API.FAILED);
      });
    };
    //hide recommended temporarily
    // homeCtrl.otherSection();
    homeCtrl.openCourseView = function(course, courseType) {
      // courseId = 'do_112265805439688704113';
      var showLectureView = 'no';
      $rootScope.enrolledCourseIds[course.courseId || course.identifier] ? showLectureView = 'no' : showLectureView = 'yes';
      var params = { courseType: courseType, courseId: course.courseId || course.identifier, tocId: course.courseId || course.identifier, lectureView: showLectureView, progress: course.progress, total: course.total, courseRecordId: course.id, courseName: course.courseName || course.name, lastReadContentId: course.lastReadContentId };
      sessionService.setSessionData('COURSE_PARAMS', params);
      $state.go('Toc', params);
    };
  });
