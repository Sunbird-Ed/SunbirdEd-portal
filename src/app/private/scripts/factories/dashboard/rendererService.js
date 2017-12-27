'use strict'

angular.module('playerApp')
  .factory('renderChart', ['$filter', 'config', '$timeout', 'toasterService',
    'uuid4', 'dashboardService', function ($filter, config, $timeout, toasterService, uuid4, dashboardService) {
      /**
     * @method Render
     * @desc callback function - will executed onAfterFileUploadSuccess
     * @param   {int}  id  [selected file number]
     * @param   {string}  name  [file name]
     * @param   {object}  responseJSON  [api response]
     * @param   {object}  xhr  [api response]
     */
      function Render (data, series, dashboardType) {
        switch (dashboardType) {
        case 'creation':
          break
        case 'consumption':
          break
        case 'course':
          break
        case 'progress':
          break
        default:
        }

        var allKey = []
        var graphArray = []
        var timePeriod = data.period

        // angular.forEach(data.snapshot, function (numericData, key) {
        //   if (key === 'org.creation.authors.count' ||
        //             key === 'org.creation.reviewers.count' ||
        //             key === 'org.creation.content.count') {
        //     numericStatArray.push(numericData)
        //   }
        //   if (key === 'org.creation.content[@status=published].count') {
        //     series.push(numericData.value + ' LIVE')
        //   }

        //   if (key === 'org.creation.content[@status=draft].count') {
        //     series.push(numericData.value + ' CREATED')
        //   }

        //   if (key === 'org.creation.content[@status=review].count') {
        //     series.push(numericData.value + ' IN REVIEW')
        //   }
        // })

        angular.forEach(data.series, function (bucketData, key) {
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

            var name = 'Content created per day'
            if (timePeriod === '5w') {
              name = 'Content created per week'
            }

            var options = dashboardService.getChartOptions(name)
            var colors = dashboardService.getChartColors(dashboardType)

            var found = false
            for (var j = 0; j < graphArray.length; j++) {
              if (graphArray[j][5] === bucketData.group_id) {
                found = true
                break
              }
            }
            if (found === true) {
              graphArray[j][2].push(dataArray)
            } else {
              graphArray.push([series, labels, data, colors, options, bucketData.group_id])
            }
          }
        })
        this.graphArray = graphArray
      }

      return {
        Render: Render
      }
    }])
