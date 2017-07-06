'use strict';

angular.module('playerApp')
        .controller('resourceCtrl', function ($log, $scope, $state, $rootScope, $sessionStorage, $timeout, config,sessionService) {
            var resource = this;
            resource.contentPlayer = {
                isContentPlayerEnabled: false
            };
            $rootScope.searchResult = [];
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

            resource.playContent = function (item) {
                var params = {content: item, contentName: item.name, contentId: item.identifier};
                $state.go('Player', params);
            };

          
            
            resource.openCourseView = function (course, courseType) {
                // courseId = 'do_112265805439688704113';
                var showLectureView = 'no';
                var params = {courseType: courseType, courseId: course.contentId, tocId: course.courseId, lectureView: showLectureView, progress: course.progress, total: course.total,courseRecordId:course.id,courseName:course.courseName};
                sessionService.setSessionData('COURSE_PARAMS', params);
                $state.go('Toc', params);
            };
        });