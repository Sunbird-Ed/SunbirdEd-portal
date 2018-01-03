/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .service('dataSourceUtils', ['config', function (config) {
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

    /**
     * @method constructDownloadReportUrl
     * @desc construct download report api url
     * @memberOf Services.constructDownloadReportUrl
     * @param {Object}  req - identifier and time period
     * @param {string}  url - url
     * @return {string} api url
     */
    dataSourceUtils.constructDownloadReportUrl = function (req, url) {
      var apiUrl = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + url + '/' + req.identifier
      apiUrl += '/export?period=' + req.timePeriod + '&format=csv'
      return apiUrl
    }
  }])
