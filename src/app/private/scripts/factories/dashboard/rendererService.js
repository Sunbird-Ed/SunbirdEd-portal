'use strict'

angular.module('playerApp')
  .factory('rendererService', ['$filter', 'config', '$timeout', 'toasterService',
    'uuid4',
    function ($filter, config, $timeout, toasterService, uuid4) {
      /**
       * @method Render
       * @desc - render line chart
       * @param   {object}  data
       * @param   {string}  dashboardType
       */
      function Render (data, dashboardType) {
        var chartList = []
        var groupList = {}

        _.forEach(data.bucketData, function (bucketData, key) {
          var groupData = {}

          var yAxesLabel = data.name
          if (data.series === '') {
            groupData['legend'] = [bucketData.name]

            if (bucketData.time_unit !== undefined) {
              yAxesLabel = bucketData.name + ' (' + bucketData.time_unit + ')'
            } else {
              yAxesLabel = bucketData.name
            }
          } else {
            groupData['legend'] = data.series
          }

          var chartData = angular.copy(getChartData(bucketData))

          // Graph values
          groupData['yaxes'] = [chartData.values]

          // X-axes Labels
          groupData['xaxes'] = chartData.labels

          // Colors
          groupData['colors'] = getChartColors(dashboardType)

          // Options
          groupData['options'] = getChartOptions(yAxesLabel)

          if (groupList[bucketData.group_id]) {
            Array.prototype.push.apply(groupList[bucketData.group_id].yaxes, groupData['yaxes'])
          } else {
            groupList[bucketData.group_id] = groupData
          }
        })

        // Preparing array to render graph
        _.forOwn(groupList, function (group, groupId) {
          chartList.push([group.legend, group.xaxes, group.yaxes, group.colors, group.options, groupId])
        })

        this.chartList = chartList
      }

      return {
        Render: Render
      }

      function getChartData (bucketData) {
        var values = []
        var labels = []
        _.forEach(bucketData.buckets, function (bucketValue, bucketKey) {
          values.push(bucketValue.value)
          labels.push(bucketValue.key_name)
        })

        return { labels: labels, values: values }
      }

      /**
       * @method getChartColors
       * @desc Get chart colors
       * @memberOf Services.dashboardService
       * @param {string}  datasetType - Data type
       * @returns {Object[]} List of colors
       * @instance
       */

      function getChartColors (datasetType) {
        if (datasetType === 'creation') {
          return [{
            backgroundColor: '#f93131',
            borderColor: '#f93131',
            fill: false
          },
          {
            backgroundColor: '#0062ff',
            borderColor: '#0062ff',
            fill: false
          },
          {
            backgroundColor: '#006400',
            borderColor: '#006400',
            fill: false
          }
          ]
        } else if (datasetType === 'consumption') {
          return [{
            backgroundColor: '#0062ff',
            borderColor: '#0062ff',
            fill: false
          }]
        }
      }

      /**
       * @method getChartOptions
       * @desc Get chart options
       * @memberOf Services.dashboardService
       * @param {string}  labelString - Labels
       * @returns {Object} Object contains chart options .
       * @instance
       */
      function getChartOptions (labelString) {
        return {
          legend: { display: true },
          scales: {
            xAxes: [{
              gridLines: { display: false }
            }],
            yAxes: [{
              scaleLabel: { display: true, labelString: labelString },
              ticks: { beginAtZero: true }
            }]
          }
        }
      }
    }
  ])
