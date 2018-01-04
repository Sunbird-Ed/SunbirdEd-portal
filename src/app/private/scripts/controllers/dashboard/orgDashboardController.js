'use strict'

angular.module('playerApp')
  .controller('orgDashboardController', ['$rootScope', '$scope',
    '$timeout', '$state', '$stateParams', 'toasterService', 'adminService', 'QueryService', 'Visualizer',
    function ($rootScope, $scope, $timeout, $state, $stateParams, toasterService,
      adminService, QueryService, Visualizer) {
      var dashboardData = this
      dashboardData.height = 110
      dashboardData.datasetPreviousValue = 'creation'
      // Create object
      dashboardData.objQueryClient = new QueryService({ key: 'orgCreationDataSource' })
      var chart = new Visualizer({ type: 'line' })

      /**
       * @method getAdminDashboardData
       * @desc Render graph
       * @param {string}  timePeriod
       */
      dashboardData.getAdminDashboardData = function (timePeriod) {
        dashboardData.showLoader = true
        dashboardData.showDataDiv = false
        dashboardData.showOrgWarningDiv = false
        dashboardData.timePeriod = timePeriod || '7d'
        dashboardData.objQueryClient.query({
          eid: dashboardData.datasetPreviousValue === 'creation' ? 'orgCreationDataSource' : 'orgConsumptionDataSource',
          request: {
            identifier: dashboardData.orgId,
            timePeriod: dashboardData.timePeriod
          },
          dataset: dashboardData.datasetPreviousValue
        }).then(function (data) {
          dashboardData.graphArray = chart.render(data)

          dashboardData.numericStatArray = data.numericData
          dashboardData.showDataDiv = true
          dashboardData.showLoader = false
        }).catch(function (apiResponse) {
          toasterService.error(apiResponse.params.errmsg)
        })
      }

      $('#dropdownMenu').dropdown()

      /**
       * @method onAfterFilterChange
       * @desc call getAdminDashboardData with specific time period
       * @param {string}  timePeriod
       */
      dashboardData.onAfterFilterChange = function (timePeriod) {
        // To avoid same
        if (dashboardData.timePeriod === timePeriod) {
          return false
        }
        dashboardData.getAdminDashboardData(timePeriod)
      }

      /**
       * @method onAfterDatasetChange
       * @desc call getAdminDashboardData with specific chart type
       * @param {string}  dataset
       */
      dashboardData.onAfterDatasetChange = function (dataset) {
        // To avoid same
        if (dashboardData.datasetPreviousValue === dataset) {
          return false
        }
        dashboardData.datasetPreviousValue = dataset
        dashboardData.getAdminDashboardData()
      }

      /**
       * @method showData
       * @desc manipulate html when with multiple org and single org
       */
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
              toasterService.error($rootScope.messages.emsg.m0005)
            })
        }
      }

      /**
       * @method initDropdwon
       * @desc Initialise dashboard dropdown menu
       */
      dashboardData.initDropdwon = function () {
        $('#dashboardMenu').dropdown({
          onChange: function () {}
        })
      }

      /**
       * @method onAfterOrgChange
       * @desc On changing organisation dropdown calling getAdminDashboardData
       * @param {string}  orgId Organisation Id
       */
      dashboardData.onAfterOrgChange = function (orgId) {
        dashboardData.orgId = orgId
        dashboardData.getAdminDashboardData()
      }
    }
  ])
