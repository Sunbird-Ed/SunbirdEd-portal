'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:ReviewContentController
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ReviewContentController', function(contentService, searchService, config, $rootScope, $scope, $state) {

        var reviewContent = this;
        reviewContent.userId = $rootScope.userId;
        $scope.contentPlayer = { isContentPlayerEnabled: false };

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


        function getReviewContent() {

            var api = "reviewApi";
            reviewContent[api] = {};
            reviewContent[api].loader = showLoaderWithMessage("", $rootScope.errorMessages.WORKSPACE.REVIEW.START);

            var request = {
                filters: {
                    status: ["Review"],
                    createdBy: reviewContent.userId
                },
                'sort_by': {
                    "lastUpdatedOn": "desc"
                }
            };
            reviewContent.reviewContentData = [];
            searchService.search(request).then(function(res) {
                    if (res && res.responseCode === 'OK') {
                        reviewContent[api].loader.showLoader = false;
                        reviewContent.reviewContentData = res.result.content;
                        if (res.result.count === 0) {
                            reviewContent[api].error = showErrorMessage(false, $rootScope.errorMessages.WORKSPACE.REVIEW.NO_CONTENT, $rootScope.errorMessages.COMMON.SUCCESS);
                        }
                    } else {
                        reviewContent[api].loader.showLoader = false;
                        reviewContent[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.REVIEW.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                    }
                })
                .catch(function(error) {
                    reviewContent[api].loader.showLoader = false;
                    reviewContent[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.REVIEW.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                });
        };

        reviewContent.initializeData = function() {
            getReviewContent();
        };

        reviewContent.openContentPlayer = function(item) {
            if (item.mimeType === "application/vnd.ekstep.content-collection") {
                $state.go("CollectionEditor", { contentId: item.identifier, type: item.contentType, state: "WorkSpace.ReviewContent" });
            } else {
                var params = { contentId: item.identifier, backState: $state.current.name };
                $state.go("PreviewContent", params);
            }
        };
    });
