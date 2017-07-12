'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:collectionController
 * @author Harish Kumar Gangula
 * @description
 * # collectionController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('CollectionController', function(contentService, $timeout, $state, config, $rootScope) {

        var collection = this;
        collection.lessonTypes = config.DROPDOWN.COMMON.lessonTypes;
        collection.audiences = config.DROPDOWN.COMMON.audiences;
        collection.languages = config.DROPDOWN.COMMON.languages;
        collection.grades = config.DROPDOWN.COMMON.grades;
        collection.ageGroup = config.DROPDOWN.COMMON.ageGroup;
        collection.mediums = config.DROPDOWN.COMMON.medium;
        collection.subjects = config.DROPDOWN.COMMON.subjects;
        collection.boards = config.DROPDOWN.COMMON.boards;
        collection.showCreateSlideShowModal = false;
        collection.slideShowCreated = false;
        collection.userId = $rootScope.userId;
        collection.accept = false;

        collection.hideCreateSlideShowModal = function() {
            $('#createSlideShowModal')
                .modal('hide');
            $('#createSlideShowModal')
                .modal('hide others');
            $('#createSlideShowModal')
                .modal('hide dimmer');
        };

        collection.initilizeView = function() {
            collection.showCreateSlideShowModal = true;
            $timeout(function() {
                $('.multiSelectDropDown')
                    .dropdown();
                $('.singleSelectDropDown')
                    .dropdown();
                $('#createSlideShowModal').modal({
                    onHide: function() {
                        collection.clearCreateSlideShowData();
                        if (!collection.slideShowCreated) {
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

        collection.createContent = function(requestData, api) {

            contentService.create(requestData).then(function(res) {
                if (res && res.responseCode === "OK") {
                    collection.slideShowCreated = true;
                    collection.showCreateSlideShowModal = false;
                    collection[api].loader.showLoader = false;
                    collection.hideCreateSlideShowModal();
                    collection.initEKStepCE(res.result.content_id);

                } else {
                    collection[api].loader.showLoader = false;
                    collection[api].error = showErrorMessage(true, config.MESSAGES.WORKSPACE.CREATE_LESSON.FAILED, config.MESSAGES.COMMON.ERROR);
                }
            }).catch(function (error){
                collection[api].loader.showLoader = false;
                collection[api].error = showErrorMessage(true, config.MESSAGES.WORKSPACE.CREATE_LESSON.FAILED, config.MESSAGES.COMMON.ERROR);
            });
        };

        collection.saveMetaData = function(data) {

            var api = 'createApi';
            collection[api] = {};
            collection[api].loader = showLoaderWithMessage("", config.MESSAGES.WORKSPACE.CREATE_LESSON.START);

            var requestBody = angular.copy(data);

            requestBody.mimeType = "application/vnd.ekstep.content-collection";
            requestBody.createdBy = collection.userId;

            requestBody.name = requestBody.name ? requestBody.name : "Default title";
            requestBody.description = requestBody.description ? requestBody.description : "Default description";
            requestBody.contentType = requestBody.contentType ? requestBody.contentType : "Collection";

            var requestdata = {
                "content": requestBody
            };
            collection.createContent(requestdata, api);
        };

        collection.clearCreateSlideShowData = function() {

            if (collection.createApi) {
                collection.createApi.error = {};
            }
            collection.data = {};
        };

        collection.initEKStepCE = function(contentId) {
            var params = { contentId: contentId ,type: "Collection"};
            $state.go("CollectionEditor", params);
        };
    });
