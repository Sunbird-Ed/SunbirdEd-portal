'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:orgAdminCreationDashboardCtrl
 * @description
 * # orgAdminCreationDashboardCtrl
 * Controller of the playerApp
 */

angular.module('playerApp')
  .controller('orgDashboardController', ['$rootScope', '$scope',
    'dashboardService', '$timeout', '$state', '$stateParams', 'toasterService',
    function($rootScope, $scope, dashboardService, $timeout, $state, $stateParams, toasterService) {
      var dashboardData = this;
      dashboardData.showLoader = true;
      dashboardData.datasetPreviousValue = 'creation';

      /**
       * @Function to load dashboard
       * @params apis request body
       * @return void
       */
      dashboardData.getAdminDashboardData = function(timePeriod) {
        timePeriod = timePeriod || '7d';
        var requestBody = {
          org_id: $stateParams.orgId,
          period: timePeriod
        };

        dashboardService.getAdminDashboardData(requestBody, dashboardData.datasetPreviousValue).then(function(apiResponse) {

            dashboardData.series = [];
            dashboardData.labels = [];
            dashboardData.numericStatArray = [];
            dashboardData.data = [];

            if (apiResponse && apiResponse.responseCode === 'OK') {
              if (dashboardData.datasetPreviousValue == 'creation') {
                angular.forEach(apiResponse.result.snapshot, function(numericData, key) {
                  if (key === 'org.creation.authors.count' || key === 'org.creation.reviewers.count' || key === 'org.creation.content.count') {
                    dashboardData.numericStatArray.push(numericData);
                  }
                  if (key === 'org.creation.content[@status=published].count') {
                    dashboardData.series.push(numericData.value + ' LIVE');
                  }

                  if (key === 'org.creation.content[@status=draft].count') {
                    dashboardData.series.push(numericData.value + ' DRAFTS');
                  }

                  if (key === 'org.creation.content[@status=review].count') {
                    dashboardData.series.push(numericData.value + ' IN REVIEW');
                  }
                });

                angular.forEach(apiResponse.result.series, function(bucketData, key) {
                  if (key === 'org.creation.content[@status=draft].count') {
                    var draftArray = new Array();
                    angular.forEach(bucketData.buckets, function(bucketValue, bucketKey) {
                      draftArray.push(bucketValue.value);
                      dashboardData.labels.push(bucketValue.key_name);
                    })
                    dashboardData.data.push(draftArray);
                  }

                  if (key === 'org.creation.content[@status=review].count') {
                    var reviewArray = new Array();
                    angular.forEach(bucketData.buckets, function(bucketValue, bucketKey) {
                      reviewArray.push(bucketValue.value);
                    })
                    dashboardData.data.push(reviewArray);
                  }

                  if (key === 'org.creation.content[@status=published].published_on.count') {
                    var publishedArray = new Array();
                    angular.forEach(bucketData.buckets, function(bucketValue, bucketKey) {
                      publishedArray.push(bucketValue.value);
                    })
                    dashboardData.data.push(publishedArray);
                  }
                });

               dashboardData.options = {legend: { display: true }};

                dashboardData.colors = [{
                    backgroundColor: '#0062ff',
                    borderColor: '#0062ff',
                    fill: false
                  },
                  {
                    backgroundColor: '#FF0000',
                    borderColor: '#FF0000',
                    fill: false
                  },
                  {
                    backgroundColor: '#006400',
                    borderColor: '#006400',
                    fill: false
                  }
                ];
              } else if (dashboardData.datasetPreviousValue == 'consumption') {
                angular.forEach(apiResponse.result.snapshot, function(numericData, key) {
                  if (key === 'org.consumption.content.session.count' || key === 'org.consumption.content.time_spent.sum' || key === 'org.consumption.content.time_spent.average') {

                    if (key === 'org.consumption.content.time_spent.sum' || key === 'org.consumption.content.time_spent.average') {

                      var result = '';
                      var iNum = '';

                      if (numericData.value < 60) {
                        numericData.value = numericData.value + ' second';
                      } else if (numericData.value >= 60 && numericData.value <= 3600) {
                        iNum = numericData.value / 60;
                        result = iNum.toFixed(2)
                        numericData.value = result + ' min';
                      } else if (numericData.value >= 3600) {
                        iNum = numericData.value / 3600;
                        result = iNum.toFixed(2);
                        numericData.value = result + ' hour';
                      }

                      dashboardData.numericStatArray.push(numericData);
                    } else {
                      dashboardData.numericStatArray.push(numericData);
                    }
                  }
                });

                angular.forEach(apiResponse.result.series, function(bucketData, key) {
                  if (key === 'org.consumption.content.time_spent.sum') {
                    var draftArray = new Array();
                    angular.forEach(bucketData.buckets, function(bucketValue, bucketKey) {
                      draftArray.push(bucketValue.value);
                      dashboardData.labels.push(bucketValue.key_name);
                    })
                    dashboardData.data.push(draftArray);
                  }

                });

                dashboardData.series = ['Time spent by day'];
                dashboardData.options = {legend: { display: true }};

                dashboardData.colors = [{
                  backgroundColor: '#0062ff',
                  borderColor: '#0062ff',
                  fill: false
                }];
              }
              dashboardData.apiResponse = apiResponse;
            } else {
				toasterService.error(apiResponse.params.errmsg);
			}
          })
          .catch(function(err) {
            console.log(err);
          })
          .finally(function() {
            // Hide loading spinner whether our call succeeded or failed.
			dashboardData.showLoader = false;
          });
      }
      $('.ui.dropdown').dropdown();

      /**
       * @Trigger onAfterFilterChange
       * @Params timePeriod
       */
      dashboardData.onAfterFilterChange = function(timePeriod) {
        dashboardData.showLoader = true;
        //Adding active class
        $('.text').removeClass('active');
        $('#' + timePeriod).addClass('active');

        dashboardData.getAdminDashboardData(timePeriod);
      };

      /**
       * @Trigger onAfterFilterChange
       * @Params timePeriod
       */
      dashboardData.onAfterDatasetChange = function(dataset) {
        dashboardData.showLoader = true;
        // To avoid same
        if (dashboardData.datasetPreviousValue === dataset) {
          return false;
        }
        dashboardData.datasetPreviousValue = dataset;

        //Adding active class
        $('.text').removeClass('active');
        $('#7d').addClass('active');

        dashboardData.getAdminDashboardData();
      };

      dashboardData.getAdminDashboardData();
    }
  ]);
