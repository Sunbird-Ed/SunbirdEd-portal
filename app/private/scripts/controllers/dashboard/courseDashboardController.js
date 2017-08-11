'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller: courseAdminCreationDashboard
 * @description: courseDashboardCtrl controller of the playerApp
 * @author: nilesh_m@tekditechnologies.com
 */
angular.module('playerApp')
    .controller('courseDashboardCtrl',
    	['$rootScope', '$scope', 'dashboardService', '$timeout', '$state', '$stateParams', 'toasterService', function ($rootScope, $scope, dashboardService, $timeout, $state, $stateParams, toasterService) {
		var courseDashboard = this;
  		courseDashboard.courseProgressArray = [];
  		courseDashboard.filterQueryTextMsg = '7 days'; // Default value
  		courseDashboard.timePeriod = '7d'; // Default value

  		// Dataset - creation / consumption
  		courseDashboard.selectedDataset = '';

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
			var request = {
				courseId: $stateParams.courseId,
				timePeriod: timePeriod
			};

			dashboardService.getCourseDashboardData(request, courseDashboard.selectedDataset).then(function (apiResponse) {
				if (apiResponse && apiResponse.responseCode === 'OK'){
					console.log('In response');
					console.log(apiResponse.result.series);
					angular.forEach(apiResponse.result.series, function(seriesData, key) {
  						if(key === 'course.progress.course_progress_per_user.count'){
  							angular.forEach(seriesData, function(bucketData, key){
  								if (key === 'buckets'){
  									courseDashboard.courseProgressArray = bucketData;
  								}
  							})
  						}
					});

					courseDashboard.showLoader = false;
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
		}
	}])
