'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:PublishedContentController
 * @description
 * @author Anuj Gupta
 * # PublishedContentController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('PublishedContentController', ['contentService', 'searchService', 'config',
        '$rootScope', '$state', 'toasterService', function (contentService, searchService, config,
        $rootScope, $state, toasterService) {
            var publishedContent = this;
            publishedContent.userId = $rootScope.userId;
            publishedContent.status = ['Live'];
            publishedContent.sortBy = 'desc';

            publishedContent.getPublishedContent = function () {
                publishedContent.loader = toasterService.loader('', $rootScope.errorMessages
                                            .WORKSPACE.PUBLISHED.START);
                var request = {
                    filters: {
                        status: publishedContent.status,
                        createdBy: publishedContent.userId
                    },
                    sort_by: {
                        lastUpdatedOn: publishedContent.sortBy
                    }
                };

                searchService.search(request).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        publishedContent.loader.showLoader = false;
                        publishedContent.publishedContentData = res.result.content || [];
                    } else {
                        publishedContent.loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.WORKSPACE.PUBLISHED.FAILED);
                    }
                }).catch(function () {
                    publishedContent.loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.WORKSPACE.PUBLISHED.FAILED);
                });
            };

            publishedContent.openContentPlayer = function (item) {
                if (item.mimeType === 'application/vnd.ekstep.content-collection') {
                    $state.go('CollectionEditor', {
                        contentId: item.identifier,
                        type: item.contentType,
                        state: 'WorkSpace.PublishedContent'
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
