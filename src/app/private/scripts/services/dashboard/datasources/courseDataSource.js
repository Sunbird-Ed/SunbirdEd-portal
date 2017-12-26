'use strict'

angular.module('playerApp')
  .service('courseDataSource', ['httpServiceJava', 'config', function (httpServiceJava, config) {
    /**
     * @class dashboardService
     * @desc Service to manage dashboard.
     * @memberOf Services
     */
    var datasets = {
      'progress': config.URL.DASHBOARD.COURSE_PROGRESS,
      'consumption': config.URL.DASHBOARD.COURSE_CONSUMPTION
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
      // TODO - remove httpServiceJava and use courseDataSource
      return httpServiceJava.get(datasets.datasetType + '/' + req.courseId + '?period=' + req.timePeriod)
    }
  }])
