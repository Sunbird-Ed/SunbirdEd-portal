/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .service('dataSourceUtils', ['config', function (config) {
    var dataSourceUtils = this
    var datasetType = {
      'ORG_CREATION': config.URL.DASHBOARD.ORG_CREATION,
      'ORG_CONSUMPTION': config.URL.DASHBOARD.ORG_CONSUMPTION,
      'COURSE_PROGRESS': config.URL.DASHBOARD.COURSE_PROGRESS,
      'COURSE_CONSUMPTION': config.URL.DASHBOARD.COURSE_CONSUMPTION
    }
    /**
     * @method getData
     * @desc get course consumption dashboard data
     * @memberOf Services.dataSourceUtils
     * @param {Object}  numericData - numericData
     * @returns promise
     */
    dataSourceUtils.secondsToMin = function (numericData) {
      var num = ''
      if (numericData.value < 60) {
        numericData.value += ' second(s)'
      } else if (numericData.value >= 60 && numericData.value <= 3600) {
        num = numericData.value / 60
        numericData.value = num.toFixed(2) + ' min(s)'
      } else if (numericData.value >= 3600) {
        num = numericData.value / 3600
        numericData.value = num.toFixed(2) + ' hour(s)'
      } else {
        return numericData
      }

      return numericData
    }

    /**
     * @method constructDownloadReportUrl
     * @desc construct download report api url
     * @memberOf Services.dataSourceUtils
     * @param {Object}  req - identifier and time period
     * @param {string}  url - url
     * @return {string} api url
     */
    dataSourceUtils.constructDownloadReportUrl = function (req, dataset) {
      var apiUrl = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + datasetType[dataset] + '/' + req.identifier
      apiUrl += '/export?period=' + req.timePeriod + '&format=csv'
      return apiUrl
    }

    /**
     * @method constructApiUrl
     * @desc construct download report api url
     * @memberOf Services.dataSourceUtils
     * @param {Object}  req - identifier and time period
     * @param {string}  url - url
     * @return {string} api url
     */
    dataSourceUtils.constructApiUrl = function (req, dataset) {
      var apiUrl = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + datasetType[dataset] + '/' +
      req.identifier + '?period=' + req.timePeriod
      return apiUrl
    }

    /**
     * @method getHeaders
     * @desc getHeaders - common headers for org and course dashboard
     * @memberOf Services.dataSourceUtils
     * @return object
     */
    dataSourceUtils.getDefaultHeader = function () {
      var headers = {
        'Content-Type': 'application/json',
        cid: 'sunbird'
      }
      return headers
    }
  }])
