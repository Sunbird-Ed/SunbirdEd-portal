'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:ContentEditorController
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ContentEditorController', function(config, $stateParams, $location, $sce, $state, contentService) {

        var contentEditor = this;
        contentEditor.contentId = $stateParams.contentId;
        
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

        contentEditor.openContentEditor = function(contentId) {

            window.context = config.ekstep_CE_config.context;
            window.context.content_id = contentId;
            window.config = config.ekstep_CE_config.config;
            var baseURL = $location.protocol() + '://' + $location.host() + ':' + $location.port();
            contentEditor.ekURL = $sce.trustAsResourceUrl(baseURL + "/ekContentEditor?contentId=" + contentId);
        };
        
        contentEditor.submitForReview = function (contentId) {

                var api = 'reviewApi';
                contentEditor[api] = {};
                contentEditor[api].loader = showLoaderWithMessage("", config.MESSAGES.WORKSPACE.REVIEW_CONTENT.START);
                var req = {content: {}};

                contentService.review(req, contentId).then(function (res) {
                    if (res && res.responseCode === "OK") {
                        contentEditor[api].loader.showLoader = false;
                        $state.go("WorkSpace.ReviewContent");

                    } else {
                        contentEditor[api].loader.showLoader = false;
                        contentEditor[api].error = showErrorMessage(true, config.MESSAGES.WORKSPACE.REVIEW_CONTENT.FAILED, config.MESSAGES.COMMON.ERROR);
                    }
                }).catch(function (error) {
                    contentEditor[api].loader.showLoader = false;
                    contentEditor[api].error = showErrorMessage(true, config.MESSAGES.WORKSPACE.REVIEW_CONTENT.FAILED, config.MESSAGES.COMMON.ERROR);
                });
            };

        contentEditor.init = function() {
            org.sunbird.portal.eventManager.addEventListener("sunbird:portal:editor:editmeta", function() {
                var params = {contentId : contentEditor.contentId}
                $state.go("EditContent", params);
            });
            
            org.sunbird.portal.eventManager.addEventListener("sunbird:portal:editor:close", function() {
                $state.go("WorkSpace.DraftContent");
            });
            
            org.sunbird.portal.eventManager.addEventListener("sunbird:portal:content:review", function (event, data) {
                console.log("sunbird:portal:content:review event fired")
                contentEditor.submitForReview(data);
            });
            
            window.addEventListener('editor:metadata:edit', function(event, data) {
                console.info('Sunbird edit metadata is calling');
                org.sunbird.portal.eventManager.dispatchEvent('sunbird:portal:editor:editmeta');
            });
            
             window.addEventListener('editor:window:close', function(event, data) {
                console.info('Sunbird editor is closing');
                org.sunbird.portal.eventManager.dispatchEvent('sunbird:portal:editor:close');
            });
            
            window.addEventListener('editor:content:review', function (event, data) {
                console.info('Sunbird edit metadata is calling', event.detail.contentId);
                org.sunbird.portal.eventManager.dispatchEvent('sunbird:portal:content:review', event.detail.contentId);
            });
            
        };
        
        contentEditor.init();
        contentEditor.openContentEditor($stateParams.contentId);
    });
