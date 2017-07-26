'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:ReviewContentController
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('UpForReviewContentController', function (
        contentService, searchService, config,
         $rootScope, $scope, $state, ToasterService) {
        var upForReviewContent = this;
        upForReviewContent.userId = $rootScope.userId;
        upForReviewContent.contentStatus = ['Review'];
        upForReviewContent.channelId = 'sunbird';
        $scope.contentPlayer = { isContentPlayerEnabled: false };

        function getReviewContent() {
            upForReviewContent.loader = ToasterService
            .loader('', $rootScope.errorMessages.WORKSPACE.UP_FOR_REVIEW.START);
            var request = {
                filters: {
                    status: upForReviewContent.contentStatus,
                    channelId: upForReviewContent.channelId
                },
                sort_by: {
                    lastUpdatedOn: 'desc'
                }
            };

            upForReviewContent.upForReviewContentData = [];
            searchService.search(request).then(function (res) {
                if (res && res.responseCode === 'OK') {
                    upForReviewContent.loader.showLoader = false;
                    if (res.result.content) {
                        upForReviewContent.upForReviewContentData = [];
                        upForReviewContent.upForReviewContentData
                         = res.result.content.filter(function (contentData) {
                             return contentData.createdBy
                             !== upForReviewContent.userId;
                         });
                    }
                    if (res.result.count === 0
                        || upForReviewContent.upForReviewContentData.length
                         === 0) {
                        upForReviewContent.zeroContentMessage
                         = $rootScope.errorMessages
                         .WORKSPACE.UP_FOR_REVIEW.NO_CONTENT;
                    }
                } else {
                    upForReviewContent.loader.showLoader = false;
                    ToasterService.error($rootScope.errorMessages
                        .WORKSPACE.UP_FOR_REVIEW.FAILED);
                }
            }).catch(function () {
                upForReviewContent.loader.showLoader = false;
                ToasterService.error($rootScope.errorMessages
                    .WORKSPACE.UP_FOR_REVIEW.FAILED);
            });
        }

        upForReviewContent.initializeData = function () {
            getReviewContent();
        };

        upForReviewContent.openContentPlayer = function (item) {
            if (item.mimeType === 'application/vnd.ekstep.content-collection') {
                $state.go('CollectionEditor', { contentId: item.identifier,
                    type: item.contentType,
                    state: 'WorkSpace.UpForReviewContent' });
            } else {
                var params = { contentId: item.identifier,
                    backState: $state.current.name };
                $state.go('PreviewContent', params);
            }
        };
    });
