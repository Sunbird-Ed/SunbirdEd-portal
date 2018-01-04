/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .factory('QueryService', ['courseConsumptionDataSource', 'courseProgressDataSource',
    'orgCreationDataSource', 'orgConsumptionDataSource', 'downloadReportDataSource',
    function (courseConsumptionDataSource, courseProgressDataSource,
      orgCreationDataSource, orgConsumptionDataSource, downloadReportDataSource) {
      return {
        getInstance: function (params) {
          switch (params.eid) {
          case 'courseConsumptionData':
            return courseConsumptionDataSource
          case 'courseProgressData':
            return courseProgressDataSource
          case 'orgCreationData':
            return orgCreationDataSource
          case 'orgConsumptionData':
            return orgConsumptionDataSource
          case 'downloadReportDataSource':
            return
          default:
            return courseConsumptionDataSource
          }
        }
      }
    }
  ])
