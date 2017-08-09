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
        '$rootScope', '$state', 'toasterService', '$scope', 'workSpaceUtilsService',
        function (contentService, searchService, config, $rootScope, $state,
            toasterService, $scope, workSpaceUtilsService) {
            var allUploadedContent = this;
            allUploadedContent.userId = $rootScope.userId;
            allUploadedContent.contentStatus = ['Draft'];
            allUploadedContent.contentMimeType = ['application/vnd.ekstep.html-archive',
                'video/youtube', 'video/mp4', 'application/pdf'];
            allUploadedContent.sortBy = 'desc';
            $scope.isSelected = false;
            allUploadedContent.selectedContentItem = [];
            allUploadedContent.message = $rootScope.errorMessages.WORKSPACE;

            allUploadedContent.getAllUploadedContent = function () {
                allUploadedContent.loader = toasterService.loader('', allUploadedContent.message
                                            .ALL_UPLOADED.START);
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
                        toasterService.error(allUploadedContent.message.ALL_UPLOADED.FAILED);
                    }
                }).catch(function () {
                    allUploadedContent.loader.showLoader = false;
                    toasterService.error(allUploadedContent.message.ALL_UPLOADED.FAILED);
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

            allUploadedContent.initializeUIElement = function () {
                $('#actionDropDown').dropdown();
            };

            $scope.addContentOnSelect = function (content, add) {
                if (add) {
                    allUploadedContent.selectedContentItem.push(content);
                } else {
                    allUploadedContent.selectedContentItem = allUploadedContent.selectedContentItem
                    .filter(function (data) {
                        return data.identifier !== content.identifier;
                    });
                }
            };

            allUploadedContent.applyAction = function () {
                var action = $('#actionDropDown').dropdown('get value');
                if (!action) {
                    toasterService.warning(allUploadedContent.message.RETIRE_CONTENT.SELECT_ACTION);
                    return;
                }
                if (allUploadedContent.selectedContentItem.length === 0) {
                    toasterService.warning(allUploadedContent.message.RETIRE_CONTENT
                                                                    .SELECT_CONTENT + ' ' + action);
                } else {
                    switch (action) {
                    case 'delete':
                        allUploadedContent.deleteContent();
                        break;
                    default:
                        break;
                    }
                }
            };

            allUploadedContent.deleteContent = function () {
                var requestData = workSpaceUtilsService.reduceObjectIntoArray(
                                            allUploadedContent.selectedContentItem, 'identifier');
                allUploadedContent.loader = toasterService.loader('', allUploadedContent.message
                                            .RETIRE_CONTENT.START);
                var request = {
                    contentIds: requestData
                };
                contentService.retire(request).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        allUploadedContent.loader.showLoader = false;
                        allUploadedContent.selectedContentItem = [];
                        toasterService.success(allUploadedContent.message.RETIRE_CONTENT.SUCCESS);
                        allUploadedContent.allUploadedContentData = workSpaceUtilsService
                        .removeContentLocal(allUploadedContent.allUploadedContentData, requestData);
                    } else {
                        allUploadedContent.loader.showLoader = false;
                        allUploadedContent.handleFailedResponse(res, requestData);
                    }
                }).catch(function () {
                    allUploadedContent.loader.showLoader = false;
                    toasterService.error(allUploadedContent.message.RETIRE_CONTENT.FAILED);
                });
            };

            allUploadedContent.handleFailedResponse = function (res, requestData) {
                var length = res && res.result ? res.result.length : requestData.length;
                var failedContentIds = res && res.result ? workSpaceUtilsService
                                    .reduceObjectIntoArray(res.result, 'contentId') : requestData;
                var deletedContentIds = workSpaceUtilsService
                                    .getDeletedContentIds(requestData, failedContentIds);
                allUploadedContent.allUploadedContentData = workSpaceUtilsService
                .removeContentLocal(allUploadedContent.allUploadedContentData, deletedContentIds);
                allUploadedContent.selectedContentItem = workSpaceUtilsService
                .removeContentLocal(allUploadedContent.selectedContentItem, deletedContentIds);
                toasterService.error(length + ' ' + allUploadedContent.message
                                    .RETIRE_CONTENT.NOT_DELETE);
            };
        }]);
