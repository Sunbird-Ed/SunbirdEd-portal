'use strict'

angular.module('playerApp')
  .service('queryService', ['$rootScope', 'config', 'httpServiceJava', function ($rootScope, config, httpServiceJava) {
    /**
     * [dashboardType description]
     *
     * @type  {Object}
     */
    var dashboardType = {
      'courseProgress': config.URL.DASHBOARD.COURSE_PROGRESS,
      'courseConsumption': config.URL.DASHBOARD.COURSE_CONSUMPTION,
      'orgCreation': config.URL.DASHBOARD.ORG_CREATION,
      'orgConsumption': config.URL.DASHBOARD.ORG_CONSUMPTION
    }

    /**
     * @method buildRequestBody
     * @description build api request body
     * @memberOf services.queryService
     * @param {[type]} [varname] [description]
     * @return {object} [description]
     */
    this.buildRequestBody = function (data) {
      var request = {
        filters: {
          status: ['Live'],
          createdBy: $rootScope.userId,
          contentType: ['Course']
        },
        sort_by: {
          lastUpdatedOn: 'desc'
        }
      }
      return request
    }

    /**
     * @method buildRequestBody
     * @description build api request body
     * @memberOf services.queryService
     * @param {[type]} [varname] [description]
     * @return {object} [description]
     */
    this.getTimePeriodData = function (identifier, timePeriod, dataset) {
      return httpServiceJava.get(dashboardType.dataset + '/' + identifier + '?period=' + timePeriod)
    }

    /**
     * @method getMyCourses
     * @description get list of courses / content created by me
     * @memberOf services.queryService
     * @param {[type]} [varname] [description]
     * @return {[type]} [description]
     */
    this.getMyCourses = function () {

    }
  }])
