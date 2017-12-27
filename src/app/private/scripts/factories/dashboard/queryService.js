/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .factory('QueryService', ['config', '$q', 'dashboardService', 'courseConsumptionService', 'courseProgressService',
    'orgCreationService', 'orgConsumptionService', function (config, $q, dashboardService, courseConsumptionService,
      courseProgressService, orgCreationService, orgConsumptionService) {
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
          return courseConsumptionService.getData(params.request, datasets.course[params.dataset], headers)
        case 'courseProgressDataSource':
          return courseProgressService.getData(params.request, datasets.course[params.dataset], headers)
        case 'orgCreationDataSource':
          return orgCreationService.getData(params.request, datasets.org[params.dataset], headers)
        case 'orgConsumptionDataSource':
          return orgConsumptionService.getData(params.request, datasets.org[params.dataset], headers)
        default:
          return courseConsumptionService.getData(params.request, datasets.course[params.dataset], headers)
        }
      }

      return QueryService
    }])
