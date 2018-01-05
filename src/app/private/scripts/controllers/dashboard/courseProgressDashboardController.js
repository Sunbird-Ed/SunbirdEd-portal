'use strict'

angular.module('playerApp')
  .controller('courseProgressDashboardCtrl', ['$rootScope', '$scope', 'QueryService',
    '$timeout', '$state', '$stateParams', 'toasterService',
    'batchService',
    function ($rootScope, $scope, QueryService, $timeout, $state, $stateParams, toasterService, batchService) {
      var courseDashboard = this
      courseDashboard.chartHeight = 120
      courseDashboard.filterQueryTextMsg = '7 days' // Default value
      courseDashboard.filterTimePeriod = '7d' // Default value
      var downloadInstanceObj = new QueryService.CreateNewInstance({ eid: 'downloadReport' })

      // Dataset - progress / consumption
      courseDashboard.courseName = 'Progress'

      // Search and sort table data
      courseDashboard.orderByField = '' // Default value
      courseDashboard.reverseSort = false
      courseDashboard.searchUser = '' // Dafault value for free text search

      // Variables to show loader/errorMsg
      spinner(true)
      courseDashboard.showError = false
      courseDashboard.showLabelFlag = false
      courseDashboard.errorMsg = ''

      function getCourseDashboardData (filterTimePeriod) {
        // Build request body
        courseDashboard.filterTimePeriod = courseDashboard.filterTimePeriod ? courseDashboard.filterTimePeriod : '7d'
        courseDashboard.courseProgressArray = []
        var getInstanceObj = new QueryService.CreateNewInstance({ eid: 'courseProgress' })
        getInstanceObj.getData({
          identifier: courseDashboard.batchIdentifier,
          timePeriod: courseDashboard.filterTimePeriod
        }).then(function (data) {
          courseDashboard.courseProgressArray = data
          spinner(false)
        }).catch(function (apiResponse) {
          toasterService.error(apiResponse.params.errmsg)
        })
      }

      courseDashboard.onAfterFilterChange = function (item) {
        // Check old filter value. If old value and new filter value are same
        if (courseDashboard.filterTimePeriod === angular.element(item).data('timeperiod')) {
          console.log('avoid same apis call twice')
          return false
        }

        spinner(true)
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
              spinner(false)
              courseDashboard.showWarningMsg = true
            }
          } else {
            // Show error div
            courseDashboard.showErrors(response)
          }
        }).catch(function (response) {
          courseDashboard.showErrors(response)
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
          spinner(false)
          courseDashboard.isMultipleCourses = courseDashboard.myBatches.length > 1
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

      courseDashboard.resetDropdown = function () {
        $('#courseDropdownValues').dropdown('restore defaults')
      }

      courseDashboard.showErrors = function (apiResponse) {
        courseDashboard.showError = true
        spinner(false)
        courseDashboard.errorMsg = apiResponse.params.errmsg
        toasterService.error(apiResponse.params.errmsg)
      }

      courseDashboard.initDropdwon = function () {
        $('#myBatchesListFilter').dropdown({
          onChange: function () {}
        })
      }

      courseDashboard.onAfterBatchChange = function (batchId, batchName) {
        if (courseDashboard.batchIdentifier === batchId) {
          console.log('avoid same apis call twice')
          return false
        }
        spinner(true)
        courseDashboard.batchIdentifier = batchId
        courseDashboard.courseName = batchName
        courseDashboard.isMultipleCourses = false
        getCourseDashboardData()
      }

      /**
       * @Function downloadReports
       * @Description - make dowload csv api call
       * @Return  void
       */
      courseDashboard.downloadReport = function () {
        courseDashboard.disabledClass = true
        downloadInstanceObj.download({
          identifier: courseDashboard.batchIdentifier,
          timePeriod: courseDashboard.filterTimePeriod
        }, 'COURSE_PROGRESS').then(function (data) {
          var str = $rootScope.messages.stmsg.m0095
          courseDashboard.downloadReportText = str.replace('{acknowledgementId}',
            data.requestId).replace(/(\(.*\))/g, '')
          $('#downloadReportModal').modal({
            closable: true,
            observeChanges: true
          }).modal('show')
          courseDashboard.disabledClass = false
        }).catch(function (apiResponse) {
          courseDashboard.disabledClass = false
          toasterService.error(apiResponse.params.errmsg)
        })
      }
    }
  ])
