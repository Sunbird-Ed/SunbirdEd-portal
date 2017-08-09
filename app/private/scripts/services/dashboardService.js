'use strict';

/**
 * @ngdoc service
 * @name playerApp.dashboardService
 * @description
 * @author Nilesh More
 * # notesService
 * Service in the playerApp.
 */

angular.module('playerApp')
  .service('dashboardService', ['httpServiceJava', 'config', '$http', function(httpServiceJava, config, $http) {
    this.getAdminDashboardData = function(req, datasetType) {
      return httpServiceJava.get('dashboard/v1/' + datasetType + '/org/' + req.org_id + '?period=' + req.period);
    };
  }]);
