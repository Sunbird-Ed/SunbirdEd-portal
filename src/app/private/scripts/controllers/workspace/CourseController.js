'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:courseController
 * @author Harish Kumar Gangula
 * @description
 * # courseController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('CourseController', ['contentService', '$timeout', '$state', 'config', '$rootScope',
        'toasterService', function (contentService, $timeout, $state, config, $rootScope,
            toasterService) {
            var course = this;
            course.showCreateCourseModal = false;
            course.isCourseCreated = false;
            course.userId = $rootScope.userId;
            course.defaultName = 'Untitled Course';
            course.mimeType = 'application/vnd.ekstep.content-collection';
            course.contentType = 'Course';

            course.hideCreateCourseModal = function () {
                $('#createCourseModal').modal('hide');
                $('#createCourseModal').modal('hide others');
                $('#createCourseModal').modal('hide dimmer');
            };

            course.initializeModal = function () {
                course.showCreateCourseModal = true;
                $timeout(function () {
                    $('#createCourseModal').modal({
                        onHide: function () {
                            course.data = {};
                            if (!course.isCourseCreated) {
                                $state.go('WorkSpace.ContentCreation');
                            }
                        }
                    }).modal('show');
                }, 10);
            };

            course.createContent = function (requestData) {
                course.loader = toasterService.loader('', $rootScope.errorMessages.WORKSPACE
                                                                    .CREATE_COURSE.START);
                contentService.create(requestData).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        course.isCourseCreated = true;
                        course.showCreateCourseModal = false;
                        course.loader.showLoader = false;
                        course.hideCreateCourseModal();
                        course.initEKStepCE(res.result.content_id);
                    } else {
                        course.loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.WORKSPACE.CREATE_COURSE
                                                                                .FAILED);
                    }
                }).catch(function () {
                    course.loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.WORKSPACE.CREATE_COURSE.FAILED);
                });
            };

            course.saveMetaData = function (data) {
                var requestBody = angular.copy(data);
                requestBody.name = requestBody.name ? requestBody.name : course.defaultName;
                requestBody.mimeType = course.mimeType;
                requestBody.createdBy = course.userId;
                requestBody.contentType = course.contentType;

                var requestData = {
                    content: requestBody
                };
                course.createContent(requestData);
            };

            course.initEKStepCE = function (contentId) {
                var params = { contentId: contentId, type: 'Course' };
                $state.go('CollectionEditor', params);
            };
        }]);
