'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:CreateSlideShowController
 * @author Anuj Gupta
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ContentLessonController', function(contentService, $timeout, $state, config, $rootScope) {

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

        contentLesson.hideCreateSlideShowModal = function() {
            $('#createSlideShowModal')
                .modal('hide');
            $('#createSlideShowModal')
                .modal('hide others');
            $('#createSlideShowModal')
                .modal('hide dimmer');
        };

        contentLesson.initilizeView = function() {
            contentLesson.showCreateSlideShowModal = true;
            $timeout(function() {
                $('.multiSelectDropDown')
                    .dropdown();
                $('.singleSelectDropDown')
                    .dropdown();
                $('#createSlideShowModal').modal({
                    onHide: function() {
                        contentLesson.clearCreateSlideShowData();
                        if (!contentLesson.slideShowCreated) {
                            $state.go("WorkSpace.ContentCreation");
                        }
                    }
                }).modal('show');
            }, 10);
        };

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

        contentLesson.createContent = function(requestData, api) {

            contentService.create(requestData).then(function(res) {
                if (res && res.responseCode === "OK") {
                    contentLesson.slideShowCreated = true;
                    contentLesson.showCreateSlideShowModal = false;
                    contentLesson[api].loader.showLoader = false;
                    contentLesson.hideCreateSlideShowModal();
                    contentLesson.initEKStepCE(res.result.content_id);

                } else {
                    contentLesson[api].loader.showLoader = false;
                    contentLesson[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.CREATE_LESSON.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                }
            }).catch(function (error){
                contentLesson[api].loader.showLoader = false;
                contentLesson[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.CREATE_LESSON.FAILED, $rootScope.errorMessages.COMMON.ERROR);
            });
        };

        contentLesson.saveMetaData = function(data) {

            var api = 'createApi';
            contentLesson[api] = {};
            contentLesson[api].loader = showLoaderWithMessage("", $rootScope.errorMessages.WORKSPACE.CREATE_LESSON.START);

            var requestBody = angular.copy(data);

            requestBody.mimeType = config.CreateLessonMimeType;
            requestBody.createdBy = contentLesson.userId;

            requestBody.name = requestBody.name ? requestBody.name : "Untitled lesson";
            requestBody.contentType = requestBody.contentType ? requestBody.contentType : "Story";

            var requestdata = {
                "content": requestBody
            };
            contentLesson.createContent(requestdata, api);
        };

        contentLesson.clearCreateSlideShowData = function() {

            if (contentLesson.createApi) {
                contentLesson.createApi.error = {};
            }
            contentLesson.data = {};
        };

        contentLesson.initEKStepCE = function(contentId) {
            var params = { contentId: contentId };
            $state.go("ContentEditor", params);
        };
    });
