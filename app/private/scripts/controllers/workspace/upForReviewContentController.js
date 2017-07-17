'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:ReviewContentController
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
        .controller('UpForReviewContentController', function (contentService, config, $rootScope, $scope, $state) {

            var upForReviewContent = this;
            upForReviewContent.userId = $rootScope.userId;
            $scope.contentPlayer = {isContentPlayerEnabled: false};

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
                upForReviewContent[api] = {};
                upForReviewContent[api].loader = showLoaderWithMessage("", $rootScope.errorMessages.WORKSPACE.UP_FOR_REVIEW.START);
                var request = {
                    filters: {
                        status: ["Review"],
                        "channelId": "sunbird"
                    },
                    'sort_by': {
                        "lastUpdatedOn": "desc"
                    }
                };
                upForReviewContent.upForReviewContentData = [];
                contentService.search(request).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        upForReviewContent[api].loader.showLoader = false;
                        if(res.result.count === 0) {
                            upForReviewContent[api].error = showErrorMessage(false, $rootScope.errorMessages.WORKSPACE.UP_FOR_REVIEW.NO_CONTENT, $rootScope.errorMessages.COMMON.SUCCESS);
                        } else {
                            upForReviewContent.upForReviewContentData = res.result.content.filter(function(contentData) {
                                return contentData.createdBy !== upForReviewContent.userId;
                            });
                        }
                    } else {
                        upForReviewContent[api].loader.showLoader = false;
                        upForReviewContent[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.UP_FOR_REVIEW.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                    }
                })
                .catch(function (error) {
                    upForReviewContent[api].loader.showLoader = false;
                    upForReviewContent[api].error = showErrorMessage(true, $rootScope.errorMessages.WORKSPACE.UP_FOR_REVIEW.FAILED, $rootScope.errorMessages.COMMON.ERROR);
                });
            };

            upForReviewContent.initializeData = function () {
                getReviewContent();
            };

            upForReviewContent.openContentPlayer = function (requestData) {
                var params = {contentId: requestData.identifier, backState: $state.current.name};
                $state.go("PreviewContent", params);
            };
        });
