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
    .controller('CreateSlideShowController', function ($scope, contentService, $timeout, $sce, $window, config, $location) {


        var createSlideShow = this;      
        createSlideShow.lessonTypes = config.DROPDOWN.COMMON.lessonTypes;
        createSlideShow.audiences = config.DROPDOWN.COMMON.audiences;
        createSlideShow.languages = config.DROPDOWN.COMMON.languages;
        createSlideShow.grades = config.DROPDOWN.COMMON.grades;
        createSlideShow.ageGroup = config.DROPDOWN.COMMON.ageGroup;
        createSlideShow.medium = config.DROPDOWN.COMMON.medium;
        createSlideShow.subjects = config.DROPDOWN.COMMON.subjects;
        
        function initilizeDropDown() {
            $timeout(function () {
                $('.multiSelectDropDown')
                        .dropdown();
                $('.singleSelectDropDown')
                        .dropdown();
            }, 0);
        }

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
        
        createSlideShow.saveMetaData = function(requestData) {
            
            requestData.mimeType =  "application/vnd.ekstep.ecml-archive";
            var api = 'createSlideShow'
            
            var requestBody = {
                "content": requestData,
                "params": {
                    "cid": "new",
                    "sid": "12345"
                }
            }
//            createSlideShow[api].loader = showLoaderWithMessage("", config.MESSAGES.RESOURCE.PAGE.START);
            contentService.create(requestBody).then(function(res) {
                if (res && res.responseCode === "OK") {
                    console.log("responseCode", res);
//                    createSlideShow[api].loader.showLoader = false;
                    createSlideShow.initEKStepCE(res.result.content_id);
                    
                } else {
//                    createSlideShow[api].loader.showLoader = false;
                }
            }, function(error) {
//                createSlideShow[api].loader.showLoader = false;
            });
        };
        
        createSlideShow.initEKStepCE = function(contentId) {
            window.context = config.ekstep_CE_config.context;
            window.context.content_id = contentId;
            window.config = config.ekstep_CE_config.config;
            var baseURL = $location.protocol() + '://' + $location.host() + ':' + $location.port();
            createSlideShow.ekURL = $sce.trustAsResourceUrl(baseURL+"/ekContentEditor?contentId="+contentId)
        };
        
        
        
    });