'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:ReviewContentController
 * @description
 * @author Anuj Gupta
 * # ReviewContentController
 * Controller of the playerApp
 */
angular.module('playerApp')
  .controller('ReviewContentController', ['contentService', 'searchService', 'config',
      '$rootScope', '$scope', '$state', 'toasterService', 'PaginationService',
      function (contentService, searchService, config, $rootScope, $scope,
      $state, toasterService, PaginationService) {
          var reviewContent = this;
          reviewContent.userId = $rootScope.userId;
          $scope.contentPlayer = { isContentPlayerEnabled: false };
          reviewContent.status = ['Review'];
          reviewContent.sortBy = 'desc';
          reviewContent.pageLimit = 9;
          reviewContent.pager = {};

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

          reviewContent.getReviewContent = function (pageNumber) {
              pageNumber = pageNumber || 1;
              reviewContent.loader = toasterService.loader('', $rootScope.errorMessages.WORKSPACE
          .REVIEW.START);
              reviewContent.error = {};
              var request = {
                  filters: {
                      status: reviewContent.status,
                      createdBy: reviewContent.userId,
                      objectType: 'Content',
                      contentType: config.contributeContentType
                  },
                  sort_by: {
                      lastUpdatedOn: reviewContent.sortBy
                  },
                  offset: (pageNumber - 1) * reviewContent.pageLimit,
                  limit: reviewContent.pageLimit
              };

              searchService.search(request).then(function (res) {
                  if (res && res.responseCode === 'OK') {
                      reviewContent.loader.showLoader = false;
                      reviewContent.error.showError = false;
                      reviewContent.reviewContentData = res.result.content || [];
                      reviewContent.totalCount = res.result.count;
                      reviewContent.pager = PaginationService.GetPager(res.result.count,
              pageNumber, reviewContent.pageLimit);
                      if (reviewContent.reviewContentData.length === 0) {
                          reviewContent.error = showErrorMessage(true,
                $rootScope.errorMessages.WORKSPACE.REVIEW.NO_CONTENT,
                $rootScope.errorMessages.COMMON.NO_RESULTS);
                      }
                  } else {
                      reviewContent.loader.showLoader = false;
                      reviewContent.error.showError = false;
                      toasterService.error($rootScope.errorMessages.WORKSPACE.REVIEW.FAILED);
                  }
              }).catch(function () {
                  reviewContent.loader.showLoader = false;
                  reviewContent.error.showError = false;
                  toasterService.error($rootScope.errorMessages.WORKSPACE.REVIEW.FAILED);
              });
          };

          reviewContent.openContentPlayer = function (item) {
              if (item.mimeType === 'application/vnd.ekstep.content-collection') {
                  $state.go('CollectionEditor', {
                      contentId: item.identifier,
                      type: item.contentType,
                      state: 'WorkSpace.ReviewContent'
                  });
              } else {
                  var params = {
                      contentId: item.identifier,
                      backState: $state.current.name
                  };
                  $state.go('PreviewContent', params);
              }
          };

          reviewContent.setPage = function (page) {
              if (page < 1 || page > reviewContent.pager.totalPages) {
                  return;
              }
              reviewContent.getReviewContent(page);
          };
      }
  ]);
