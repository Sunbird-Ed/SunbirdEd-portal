'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:DraftContentController
 * @description
 * @author Anuj Gupta
 * # DraftContentController
 * Controller of the playerApp
 */

angular.module('playerApp')
    .controller('DraftContentController', ['contentService', 'searchService', 'config',
        '$rootScope', '$state', 'toasterService', '$scope', 'workSpaceUtilsService',
        function (contentService, searchService, config, $rootScope, $state,
        toasterService, $scope, workSpaceUtilsService) {
            var draftContent = this;
            draftContent.userId = $rootScope.userId;
            draftContent.status = ['Draft'];
            draftContent.mimeType = [
                'application/vnd.ekstep.ecml-archive',
                'application/vnd.ekstep.content-collection'
            ];
            draftContent.sortBy = 'desc';
            $scope.isSelected = false;
            draftContent.selectedContentItem = [];
            draftContent.message = $rootScope.errorMessages.WORKSPACE;

            draftContent.getDraftContent = function () {
                draftContent.loader = toasterService.loader('', draftContent.message.DRAFT.START);

                var request = {
                    filters: {
                        status: draftContent.status,
                        createdBy: draftContent.userId,
                        mimeType: draftContent.mimeType
                    },
                    sort_by: {
                        lastUpdatedOn: draftContent.sortBy
                    }
                };

                searchService.search(request).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        draftContent.loader.showLoader = false;
                        draftContent.draftContentData = res.result.content || [];
                    } else {
                        draftContent.loader.showLoader = false;
                        toasterService.error(draftContent.message.DRAFT.FAILED);
                    }
                }).catch(function () {
                    draftContent.loader.showLoader = false;
                    toasterService.error(draftContent.message.DRAFT.FAILED);
                });
            };

            draftContent.openContentEditor = function (item) {
                if (item.mimeType === 'application/vnd.ekstep.content-collection') {
                    $state.go('CollectionEditor', {
                        contentId: item.identifier,
                        type: item.contentType,
                        state: 'WorkSpace.DraftContent'
                    });
                } else {
                    $state.go('EditContent', { contentId: item.identifier });
                }
            };

            draftContent.initializeUIElement = function () {
                $('#actionDropDown').dropdown();
            };

            $scope.addContentOnSelect = function (content, add) {
                if (add) {
                    draftContent.selectedContentItem.push(content);
                } else {
                    draftContent.selectedContentItem = draftContent.selectedContentItem.filter(
                    function (data) {
                        return data.identifier !== content.identifier;
                    });
                }
            };

            draftContent.applyAction = function () {
                var action = $('#actionDropDown').dropdown('get value');
                if (!action) {
                    toasterService.warning(draftContent.message.RETIRE_CONTENT.SELECT_ACTION);
                    return;
                }
                if (draftContent.selectedContentItem.length === 0) {
                    toasterService.warning(draftContent.message.RETIRE_CONTENT.SELECT_CONTENT +
                                        ' ' + action);
                } else {
                    switch (action) {
                    case 'delete':
                        draftContent.deleteContent();
                        break;
                    default:
                        break;
                    }
                }
            };

            draftContent.deleteContent = function () {
                var requestData = workSpaceUtilsService.reduceObjectIntoArray(draftContent
                                                        .selectedContentItem, 'identifier');
                draftContent.loader = toasterService.loader('', draftContent.message.RETIRE_CONTENT
                                                    .START);
                var request = {
                    contentIds: requestData
                };
                contentService.retire(request).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        draftContent.loader.showLoader = false;
                        draftContent.selectedContentItem = [];
                        toasterService.success(draftContent.message.RETIRE_CONTENT.SUCCESS);
                        draftContent.draftContentData = workSpaceUtilsService
                        .removeContentLocal(draftContent.draftContentData, requestData);
                    } else {
                        draftContent.loader.showLoader = false;
                        draftContent.handleFailedResponse(res, requestData);
                    }
                }).catch(function () {
                    draftContent.loader.showLoader = false;
                    toasterService.error(draftContent.message.RETIRE_CONTENT.FAILED);
                });
            };

            draftContent.handleFailedResponse = function (res, requestData) {
                var length = res && res.result ? res.result.length : requestData.length;
                var failedContentIds = res && res.result ? workSpaceUtilsService
                        .reduceObjectIntoArray(res.result, 'contentId') : requestData;
                var deletedContentIds =
                        workSpaceUtilsService.getDeletedContentIds(requestData, failedContentIds);
                draftContent.draftContentData = workSpaceUtilsService
                        .removeContentLocal(draftContent.draftContentData, deletedContentIds);
                draftContent.selectedContentItem = workSpaceUtilsService
                        .removeContentLocal(draftContent.selectedContentItem, deletedContentIds);
                toasterService.error(length + ' ' + draftContent.message.RETIRE_CONTENT
                                                                                    .NOT_DELETE);
            };
        }]);
