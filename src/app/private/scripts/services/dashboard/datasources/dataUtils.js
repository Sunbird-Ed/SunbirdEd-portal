/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .service('dataUtils', [function () {
    var dataUtils = this
    /**
     * @method getData
     * @desc get course consumption dashboard data
     * @memberOf Services.courseConsumptionDataSource
     * @param {Object}  req - Request object
     * @param {string}  datasetType - Data set type
     * @param {object} headers headers
     * @returns promise
     * @instance
     */
    dataUtils.secondsToMin = function (numericData) {
      var num = ''
      var result = ''
      if (numericData.value < 60) {
        numericData.value += ' second(s)'
      } else if (numericData.value >= 60 && numericData.value <= 3600) {
        num = numericData.value / 60
        result = num.toFixed(2)
        numericData.value = result + ' min(s)'
      } else if (numericData.value >= 3600) {
        num = numericData.value / 3600
        result = num.toFixed(2)
        numericData.value = result + ' hour(s)'
      } else {
        return numericData
      }
      return numericData
    }
  }])
