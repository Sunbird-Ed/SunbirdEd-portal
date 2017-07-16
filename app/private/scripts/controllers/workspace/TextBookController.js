'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:TextBookController
 * @author Harish Kumar Gangula
 * @description
 * # TextBookController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('TextBookController', function(contentService, $timeout, $state, config, $rootScope) {

        var textbook = this;
        textbook.lessonTypes = config.DROPDOWN.COMMON.lessonTypes;
        textbook.audiences = config.DROPDOWN.COMMON.audiences;
        textbook.languages = config.DROPDOWN.COMMON.languages;
        textbook.grades = config.DROPDOWN.COMMON.grades;
        textbook.ageGroup = config.DROPDOWN.COMMON.ageGroup;
        textbook.mediums = config.DROPDOWN.COMMON.medium;
        textbook.subjects = config.DROPDOWN.COMMON.subjects;
        textbook.boards = config.DROPDOWN.COMMON.boards;
        textbook.showCreateSlideShowModal = false;
        textbook.slideShowCreated = false;
        textbook.userId = $rootScope.userId;
        textbook.accept = false;

        textbook.hideCreateSlideShowModal = function() {
            $('#createSlideShowModal')
                .modal('hide');
            $('#createSlideShowModal')
                .modal('hide others');
            $('#createSlideShowModal')
                .modal('hide dimmer');
        };

        textbook.initilizeView = function() {
            textbook.showCreateSlideShowModal = true;
            $timeout(function() {
                $('.multiSelectDropDown')
                    .dropdown();
                $('.singleSelectDropDown')
                    .dropdown();
                $('#createSlideShowModal').modal({
                    onHide: function() {
                        textbook.clearCreateSlideShowData();
                        if (!textbook.slideShowCreated) {
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

        textbook.createContent = function(requestData, api) {

            contentService.create(requestData).then(function(res) {
                if (res && res.responseCode === "OK") {
                    textbook.slideShowCreated = true;
                    textbook.showCreateSlideShowModal = false;
                    textbook[api].loader.showLoader = false;
                    textbook.hideCreateSlideShowModal();
                    textbook.initEKStepCE(res.result.content_id);

                } else {
                    textbook[api].loader.showLoader = false;
                    textbook[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.CREATE_LESSON.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                }
            }).catch(function (error){
                textbook[api].loader.showLoader = false;
                textbook[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.CREATE_LESSON.FAILED, $rootScope.errorMessages.COMMON.ERROR);
            });
        };

        textbook.saveMetaData = function(data) {

            var api = 'createApi';
            textbook[api] = {};
            textbook[api].loader = showLoaderWithMessage("", $rootScope.errorMessages.WORKSPACE.CREATE_LESSON.START);

            var requestBody = angular.copy(data);

            requestBody.mimeType = "application/vnd.ekstep.content-collection";
            requestBody.createdBy = textbook.userId;

            requestBody.name = requestBody.name ? requestBody.name : "Untitled textbook";
            requestBody.contentType =  "TextBook";

            var requestdata = {
                "content": requestBody
            };
            textbook.createContent(requestdata, api);
        };

        textbook.clearCreateSlideShowData = function() {

            if (textbook.createApi) {
                textbook.createApi.error = {};
            }
            textbook.data = {};
        };

        textbook.initEKStepCE = function(contentId) {
            var params = { contentId: contentId ,type: "TextBook"};
            $state.go("CollectionEditor", params);
        };
    });
