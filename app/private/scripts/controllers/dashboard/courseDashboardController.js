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
  		courseDashboard.filterTimePeriod = '7d'; // Default value

  		// Dataset - progress / consumption
  		courseDashboard.dataset = 'progress';
  		var currentUserRoles = permissionsService.getCurrentUserRoles();
  		console.log(currentUserRoles);
		/*var userRolesLookup  = ['COURSE_ADMIN','COURSE_CREATOR'];
		Check logged user has both roles to show progress, and consumption dropdwon values
		courseDashboard.bothRolesUser    = _.every(userRolesLookup, _.partial(_.includes, currentUserRoles));
		if(!courseDashboard.bothRolesUser){
	  		angular.forEach(currentUserRoles, function(roleName, key){
	  			if (roleName === 'COURSE_CREATOR'){
	  				//courseDashboard.dataset = 'consumption';
	  			}
	  		})
  		}*/

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
		function getCourseDashboardData(filterTimePeriod){
			// Build request body
			courseDashboard.filterTimePeriod = courseDashboard.filterTimePeriod ? courseDashboard.filterTimePeriod : '7d';

			var request = {
				courseId: $stateParams.courseId,
				timePeriod: courseDashboard.filterTimePeriod
			};

			dashboardService.getCourseDashboardData(request, courseDashboard.dataset).then(function (apiResponse) {

				courseDashboard.consumptionNumericData = [];
				console.log('in controller');
				console.log(apiResponse);

				if (apiResponse && apiResponse.responseCode === 'OK'){
					if(courseDashboard.dataset === 'progress'){
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
		 * @Params filterTimePeriod
		 * @Return {[type]} [description]
		 */
		courseDashboard.onAfterFilterChange = function (item){
			// Check old filter value. If old value and new filter value are same
			if (courseDashboard.filterTimePeriod === angular.element(item).data('timeperiod')){
				console.log('avoid same apis call twice');
				return false;
			}

			courseDashboard.showLoader   = true;
			courseDashboard.orderByField = '';
			courseDashboard.filterTimePeriod   = angular.element(item).data('timeperiod');
			courseDashboard.filterQueryTextMsg = angular.element(item).data('timeperiod-text');
			getCourseDashboardData(courseDashboard.filterTimePeriod);
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
