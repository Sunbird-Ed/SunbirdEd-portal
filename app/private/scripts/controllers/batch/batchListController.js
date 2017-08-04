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
  .controller('BatchListController', ['$rootScope', 'toasterService', 'batchService',
    '$timeout',
    function($rootScope, toasterService, batchService, $timeout) {
      var batch = this;
      batch.list = [];
      batch.status = 1;
      batch.statusOptions = [
        { name: 'Current', value: 1 },
        { name: 'Upcoming', value: 0 },
        { name: 'Previous', value: 2 },
      ];

      //sematic ui scripts
      $rootScope.$on('$viewContentLoaded', function() {
        $('#batchStatusOptions').dropdown();
      });

      batch.listBatches = function() {
        var req = {
          request: {
            filters: {
              status: batch.status,
              createdFor: $rootScope.organisationIds,
            },
            sort_by: { createdOn: 'desc' },
            offset: 0,
            limit: 10
          }
        }
        //batchService.getAllBatchs(req).then()
        console.log('req', JSON.stringify(req));
      };

      batch.listBatches();
    }
  ]);
