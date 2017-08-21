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
    this.getChartColors = function(datasetType) {
      if (datasetType == 'creation') {
        return [{
            backgroundColor: '#292929',
            borderColor: '#292929',
            fill: false
          },
          {
            backgroundColor: '#FF0000',
            borderColor: '#FF0000',
            fill: false
          },
          {
            backgroundColor: '#0062ff',
            borderColor: '#0062ff',
            fill: false
          },
          {
            backgroundColor: '#006400',
            borderColor: '#006400',
            fill: false
          }
        ];
      } else if (datasetType == 'consumption') {
        return [{
          backgroundColor: '#0062ff',
          borderColor: '#0062ff',
          fill: false
        }];
      }
    };

    this.getChartOptions = function(labelString) {
      return {
        legend: { display: true },
        scales: {
          xAxes: [{
            gridLines: { display: false }
          }],
          yAxes: [{
            scaleLabel: { display: true, labelString: labelString }
          }]
        }
      };
    };
  }]);
