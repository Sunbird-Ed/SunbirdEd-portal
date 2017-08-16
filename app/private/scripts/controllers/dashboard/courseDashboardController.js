'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller: courseAdminCreationDashboard
 * @description: courseDashboardCtrl controller of the playerApp
 * @author: nilesh_m@tekditechnologies.com
 */
angular.module('playerApp')
    .controller('courseDashboardCtrl',
    	['$rootScope', '$scope', 'dashboardService', '$timeout', '$state', '$stateParams', 'toasterService',
    	'permissionsService', function ($rootScope, $scope, dashboardService, $timeout, $state, $stateParams, toasterService, permissionsService) {
		var courseDashboard = this;
		courseDashboard.chartHeight = 120;
  		courseDashboard.courseProgressArray = [];
  		courseDashboard.filterQueryTextMsg = '7 days'; // Default value
  		courseDashboard.timePeriod = '7d'; // Default value

  		// Dataset - progress / consumption
  		courseDashboard.selectedDataset = 'progress';
  		console.log(permissionsService.getCurrentUserRoles())
  		angular.forEach(permissionsService.getCurrentUserRoles(), function(roleName, key){
  			if (roleName === 'COURSE_CREATOR'){
  				courseDashboard.selectedDataset = 'consumption';
  			}
  		})

  		// Search and sort table data
  		courseDashboard.orderByField = ''; // Default value
  		courseDashboard.reverseSort  = false;
  		courseDashboard.searchUser   = ''; // Dafault value for free text search

  		// Variables to show loader/errorMsg
  		courseDashboard.showLoader = true;
  		courseDashboard.showError  = false;
  		courseDashboard.errorMsg   = '';

		/**
		 * @Function to load dashboard
		 * @params apis request body
		 * @return void
		 */
		function getCourseDashboardData(timePeriod){
			// Build request body
			courseDashboard.timePeriod = courseDashboard.timePeriod ? courseDashboard.timePeriod : '7d';

			var request = {
				courseId: $stateParams.courseId,
				timePeriod: courseDashboard.timePeriod
			};

			dashboardService.getCourseDashboardData(request, courseDashboard.selectedDataset).then(function (apiResponse) {

				courseDashboard.consumptionNumericData = [];
				console.log('in controller');
				console.log(apiResponse);

				if (apiResponse && apiResponse.responseCode === 'OK'){
					if(courseDashboard.selectedDataset === 'progress'){
						console.log('In progress......');
						angular.forEach(apiResponse.result.series, function(seriesData, key) {
	  						if(key === 'course.progress.course_progress_per_user.count'){
	  							angular.forEach(seriesData, function(bucketData, key){
	  								if (key === 'buckets'){
	  									courseDashboard.courseProgressArray = bucketData;
	  								}
	  							})
	  						}
						});
					}

					if(courseDashboard.selectedDataset === 'consumption' && apiResponse.result.snapshot){
						courseDashboard.labels = [];
						courseDashboard.data   = [];
						courseDashboard.series = [];

						// To print block data
						angular.forEach(apiResponse.result.snapshot,function(numericData, key){
							if (key != 'course.consumption.users_completed'){
								dashboardService.secondsToMin(numericData)
							}
							courseDashboard.consumptionNumericData.push(numericData);
						})

						// To print line chart
						angular.forEach(apiResponse.result.series,function(linechartData, key){
							if(key === 'course.consumption.time_spent'){
								// Push legend series label
								courseDashboard.series.push(linechartData.name);
								var lineDataArray = new Array();
								// Iterate day/week/month wise data
								angular.forEach(linechartData.buckets, function(bucketValue, bucketKey){
									lineDataArray.push(bucketValue.value);
                     				courseDashboard.labels.push(bucketValue.key_name);
								})

								courseDashboard.data.push(lineDataArray);
							}
						})

						courseDashboard.options = dashboardService.getChartOptions('consumption');
            			courseDashboard.colors  = dashboardService.getChartColors('consumption');
					}

					courseDashboard.showLoader = false;
					courseDashboard.showError  = false;
				} else {
					// Show error div
					courseDashboard.showErrors(apiResponse);
				}
				console.log('Response received');
			}).catch(function (apiResponse) {
				// Show error div
				courseDashboard.showErrors(apiResponse);
			});
		}

		/**
		 * @Function onAfterFilterChange
		 * @Description load data based on selected filter
		 * @Params timePeriod
		 * @Return {[type]} [description]
		 */
		courseDashboard.onAfterFilterChange = function (item){
			// Check old filter value. If old value and new filter value are same
			if (courseDashboard.timePeriod === angular.element(item).data('timeperiod')){
				console.log('avoid same apis call twice');
				return false;
			}

			courseDashboard.timePeriod   = angular.element(item).data('timeperiod');
			courseDashboard.showLoader   = true;
			courseDashboard.orderByField = '';
			courseDashboard.filterQueryTextMsg = angular.element(item).data('timeperiod-text');
			getCourseDashboardData(courseDashboard.timePeriod);
		};

		/**
		 * @Function onAfterDatasetChange
		 * @Description load data based on selected filter
		 * @Params timePeriod
		 * @Return {[type]} [description]
		 */
		courseDashboard.onAfterDatasetChange = function (item){
			// Check old filter value. If old value and new filter value are same
			if (courseDashboard.selectedDataset === angular.element(item).data('dataset')){
				console.log('avoid same apis call twice');
				return false;
			}

			courseDashboard.timePeriod   = courseDashboard.timePeriod;
			courseDashboard.showLoader   = true;
			courseDashboard.orderByField = '';
			courseDashboard.selectedDataset = angular.element(item).data('dataset');
			getCourseDashboardData();
		};

		/**
		 * @Function loadData
		 * @Description load data
		 * @Params
		 * @Return void
		 */
		courseDashboard.loadData = function(){
			getCourseDashboardData('7d');
		};

		/**
		 * @Function resetDropdown
		 * @Description reset dropdown values when user close the dashboard / resume course
		 * @Params
		 * @Return void
		 */
		courseDashboard.resetDropdown = function(){
			$('#courseDropdownValues').dropdown('restore defaults');
		};

		/**
		 * @function showErrors
		 * @description show error messages
		 * @param {object} [apiResponse]
		 */
		courseDashboard.showErrors = function(apiResponse){
			courseDashboard.showError  = true;
			courseDashboard.showLoader = false;
			courseDashboard.errorMsg   = apiResponse.params.errmsg;
			console.log(apiResponse.params.errmsg);
			toasterService.error(apiResponse.params.errmsg);
		};

		courseDashboard.initDropdwon = function(){
			$('#courseDropdownMenu').dropdown();
		};
	}])
