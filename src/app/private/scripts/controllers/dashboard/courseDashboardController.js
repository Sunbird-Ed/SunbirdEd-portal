'use strict'

angular.module('playerApp')
  .controller('courseDashboardCtrl', ['$rootScope', '$scope', 'dashboardService', '$timeout', '$state', '$stateParams', 'toasterService',
    'batchService',
    function ($rootScope, $scope, dashboardService, $timeout, $state, $stateParams, toasterService, batchService) {
      var courseDashboard = this
      courseDashboard.chartHeight = 120
      courseDashboard.courseProgressArray = []
      courseDashboard.filterQueryTextMsg = '7 days' // Default value
      courseDashboard.filterTimePeriod = '7d' // Default value

      // Dataset - progress / consumption
      courseDashboard.dataset = 'progress'
      courseDashboard.courseName = 'Progress'

      // Search and sort table data
      courseDashboard.orderByField = '' // Default value
      courseDashboard.reverseSort = false
      courseDashboard.searchUser = '' // Dafault value for free text search

      // Variables to show loader/errorMsg
      courseDashboard.showLoader = true
      courseDashboard.showError = false
      courseDashboard.showLabelFlag = false
      courseDashboard.errorMsg = ''

      function getCourseDashboardData (filterTimePeriod) {
        // Build request body
        courseDashboard.filterTimePeriod = courseDashboard.filterTimePeriod ? courseDashboard.filterTimePeriod : '7d'

        var request = {
          courseId: courseDashboard.batchIdentifier,
          timePeriod: courseDashboard.filterTimePeriod
        }

        dashboardService.getCourseDashboardData(request, courseDashboard.dataset).then(function (apiResponse) {
          courseDashboard.consumptionNumericData = []
          if (apiResponse && apiResponse.responseCode === 'OK') {
            if (courseDashboard.dataset === 'progress') {
              angular.forEach(apiResponse.result.series, function (seriesData, key) {
                if (key === 'course.progress.course_progress_per_user.count') {
                  angular.forEach(seriesData, function (bucketData, key) {
                    if (key === 'buckets') {
                      courseDashboard.courseProgressArray = bucketData
                    }
                  })
                }
              })
            }

            courseDashboard.showLoader = false
            courseDashboard.showError = false
          } else {
            // Show error div
            courseDashboard.showErrors(apiResponse)
          }
        }).catch(function (apiResponse) {
          // Show error div
          courseDashboard.showErrors(apiResponse)
        })
      }

      courseDashboard.onAfterFilterChange = function (item) {
        // Check old filter value. If old value and new filter value are same
        if (courseDashboard.filterTimePeriod === angular.element(item).data('timeperiod')) {
          console.log('avoid same apis call twice')
          return false
        }

        courseDashboard.showLoader = true
        courseDashboard.orderByField = ''
        courseDashboard.filterTimePeriod = angular.element(item).data('timeperiod')
        courseDashboard.filterQueryTextMsg = angular.element(item).data('timeperiod-text')
        getCourseDashboardData(courseDashboard.filterTimePeriod)
      }

      courseDashboard.loadData = function () {
        var request = {
          request: {
            filters: {
              courseId: $stateParams.courseId,
              status: ['1', '2', '3'],
              createdBy: $rootScope.userId
            },
            sort_by: { createdDate: 'desc' }
          }
        }

        courseDashboard.myBatches = []
        batchService.getAllBatchs(request).then(function (response) {
          if (response && response.responseCode === 'OK') {
            if (response.result.response.content.length > 0) {
              courseDashboard.myBatches = response.result.response.content
              courseDashboard.buildMyBatchesDropdown()
            } else {
              courseDashboard.showLoader = false
              courseDashboard.showWarningMsg = true
            }
          } else {
            // Show error div
            courseDashboard.showErrors(apiResponse)
          }
        }).catch(function () {
          courseDashboard.showErrors(apiResponse)
        })
      }

      courseDashboard.buildMyBatchesDropdown = function () {
        if (courseDashboard.myBatches.length === 1) {
          courseDashboard.showLabelFlag = true
          var firstChild = _.first(_.values(courseDashboard.myBatches), 1)
          courseDashboard.batchIdentifier = firstChild.id
          courseDashboard.courseName = firstChild.name
          getCourseDashboardData('7d')
        } else {
          courseDashboard.showLoader = false
          // courseDashboard.showError = true;
          courseDashboard.isMultipleCourses = courseDashboard.myBatches.length > 1
        }
      }

      courseDashboard.resetDropdown = function () {
        $('#courseDropdownValues').dropdown('restore defaults')
      }

      courseDashboard.showErrors = function (apiResponse) {
        courseDashboard.showError = true
        courseDashboard.showLoader = false
        courseDashboard.errorMsg = apiResponse.params.errmsg
        toasterService.error(apiResponse.params.errmsg)
      }

      courseDashboard.initDropdwon = function () {
        $('#myBatchesListFilter').dropdown({
          onChange: function () {}
        })
      }

      courseDashboard.onAfterBatchChange = function (batchId, batchName) {
        if (courseDashboard.batchIdentifier == batchId) {
          console.log('avoid same apis call twice')
          return false
        }
        courseDashboard.showLoader = true
        courseDashboard.batchIdentifier = batchId
        courseDashboard.courseName = batchName
        courseDashboard.isMultipleCourses = false
        getCourseDashboardData()
      }
    }
  ])
