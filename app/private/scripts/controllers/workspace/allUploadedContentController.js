'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:AllUploadedContentController
 * @author Anuj Gupta
 * @description
 * # AllUploadedContentController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('AllUploadedContentController', ['contentService', 'searchService', 'config',
        '$rootScope', '$state', 'toasterService', function (contentService, searchService, config,
            $rootScope, $state, toasterService) {
            var allUploadedContent = this;
            allUploadedContent.userId = $rootScope.userId;
            allUploadedContent.contentStatus = ['Draft'];
            allUploadedContent.contentMimeType = ['application/vnd.ekstep.html-archive',
                'video/youtube', 'video/mp4', 'application/pdf'];
            allUploadedContent.sortBy = 'desc';

            allUploadedContent.getAllUploadedContent = function () {
                allUploadedContent.loader = toasterService.loader('', $rootScope.errorMessages
                                                            .WORKSPACE.ALL_UPLOADED.START);

                var request = {
                    filters: {
                        status: allUploadedContent.contentStatus,
                        createdBy: allUploadedContent.userId,
                        mimeType: allUploadedContent.contentMimeType
                    },
                    sort_by: {
                        lastUpdatedOn: allUploadedContent.sortBy
                    }
                };

                searchService.search(request).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        allUploadedContent.loader.showLoader = false;
                        allUploadedContent.allUploadedContentData = res.result.content || [];
                    } else {
                        allUploadedContent.loader.showLoader = false;
                        toasterService.error($rootScope.errorMessages.WORKSPACE.ALL_UPLOADED
                                                                        .FAILED);
                    }
                }).catch(function () {
                    allUploadedContent.loader.showLoader = false;
                    toasterService.error($rootScope.errorMessages.WORKSPACE.ALL_UPLOADED.FAILED);
                });
            };

            allUploadedContent.editContent = function (item) {
                if (item.mimeType === 'application/vnd.ekstep.content-collection') {
                    $state.go('CollectionEditor', {
                        contentId: item.identifier,
                        type: item.contentType,
                        state: 'WorkSpace.AllUploadedContent'
                    });
                } else {
                    var params = { contentId: item.identifier };
                    $state.go('EditContent', params);
                }
            };
        }]);
