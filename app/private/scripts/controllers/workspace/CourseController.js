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
    .controller('CourseController', function(contentService, $timeout, $state, config, $rootScope) {

        var course = this;
        course.lessonTypes = config.DROPDOWN.COMMON.lessonTypes;
        course.audiences = config.DROPDOWN.COMMON.audiences;
        course.languages = config.DROPDOWN.COMMON.languages;
        course.grades = config.DROPDOWN.COMMON.grades;
        course.ageGroup = config.DROPDOWN.COMMON.ageGroup;
        course.mediums = config.DROPDOWN.COMMON.medium;
        course.subjects = config.DROPDOWN.COMMON.subjects;
        course.boards = config.DROPDOWN.COMMON.boards;
        course.showCreateSlideShowModal = false;
        course.slideShowCreated = false;
        course.userId = $rootScope.userId;
        course.accept = false;

        course.hideCreateSlideShowModal = function() {
            $('#createSlideShowModal')
                .modal('hide');
            $('#createSlideShowModal')
                .modal('hide others');
            $('#createSlideShowModal')
                .modal('hide dimmer');
        };

        course.initilizeView = function() {
            course.showCreateSlideShowModal = true;
            $timeout(function() {
                $('.multiSelectDropDown')
                    .dropdown();
                $('.singleSelectDropDown')
                    .dropdown();
                $('#createSlideShowModal').modal({
                    onHide: function() {
                        course.clearCreateSlideShowData();
                        if (!course.slideShowCreated) {
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

        course.createContent = function(requestData, api) {

            contentService.create(requestData).then(function(res) {
                if (res && res.responseCode === "OK") {
                    course.slideShowCreated = true;
                    course.showCreateSlideShowModal = false;
                    course[api].loader.showLoader = false;
                    course.hideCreateSlideShowModal();
                    course.initEKStepCE(res.result.content_id);

                } else {
                    course[api].loader.showLoader = false;
                    course[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.CREATE_LESSON.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                }
            }).catch(function (error){
                course[api].loader.showLoader = false;
                course[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.CREATE_LESSON.FAILED, $rootScope.errorMessages.COMMON.ERROR);
            });
        };

        course.saveMetaData = function(data) {

            var api = 'createApi';
            course[api] = {};
            course[api].loader = showLoaderWithMessage("", $rootScope.errorMessages.WORKSPACE.CREATE_LESSON.START);

            var requestBody = angular.copy(data);

            requestBody.mimeType = "application/vnd.ekstep.content-collection";
            requestBody.createdBy = course.userId;

            requestBody.name = requestBody.name ? requestBody.name : "Untitled Course";
            requestBody.description = requestBody.description ? requestBody.description : "Description";
            requestBody.contentType = "Course";

            var requestdata = {
                "content": requestBody
            };
            course.createContent(requestdata, api);
        };

        course.clearCreateSlideShowData = function() {

            if (course.createApi) {
                course.createApi.error = {};
            }
            course.data = {};
        };

        course.initEKStepCE = function(contentId) {
            var params = { contentId: contentId ,type: "Course"};
            $state.go("CollectionEditor", params);
        };
    });
