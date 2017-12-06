'use strict'

angular.module('playerApp')
  .controller('LearnCtrl', ['learnService', '$scope', '$state', '$rootScope',
    'sessionService', 'toasterService', function (learnService, $scope, $state, $rootScope,
      sessionService, toasterService) {
      var learn = this
      var uid = $rootScope.userId
      //   $rootScope.searchResult = [];
      $scope.contentPlayer = {
        isContentPlayerEnabled: false
      }
      learn.openCourseView = function (course, courseType) {
        $rootScope.search.searchKeyword = ''
        var showLectureView = 'no'
            $rootScope.enrolledCourseIds[course.courseId || course.identifier] ? showLectureView = 'no' : showLectureView = 'yes'; //eslint-disable-line

        var params = {
          courseType: courseType,
          courseId: course.courseId || course.identifier,
          lectureView: showLectureView,
          progress: course.progress,
          total:
                $rootScope.enrolledCourseIds[course.courseId].leafNodesCount,
          courseName: course.courseName || course.name,
          lastReadContentId: course.lastReadContentId
        }

        sessionService.setSessionData('COURSE_PARAMS', params)
        $rootScope.isPlayerOpen = true
        $state.go('Toc', params)
      }

      learn.courses = function () {
        var api = 'enrollCourseApi'
        learn[api] = {}
        learn[api].loader = toasterService.loader('', $rootScope.messages.stmsg.m0001)

        learnService.enrolledCourses(uid).then(function (successResponse) {
          if (successResponse && successResponse.responseCode === 'OK') {
            learn[api].loader.showLoader = false
            $rootScope.enrolledCourses = successResponse.result.courses
            $rootScope.enrolledCourseIds = $rootScope
              .arrObjsToObject($rootScope.enrolledCourses, 'courseId')
            learn.enrolledCourses = $rootScope.enrolledCourses
          } else {
            learn[api].loader.showLoader = false
            toasterService.error(
              $rootScope.messages.fmsg.m0001)
          }
        })
          .catch(function () {
            learn[api].loader.showLoader = false
            toasterService.error(
              $rootScope.messages.fmsg.m0001)
          })
      }
      if ($rootScope.enrolledCourseIds &&
                !_.isEmpty($rootScope.enrolledCourseIds)) {
        learn.enrolledCourses = $rootScope.enrolledCourses
      } else {
        learn.courses()
      }
    }])
