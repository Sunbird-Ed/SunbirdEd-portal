'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:orgAdminCreationDashboardCtrl
 * @description
 * # orgAdminCreationDashboardCtrl
 * Controller of the playerApp
 */

angular.module('playerApp')
    .controller('orgCreationDashboardController', ['$rootScope', '$scope', 'dashboardService', '$timeout', '$state', '$stateParams', 'toasterService', function ($rootScope, $scope, dashboardService, $timeout, $state, $stateParams, toasterService) {
		var dashboardData = this;
		dashboardData.datasetPreviousValue = 'creation';

		/**
		 * @Function to load dashboard
		 * @params apis request body
		 * @return void
		 */
		dashboardData.getAdminDashboardData = function (requestBody){
			$scope.loading = true;
			dashboardService.getAdminDashboardData(requestBody, dashboardData.datasetPreviousValue).then(function (apiResponse) {
				
				
				var apiResponse = apiResponse.data; 

				if (apiResponse && apiResponse.responseCode === 'OK') {
					var graphLabelsArray = [];
					var graphDataArray   = [];
					var numericStatArray = [];
					var seriesArray 	 = [];
					
					var apiResponse = apiResponse.result; // TODO - remove it
					
					angular.forEach(apiResponse.result.snapshot, function( numericData, key ) {
						if (key === 'org.creation.authors.count' || key === 'org.creation.reviewers.count'){
							numericStatArray.push(numericData);
						}
						
						if (key === 'org.creation.content[@status=published].count'){
							seriesArray.push(numericData.value + ' LIVE');
						}
						
						if (key === 'org.creation.content[@status=draft].count'){
							seriesArray.push(numericData.value + ' DRAFTS');
						}
						
						if (key === 'org.creation.content[@status=review].count'){
							seriesArray.push(numericData.value + ' IN REVIEW');
						}
					});

					dashboardData.numericStatArray = numericStatArray;

					var holdLineData = new Array ();
					//var draftArray = new Array();

					angular.forEach(apiResponse.result.series, function( bucketData, key ) {
						if (key === 'org.creation.content[@status=draft].count'){
							var draftArray = new Array();
							angular.forEach(bucketData.buckets, function( bucketValue, bucketKey ) {
								draftArray.push(bucketValue.value);
								graphLabelsArray.push(bucketValue.key_name);
							})

							holdLineData.push(draftArray);
						}

						if (key === 'org.creation.content[@status=review].count'){
							var reviewArray = new Array();
							angular.forEach(bucketData.buckets, function( bucketValue, bucketKey ) {
								reviewArray.push(bucketValue.value);
							})

							holdLineData.push(reviewArray);
						}

						if (key === 'org.creation.content[@status=published].published_on.count'){
							var publishedArray = new Array();
							angular.forEach(bucketData.buckets, function( bucketValue, bucketKey ) {
								publishedArray.push(bucketValue.value);
							})

							holdLineData.push(publishedArray);
						}
					});
					

					$scope.labels = graphLabelsArray;
					$scope.series = seriesArray;
					$scope.options = {
						legend: {display: true },
						showLines: true,
						fill: false,
						line: {
						  fill: false
						}
					}

					$scope.colors = [{
                        backgroundColor : '#0062ff',
                        pointBackgroundColor: '#0062ff',
                        pointHoverBackgroundColor: '#0062ff',
                        borderColor: '#0062ff',
                        pointBorderColor: '#0062ff',
                        pointHoverBorderColor: '#0062ff',
                        fill: false
                    },
                    {
                        backgroundColor : '#FF0000',
                        pointBackgroundColor: '#FF0000',
                        pointHoverBackgroundColor: '#FF0000',
                        borderColor: '#FF0000',
                        pointBorderColor: '#FF0000',
                        pointHoverBorderColor: '#FF0000',
                        fill: false
                    },
                    {
                        backgroundColor : '#006400',
                        pointBackgroundColor: '#006400',
                        pointHoverBackgroundColor: '#006400',
                        borderColor: '#006400',
                        pointBorderColor: '#006400',
                        pointHoverBorderColor: '#006400',
                        fill: false
                    }];

					//$scope.data   = graphDataArray;
					$scope.data  = holdLineData;
					dashboardData.apiResponse = apiResponse;

				} else {
					showEmptyData();
					//dashboardData[api].loader.showLoader = false;
				}
			})
			.catch(function (err) {
			  console.log('underprocess');
			})
			.finally(function () {
				// Hide loading spinner whether our call succeeded or failed.
				$scope.loading = false;
			});
			
			
			
		}

		$('.ui.dropdown').dropdown();

		/**
		 * @Function prepareRequestFilters common for all filters
		 * @Discription build apis request body based on selected filter
		 * @Params timePeriod - 7d/14d/5w
		 * @return void
		 */
		dashboardData.prepareRequestFilters = function (timePeriod){
			var request = {
				org_id: 'sunbird',
				period: timePeriod
			};
			dashboardData.getAdminDashboardData(request);
			console.log(request);
		};

		/**
		 * @Function
		 */
		function showEmptyData()
		{
			var graphLabelsArray = [];
			var graphDataArray   = [];
			var numericStatArray = [];

			$scope.labels = graphLabelsArray;
			$scope.data   = graphDataArray;
			alert(111);
		}

		/**
		 * @Trigger onAfterFilterChange
		 * @Params timePeriod
		 */
		dashboardData.onAfterFilterChange = function (timePeriod){
			dashboardData.datasetPreviousValue = timePeriod === '7d' ? 'creation' : '1m';
			//alert(dashboardData.datasetPreviousValue);
			//dashboardData.prepareRequestFilters(timePeriod);
			
			//Adding active class
			$('.text').removeClass('active');
			$('#' + timePeriod).addClass('active');
			
			dashboardData.prepareRequestFilters(timePeriod);
		};

		/**
		 * @Trigger onAfterFilterChange
		 * @Params timePeriod
		 */
		dashboardData.onAfterDatasetChange = function (dataset){
			// To avoid same
			if (dashboardData.datasetPreviousValue === dataset){
				return false;
			}

			dashboardData.datasetPreviousValue = dataset;
			dashboardData.prepareRequestFilters(dataset);
		};

		dashboardData.prepareRequestFilters('7d');
	}]);
