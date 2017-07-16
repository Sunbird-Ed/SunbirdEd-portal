'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:AllUploadedContentController
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('AllUploadedContentController', function(contentService, config, $rootScope, $state) {

        var allUploadedContent = this;
        allUploadedContent.userId = $rootScope.userId;

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

        function getUploadedContent() {

            var api = "allUploadedApi";
            allUploadedContent[api] = {};
            allUploadedContent[api].loader = showLoaderWithMessage("", $rootScope.errorMessages.WORKSPACE.ALL_UPLOADED.START);

            var request = {
                filters: {
                    status: ["Draft"],
                    createdBy: allUploadedContent.userId,
                    mimeType: ["application/vnd.ekstep.html-archive", "video/youtube", "video/mp4", "application/pdf"]
                },
                'sort_by': {
                    "lastUpdatedOn": "desc"
                }
            };
            allUploadedContent.allUploadedContentData = [];
            contentService.search(request).then(function(res) {
                    if (res && res.responseCode === 'OK') {
                        allUploadedContent[api].loader.showLoader = false;
                        allUploadedContent.allUploadedContentData = res.result.content;
                        if(res.result.count === 0) {
                            allUploadedContent[api].error = showErrorMessage(false, $rootScope.errorMessages.WORKSPACE.ALL_UPLOADED.NO_CONTENT, $rootScope.errorMessages.COMMON.SUCCESS);
                            allUploadedContent[api].error.success = true;
                        }
                    } else {
                        allUploadedContent[api].loader.showLoader = false;
                        allUploadedContent[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.ALL_UPLOADED.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                    }
                })
                .catch(function(error) {
                    allUploadedContent[api].loader.showLoader = false;
                    allUploadedContent[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.ALL_UPLOADED.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                });
        };

        allUploadedContent.initializeData = function() {
            getUploadedContent();
        };

        allUploadedContent.openContentEditor = function(contentId) {
            var params = { contentId: contentId };
            $state.go("ContentEditor", params);
        };
        
        allUploadedContent.openEditForm = function(contentId) {
            var params = {contentId : contentId};
            $state.go("EditContent", params);
        };
    });
