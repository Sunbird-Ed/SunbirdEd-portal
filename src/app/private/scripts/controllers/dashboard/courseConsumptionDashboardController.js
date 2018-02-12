'use strict'

angular.module('playerApp')
  .controller('courseConsumptionDashboardCtrl', ['$rootScope', '$scope',
    '$state', '$stateParams', 'toasterService', 'searchService', 'QueryService', 'Visualizer',
    'telemetryService', function ($rootScope, $scope, $state, $stateParams, toasterService,
      searchService, QueryService, Visualizer, telemetryService) {
      // Initialize variables
      var courseDashboard = this
      courseDashboard.chartHeight = 110
      spinner(true)
      var getInstanceObj = new QueryService.CreateNewInstance({ eid: 'courseConsumption' })
      var chart = new Visualizer({ type: 'line' })

      /**
       * @Function to load dashboard
       * @params apis request body
       * @return void
       */
      courseDashboard.getCourseDashboardData = function (timePeriod) {
        spinner(true)
        courseDashboard.timePeriod = timePeriod || '7d'
        getInstanceObj.getData({
          identifier: courseDashboard.courseIdentifier,
          timePeriod: courseDashboard.timePeriod
        }).then(function (data) {
          courseDashboard.data = chart.render(data)
          courseDashboard.consumptionNumericData = data.numericData
          spinner(false)
          courseDashboard.showError = false
        }).catch(function (apiResponse) {
          courseDashboard.showErrors()
        })
      }

      courseDashboard.onAfterFilterChange = function (timeperiod) {
        // Check old filter value. If old value and new filter value are same
        if (courseDashboard.timePeriod === timeperiod) {
          return false
        }
        courseDashboard.getCourseDashboardData(timeperiod)
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

        courseDashboard.myCoursesList = []
        searchService.search(request).then(function (apiResponse) {
          if (apiResponse && apiResponse.responseCode === 'OK') {
            if (apiResponse.result.content && apiResponse.result.content.length > 0) {
              courseDashboard.myCoursesList = apiResponse.result.content
              courseDashboard.buildMyCoursesDropdown()
              courseDashboard.version = apiResponse.ver
            } else {
              spinner(false)
            }
          } else {
            courseDashboard.showErrors()
          }
        }).catch(function (apiResponse) {
          courseDashboard.showErrors()
        })
        courseDashboard.generateImpressionEvent('dasboard', 'profile-course-creator-dashboard',
          '/course-creator-dashboard', 'profile', courseDashboard.version)
      }

      courseDashboard.buildMyCoursesDropdown = function () {
        if (courseDashboard.myCoursesList.length === 1) {
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

      courseDashboard.showErrors = function () {
        courseDashboard.showError = true
        spinner(false)
      }

      courseDashboard.onAfterCourseChange = function (courseId) {
        if (courseDashboard.courseIdentifier === courseId) {
          return false
        }
        courseDashboard.courseIdentifier = courseId
        courseDashboard.isMultipleCourses = false
        courseDashboard.getCourseDashboardData(courseDashboard.timePeriod)
      }

      courseDashboard.initDropdwon = function () {
        $('#myCoursesListFilter').dropdown()
      }

      /**
             * This function call to generate Imression
             * telemetry event
             */
      courseDashboard.generateImpressionEvent = function (itemType, pageId, uri, env, objVer) {
        var contextData = {
          env: env,
          rollup: telemetryService.getRollUpData($rootScope.organisationIds)
        }

        var objectData = {
          id: '',
          type: itemType,
          ver: objVer
        }

        var data = {
          edata: telemetryService.impressionEventData('view', 'scroll', pageId, uri),
          context: telemetryService.getContextData(contextData),
          object: telemetryService.getObjectData(objectData),
          tags: $rootScope.organisationIds
        }
        telemetryService.impression(data)
      }
    }
  ])
