'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:ContentLessonController
 * @author Anuj Gupta
 * @description
 * # ContentLessonController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ContentLessonController', function (contentService, $timeout,
        $state, config, $rootScope, ToasterService) {
        var contentLesson = this;
        contentLesson.lessonTypes = config.DROPDOWN.COMMON.lessonTypes;
        contentLesson.audiences = config.DROPDOWN.COMMON.audiences;
        contentLesson.languages = config.DROPDOWN.COMMON.languages;
        contentLesson.grades = config.DROPDOWN.COMMON.grades;
        contentLesson.ageGroup = config.DROPDOWN.COMMON.ageGroup;
        contentLesson.mediums = config.DROPDOWN.COMMON.medium;
        contentLesson.subjects = config.DROPDOWN.COMMON.subjects;
        contentLesson.boards = config.DROPDOWN.COMMON.boards;
        contentLesson.showCreateSlideShowModal = false;
        contentLesson.slideShowCreated = false;
        contentLesson.userId = $rootScope.userId;
        contentLesson.accept = false;

        contentLesson.hideCreateSlideShowModal = function () {
            $('#createSlideShowModal')
                .modal('hide');
            $('#createSlideShowModal')
                .modal('hide others');
            $('#createSlideShowModal')
                .modal('hide dimmer');
        };

        contentLesson.initilizeView = function () {
            contentLesson.showCreateSlideShowModal = true;
            $timeout(function () {
                $('.multiSelectDropDown')
                    .dropdown();
                $('.singleSelectDropDown')
                    .dropdown();
                $('#createSlideShowModal').modal({
                    onHide: function () {
                        contentLesson.clearCreateSlideShowData();
                        if (!contentLesson.slideShowCreated) {
                            $state.go('WorkSpace.ContentCreation');
                        }
                    }
                }).modal('show');
            }, 10);
        };

        contentLesson.createContent = function (requestData) {
            contentService.create(requestData).then(function (res) {
                if (res && res.responseCode === 'OK') {
                    contentLesson.slideShowCreated = true;
                    contentLesson.showCreateSlideShowModal = false;
                    contentLesson.loader.showLoader = false;
                    contentLesson.hideCreateSlideShowModal();
                    contentLesson.initEKStepCE(res.result.content_id);
                } else {
                    contentLesson.loader.showLoader = false;
                    ToasterService.error($rootScope
                        .errorMessages.WORKSPACE.CREATE_LESSON.FAILED);
                }
            }).catch(function () {
                contentLesson.loader.showLoader = false;
                ToasterService.error($rootScope
                    .errorMessages.WORKSPACE.CREATE_LESSON.FAILED);
            });
        };

        contentLesson.saveMetaData = function (data) {
            contentLesson.loader = ToasterService.loader('', $rootScope
            .errorMessages.WORKSPACE.CREATE_LESSON.START);

            var requestBody = angular.copy(data);

            requestBody.mimeType = config.CreateLessonMimeType;
            requestBody.createdBy = contentLesson.userId;

            requestBody.name = requestBody.name
                ? requestBody.name : 'Untitled lesson';
            requestBody.contentType = requestBody.contentType
                ? requestBody.contentType : 'Story';

            var requestdata = {
                content: requestBody
            };
            contentLesson.createContent(requestdata);
        };

        contentLesson.clearCreateSlideShowData = function () {
            contentLesson.data = {};
        };

        contentLesson.initEKStepCE = function (contentId) {
            var params = { contentId: contentId };
            $state.go('ContentEditor', params);
        };
    });
