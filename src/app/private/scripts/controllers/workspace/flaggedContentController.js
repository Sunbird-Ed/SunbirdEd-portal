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
      '$rootScope', '$state', 'toasterService', 'PaginationService',
      function (contentService,
      searchService, config, $rootScope, $state, toasterService, PaginationService) {
          var flaggedContent = this;
          flaggedContent.userId = $rootScope.userId;
          flaggedContent.contentStatus = ['Flagged'];
          flaggedContent.sortBy = 'desc';
          flaggedContent.pageLimit = 9;
          flaggedContent.pager = {};

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

          flaggedContent.getAllFlaggedContent = function (pageNumber) {
              pageNumber = pageNumber || 1;
              flaggedContent.loader = toasterService.loader('', $rootScope.errorMessages
          .WORKSPACE.FLAGGED.START);
              flaggedContent.error = {};

              var request = {
                  filters: {
                      status: flaggedContent.contentStatus,
                      createdFor: $rootScope.organisationIds,
                      objectType: 'Content',
                      contentType: config.contributeContentType
                  },
                  sort_by: {
                      lastUpdatedOn: flaggedContent.sortBy
                  },
                  offset: (pageNumber - 1) * flaggedContent.pageLimit,
                  limit: flaggedContent.pageLimit
              };

              searchService.search(request).then(function (res) {
                  if (res && res.responseCode === 'OK') {
                      flaggedContent.loader.showLoader = false;
                      flaggedContent.error.showError = false;
                      flaggedContent.flaggedContentData = [];
                      if (res.result.content) {
                          flaggedContent.flaggedContentData =
                res.result.content.filter(function (contentData) {
                    return contentData.createdBy !== flaggedContent.userId;
                });
                      }
                      flaggedContent.totalCount = res.result.count;
                      if (flaggedContent.flaggedContentData.length === 0) {
                          flaggedContent.error = showErrorMessage(true,
                $rootScope.errorMessages.WORKSPACE.FLAGGED.NO_CONTENT,
                $rootScope.errorMessages.COMMON.NO_RESULTS);
                      }
                      flaggedContent.pager = PaginationService.GetPager(res.result.count,
              pageNumber, flaggedContent.pageLimit);
                  } else {
                      flaggedContent.loader.showLoader = false;
                      toasterService.error($rootScope.errorMessages.WORKSPACE.FLAGGED
              .FAILED);
                      flaggedContent.error.showError = false;
                  }
              }).catch(function () {
                  flaggedContent.loader.showLoader = false;
                  toasterService.error($rootScope.errorMessages.WORKSPACE.FLAGGED.FAILED);
                  flaggedContent.error.showError = false;
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

          flaggedContent.setPage = function (page) {
              if (page < 1 || page > flaggedContent.pager.totalPages) {
                  return;
              }
              flaggedContent.getAllFlaggedContent(page);
          };
      }
  ]);
