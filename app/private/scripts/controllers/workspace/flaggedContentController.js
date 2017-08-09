'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:FlaggedContentController
 * @author Anuj Gupta
 * @description
 * # AllUploadedContentController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('FlaggedContentController', ['contentService', 'searchService', 'config',
        '$rootScope', '$state', 'toasterService', function (contentService, searchService, config,
            $rootScope, $state, toasterService) {
            var flaggedContent = this;
            flaggedContent.userId = $rootScope.userId;
            flaggedContent.contentStatus = ['Flagged'];
            flaggedContent.sortBy = 'desc';

            flaggedContent.getAllFlaggedContent = function () {
                flaggedContent.loader = toasterService.loader('', $rootScope.errorMessages
                                                            .WORKSPACE.FLAGGED.START);

                var request = {
                    filters: {
                        status: flaggedContent.contentStatus,
                        createdFor: $rootScope.organisationIds
                    },
                    sort_by: {
                        lastUpdatedOn: flaggedContent.sortBy
                    }
                };

                searchService.search(request).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        flaggedContent.loader.showLoader = false;
                        flaggedContent.flaggedContentData = [];
                        if (res.result.content) {
                            flaggedContent.flaggedContentData =
                            res.result.content.filter(function (contentData) {
                                return contentData.createdBy !== flaggedContent.userId;
                            });
                        }
                        flaggedContent.flaggedContentData = res.result.content || [];
                    } else {
                        flaggedContent.loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.WORKSPACE.FLAGGED
                                                                        .FAILED);
                    }
                }).catch(function () {
                    flaggedContent.loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.WORKSPACE.FLAGGED.FAILED);
                });
            };

            flaggedContent.openContentPlayer = function (item) {
                if (item.mimeType === 'application/vnd.ekstep.content-collection') {
                    $state.go('CollectionEditor', {
                        contentId: item.identifier,
                        type: item.contentType,
                        state: $state.current.name
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
