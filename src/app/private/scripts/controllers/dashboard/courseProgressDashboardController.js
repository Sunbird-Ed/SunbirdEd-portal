'use strict'

angular.module('playerApp')
  .controller('courseProgressDashboardCtrl', ['$rootScope', '$scope', 'QueryService',
    '$timeout', '$state', '$stateParams', 'toasterService',
    'batchService',
    function ($rootScope, $scope, QueryService, $timeout, $state, $stateParams, toasterService, batchService) {
      var courseDashboard = this
      courseDashboard.showError = false
      spinner(true)
      var downloadInstanceObj = new QueryService.CreateNewInstance({ eid: 'downloadReport' })
      var filterDesc = {
        '7d': $rootScope.messages.imsg.m0022,
        '14d': $rootScope.messages.imsg.m0023,
        '5w': $rootScope.messages.imsg.m0024,
        'fromBegining': $rootScope.messages.imsg.m0025
      }

      /**
     * @method getCourseDashboardData
     * @desc get batch details based on time period
     * @memberOf Services.courseProgressDashboardCtrl
     * @param {string}  timePeriod - timePeriod
     */
      courseDashboard.getCourseDashboardData = function (timePeriod) {
        spinner(true)
        courseDashboard.timePeriod = timePeriod || '7d'
        courseDashboard.dashboarData = []
        var getInstanceObj = new QueryService.CreateNewInstance({ eid: 'courseProgress' })
        getInstanceObj.getData({
          identifier: courseDashboard.batchIdentifier,
          timePeriod: courseDashboard.timePeriod
        }).then(function (data) {
          courseDashboard.showError = false
          courseDashboard.filterText = filterDesc[courseDashboard.timePeriod]
          courseDashboard.dashboarData = data
          spinner(false)
        }).catch(function (apiResponse) {
          courseDashboard.showErrors()
        })
      }

      /**
     * @method onAfterFilterChange
     * @desc get time perios
     * @memberOf Services.courseProgressDashboardCtrl
     * @param {string}  timeperiod - timeperiod
     */
      courseDashboard.onAfterFilterChange = function (timeperiod) {
        // Check old filter value. If old value and new filter value are same
        if (courseDashboard.timePeriod === timeperiod) {
          console.log('avoid same apis call twice')
          return false
        }
        courseDashboard.orderByField = ''
        courseDashboard.getCourseDashboardData(timeperiod)
      }

      /**
     * @method loadData
     * @desc get my batches list
     * @memberOf Services.courseProgressDashboardCtrl
     */
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
        courseDashboard.searchUser = ''
        batchService.getAllBatchs(request).then(function (response) {
          if (response && response.responseCode === 'OK') {
            if (response.result.response.content.length > 0) {
              courseDashboard.myBatches = response.result.response.content
              courseDashboard.buildMyBatchesDropdown()
            }
          } else {
            courseDashboard.showErrors()
          }
          spinner(false)
        }).catch(function (response) {
          courseDashboard.showErrors()
        })
      }

      /**
     * @method buildMyBatchesDropdown
     * @desc buildMyBatchesDropdown
     * @memberOf Services.courseProgressDashboardCtrl
     */
      courseDashboard.buildMyBatchesDropdown = function () {
        if (courseDashboard.myBatches.length === 1) {
          var firstChild = _.first(_.values(courseDashboard.myBatches), 1)
          courseDashboard.batchIdentifier = firstChild.id
          courseDashboard.courseName = firstChild.name
          courseDashboard.getCourseDashboardData('7d')
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

      /**
     * @method resetDropdown
     * @desc to reset dropdwon values
     * @memberOf Services.courseProgressDashboardCtrl
     * @return void
     */
      courseDashboard.resetDropdown = function () {
        $('#courseDropdownValues').dropdown('restore defaults')
      }

      /**
     * @method showErrors
     * @desc to show error
     * @memberOf Services.courseProgressDashboardCtrl
     * @return void
     */
      courseDashboard.showErrors = function () {
        courseDashboard.showError = true
        spinner(false)
      }

      /**
     * @method initDropdwon
     * @desc init drodwon values
     * @memberOf Services.courseProgressDashboardCtrl
     * @return void
     */
      courseDashboard.initDropdwon = function () {
        $('#myBatchesListFilter').dropdown({})
      }

      /**
     * @method onAfterBatchChange
     * @desc get batchid and batchname
     * @memberOf Services.courseProgressDashboardCtrl
     * @param {string} [batchId] [batch identifier]
     * @return void
     */
      courseDashboard.onAfterBatchChange = function (batchId) {
        if (courseDashboard.batchIdentifier === batchId) {
          console.log('avoid same apis call twice')
          return false
        }
        courseDashboard.batchIdentifier = batchId
        courseDashboard.isMultipleCourses = false
        courseDashboard.getCourseDashboardData(courseDashboard.timePeriod)
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
          timePeriod: courseDashboard.timePeriod
        }, 'COURSE_PROGRESS').then(function (data) {
          courseDashboard.downloadReportText = $rootScope.messages.stmsg.m0095
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
