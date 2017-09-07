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
      '$rootScope', '$state', 'toasterService', '$scope', 'workSpaceUtilsService', '$timeout',
      'PaginationService',
      function (contentService, searchService, config, $rootScope, $state,
      toasterService, $scope, workSpaceUtilsService, $timeout, PaginationService) {
          var publishedContent = this;
          publishedContent.userId = $rootScope.userId;
          publishedContent.status = ['Live'];
          publishedContent.sortBy = 'desc';
          $scope.isSelected = false;
          publishedContent.selectedContentItem = [];
          publishedContent.message = $rootScope.errorMessages.WORKSPACE;
          publishedContent.pageLimit = 9;
          publishedContent.pager = {};

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

          publishedContent.getPublishedContent = function (pageNumber) {
              pageNumber = pageNumber || 1;
              publishedContent.loader = toasterService.loader('', publishedContent.message
          .PUBLISHED.START);
              publishedContent.error = {};
              var request = {
                  filters: {
                      status: publishedContent.status,
                      createdBy: publishedContent.userId,
                      objectType: 'Content',
                      contentType: config.contributeContentType
                  },
                  sort_by: {
                      lastUpdatedOn: publishedContent.sortBy
                  },
                  offset: (pageNumber - 1) * publishedContent.pageLimit,
                  limit: publishedContent.pageLimit
              };

              searchService.search(request).then(function (res) {
                  if (res && res.responseCode === 'OK') {
                      publishedContent.error.showError = false;
                      publishedContent.loader.showLoader = false;
                      publishedContent.pager = PaginationService.GetPager(res.result.count,
              pageNumber, publishedContent.pageLimit);
                      publishedContent.publishedContentData = res.result.content || [];
                      publishedContent.totalCount = res.result.count;
                      publishedContent.pageNumber = pageNumber;
                      if (publishedContent.publishedContentData.length === 0) {
                          publishedContent.error = showErrorMessage(true,
                $rootScope.errorMessages.WORKSPACE.PUBLISHED.NO_CONTENT,
                $rootScope.errorMessages.COMMON.NO_RESULTS);
                      }
                  } else {
                      publishedContent.error.showError = false;
                      publishedContent.loader.showLoader = false;
                      toasterService.error(publishedContent.message.PUBLISHED.FAILED);
                  }
              }).catch(function () {
                  publishedContent.error.showError = false;
                  publishedContent.loader.showLoader = false;
                  toasterService.error(publishedContent.message.PUBLISHED.FAILED);
              });
          };

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
          publishedContent.openContentPlayer = function (item) {
              if (item.mimeType === 'application/vnd.ekstep.content-collection') {
                  $state.go('CollectionEditor', {
                      contentId: item.identifier,
                      type: item.contentType,
                      state: 'WorkSpace.PublishedContent'
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
                      state: 'WorkSpace.PublishedContent'
                  };
                  $state.go('GenericEditor', params);
              }
          };

          publishedContent.initializeUIElement = function () {
              $('#actionDropDown').dropdown();
          };

          publishedContent.openRemoveContentModel = function (ContentId) {
              publishedContent.removeContentId = ContentId;
              publishedContent.showRemoveContentModel = true;
              $timeout(function () {
                  $('#removeContentModel').modal({}).modal('show');
              }, 10);
          };

          publishedContent.hideRemoveContentModel = function () {
              $('#removeContentModel').modal('hide');
              $('#removeContentModel').modal('hide all');
              $('#removeContentModel').modal('hide other');
              $('#removeContentModel').modal('hide dimmer');
              publishedContent.removeContentId = '';
              publishedContent.showRemoveContentModel = false;
          };

          publishedContent.deleteContent = function (contentId) {
              var requestData = [contentId];
              publishedContent.hideRemoveContentModel();
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
                      publishedContent.pager = PaginationService
              .GetPager(publishedContent.totalCount - requestData.length,
                publishedContent.pageNumber, publishedContent.pageLimit);
                      if (publishedContent.publishedContentData.length === 0) {
                          publishedContent.error = showErrorMessage(true,
                $rootScope.errorMessages.WORKSPACE.PUBLISHED.NO_CONTENT,
                $rootScope.errorMessages.COMMON.NO_RESULTS);
                      }
                  } else {
                      publishedContent.loader.showLoader = false;
                      toasterService.error(publishedContent.message.RETIRE_CONTENT.NOT_DELETE);
                  }
              }).catch(function () {
                  publishedContent.loader.showLoader = false;
                  toasterService.error(publishedContent.message.RETIRE_CONTENT.NOT_DELETE);
              });
          };

          publishedContent.setPage = function (page) {
              if (page < 1 || page > publishedContent.pager.totalPages) {
                  return;
              }
              publishedContent.getPublishedContent(page);
          };
      }
  ]);
