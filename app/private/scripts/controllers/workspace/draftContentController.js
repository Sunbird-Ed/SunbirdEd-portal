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
        '$rootScope', '$state', 'toasterService', '$scope', 'workSpaceUtilsService', '$timeout',
        'PaginationService',
        function (contentService, searchService, config, $rootScope, $state,
      toasterService, $scope, workSpaceUtilsService, $timeout, PaginationService) {
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
            draftContent.pageLimit = 9;
            draftContent.pager = {};
            draftContent.error = {};

            /**
             * This function called when api failed,
             * and its show failed response for 2 sec.
             * @param {String} message
             */
            function showErrorMessage(isClose, message, messageType, messageText) {
                var error = {};
                error.showError = true;
                error.isClose = isClose;
                error.message = message;
                error.messageType = messageType;
                if (messageText) {
                    error.messageText = messageText;
                }
                return error;
            }

            draftContent.getDraftContent = function (pageNumber) {
                pageNumber = pageNumber || 1;
                draftContent.loader = toasterService.loader('', draftContent.message.DRAFT.START);

                var request = {
                    filters: {
                        status: draftContent.status,
                        createdBy: draftContent.userId,
                        mimeType: draftContent.mimeType,
                        contentType: config.contributeContentType
                    },
                    sort_by: {
                        lastUpdatedOn: draftContent.sortBy
                    },
                    offset: (pageNumber - 1) * draftContent.pageLimit,
                    limit: draftContent.pageLimit
                };

                searchService.search(request).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        draftContent.loader.showLoader = false;
                        draftContent.error.showError = false;
                        draftContent.totalCount = res.result.count;
                        draftContent.pageNumber = pageNumber;
                        draftContent.draftContentData = res.result.content || [];
                        draftContent.pager = PaginationService.GetPager(res.result.count,
                        pageNumber, draftContent.pageLimit);
                        if (draftContent.draftContentData.length === 0) {
                            draftContent.error = showErrorMessage(true,
                            $rootScope.errorMessages.WORKSPACE.DRAFT.NO_CONTENT,
                            $rootScope.errorMessages.COMMON.NO_RESULTS);
                        }
                    } else {
                        draftContent.loader.showLoader = false;
                        draftContent.error.showError = false;
                        toasterService.error(draftContent.message.DRAFT.FAILED);
                    }
                }).catch(function () {
                    draftContent.loader.showLoader = false;
                    draftContent.error.showError = false;
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
                    $state.go('ContentEditor', { contentId: item.identifier });
                }
            };

            draftContent.openRemoveContentModel = function (ContentId) {
                draftContent.removeContentId = ContentId;
                draftContent.showRemoveContentModel = true;
                $timeout(function () {
                    $('#removeContentModel').modal({}).modal('show');
                }, 10);
            };

            draftContent.hideRemoveContentModel = function () {
                $('#removeContentModel').modal('hide');
                $('#removeContentModel').modal('hide all');
                $('#removeContentModel').modal('hide other');
                $('#removeContentModel').modal('hide dimmer');
                draftContent.removeContentId = '';
                draftContent.showRemoveContentModel = false;
            };

            draftContent.deleteContent = function (contentId) {
                var requestData = [contentId];
                draftContent.hideRemoveContentModel();
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
                        draftContent.pager = PaginationService
              .GetPager(draftContent.totalCount - requestData.length,
                draftContent.pageNumber, draftContent.pageLimit);
                        if (draftContent.draftContentData.length === 0) {
                            draftContent.error = showErrorMessage(true,
                $rootScope.errorMessages.WORKSPACE.DRAFT.NO_CONTENT,
                $rootScope.errorMessages.COMMON.NO_RESULTS);
                        }
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
                draftContent.pager = PaginationService.GetPager(draftContent.totalCount - length,
          draftContent.pageNumber, draftContent.pageLimit);
            };

            draftContent.setPage = function (page) {
                if (page < 1 || page > draftContent.pager.totalPages) {
                    return;
                }
                draftContent.getDraftContent(page);
            };
        }
    ]);
