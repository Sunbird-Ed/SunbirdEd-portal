'use strict'

angular.module('playerApp')
  .factory('renderChart', ['$filter', 'config', '$timeout', 'toasterService',
    'uuid4', function ($filter, config, $timeout, toasterService, uuid4) {
      /**
     * @method Render
     * @desc callback function - will executed onAfterFileUploadSuccess
     * @param   {object}  data  api response
     * @param   {object}  series  series data
     * @param   {string}  dashboardType  dashboard type
     */
      function Render (data, series, dashboardType) {
        var allKey = []
        var graphArray = []
        var timePeriod = data.period

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

            var options = getChartOptions(name)
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
              graphArray.push([series, labels, data, colors, options, bucketData.group_id])
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
              scaleLabel: { display: true, labelString: labelString }, ticks: { beginAtZero: true }
            }]
          }
        }
      }
    /**
             * @method secondsToMin
             * @desc Convert seconds to min
             * @memberOf Services.dashboardService
             * @param {string}  numericData - Numeric data
             * @returns {string} Seconds converted to min numeric value.
             * @instance
             */
      this.secondsToMin = function (numericData) {
        var iNum = ''
        var result = ''
        if (numericData.value < 60) {
          numericData.value += ' second(s)'
        } else if (numericData.value >= 60 && numericData.value <= 3600) {
          iNum = numericData.value / 60
          result = iNum.toFixed(2)
          numericData.value = result + ' min(s)'
        } else if (numericData.value >= 3600) {
          iNum = numericData.value / 3600
          result = iNum.toFixed(2)
          numericData.value = result + ' hour(s)'
        } else {
          return numericData
        }

        return numericData
      }
    }])
