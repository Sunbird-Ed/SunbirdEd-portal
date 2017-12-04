'use strict'

angular.module('playerApp')
  .controller('orgDashboardController', ['$rootScope', '$scope',
    'dashboardService', '$timeout', '$state', '$stateParams', 'toasterService', 'adminService',
    function ($rootScope, $scope, dashboardService, $timeout, $state, $stateParams, toasterService, adminService) {
      var dashboardData = this
      dashboardData.height = 110
      dashboardData.datasetPreviousValue = 'creation'

      dashboardData.getAdminDashboardData = function (timePeriod) {
        dashboardData.showLoader = true
        dashboardData.showDataDiv = false
        dashboardData.showOrgWarningDiv = false
        dashboardData.timePeriod = timePeriod || '7d'

        var requestBody = {
          org_id: dashboardData.orgId,
          period: dashboardData.timePeriod
        }

        dashboardService.getAdminDashboardData(requestBody, dashboardData.datasetPreviousValue).then(function (apiResponse) {
          dashboardData.graphShow = 0
          dashboardData.numericStatArray = []
          var allKey = []
          dashboardData.graphArray = []

          if (apiResponse && apiResponse.responseCode === 'OK') {
            if (dashboardData.datasetPreviousValue === 'creation') {
              var series = []
              angular.forEach(apiResponse.result.snapshot, function (numericData, key) {
                if (key === 'org.creation.authors.count' ||
                    key === 'org.creation.reviewers.count' ||
                    key === 'org.creation.content.count') {
                  dashboardData.numericStatArray.push(numericData)
                }
                if (key === 'org.creation.content[@status=published].count') {
                  series.push(numericData.value + ' LIVE')
                }

                if (key === 'org.creation.content[@status=draft].count') {
                  series.push(numericData.value + ' CREATED')
                }

                if (key === 'org.creation.content[@status=review].count') {
                  series.push(numericData.value + ' IN REVIEW')
                }
              })

              angular.forEach(apiResponse.result.series, function (bucketData, key) {
                if (allKey.indexOf(key) === -1) {
                  allKey.push(key)
                  var dataArray = []
                  var labels = []
                  var data = []

                  angular.forEach(bucketData.buckets, function (bucketValue, bucketKey) {
                    dataArray.push(bucketValue.value)
                    labels.push(bucketValue.key_name)
                  })
                  data.push(dataArray)

                  if (dashboardData.timePeriod === '5w') {
                    var name = 'Content created per week'
                  } else {
                    var name = 'Content created per day'
                  }
                  var options = dashboardService.getChartOptions(name)
                  var colors = dashboardService.getChartColors(dashboardData.datasetPreviousValue)

                  var found = false
                  for (var j = 0; j < dashboardData.graphArray.length; j++) {
                    if (dashboardData.graphArray[j][5] === bucketData.group_id) {
                      found = true
                      break
                    }
                  }
                  if (found === true) {
                    var d = dashboardData.graphArray[j][2]
                    dashboardData.graphArray[j][2].push(dataArray)
                  } else {
                    dashboardData.graphArray.push([series, labels, data, colors, options, bucketData.group_id])
                  }
                }
              })
            } else if (dashboardData.datasetPreviousValue === 'consumption') {
              angular.forEach(apiResponse.result.snapshot, function (numericData, key) {
                if (key === 'org.consumption.content.session.count' || key === 'org.consumption.content.time_spent.sum' || key === 'org.consumption.content.time_spent.average') {
                  if (key === 'org.consumption.content.time_spent.sum' || key === 'org.consumption.content.time_spent.average') {
                    numericData = dashboardService.secondsToMin(numericData)
                    dashboardData.numericStatArray.push(numericData)
                  } else {
                    dashboardData.numericStatArray.push(numericData)
                  }
                }
              })

              angular.forEach(apiResponse.result.series, function (bucketData, key) {
                if (allKey.indexOf(key) === -1) {
                  allKey.push(key)
                  var dataArray = []
                  var labels = []
                  var data = []

                  angular.forEach(bucketData.buckets, function (bucketValue, bucketKey) {
                    dataArray.push(bucketValue.value)
                    labels.push(bucketValue.key_name)
                  })
                  data.push(dataArray)
                  var series = [bucketData.name]
                  if (bucketData.time_unit !== undefined) {
                    var name = bucketData.name + ' (' + bucketData.time_unit + ')'
                  } else {
                    var name = bucketData.name
                  }
                  var options = dashboardService.getChartOptions(name)
                  var colors = dashboardService.getChartColors(dashboardData.datasetPreviousValue)

                  var found = false
                  for (var j = 0; j < dashboardData.graphArray.length; j++) {
                    if (dashboardData.graphArray[j][5] === bucketData.group_id) {
                      found = true
                      break
                    }
                  }
                  if (found === true) {
                    var d = dashboardData.graphArray[j][2]
                    dashboardData.graphArray[j][2].push(dataArray)
                  } else {
                    dashboardData.graphArray.push([series, labels, data, colors, options, bucketData.group_id])
                  }
                }
              })
            }
            dashboardData.orgName = apiResponse.result.org.orgName
            dashboardData.showDataDiv = true
          } else {
            toasterService.error(apiResponse.params.errmsg)
            dashboardData.showDataDiv = false
          }
        })
          .catch(function (err) {
            console.log(err)
          })
          .finally(function () {
            // Hide loading spinner whether our call succeeded or failed.
            dashboardData.showLoader = false
          })
      }
      $('#dropdownMenu').dropdown()

      dashboardData.onAfterFilterChange = function (timePeriod) {
        // To avoid same
        if (dashboardData.timePeriod === timePeriod) {
          return false
        }
        dashboardData.showLoader = true
        dashboardData.showDataDiv = false
        dashboardData.getAdminDashboardData(timePeriod)
      }

      dashboardData.onAfterDatasetChange = function (dataset) {
        // To avoid same
        if (dashboardData.datasetPreviousValue === dataset) {
          return false
        }
        dashboardData.showLoader = true
        dashboardData.showDataDiv = false
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
              toasterService.error(apiMessages.ERROR.get)
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
