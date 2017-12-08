'use strict'

angular.module('playerApp')
  .controller('HomeController', ['$state', 'learnService', '$rootScope',
    'sessionService', 'toasterService',
    function ($state, learnService, $rootScope,
      sessionService, toasterService) {
      var homeCtrl = this

      homeCtrl.loadCarousel = function () {
        $('.ui .progress .course-progress').progress()
        $('.ui.rating')
          .rating({
            maxRating: 5
          }).rating('disable', true)
      }
      homeCtrl.loadFeaturedCarousel = function () {
        $('.ui.rating')
          .rating({
            maxRating: 5
          }).rating('disable', true)
      }
      homeCtrl.getToDoList = function () {
        $rootScope.toDoList = []
        // if profile is incomplete append profile update details to ToDo list
        if ($rootScope.profileCompleteness < 100) {
          $rootScope.toDoList = [{
            title: $rootScope.messages.stmsg.m0060,
            missingFields: $rootScope.profileMissingFields,
            value: $rootScope.profileCompleteness,
            type: 'profile'
          }]
        }
        // merge todo list with enrolled courses (both are to be shown in TO-DO section
        Array.prototype.push.apply($rootScope.toDoList, $rootScope.enrolledCourses)
      }

      homeCtrl.otherSection = function () {
        var req = {
          request: {
            recommendType: 'course'
          }
        }
        var api = 'pageApi'
        homeCtrl[api] = {}
        homeCtrl[api].loader = toasterService.loader(
          '', $rootScope.messages.stmsg.m0002)
        learnService.recommendedCourses(req)
          .then(function (successResponse) {
            if (successResponse && successResponse.responseCode === 'OK') {
              homeCtrl.recommendedCourse = successResponse.result.response
              homeCtrl[api].loader.showLoader = false
            } else {
              homeCtrl[api].loader.showLoader = false
              toasterService.error(
                $rootScope.messages.fmsg.m0002)
            }
          }).catch(function () {
            homeCtrl[api].loader.showLoader = false
            toasterService.error(
              $rootScope.messages.fmsg.m0002)
          })
      }
      // hide recommended temporarily
      // homeCtrl.otherSection();
      homeCtrl.openCourseView = function (course, courseType) {
      // courseId = 'do_112265805439688704113';
        var showLectureView = 'no'
        if ($rootScope.enrolledCourseIds[course.courseId || course.identifier]) {
          showLectureView = 'no'
        } else {
          showLectureView = 'yes'
        }
        var params = { courseType: courseType,
          courseId: course.courseId || course.identifier,
          lectureView: showLectureView,
          progress: course.progress,
          total: course.total,
          courseRecordId: course.id,
          courseName: course.courseName || course.name,
          lastReadContentId: course.lastReadContentId }
        sessionService.setSessionData('COURSE_PARAMS', params)
        $state.go('Toc', params)
      }
    }])
