'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:UpForReviewContentController
 * @description
 * @author Anuj Gupta
 * # UpForReviewContentController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('UpForReviewContentController', ['contentService', 'searchService', 'config',
        '$rootScope', '$scope', '$state', 'toasterService', function (contentService, searchService,
        config, $rootScope, $scope, $state, toasterService) {
            var upForReviewContent = this;
            upForReviewContent.userId = $rootScope.userId;
            upForReviewContent.contentStatus = ['Review'];
            upForReviewContent.channelId = 'sunbird';
            upForReviewContent.sortBy = 'desc';
            $scope.contentPlayer = { isContentPlayerEnabled: false };

            upForReviewContent.getUpForReviewContent = function () {
                upForReviewContent.loader = toasterService.loader('', $rootScope.errorMessages
                                            .WORKSPACE.UP_FOR_REVIEW.START);
                var request = {
                    filters: {
                        status: upForReviewContent.contentStatus,
                        channelId: upForReviewContent.channelId
                    },
                    sort_by: {
                        lastUpdatedOn: upForReviewContent.sortBy
                    }
                };
                searchService.search(request).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        upForReviewContent.loader.showLoader = false;
                        upForReviewContent.upForReviewContentData = [];
                        if (res.result.content) {
                            upForReviewContent.upForReviewContentData =
                            res.result.content.filter(function (contentData) {
                                return contentData.createdBy !== upForReviewContent.userId;
                            });
                        }
                    } else {
                        upForReviewContent.loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.WORKSPACE.UP_FOR_REVIEW
                                            .FAILED);
                    }
                }).catch(function () {
                    upForReviewContent.loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.WORKSPACE.UP_FOR_REVIEW.FAILED);
                });
            };

            upForReviewContent.openContentPlayer = function (item) {
                if (item.mimeType === 'application/vnd.ekstep.content-collection') {
                    $state.go('CollectionEditor', {
                        contentId: item.identifier,
                        type: item.contentType,
                        state: 'WorkSpace.UpForReviewContent'
                    });
                } else {
                    var params = {
                        contentId: item.identifier,
                        backState: $state.current.name
                    };
                    $state.go('PreviewContent', params);
                }
            };
        }]);
