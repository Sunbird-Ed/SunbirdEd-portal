'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:ReviewContentController
 * @description
 * # CreatecontentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ReviewContentController', function (contentService,
         searchService, config, $rootScope, $scope, $state, toasterService) {
        var reviewContent = this;
        reviewContent.userId = $rootScope.userId;
        $scope.contentPlayer = { isContentPlayerEnabled: false };

        function getReviewContent() {
            reviewContent.loader = toasterService
            .loader('', $rootScope.errorMessages.WORKSPACE.REVIEW.START);

            var request = {
                filters: {
                    status: ['Review'],
                    createdBy: reviewContent.userId
                },
                sort_by: {
                    lastUpdatedOn: 'desc'
                }
            };
            reviewContent.reviewContentData = [];
            searchService.search(request).then(function (res) {
                if (res && res.responseCode === 'OK') {
                    reviewContent.loader.showLoader = false;
                    reviewContent.reviewContentData = res.result.content;
                    if (res.result.count === 0) {
                        reviewContent.zeroContentMessage
                        = $rootScope.errorMessages.WORKSPACE.REVIEW.NO_CONTENT;
                    }
                } else {
                    reviewContent.loader.showLoader = false;
                    toasterService
                    .error($rootScope.errorMessages.WORKSPACE.REVIEW.FAILED);
                }
            })
                .catch(function () {
                    reviewContent.loader.showLoader = false;
                    toasterService
                    .error($rootScope.errorMessages.WORKSPACE.REVIEW.FAILED);
                });
        }

        reviewContent.initializeData = function () {
            getReviewContent();
        };

        reviewContent.openContentPlayer = function (item) {
            if (item.mimeType === 'application/vnd.ekstep.content-collection') {
                $state.go('CollectionEditor', { contentId: item.identifier,
                    type: item.contentType,
                    state: 'WorkSpace.ReviewContent' });
            } else {
                var params = { contentId: item.identifier,
                    backState: $state.current.name };
                $state.go('PreviewContent', params);
            }
        };
    });
