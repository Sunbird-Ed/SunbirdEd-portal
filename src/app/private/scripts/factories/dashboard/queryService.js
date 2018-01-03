/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .factory('QueryService', ['courseConsumptionDataSource', 'courseProgressDataSource',
    'orgCreationDataSource', 'orgConsumptionDataSource',
    function (courseConsumptionDataSource, courseProgressDataSource, orgCreationDataSource, orgConsumptionDataSource) {
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
          default:
            return courseConsumptionDataSource
          }
        }
      }
    }
  ])
