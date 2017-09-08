'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:LessonPlanController
 * @author Anuj Kumar Gupta
 * @description
 * # LessonPlanController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('LessonPlanController', ['contentService', '$timeout', '$state', 'config',
        '$rootScope', 'toasterService', function (contentService, $timeout, $state, config,
            $rootScope, toasterService) {
            var lessonPlan = this;
            lessonPlan.boards = config.DROPDOWN.COMMON.boards;
            lessonPlan.mediums = config.DROPDOWN.COMMON.medium;
            lessonPlan.subjects = config.DROPDOWN.COMMON.subjects;
            lessonPlan.grades = config.DROPDOWN.COMMON.grades;
            lessonPlan.showCreateLessonPlanModal = false;
            lessonPlan.isLessonPlanCreated = false;
            lessonPlan.userId = $rootScope.userId;
            lessonPlan.mimeType = 'application/vnd.ekstep.content-collection';
            lessonPlan.defaultName = 'Untitled lesson plan';
            lessonPlan.contentType = 'LessonPlan';
            lessonPlan.message = $rootScope.errorMessages.WORKSPACE;

            lessonPlan.hideCreateLessonPlanModal = function () {
                $('#createLessonPlanModal').modal('hide');
                $('#createLessonPlanModal').modal('hide others');
                $('#createLessonPlanModal').modal('hide dimmer');
            };

            lessonPlan.initializeModal = function () {
                lessonPlan.showCreateLessonPlanModal = true;
                $timeout(function () {
                    $('#boardDropDown').dropdown();
                    $('#mediumDropDown').dropdown();
                    $('#subjectDropDown').dropdown();
                    $('#gradeDropDown').dropdown();
                    $('#createLessonPlanModal').modal({
                        onHide: function () {
                            lessonPlan.data = {};
                            if (!lessonPlan.isLessonPlanCreated) {
                                $state.go('WorkSpace.ContentCreation');
                            }
                        }
                    }).modal('show');
                }, 10);
            };

            lessonPlan.createContent = function (requestData) {
                lessonPlan.loader = toasterService.loader('', lessonPlan.message.CREATE_LESSON_PLAN
                                                                        .START);
                contentService.create(requestData).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        lessonPlan.isLessonPlanCreated = true;
                        lessonPlan.showCreateLessonPlanModal = false;
                        lessonPlan.loader.showLoader = false;
                        lessonPlan.hideCreateLessonPlanModal();
                        lessonPlan.initEKStepCE(res.result.content_id);
                    } else {
                        lessonPlan.loader.showLoader = false;
                        toasterService.error(lessonPlan.message.CREATE_LESSON_PLAN.FAILED);
                    }
                }).catch(function () {
                    lessonPlan.loader.showLoader = false;
                    toasterService.error(lessonPlan.message.CREATE_LESSON_PLAN.FAILED);
                });
            };

            lessonPlan.saveMetaData = function (data) {
                var requestBody = angular.copy(data);
                requestBody.name = requestBody.name ? requestBody.name : lessonPlan.defaultName;
                requestBody.mimeType = lessonPlan.mimeType;
                requestBody.createdBy = lessonPlan.userId;
                requestBody.contentType = lessonPlan.contentType;
                var requestData = {
                    content: requestBody
                };
                lessonPlan.createContent(requestData);
            };

            lessonPlan.initEKStepCE = function (contentId) {
                var params = { contentId: contentId, type: lessonPlan.contentType };
                $state.go('CollectionEditor', params);
            };
        }]);
