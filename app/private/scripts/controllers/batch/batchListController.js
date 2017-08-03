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
  .controller('BatchListController', ['$rootScope', 'toasterService', 'batchService', function($rootScope, toasterService, batchService) {
    var batch = this;
    batch.list = [];
    batch.status = 0;
    batch.statusOptions = [
      { name: 'Current', value: 1 },
      { name: 'Upcoming', value: 0 },
      { name: 'Previous', value: 2 },
    ];
    batch.listBatches = function() {
      var req = {
        request: {
          filters: {
            status: batch.status,
            createdFor: $rootScope.organisationIds,
          },
          sort_by: { createdOn: desc },
          offset: 0,
          limit: 10
        }
      }
      var api = 'createApi';
      batch[api] = {};
      noteCard[api].loader = toasterService.loader('', noteCard.messages.CREATE.START);
      batchService.getAllBatchs(req).then()

    };


  }]);
