'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller: courseAdminCreationDashboard
 * @description: courseDashboardCtrl controller of the playerApp
 * @author: nilesh_m@tekditechnologies.com
 */
angular.module('playerApp')
    .controller('courseCreatorDashboardCtrl',
    	['$rootScope', '$scope', 'dashboardService', '$timeout', '$state', '$stateParams', 'toasterService',
    	'permissionsService', 'learnService', function ($rootScope, $scope, dashboardService, $timeout, $state, $stateParams, toasterService, permissionsService, learnService) {

    	// Initialize variables
		var courseDashboard = this;
		courseDashboard.chartHeight = 120;
  		courseDashboard.filterQueryTextMsg = '7 days';
  		courseDashboard.filterTimePeriod = '7d';
  		courseDashboard.myCoursesList = [];
  		courseDashboard.courseIdentifier = '';

  		// Dataset - consumption
  		courseDashboard.dataset = 'consumption';

  		// Variables to show loader/errorMsg
  		courseDashboard.showLoader = true;
  		courseDashboard.showError  = false;
  		courseDashboard.errorMsg   = '';

		/**
		 * @Function to load dashboard
		 * @params apis request body
		 * @return void
		 */
		function getCourseDashboardData(){
			// Build request body
			courseDashboard.filterTimePeriod = courseDashboard.filterTimePeriod ? courseDashboard.filterTimePeriod : '7d';
			var request = {
				courseId: courseDashboard.courseIdentifier,
				timePeriod: courseDashboard.filterTimePeriod
			};

			// Call dashboard service
			dashboardService.getCourseDashboardData(request, courseDashboard.dataset).then(function (apiResponse) {
				courseDashboard.consumptionNumericData = [];

				if (apiResponse && apiResponse.responseCode === 'OK'){
					courseDashboard.labels = [];
					courseDashboard.data   = [];
					courseDashboard.series = [];
					var yAxisLable         = 'Timespent for content consumption';

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
							yAxisLable = linechartData.name;
							var lineDataArray = new Array();
							// Iterate day/week/month wise data
							angular.forEach(linechartData.buckets, function(bucketValue, bucketKey){
								lineDataArray.push(bucketValue.value);
                 				courseDashboard.labels.push(bucketValue.key_name);
							})

							courseDashboard.data.push(lineDataArray);
						}
					})

					// Get chart options and colors
					courseDashboard.options = dashboardService.getChartOptions(yAxisLable);
        			courseDashboard.colors  = dashboardService.getChartColors('consumption');

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
		 * @Params item
		 * @Return {[type]} [description]
		 */
		courseDashboard.onAfterFilterChange = function (item){
			// Check old filter value. If old value and new filter value are same
			if (courseDashboard.filterTimePeriod === angular.element(item).data('timeperiod')){
				console.log('avoid same apis call twice');
				return false;
			}

			courseDashboard.filterTimePeriod   = angular.element(item).data('timeperiod');
			courseDashboard.filterQueryTextMsg = angular.element(item).data('timeperiod-text');
			courseDashboard.showLoader         = true;
			getCourseDashboardData();
		};

		/**
		 * @Function loadData
		 * @Description load data
		 * @Params
		 * @Return void
		 */
		courseDashboard.loadData = function(){
			// Get list of my courses
			learnService.enrolledCourses($rootScope.userId).then(function (apiResponse) {
	            if (apiResponse && apiResponse.responseCode === 'OK' && apiResponse.result.courses.length > 0) {
               		courseDashboard.myCoursesList = apiResponse.result.courses;
	               	var firstChild = _.first(_.values(courseDashboard.myCoursesList), 1);
	               	courseDashboard.courseIdentifier = firstChild.courseId;
	               	getCourseDashboardData('7d');
	            } else {
	            	// Show error div
					courseDashboard.showErrors(apiResponse);
	            }
	        }).catch(function (apiResponse) {
	            // Show error div
				courseDashboard.showErrors(apiResponse);
	        });
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
			toasterService.error(apiResponse.params.errmsg);
		};

		courseDashboard.onAfterCourseChange = function(courseId){
			if (courseDashboard.courseIdentifier == courseId){
				console.log('avoid same apis call twice');
				return false;
			}

			courseDashboard.courseIdentifier = courseId;
			courseDashboard.showLoader       = true;
			getCourseDashboardData();
		}
		/**
		 * @Function initMyCoursesDropdown
		 * @Description show list my courses
		 * @return  {[type]}  [description]
		 */
		courseDashboard.initDropdwon = function(){
			$('#myCoursesListFilter').dropdown({
				onChange: function(){}
			});
		};
	}])
