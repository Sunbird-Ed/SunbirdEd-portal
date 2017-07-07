'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:PublishedContentController
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('PublishedContentController', function(contentService, config, $rootScope, $state) {

        var publishedContent = this;
        publishedContent.userId = $rootScope.userId;

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


        function getPublishedContent() {

            var api = "publishedApi";
            publishedContent[api] = {};
            publishedContent[api].loader = showLoaderWithMessage("", config.MESSAGES.WORKSPACE.PUBLISHED.START);

            var request = {
                filters: {
                    status: ["Live"],
                    createdBy: "263",
                    mimeType: ['application/vnd.ekstep.ecml-archive']
                },
                'params': {
                    'cid': '12'
                },
                'sort_by': {
                    "lastUpdatedOn": "desc"
                }
            };
            publishedContent.publishedContentData = [];
            contentService.search(request).then(function(res) {
                    if (res && res.responseCode === 'OK') {
                        publishedContent[api].loader.showLoader = false;
                        publishedContent.publishedContentData = res.result.content;
                    } else {
                        publishedContent[api].loader.showLoader = false;
                        publishedContent[api].error = showErrorMessage(true, config.MESSAGES.WORKSPACE.PUBLISHED.FAILED, config.MESSAGES.COMMON.ERROR);
                    }
                })
                .catch(function(error) {
                    publishedContent[api].loader.showLoader = false;
                    publishedContent[api].error = showErrorMessage(true, config.MESSAGES.WORKSPACE.PUBLISHED.FAILED, config.MESSAGES.COMMON.ERROR);
                });
        };

        publishedContent.initializeData = function() {

            getPublishedContent();

        };

        publishedContent.openContentEditor = function(contentId) {

            var params = { contentId: contentId }
            $state.go("ContentEditor", params);

        };
    });
