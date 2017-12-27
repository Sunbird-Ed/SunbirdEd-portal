/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .factory('QueryService', ['config', '$q', 'dashboardService', 'courseDataSource',
    'orgDataSource', function (config, $q, dashboardService, courseDataSource, orgDataSource) {
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
          cid: 'sunbird',
          Accept: 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,image/webp,*/*;q=0.8'
        }

        switch (params.eid) {
        case 'courseDataSource':
          return courseDataSource.getData(params.request, params.dataset, headers)
        case 'orgDataSource':
          return orgDataSource.getData(params.request, params.dataset, headers)
        default:
          return courseDataSource.getData(params.request, params.dataset, headers)
        }
      }

      return QueryService
    }])
