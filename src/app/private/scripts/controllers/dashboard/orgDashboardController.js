'use strict'

angular.module('playerApp')
  .controller('orgDashboardController', ['$rootScope', '$scope',
    '$timeout', '$state', '$stateParams', 'toasterService', 'adminService', 'QueryService',
    function ($rootScope, $scope, $timeout, $state, $stateParams, toasterService,
      adminService, QueryService) {
      var dashboardData = this
      dashboardData.height = 110
      dashboardData.datasetPreviousValue = 'creation'
      // Create object
      dashboardData.objQueryClient = new QueryService({key: 'orgDataSource'})

      dashboardData.getAdminDashboardData = function (timePeriod) {
        dashboardData.timePeriod = timePeriod || '7d'
        var requestBody = {
          orgId: dashboardData.orgId,
          timePeriod: dashboardData.timePeriod
        }

        dashboardData.objQueryClient.query({
          eid: 'orgDataSource',
          request: requestBody,
          dataset: dashboardData.datasetPreviousValue
        }).then(function (apiResponse) {
          console.log('Response received===', apiResponse)
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
