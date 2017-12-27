'use strict'

angular.module('playerApp')
  .controller('courseCreatorDashboardCtrl', ['$rootScope', '$scope',
    '$state', '$stateParams', 'toasterService', 'searchService', 'QueryService',
    function ($rootScope, $scope, $state, $stateParams, toasterService, searchService, QueryService) {
      var courseDashboard = this
      courseDashboard.dataset = 'consumption'
      courseDashboard.objQueryClient = new QueryService({key: 'courseDataSource'})

      /**
       * @Function to load dashboard
       * @params apis request body
       * @return void
       */
      courseDashboard.getCourseDashboardData = function () {
        courseDashboard.filterTimePeriod = courseDashboard.filterTimePeriod ? courseDashboard.filterTimePeriod : '7d'
        courseDashboard.objQueryClient.query({
          eid: 'courseDataSource',
          request: {
            courseId: courseDashboard.courseIdentifier,
            timePeriod: courseDashboard.filterTimePeriod
          },
          dataset: 'consumption'
        }).then(function (apiResponse) {
          console.log('apiResponse received===', apiResponse)
        }).catch(function (apiResponse) {
          toasterService.error(apiResponse.params.errmsg)
        })
      }

      courseDashboard.onAfterFilterChange = function (item) {
        if (courseDashboard.filterTimePeriod === angular.element(item).data('timeperiod')) {
          console.log('avoid same apis call twice')
          return false
        }
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
          console.log(apiResponse)
          if (apiResponse && apiResponse.responseCode === 'OK') {
            if (apiResponse.result.content && apiResponse.result.content.length > 0) {
              courseDashboard.myCoursesList = apiResponse.result.content
              courseDashboard.buildMyCoursesDropdown()
            } else {
              courseDashboard.showLoader = false
              courseDashboard.showWarningMsg = true
            }
          } else {
            courseDashboard.showErrors(apiResponse)
          }
        }).catch(function (apiResponse) {
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
          courseDashboard.isMultipleCourses = courseDashboard.myCoursesList.length > 1
        }
      }

      courseDashboard.showErrors = function (apiResponse) {
        toasterService.error(apiResponse.params.errmsg)
      }

      courseDashboard.onAfterCourseChange = function (courseId, courseName) {
        courseDashboard.courseIdentifier = courseId
        courseDashboard.getCourseDashboardData()
      }

      courseDashboard.initDropdwon = function () {
        $('#myCoursesListFilter').dropdown({
          onChange: function () {}
        })
      }
    }
  ])
