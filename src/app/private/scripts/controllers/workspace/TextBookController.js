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
    .controller('TextBookController', function(contentService, $timeout, $state, config, $rootScope, ToasterService) {

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

        textbook.createContent = function(requestData) {

            contentService.create(requestData).then(function(res) {
                if (res && res.responseCode === "OK") {
                    textbook.slideShowCreated = true;
                    textbook.showCreateSlideShowModal = false;
                    textbook.loader.showLoader = false;
                    textbook.hideCreateSlideShowModal();
                    textbook.initEKStepCE(res.result.content_id);

                } else {
                    textbook.loader.showLoader = false;
                    ToasterService.error($rootScope.errorMessages.WORKSPACE.CREATE_TEXTBOOK.FAILED);
                }
            }).catch(function (error){
                textbook.loader.showLoader = false;
                ToasterService.error($rootScope.errorMessages.WORKSPACE.CREATE_TEXTBOOK.FAILED);
            });
        };

        textbook.saveMetaData = function(data) {

            textbook.loader = ToasterService.loader("", $rootScope.errorMessages.WORKSPACE.CREATE_TEXTBOOK.START);

            var requestBody = angular.copy(data);

            requestBody.mimeType = "application/vnd.ekstep.content-collection";
            requestBody.createdBy = textbook.userId;

            requestBody.name = requestBody.name ? requestBody.name : "Untitled textbook";
            requestBody.contentType =  "TextBook";

            var requestdata = {
                "content": requestBody
            };
            textbook.createContent(requestdata);
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
