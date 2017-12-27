'use strict'

angular.module('playerApp')
  .controller('orgDashboardController', ['$rootScope', '$scope',
    '$timeout', '$state', '$stateParams', 'toasterService', 'adminService', 'QueryService', 'renderChart',
    function ($rootScope, $scope, $timeout, $state, $stateParams, toasterService,
      adminService, QueryService, renderChart) {
      var dashboardData = this
      dashboardData.height = 110
      dashboardData.datasetPreviousValue = 'creation'
      // Create object
      dashboardData.objQueryClient = new QueryService({key: 'orgCreationDataSource'})

      dashboardData.getAdminDashboardData = function (timePeriod) {
        dashboardData.showLoader = true
        dashboardData.showDataDiv = false
        dashboardData.showOrgWarningDiv = false
        dashboardData.timePeriod = timePeriod || '7d'
        dashboardData.objQueryClient.query({
          eid: 'orgCreationDataSource',
          request: {
            orgId: dashboardData.orgId,
            timePeriod: dashboardData.timePeriod
          },
          dataset: dashboardData.datasetPreviousValue
        }).then(function (data) {
          console.log('Response received===', data)
          var rendererData = new renderChart.Render(data.apiResponse, data.series, dashboardData.datasetPreviousValue)
          dashboardData.graphArray = rendererData.graphArray
          dashboardData.numericStatArray = data.numericData
          dashboardData.showDataDiv = true
          dashboardData.showLoader = false
        }).catch(function (apiResponse) {
          toasterService.error(apiResponse.params.errmsg)
        })
      }
      $('#dropdownMenu').dropdown()

      dashboardData.onAfterFilterChange = function (timePeriod) {
        // To avoid same
        if (dashboardData.timePeriod === timePeriod) {
          return false
        }
        dashboardData.getAdminDashboardData(timePeriod)
      }

      dashboardData.onAfterDatasetChange = function (dataset) {
        // To avoid same
        if (dashboardData.datasetPreviousValue === dataset) {
          return false
        }
        dashboardData.datasetPreviousValue = dataset
        dashboardData.getAdminDashboardData()
      }

      dashboardData.graphShow = 0
      dashboardData.nextGraph = function () {
        dashboardData.graphShow++
      }
      dashboardData.previousGraph = function () {
        dashboardData.graphShow--
      }

      dashboardData.showData = function () {
        dashboardData.orgIds = $rootScope.organisationIds
        if (dashboardData.orgIds.length === 1) {
          dashboardData.orgId = dashboardData.orgIds[0]
          dashboardData.getAdminDashboardData()
        } else {
          dashboardData.showOrgWarningDiv = true
          // Get Organisation details
          var req = { 'request': { 'filters': { id: dashboardData.orgIds } } }
          adminService.orgSearch(req).then(function (apiResponse) {
            if (apiResponse.responseCode === 'OK') {
              var orgArray = []
              _.forEach(apiResponse.result.response.content, function (org) {
                orgArray.push({ organisationId: org.id, orgName: org.orgName })
              })
              dashboardData.orgDetails = orgArray
            } else {
              toasterService.error(apiResponse.params.errmsg)
            }
          })
            .catch(function () {
              toasterService.error('error')
            })
        }
      }

      dashboardData.initDropdwon = function () {
        $('#dashboardMenu').dropdown({
          onChange: function () {}
        })
      }

      dashboardData.onAfterOrgChange = function (orgId) {
        dashboardData.orgId = orgId
        dashboardData.getAdminDashboardData()
      }
    }
  ])
