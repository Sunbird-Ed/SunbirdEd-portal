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
    function($rootScope, toasterService, batchService, $state) {
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
            batch.batchList = [{"identifier":"do_123454","name":"Batch1","description":"description1","courseId":"do_212296625948319744173","createdBy":"89cf1a7e-dfd3-46c9-a428-d37e9a2bc001","enrollmenttype":"open","startdate":"2017-07-27","enddate":"2017-08-27","status":"1","users":["User1","User2"],"mentors":["Mentor1","Mentor2"]},{"identifier":"do_123455","name":"Batch2","description":"description2","courseId":"do_212296625948319744173","createdBy":"89cf1a7e-dfd3-46c9-a428-d37e9a2bc001","enrollmenttype":"open","startdate":"2017-08-27","enddate":"2017-09-27","status":"0","users":["User3","User4"],"mentors":["Mentor3","Mentor5"]},{"identifier":"do_123456","name":"Batch3","description":"description3","courseId":"do_212296625948319744173","createdBy":"89cf1a7e-dfd3-46c9-a428-d37e9a2bc001","enrollmenttype":"open","startdate":"2017-07-27","enddate":"2017-08-03","status":"2","users":["User3","User6"],"mentors":["Mentor5","Mentor3"]}];
        };

        batch.listBatches();

        batch.showUpdateBatchModal = function(batchData){
            batchService.setBatchData(batchData);
            $state.go('updateBatch', {batchId: batchData.identifier});
        }
    }
]);
