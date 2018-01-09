'use strict'

angular.module('playerApp')
  .controller('courseConsumptionDashboardCtrl', ['$rootScope', '$scope',
    '$state', '$stateParams', 'toasterService', 'searchService', 'QueryService', 'Visualizer',
    function ($rootScope, $scope, $state, $stateParams, toasterService, searchService, QueryService, Visualizer) {
      // Initialize variables
      var courseDashboard = this
      courseDashboard.chartHeight = 110
      courseDashboard.myCoursesList = []
      courseDashboard.courseIdentifier = ''
      courseDashboard.courseName = ''
      courseDashboard.filterTimePeriod = '7d'
      courseDashboard.filterQueryTextMsg = '7 days'

      // Dataset - consumption
      courseDashboard.dataset = 'consumption'

      var getInstanceObj = new QueryService.CreateNewInstance({ eid: 'courseConsumption' })
      var chart = new Visualizer({ type: 'line' })

      // Variables to show loader/errorMsg/warningMsg
      spinner(true)
      courseDashboard.showError = false
      courseDashboard.showLabelFlag = false
      courseDashboard.errorMsg = ''
      courseDashboard.showWarningMsg = false

      /**
       * @Function to load dashboard
       * @params apis request body
       * @return void
       */
      courseDashboard.getCourseDashboardData = function () {
        courseDashboard.filterTimePeriod = courseDashboard.filterTimePeriod ? courseDashboard.filterTimePeriod : '7d'
        getInstanceObj.getData({
          identifier: courseDashboard.courseIdentifier,
          timePeriod: courseDashboard.filterTimePeriod
        }).then(function (data) {
          courseDashboard.data = chart.render(data)
          courseDashboard.consumptionNumericData = data.numericData
          spinner(false)
          courseDashboard.showError = false
        }).catch(function (apiResponse) {
          toasterService.error(apiResponse.params.errmsg)
        })
      }

      courseDashboard.onAfterFilterChange = function (item) {
        // Check old filter value. If old value and new filter value are same
        if (courseDashboard.filterTimePeriod === angular.element(item).data('timeperiod')) {
          return false
        }
        spinner(true)
        courseDashboard.filterTimePeriod = angular.element(item).data('timeperiod')
        courseDashboard.filterQueryTextMsg = angular.element(item).data('timeperiod-text')
        courseDashboard.isMultipleCourses = false
        courseDashboard.getCourseDashboardData()
      }

      courseDashboard.loadData = function () {
        var request = {
          filters: {
            status: ['Live'],
            createdBy: $rootScope.userId,
            contentType: ['Course']
          },
          sort_by: {
            lastUpdatedOn: 'desc'
          }
        }

        // Make api call to get list of my courses
        searchService.search(request).then(function (apiResponse) {
          if (apiResponse && apiResponse.responseCode === 'OK') {
            if (apiResponse.result.content && apiResponse.result.content.length > 0) {
              courseDashboard.myCoursesList = apiResponse.result.content

              console.log(' courseDashboard.myCoursesList ', courseDashboard.myCoursesList)
              courseDashboard.buildMyCoursesDropdown()
            } else {
              spinner(false)
              courseDashboard.showWarningMsg = true
            }
          } else {
            // Show error div
            courseDashboard.showErrors(apiResponse)
          }
        }).catch(function (apiResponse) {
          // Show error div
          courseDashboard.showErrors(apiResponse)
        })
      }

      courseDashboard.buildMyCoursesDropdown = function () {
        if (courseDashboard.myCoursesList.length === 1) {
          courseDashboard.showLabelFlag = true
          var firstChild = _.first(_.values(courseDashboard.myCoursesList), 1)
          courseDashboard.courseIdentifier = firstChild.identifier
          courseDashboard.courseName = firstChild.name
          courseDashboard.getCourseDashboardData('7d')
        } else {
          spinner(false)
          courseDashboard.isMultipleCourses = courseDashboard.myCoursesList.length > 1
        }
      }

      /**
       * @method spinner
       * @change value of spinner
       * @param {string}  data
       */
      function spinner (data) {
        courseDashboard.showLoader = data
      }

      courseDashboard.showErrors = function (apiResponse) {
        courseDashboard.showError = true
        spinner(false)
        courseDashboard.errorMsg = apiResponse.params.errmsg
        toasterService.error(apiResponse.params.errmsg)
      }

      courseDashboard.onAfterCourseChange = function (courseId, courseName) {
        if (courseDashboard.courseIdentifier === courseId) {
          return false
        }
        spinner(true)
        courseDashboard.courseIdentifier = courseId
        courseDashboard.courseName = courseName
        courseDashboard.isMultipleCourses = false
        courseDashboard.getCourseDashboardData()
      }

      courseDashboard.initDropdwon = function () {
        $('#myCoursesListFilter').dropdown({
          onChange: function () {}
        })
      }
    }
  ])
