'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller.batch:BatchListController
 * @author Harish Kumar Gangula
 * @description
 * # BatchListController
 * Controller of the playerApp
 */

angular.module('playerApp')
  .controller('BatchListController', ['$rootScope', 'toasterService', 'batchService', '$state',
      'userService', 'PaginationService', function ($rootScope, toasterService, batchService,
         $state, userService, PaginationService) {
          var batch = this;
          batch.userId = $rootScope.userId;
          batch.list = [];
          batch.status = 1;
          batch.statusOptions = [
            { name: 'Ongoing Batches', value: 1 },
            { name: 'Upcoming Batches', value: 0 },
            { name: 'Previous Batches', value: 2 }
          ];
          $('#batchStatusOptions').dropdown();
          batch.pageLimit = 9;
          batch.pager = {};
          
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

          batch.listBatches = function (pageNumber) {
              pageNumber = pageNumber || 1;
              var req = {
                  request: {
                      filters: {
                          status: batch.status.toString(),
                          createdFor: $rootScope.organisationIds,
                          createdBy: batch.userId
                      },
                      sort_by: { createdDate: 'desc' },
                      offset: (pageNumber - 1) * batch.pageLimit,
                      limit: batch.pageLimit
                  }
              };

              batchService.getAllBatchs(req).then(function (response) {
                  if (response && response.responseCode === 'OK') {
                      batch.userList = [];
                      batch.userNames = [];
                      batch.participants = [];
                      _.forEach(response.result.response.content, function (val) {
                          batch.userList.push(val.createdBy);
                          batch.participants[val.id] = !_.isUndefined(val.participant) ? _.size(val.participant) : 0;
                      });
                      batch.userList = _.compact(_.uniq(batch.userList));
                      var req = {
                          request: {
                              filters: {
                                  identifier: batch.userList
                              }
                          }
                      };
                      batchService.getUserList(req).then(function (res) {
                          if (res && res.responseCode === 'OK') {
                              _.forEach(res.result.response.content, function (val) {
                                  batch.userNames[val.identifier] = val.firstName + ' ' + val.lastName;
                              });
                          } else {
                              toasterService.error(errorMessages.BATCH.GET_USERS.FAILED);
                          }
                      }).catch(function () {
                          toasterService.error(errorMessages.BATCH.GET_USERS.FAILED);
                      });
                      batch.batchList = response.result.response.content || [];
                      batch.totalCount = response.result.response.count;
                      batch.pager = PaginationService.GetPager(response.result.response.count,
                        pageNumber, batch.pageLimit);
                      if (batch.batchList.length === 0) {
                              batch.error = showErrorMessage(true,
                                $rootScope.errorMessages.WORKSPACE.BATCHES.NO_CONTENT,
                                $rootScope.errorMessages.COMMON.NO_RESULTS);
                          }
                  } else {
                      toasterService.error(errorMessages.BATCH.SEARCH.FAILED);
                  }
              }).catch(function () {
                  toasterService.error(errorMessages.BATCH.SEARCH.FAILED);
              });
          };

          batch.listBatches();

          batch.showUpdateBatchModal = function (batchData) {
              batchService.setBatchData(batchData);
              $state.go('updateBatch', { batchId: batchData.identifier });
          };

          batch.setPage = function (page) {
              if (page < 1 || page > batch.pager.totalPages) {
                  return;
              }
              batch.listBatches(page);
          };
      }
  ]);
