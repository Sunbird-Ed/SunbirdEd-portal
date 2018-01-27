'use strict'

angular.module('playerApp')
  .factory('Visualizer', ['LineChart',
    function (LineChart) {
      /**
       * @method Visualizer
       * @desc - declare config variables
       * @param   {object}  config
       */
      function Visualizer (config) {
        this.chartType = config.type
        this.chartObj = this.getChartInstance()
      }

      /**
       * @method render
       * @desc - call specific chart factory to render graph
       * @param   {object}  data
       */
      Visualizer.prototype.render = function (data) {
        return this.chartObj.render(data)
      }

      /**
       * @method getChartInstance
       * @desc - define chart instance according to chart type
       */
      Visualizer.prototype.getChartInstance = function () {
        var obj = null
        switch (this.chartType) {
        case 'line':
          obj = new LineChart()
          break
        }
        return obj
      }

      return Visualizer
    }
  ])
