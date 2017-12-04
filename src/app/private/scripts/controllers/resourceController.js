'use strict'

angular.module('playerApp')
        .controller('resourceCtrl', ['$state', 'sessionService', function ($state, sessionService) {
          var resource = this
          resource.contentPlayer = {
            isContentPlayerEnabled: false
          }

          resource.playContent = function (item) {
            var params = {
              content: item,
              contentName: item.name,
              contentId: item.identifier
            }
            $state.go('Player', params)
          }

          resource.openCourseView = function (course, courseType) {
                // courseId = 'do_112265805439688704113';
            var showLectureView = 'no'
            var params = {
              courseType: courseType,
              courseId: course.courseId || course.identifier,
              lectureView: showLectureView,
              progress: course.progress,
              total: course.total,
              courseRecordId: course.id,
              courseName: course.courseName
            }
            sessionService.setSessionData('COURSE_PARAMS', params)
            $state.go('Toc', params)
          }
        }])
