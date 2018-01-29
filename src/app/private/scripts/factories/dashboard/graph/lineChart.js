'use strict'

angular.module('playerApp')
  .factory('LineChart', [
    function () {
      function LineChart () {}

      /**
       * @method Render
       * @desc - render line chart
       * @param   {object}  data
       */
      LineChart.prototype.render = function (data) {
        return parseLineChart(data)
      }

      return LineChart

      /**
       * @method getChartColors
       * @desc Get chart colors
       * @param {int}  legendCount
       * @returns {Object[]} List of colors
       * @instance
       */
      function getChartColors (legendCount) {
        var colorArray = []
        for (var i = 0; i < legendCount; i++) {
          var randColor = getRandomColor()
          colorArray.push({
            backgroundColor: randColor,
            borderColor: randColor,
            fill: false
          })
        }
        return colorArray
      }

      /**
       * @method getRandomColor
       * @desc Get random colors
       * @returns {string} Colors
       * @instance
       */
      function getRandomColor () {
        var letters = '0123456789ABCDEF'
        var color = '#'
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)]
        }
        return color
      }

      /**
       * @method getChartOptions
       * @desc Get chart options
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

      /**
       * @method getChartData
       * @desc - push graph values
       * @param   {object}  bucketData
       */
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
       * @method parseLineChart
       * @desc - return line chart object
       * @param   {object}  data
       */
      function parseLineChart (data) {
        if (data) {
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

            // Options
            groupData['options'] = getChartOptions(yAxesLabel)

            if (groupList[bucketData.group_id]) {
              Array.prototype.push.apply(groupList[bucketData.group_id].yaxes, groupData['yaxes'])
            } else {
              groupList[bucketData.group_id] = groupData
            }

            // Colors
            groupData['colors'] = getChartColors(groupList[bucketData.group_id].legend.length)
          })

          // Preparing array to render graph
          _.forOwn(groupList, function (group, groupId) {
            chartList.push([group.legend, group.xaxes, group.yaxes, group.colors, group.options, groupId])
          })

          return chartList
        } else {
          return undefined
        }
      }
    }
  ])
