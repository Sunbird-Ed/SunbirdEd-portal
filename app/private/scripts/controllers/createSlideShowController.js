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
    .controller('CreateSlideShowController', function ($scope, contentService, $timeout, $sce, $state, config, $location, $rootScope) {


        var createSlideShow = this;      
        createSlideShow.lessonTypes = config.DROPDOWN.COMMON.lessonTypes;
        createSlideShow.audiences = config.DROPDOWN.COMMON.audiences;
        createSlideShow.languages = config.DROPDOWN.COMMON.languages;
        createSlideShow.grades = config.DROPDOWN.COMMON.grades;
        createSlideShow.ageGroup = config.DROPDOWN.COMMON.ageGroup;
        createSlideShow.mediums = config.DROPDOWN.COMMON.medium;
        createSlideShow.subjects = config.DROPDOWN.COMMON.subjects;
        createSlideShow.boards = config.DROPDOWN.COMMON.boards;
        createSlideShow.showCreateSlideShowModal = true;
        createSlideShow.iconImage = false;
        createSlideShow.userId = $rootScope.userId;
        createSlideShow.accept = false;
        
        function initilizeDropDown() {
            $timeout(function () {
                $('.multiSelectDropDown')
                        .dropdown();
                $('.singleSelectDropDown')
                        .dropdown();
                
                $('.createSlideShowModal').modal({
                    onShow: function() {
                        createSlideShow.iconImage = false;
                    },
                    onHide: function() {
                        createSlideShow.clearCreateSlideShowData();
                        if(!createSlideShow.slideShowCreated) {
                            $state.go("Profile.ContentCreation");
                        }
                    }
                    
                }).modal('show');
            }, 0);
        };
        
        createSlideShow.hideCreateSlideShowModal = function() { 
            $('.createSlideShowModal') 
                .modal('hide'); 
            $('.createSlideShowModal') 
                .modal('hide others'); 
            $('.createSlideShowModal') 
                .modal('hide dimmer'); 
        };

        createSlideShow.initilizeView = function () {
            initilizeDropDown();
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
        
        createSlideShow.createContent = function(requestData, api) {
            
            contentService.create(requestData).then(function(res) {
                if (res && res.responseCode === "OK") {
                    createSlideShow.slideShowCreated = true;
                    createSlideShow.showCreateSlideShowModal = false;
                    createSlideShow[api].loader.showLoader = false;
                    createSlideShow.hideCreateSlideShowModal();
                    createSlideShow.initEKStepCE(res.result.content_id);
                    
                } else {
                    createSlideShow[api].loader.showLoader = false;
                    createSlideShow[api].error = showErrorMessage(false, config.MESSAGES.WORKSPACE.CREATE_SLIDESHOW.FAILED, config.MESSAGES.COMMON.ERROR);
                }
            }, function(error) {
                createSlideShow[api].loader.showLoader = false;
                createSlideShow[api].error = showErrorMessage(false, config.MESSAGES.WORKSPACE.CREATE_SLIDESHOW.FAILED, config.MESSAGES.COMMON.ERROR);
            });
        };
        
        createSlideShow.saveMetaData = function(requestBody) {
            
            var api = 'createApi';
            createSlideShow[api] = {};
            createSlideShow[api].loader = showLoaderWithMessage("", config.MESSAGES.WORKSPACE.CREATE_SLIDESHOW.START);
            
            requestBody.mimeType =  "application/vnd.ekstep.ecml-archive";
            requestBody.createdBy = createSlideShow.userId;
            
            requestBody.name = requestBody.name ? requestBody.name : "Default title";
            requestBody.description = requestBody.description ? requestBody.description : "Default description";
            requestBody.contentType = requestBody.contentType ? requestBody.contentType : "Story";
            
            var requestdata = {
                "content": requestBody,
                "params": {
                    "cid": "new",
                    "sid": "12345"
                }
            };
            createSlideShow.createContent(requestdata, api);

//            contentService.uploadMedia(createSlideShow.icon).then(function(res) {
//                if (res && res.responseCode === "OK") {
//                    requestBody.content.appIcon = res.result.url;
//                    createSlideShow.createContent(requestBody);
//                    
//                } else {
//                    createSlideShow[api].error = showErrorMessage(false, "Create slideshow failed, please try again later", config.MESSAGES.COMMON.ERROR);
//                }
//            }, function(err) {
//                createSlideShow[api].error = showErrorMessage(false, "Create slideshow failed, please try again later", config.MESSAGES.COMMON.ERROR);
//            });
        }
        
        createSlideShow.clearCreateSlideShowData = function() {
            createSlideShow.iconImage = '';
            createSlideShow.iconUpdate = false;
            createSlideShow.data = {};
            createSlideShow.showCreateSlideShowModal = false;
        };
        
        createSlideShow.openImageBrowser = function() {
            createSlideShow.iconImage = false;
            $('#SlideShowIconInput').click();
        }
        
        createSlideShow.initEKStepCE = function(contentId) {
            var params = {contentId : contentId}
            $state.go("ContentEditor", params);
        };
        
        $scope.updateIcon = function(files) {
            if (files) {
                var fd = new FormData();
                if (files.length) {
                    fd.append("file", files[0]);

                    var reader = new FileReader();
                    reader.onload = function(e) {
                        createSlideShow.iconImage = e.target.result;
                        createSlideShow.icon = fd;
                        $rootScope.$emit("updateImageIcon", e.target.result, fd);

                    };
                    reader.readAsDataURL(files[0]);
                }
            }
        };
        
        $rootScope.$on("updateImageIcon", function(e, imageData, fd) {
            createSlideShow.iconImage = imageData;
            createSlideShow.icon = fd;
            $scope.$apply();
        });
        
    });