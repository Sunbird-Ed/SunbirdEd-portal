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
        '$rootScope', '$scope', '$state', 'toasterService', 'PaginationService',
        function (contentService, searchService, config, $rootScope, $scope, $state, toasterService,
            PaginationService) {
            var upForReviewContent = this;
            upForReviewContent.userId = $rootScope.userId;
            upForReviewContent.contentStatus = ['Review'];
            upForReviewContent.channelId = 'sunbird';
            upForReviewContent.sortBy = 'desc';
            $scope.contentPlayer = { isContentPlayerEnabled: false };
            upForReviewContent.pageLimit = 10;
            upForReviewContent.pager = {};

            upForReviewContent.getUpForReviewContent = function (pageNumber) {
                pageNumber = pageNumber || 1;
                upForReviewContent.loader = toasterService.loader('', $rootScope.errorMessages
                                            .WORKSPACE.UP_FOR_REVIEW.START);
                var request = {
                    filters: {
                        status: upForReviewContent.contentStatus,
                        createdFor: $rootScope.organisationIds
                    },
                    sort_by: {
                        lastUpdatedOn: upForReviewContent.sortBy
                    },
                    offset: (pageNumber - 1) * upForReviewContent.pageLimit,
                    limit: upForReviewContent.pageLimit
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
                            upForReviewContent.pager = PaginationService.GetPager(res.result.count,
                                                         pageNumber, upForReviewContent.pageLimit);
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

            upForReviewContent.setPage = function (page) {
                if (page < 1 || page > upForReviewContent.pager.totalPages) {
                    return;
                }
                upForReviewContent.getUpForReviewContent(page);
            };
        }]);
