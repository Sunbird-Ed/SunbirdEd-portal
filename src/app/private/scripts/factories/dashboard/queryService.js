/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .factory('QueryService', ['config', '$q', 'dashboardService',
    'courseConsumptionDataSource', 'courseProgressDataSource',
    'orgCreationDataSource', 'orgConsumptionDataSource',
    function (config, $q, dashboardService, courseConsumptionDataSource,
      courseProgressDataSource, orgCreationDataSource, orgConsumptionDataSource) {
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
        case 'courseConsumptionDataSource':
          return courseConsumptionDataSource.getData(params.request, datasets.course[params.dataset], headers)
        case 'courseProgressDataSource':
          return courseProgressDataSource.getData(params.request, datasets.course[params.dataset], headers)
        case 'orgCreationDataSource':
          return orgCreationDataSource.getData(params.request, datasets.org[params.dataset], headers)
        case 'orgConsumptionDataSource':
          return orgConsumptionDataSource.getData(params.request, datasets.org[params.dataset], headers)
        default:
          return courseConsumptionDataSource.getData(params.request, datasets.course[params.dataset], headers)
        }
      }

      return QueryService
    }
  ])
