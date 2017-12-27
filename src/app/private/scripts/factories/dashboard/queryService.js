/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .factory('QueryService', ['config', '$q', 'dashboardService', 'courseDataSource',
    'orgDataSource', function (config, $q, dashboardService, courseDataSource, orgDataSource) {
      // Datasets - api urls
      var datasets = {
        org: {
          'creation': config.URL.DASHBOARD.ORG_CREATION,
          'consumption': config.URL.DASHBOARD.ORG_CONSUMPTION
        },
        course: {
          'progress': config.URL.DASHBOARD.COURSE_PROGRESS,
          'consumption': config.URL.DASHBOARD.COURSE_CONSUMPTION
        }
      }

      /**
     * @method query
     * @desc function to call required data source.
     * @memberOf Factory.dashboardQueryFactory
     */
      function QueryService (data) {
        this.clientName = data.key
      }

      /**
     * @method query
     * @desc function to call required data source.
     * @memberOf Factory.dashboardQueryFactory
     * @param {object} [varname] [description]
     */
      QueryService.prototype.query = function (params) {
      // Build header
        var headers = {
          'Content-Type': 'application/json',
          cid: 'sunbird'
        }

        switch (params.eid) {
        case 'courseDataSource':
          return courseDataSource.getData(params.request, datasets.course[params.dataset], headers)
        case 'orgDataSource':
          return orgDataSource.getData(params.request, datasets.org[params.dataset], headers)
        default:
          return courseDataSource.getData(params.request, params.dataset, headers)
        }
      }

      return QueryService
    }])
