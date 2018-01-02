/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .service('dataSourceUtils', [function () {
    var dataSourceUtils = this
    /**
     * @method getData
     * @desc get course consumption dashboard data
     * @memberOf Services.dataSourceUtils
     * @param {Object}  numericData - numericData
     * @returns promise
     */
    dataSourceUtils.secondsToMin = function (numericData) {
      var num = ''
      if (numericData.value > 0 && numericData.value < 60) {
        numericData.value = '0 second(s)'
      } else if (numericData.value >= 60 && numericData.value <= 3600) {
        num = numericData.value / 60
        numericData.value = num.toFixed(2) + ' min(s)'
      } else if (numericData.value >= 3600) {
        num = numericData.value / 3600
        numericData.value = num.toFixed(2) + ' hour(s)'
      } else {
        numericData.value += '0 second(s)'
      }
      return numericData
    }
  }])
