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
    .controller('CourseController', function(contentService, $timeout, $state, config, $rootScope, ToasterService) {

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

        course.createContent = function(requestData) {

            contentService.create(requestData).then(function(res) {
                if (res && res.responseCode === "OK") {
                    course.slideShowCreated = true;
                    course.showCreateSlideShowModal = false;
                    course.loader.showLoader = false;
                    course.hideCreateSlideShowModal();
                    course.initEKStepCE(res.result.content_id);

                } else {
                    course.loader.showLoader = false;
                    ToasterService.error($rootScope.errorMessages.WORKSPACE.CREATE_COURSE.FAILED);
                }
            }).catch(function (error){
                course.loader.showLoader = false;
                ToasterService.error($rootScope.errorMessages.WORKSPACE.CREATE_COURSE.FAILED);
            });
        };

        course.saveMetaData = function(data) {

            course.loader = ToasterService.loader("", $rootScope.errorMessages.WORKSPACE.CREATE_COURSE.START);

            var requestBody = angular.copy(data);

            requestBody.mimeType = "application/vnd.ekstep.content-collection";
            requestBody.createdBy = course.userId;

            requestBody.name = requestBody.name ? requestBody.name : "Untitled Course";
            requestBody.description = requestBody.description ? requestBody.description : "Description";
            requestBody.contentType = "Course";

            var requestdata = {
                "content": requestBody
            };
            course.createContent(requestdata);
        };

        course.clearCreateSlideShowData = function() {
            course.data = {};
        };

        course.initEKStepCE = function(contentId) {
            var params = { contentId: contentId ,type: "Course"};
            $state.go("CollectionEditor", params);
        };
    });
