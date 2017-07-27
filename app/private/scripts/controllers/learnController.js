'use strict';

angular.module('playerApp').controller('LearnCtrl', function(learnService, $scope, $state, $rootScope, sessionService, config) {
  var learn = this;
  var uid = $rootScope.userId;
  //   $rootScope.searchResult = [];
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
    $rootScope.enrolledCourseIds[course.courseId || course.identifier] ? showLectureView = 'no' : showLectureView = 'yes';
    var params = { courseType: courseType, courseId: course.courseId || course.identifier, tocId: course.courseId || course.identifier, lectureView: showLectureView, progress: course.progress, total: $rootScope.enrolledCourseIds[course.courseId].leafNodesCount, courseName: course.courseName || course.name, lastReadContentId: course.lastReadContentId };
    sessionService.setSessionData('COURSE_PARAMS', params);
    $rootScope.isPlayerOpen = true;
    $state.go('Toc', params);
  };

  learn.courses = function() {

    var api = 'enrollCourseApi';
    learn[api] = {};
    learn[api].loader = showLoaderWithMessage("", $rootScope.errorMessages.Courses.ENROLLED.START);

    learnService.enrolledCourses(uid).then(function(successResponse) {
        if (successResponse && successResponse.responseCode === 'OK') {
          learn[api].loader.showLoader = false;
          $rootScope.enrolledCourses = successResponse.result.courses;
          $rootScope.enrolledCourseIds = $rootScope.arrObjsToObject($rootScope.enrolledCourses, 'courseId');
          learn.enrolledCourses = $rootScope.enrolledCourses;

        } else {
          learn[api].loader.showLoader = false;
          learn[api].error = showErrorMessage(true, $rootScope.errorMessages.Courses.ENROLLED.FAILED, $rootScope.errorMessages.COMMON.ERROR);
        }
      })
      .catch(function(error) {
        learn[api].loader.showLoader = false;
        learn[api].error = showErrorMessage(true, $rootScope.errorMessages.Courses.ENROLLED.FAILED, $rootScope.errorMessages.COMMON.ERROR);
      });
  };


  $rootScope.enrolledCourseIds ? learn.enrolledCourses = $rootScope.enrolledCourses : learn.courses();

});
