/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .factory('QueryService', [ 'courseConsumptionDataSource', 'courseProgressDataSource',
    'orgCreationDataSource', 'orgConsumptionDataSource', 'downloadReportDataSource',
    function (courseConsumptionDataSource, courseProgressDataSource,
      orgCreationDataSource, orgConsumptionDataSource, downloadReportDataSource) {
      /**
       * @method SetProvider
       * @desc create datasource instance
       * @param {object}  params
       */
      function SetProvider (params) {
        switch (params.eid) {
        case 'courseConsumption':
          this.clientName = courseConsumptionDataSource
          break
        case 'courseProgress':
          this.clientName = courseProgressDataSource
          break
        case 'orgCreation':
          this.clientName = orgCreationDataSource
          break
        case 'orgConsumption':
          this.clientName = orgConsumptionDataSource
          break
        case 'downloadReport':
          this.clientName = downloadReportDataSource
          break
        default:
          this.clientName = { error: 'Invalid argument. Data source not found' }
        }

        return this.clientName
      }

      return {
        CreateNewInstance: function (params) {
          return new SetProvider(params)
        }
      }
    }
  ])
