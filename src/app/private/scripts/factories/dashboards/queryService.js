'use strict'

angular.module('playerApp') // TODO - inject required services only.
  .factory('QueryService', ['config', '$q', 'dashboardService', function (config, $q, dashboardService) {
    /**
     * @method query
     * @desc function to call required data source.
     * @memberOf Factory.dashboardQueryFactory
     */
    function QueryService (data) {
      this.clientName = data.key
      this.clientResult = {}
    }

    QueryService.prototype.query = function (params) {
      // TODO - use courseDatasource. Use switch
      if (this.clientName === 'dashboardService') {
        return dashboardService.getCourseDashboardData(params.request, params.dataset)
      }
    }

    return QueryService
  }])
