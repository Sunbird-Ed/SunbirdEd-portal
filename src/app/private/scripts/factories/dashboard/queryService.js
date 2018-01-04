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
        GetInstance: function (params) {
          switch (params.eid) {
          case 'courseConsumption':
            return courseConsumptionDataSource
          case 'courseProgress':
            return courseProgressDataSource
          case 'orgCreation':
            return orgCreationDataSource
          case 'orgConsumption':
            return orgConsumptionDataSource
          case 'downloadReport':
            return downloadReportDataSource
          default:
            return courseConsumptionDataSource
          }
        }
      }
    }
  ])
