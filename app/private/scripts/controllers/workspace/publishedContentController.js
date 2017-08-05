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
        '$rootScope', '$state', 'toasterService', '$scope', 'workSpaceUtilsService',
        function (contentService, searchService, config, $rootScope, $state,
            toasterService, $scope, workSpaceUtilsService) {
            var publishedContent = this;
            publishedContent.userId = $rootScope.userId;
            publishedContent.status = ['Live'];
            publishedContent.sortBy = 'desc';
            $scope.isSelected = false;
            publishedContent.selectedContentItem = [];
            publishedContent.message = $rootScope.errorMessages.WORKSPACE;

            publishedContent.getPublishedContent = function () {
                publishedContent.loader = toasterService.loader('', publishedContent.message
                                                        .PUBLISHED.START);
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
                        toasterService.error(publishedContent.message.PUBLISHED.FAILED);
                    }
                }).catch(function () {
                    publishedContent.loader.showLoader = false;
                    toasterService.error(publishedContent.message.PUBLISHED.FAILED);
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

            publishedContent.initializeUIElement = function () {
                $('#actionDropDown').dropdown();
            };

            $scope.addContentOnSelect = function (content, add) {
                if (add) {
                    publishedContent.selectedContentItem.push(content);
                } else {
                    publishedContent.selectedContentItem = publishedContent.selectedContentItem
                    .filter(function (data) {
                        return data.identifier !== content.identifier;
                    });
                }
            };

            publishedContent.applyAction = function () {
                var action = $('#actionDropDown').dropdown('get value');
                if (!action) {
                    toasterService.warning(publishedContent.message.RETIRE_CONTENT.SELECT_ACTION);
                    return;
                }
                if (publishedContent.selectedContentItem.length === 0) {
                    toasterService.warning(publishedContent.message.RETIRE_CONTENT.SELECT_CONTENT +
                                                        ' ' + action);
                } else {
                    switch (action) {
                    case 'delete':
                        publishedContent.deleteContent();
                        break;
                    default:
                        break;
                    }
                }
            };

            publishedContent.deleteContent = function () {
                var requestData = workSpaceUtilsService.reduceObjectIntoArray(
                                            publishedContent.selectedContentItem, 'identifier');
                publishedContent.loader = toasterService.loader('', publishedContent.message
                                            .RETIRE_CONTENT.START);
                var request = {
                    contentIds: requestData
                };
                contentService.retire(request).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        publishedContent.loader.showLoader = false;
                        publishedContent.selectedContentItem = [];
                        toasterService.success(publishedContent.message.RETIRE_CONTENT.SUCCESS);
                        publishedContent.publishedContentData = workSpaceUtilsService
                        .removeContentLocal(publishedContent.publishedContentData, requestData);
                    } else {
                        publishedContent.loader.showLoader = false;
                        publishedContent.handleFailedResponse(res, requestData);
                    }
                }).catch(function () {
                    publishedContent.loader.showLoader = false;
                    toasterService.error(publishedContent.message.RETIRE_CONTENT.FAILED);
                });
            };

            publishedContent.handleFailedResponse = function (res, requestData) {
                var length = res && res.result ? res.result.length : requestData.length;
                var failedContentIds = res && res.result ? workSpaceUtilsService
                .reduceObjectIntoArray(res.result, 'contentId') : requestData;
                var deletedContentIds = workSpaceUtilsService.getDeletedContentIds(requestData,
                                                                                failedContentIds);
                publishedContent.publishedContentData = workSpaceUtilsService.removeContentLocal(
                    publishedContent.publishedContentData, deletedContentIds);
                publishedContent.selectedContentItem = workSpaceUtilsService.removeContentLocal(
                    publishedContent.selectedContentItem, deletedContentIds);
                toasterService.error(length + ' ' + publishedContent.message.RETIRE_CONTENT
                                                                                .NOT_DELETE);
            };
        }]);
