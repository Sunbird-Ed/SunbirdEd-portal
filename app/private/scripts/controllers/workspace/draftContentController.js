'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:DraftContentController
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('DraftContentController', function(contentService, config, $rootScope, $state) {

        var draftContent = this;
        draftContent.userId = $rootScope.userId;

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

        function getDraftContent() {

            var api = "draftApi";
            draftContent[api] = {};
            draftContent[api].loader = showLoaderWithMessage("", $rootScope.errorMessages.WORKSPACE.DRAFT.START);

            var request = {
                filters: {
                    status: ["Draft"],
                    createdBy: draftContent.userId,
                    mimeType: ['application/vnd.ekstep.ecml-archive', 'application/vnd.ekstep.content-collection'],

                },
                'sort_by': {
                    "lastUpdatedOn": "desc"
                }
            };
            draftContent.draftContentData = [];
            contentService.search(request).then(function(res) {
                    if (res && res.responseCode === 'OK') {
                        draftContent[api].loader.showLoader = false;
                        draftContent.draftContentData = res.result.content;
                        if (res.result.count === 0) {
                            draftContent[api].error = showErrorMessage(false, $rootScope.errorMessages.WORKSPACE.DRAFT.NO_CONTENT, $rootScope.errorMessages.COMMON.SUCCESS);
                        }
                    } else {
                        draftContent[api].loader.showLoader = false;
                        draftContent[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.DRAFT.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                    }
                })
                .catch(function(error) {
                    draftContent[api].loader.showLoader = false;
                    draftContent[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.DRAFT.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                });
        };

        draftContent.initializeData = function() {
            getDraftContent();
        };

        draftContent.openContentEditor = function(item) {
            if (item.mimeType === "application/vnd.ekstep.content-collection") {
                $state.go("CollectionEditor", { contentId: item.identifier, type: item.contentType, state: "WorkSpace.DraftContent" });
            } else {
                $state.go("EditContent", { contentId: item.identifier });
            }
        };
    });
