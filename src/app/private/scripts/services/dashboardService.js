'use strict'

angular.module('playerApp')
  .service('dashboardService', ['restfulLearnerService', 'config', function (restfulLearnerService, config) {
    /**
     * @class dashboardService
     * @desc Service to manage dashboard.
     * @memberOf Services
     */

    /**
             * @method getAdminDashboardData
             * @desc Get admin dashboard data
             * @memberOf Services.dashboardService
             * @param {Object}   req - Request Object
             * @param {string}  datasetType - Data type
             * @returns {Promise} Promise object represents admin dashboard data
             * @instance
             */
    this.getAdminDashboardData = function (req, datasetType) {
      switch (datasetType) {
      case 'creation':
        return restfulLearnerService.get(config.URL.DASHBOARD.ORG_CREATION +
         '/' + req.org_id + '?period=' + req.period)
      case 'consumption':
        return restfulLearnerService.get(config.URL.DASHBOARD.ORG_CONSUMPTION +
         '/' + req.org_id + '?period=' + req.period)
      default:
        return restfulLearnerService.get(config.URL.DASHBOARD.ORG_CREATION +
         '/' + req.org_id + '?period=' + req.period)
      }
    }
    /**
             * @method getChartColors
             * @desc Get chart colors
             * @memberOf Services.dashboardService
             * @param {string}  datasetType - Data type
             * @returns {Object[]} List of colors
             * @instance
             */

    this.getChartColors = function (datasetType) {
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
    this.getChartOptions = function (labelString) {
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
    /**
             * @method getCourseDashboardData
             * @desc Convert seconds to min
             * @memberOf Services.dashboardService
             * @param {Object}  req - Request object
             * @param {string}  datasetType - Data set type
             * @returns {Promise} Promise object represents course dashboard data
             * @instance
             */
    this.getCourseDashboardData = function (req, datasetType) {
      switch (datasetType) {
      case 'progress':
        return restfulLearnerService.get(config.URL.DASHBOARD.COURSE_PROGRESS +
         '/' + req.courseId + '?period=' + req.timePeriod)
      case 'consumption':
        return restfulLearnerService.get(config.URL.DASHBOARD.COURSE_CONSUMPTION +
         '/' + req.courseId + '?period=' + req.timePeriod)
      default:
        return restfulLearnerService.get(config.URL.DASHBOARD.COURSE_PROGRESS +
         '/' + req.courseId + '?period=' + req.timePeriod)
      }
    }
  }])
