'use strict'

angular.module('playerApp')
  .factory('rendererService', ['$filter', 'config', '$timeout', 'toasterService',
    'uuid4',
    function ($filter, config, $timeout, toasterService, uuid4) {
      /**
       * @method Render
       * @desc callback function - will executed onAfterFileUploadSuccess
       * @param   {object}  data  api response
       * @param   {object}  series  series data
       * @param   {string}  dashboardType  dashboard type
       */
      function Render (data, dashboardType) {
        var allKey = []
        var graphArray = []
        var series = data.series

        angular.forEach(data.bucketData, function (bucketData, key) {
          if (allKey.indexOf(key) === -1) {
            allKey.push(key)
            var dataArray = []
            var labels = []
            var chartData = []

            angular.forEach(bucketData.buckets, function (bucketValue, bucketKey) {
              dataArray.push(bucketValue.value)
              labels.push(bucketValue.key_name)
            })
            chartData.push(dataArray)

            var options = getChartOptions(data.name)
            var colors = getChartColors(dashboardType)

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
              graphArray.push([series, labels, chartData, colors, options, bucketData.group_id])
            }
          }
        })
        this.graphArray = graphArray
      }

      return {
        Render: Render
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
