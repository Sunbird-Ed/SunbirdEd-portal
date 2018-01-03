/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .factory('QueryService', ['config', '$q',
    'courseConsumptionDataSource', 'courseProgressDataSource',
    'orgCreationDataSource', 'orgConsumptionDataSource', 'downloadReportDataSource',
    function (config, $q, courseConsumptionDataSource,
      courseProgressDataSource, orgCreationDataSource, orgConsumptionDataSource, downloadReportDataSource) {
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
       * @method QueryService
       * @desc function to regiester data source.
       * @memberOf Factory.dashboardQueryFactory
       * @param {object} data data source
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
        switch (params.eid) {
        case 'courseConsumptionDataSource':
          return courseConsumptionDataSource.getData(params.request, datasets.course[params.dataset])
        case 'courseProgressDataSource':
          return courseProgressDataSource.getData(params.request, datasets.course[params.dataset])
        case 'orgCreationDataSource':
          return orgCreationDataSource.getData(params.request, datasets.org[params.dataset])
        case 'orgConsumptionDataSource':
          return orgConsumptionDataSource.getData(params.request, datasets.org[params.dataset])
        case 'downloadOrgReport':
          return downloadReportDataSource.download(params.request, datasets.org[params.dataset])
        default:
          return downloadReportDataSource.download(params.request, datasets.org[params.dataset])
        }
      }

      return QueryService
    }
  ])
