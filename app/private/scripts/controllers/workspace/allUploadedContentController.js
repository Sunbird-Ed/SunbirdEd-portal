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
        '$rootScope', '$state', 'toasterService', '$scope', 'workSpaceUtilsService', '$timeout',
        'PaginationService',
        function (contentService, searchService, config, $rootScope, $state,
      toasterService, $scope, workSpaceUtilsService, $timeout, PaginationService) {
            var allUploadedContent = this;
            allUploadedContent.userId = $rootScope.userId;
            allUploadedContent.contentStatus = ['Draft'];
            var mimeType = config.MIME_TYPE;
            allUploadedContent.contentMimeType = [mimeType.pdf, mimeType.youtube, mimeType.html,
                mimeType.ePub, mimeType.h5p, mimeType.mp4, mimeType.webm
            ];
            allUploadedContent.sortBy = 'desc';
            $scope.isSelected = false;
            allUploadedContent.selectedContentItem = [];
            allUploadedContent.message = $rootScope.errorMessages.WORKSPACE;
            allUploadedContent.pageLimit = 9;
            allUploadedContent.pager = {};

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

            allUploadedContent.getAllUploadedContent = function (pageNumber) {
                pageNumber = pageNumber || 1;
                allUploadedContent.loader = toasterService.loader('', allUploadedContent.message
                                        .ALL_UPLOADED.START);
                allUploadedContent.error = {};
                var request = {
                    filters: {
                        status: allUploadedContent.contentStatus,
                        createdBy: allUploadedContent.userId,
                        mimeType: allUploadedContent.contentMimeType,
                        contentType: config.contributeContentType
                    },
                    sort_by: {
                        lastUpdatedOn: allUploadedContent.sortBy
                    },
                    offset: (pageNumber - 1) * allUploadedContent.pageLimit,
                    limit: allUploadedContent.pageLimit
                };

                searchService.search(request).then(function (res) {
                    if (res && res.responseCode === 'OK') {
                        allUploadedContent.loader.showLoader = false;
                        allUploadedContent.error.showError = false;
                        allUploadedContent.totalCount = res.result.count;
                        allUploadedContent.pageNumber = pageNumber;
                        allUploadedContent.allUploadedContentData = res.result.content || [];
                        allUploadedContent.pager = PaginationService.GetPager(res.result.count,
              pageNumber, allUploadedContent.pageLimit);
                        if (allUploadedContent.allUploadedContentData.length === 0) {
                            allUploadedContent.error = showErrorMessage(true,
                $rootScope.errorMessages.WORKSPACE.ALL_UPLOADED.NO_CONTENT,
                $rootScope.errorMessages.COMMON.NO_RESULTS);
                        }
                    } else {
                        allUploadedContent.error.showError = false;
                        allUploadedContent.loader.showLoader = false;
                        toasterService.error(allUploadedContent.message.ALL_UPLOADED.FAILED);
                    }
                }).catch(function () {
                    allUploadedContent.error.showError = false;
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
                } else if (item.mimeType === 'application/vnd.ekstep.ecml-archive') {
                    var params = {
                        contentId: item.identifier,
                        state: 'WorkSpace.PublishedContent'
                    };
                    $state.go('ContentEditor', params);
                } else {
                    var params = {
                        contentId: item.identifier,
                        state: 'WorkSpace.AllUploadedContent'
                    };
                    $state.go('GenericEditor', params);
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

            allUploadedContent.openRemoveContentModel = function (ContentId) {
                allUploadedContent.removeContentId = ContentId;
                allUploadedContent.showRemoveContentModel = true;
                $timeout(function () {
                    $('#removeContentModel').modal({}).modal('show');
                }, 10);
            };

            allUploadedContent.hideRemoveContentModel = function () {
                $('#removeContentModel').modal('hide');
                $('#removeContentModel').modal('hide all');
                $('#removeContentModel').modal('hide other');
                $('#removeContentModel').modal('hide dimmer');
                allUploadedContent.removeContentId = '';
                allUploadedContent.showRemoveContentModel = false;
            };

            allUploadedContent.deleteContent = function (contentId) {
                var requestData = [contentId];
                allUploadedContent.hideRemoveContentModel();
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
                        allUploadedContent.pager = PaginationService
              .GetPager(allUploadedContent.totalCount - requestData.length,
                allUploadedContent.pageNumber, allUploadedContent.pageLimit);
                        if (allUploadedContent.allUploadedContentData.length === 0) {
                            allUploadedContent.error = showErrorMessage(true,
                $rootScope.errorMessages.WORKSPACE.ALL_UPLOADED.NO_CONTENT,
                $rootScope.errorMessages.COMMON.NO_RESULTS);
                        }
                    } else {
                        allUploadedContent.loader.showLoader = false;
                        toasterService.error(allUploadedContent.message.RETIRE_CONTENT.NOT_DELETE);
                    }
                }).catch(function () {
                    allUploadedContent.loader.showLoader = false;
                    toasterService.error(allUploadedContent.message.RETIRE_CONTENT.NOT_DELETE);
                });
            };

            allUploadedContent.setPage = function (page) {
                if (page < 1 || page > allUploadedContent.pager.totalPages) {
                    return;
                }
                allUploadedContent.getAllUploadedContent(page);
            };
        }
    ]);
