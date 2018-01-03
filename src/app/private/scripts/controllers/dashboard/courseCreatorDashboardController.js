'use strict'

angular.module('playerApp')
  .controller('courseCreatorDashboardCtrl', ['$rootScope', '$scope',
    '$state', '$stateParams', 'toasterService', 'searchService', 'QueryService', 'rendererService',
    function ($rootScope, $scope, $state, $stateParams, toasterService, searchService, QueryService, rendererService) {
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
      courseDashboard.graphShow = 0
      courseDashboard.objQueryClient = new QueryService({key: 'courseConsumptionDataSource'})

      // Variables to show loader/errorMsg/warningMsg
      courseDashboard.showLoader = true
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
        courseDashboard.objQueryClient.query({
          eid: 'courseConsumptionDataSource',
          request: {
            courseId: courseDashboard.courseIdentifier,
            timePeriod: courseDashboard.filterTimePeriod
          },
          dataset: 'consumption'
        }).then(function (data) {
          var rendererData = new rendererService.Render(data)
          courseDashboard.data = rendererData.chartList
          courseDashboard.graphShow = 0
          courseDashboard.showLoader = false
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
        courseDashboard.showLoader = true
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
              courseDashboard.buildMyCoursesDropdown()
            } else {
              courseDashboard.showLoader = false
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
          courseDashboard.showLoader = false
          // courseDashboard.showError = true;
          courseDashboard.isMultipleCourses = courseDashboard.myCoursesList.length > 1
        }
      }

      courseDashboard.showErrors = function (apiResponse) {
        courseDashboard.showError = true
        courseDashboard.showLoader = false
        courseDashboard.errorMsg = apiResponse.params.errmsg
        toasterService.error(apiResponse.params.errmsg)
      }

      courseDashboard.onAfterCourseChange = function (courseId, courseName) {
        if (courseDashboard.courseIdentifier === courseId) {
          return false
        }
        courseDashboard.showLoader = true
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

      courseDashboard.nextGraph = function () {
        courseDashboard.graphShow++
      }

      courseDashboard.previousGraph = function () {
        courseDashboard.graphShow--
      }
    }
  ])
