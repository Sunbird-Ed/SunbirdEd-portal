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
          upForReviewContent.pageLimit = 9;
          upForReviewContent.pager = {};

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

          upForReviewContent.getUpForReviewContent = function (pageNumber) {
              pageNumber = pageNumber || 1;
              upForReviewContent.loader = toasterService.loader('', $rootScope.errorMessages
          .WORKSPACE.UP_FOR_REVIEW.START);
              upForReviewContent.error = {};
              var request = {
                  filters: {
                      status: upForReviewContent.contentStatus,
                      createdFor: $rootScope.organisationIds,
                      objectType: 'Content',
                      contentType: config.contributeContentType
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
                      upForReviewContent.error.showError = false;
                      upForReviewContent.upForReviewContentData = [];
                      if (res.result.content) {
                          upForReviewContent.upForReviewContentData =
                            res.result.content.filter(function (contentData) {
                                return contentData.createdBy !== upForReviewContent.userId;
                            });
                      }
                      upForReviewContent.totalCount = res.result.count;
                      upForReviewContent.pager = PaginationService.GetPager(res.result.count,
                            pageNumber, upForReviewContent.pageLimit);
                      if (upForReviewContent.upForReviewContentData.length === 0) {
                          upForReviewContent.error = showErrorMessage(true,
                  $rootScope.errorMessages.WORKSPACE.UP_FOR_REVIEW.NO_CONTENT,
                  $rootScope.errorMessages.COMMON.NO_RESULTS);
                      }
                  } else {
                      upForReviewContent.loader.showLoader = false;
                      upForReviewContent.error.showError = false;
                      toasterService.error($rootScope.errorMessages.WORKSPACE.UP_FOR_REVIEW
              .FAILED);
                  }
              }).catch(function () {
                  upForReviewContent.loader.showLoader = false;
                  upForReviewContent.error.showError = false;
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
      }
  ]);
