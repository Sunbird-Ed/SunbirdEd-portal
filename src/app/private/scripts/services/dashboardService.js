'use strict';

/**
 * @ngdoc service
 * @name playerApp.dashboardService
 * @description
 * @author nilesh_m@tekditechnologies.com
 * # dashboardService
 * Service in the playerApp.
 */

angular.module('playerApp')
  .service('dashboardService', ['httpServiceJava', 'config', '$http', function(httpServiceJava, config, $http) {
    this.getAdminDashboardData = function(req, datasetType) {
      switch (datasetType) {
        case 'creation':
          return httpServiceJava.get(config.URL.DASHBOARD.ORG_CREATION + '/' + req.org_id + '?period=' + req.period);
          break;
        case 'consumption':
          return httpServiceJava.get(config.URL.DASHBOARD.ORG_CONSUMPTION + '/' + req.org_id + '?period=' + req.period);
          break;
        default:
          return httpServiceJava.get(config.URL.DASHBOARD.ORG_CREATION + '/' + req.org_id + '?period=' + req.period);
      }
    };

    this.getChartColors = function(datasetType) {
      if (datasetType == 'creation') {
        return [{
            backgroundColor: '#f93131',
            borderColor: '#f93131',
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
            scaleLabel: { display: true, labelString: labelString }, ticks: { beginAtZero: true }
          }]
        }
      };
    };

    this.secondsToMin = function(numericData) {
      var iNum = '';
      var result = '';
      if (numericData.value < 60) {
        numericData.value = numericData.value + ' second(s)';
      } else if (numericData.value >= 60 && numericData.value <= 3600) {
        iNum = numericData.value / 60;
        result = iNum.toFixed(2)
        numericData.value = result + ' min(s)';
      } else if (numericData.value >= 3600) {
        iNum = numericData.value / 3600;
        result = iNum.toFixed(2);
        numericData.value = result + ' hour(s)';
      } else {
        return numericData;
      }

      return numericData;
    }

    this.getCourseDashboardData = function(req, datasetType) {
      switch (datasetType) {
        case 'progress':
          return httpServiceJava.get(config.URL.DASHBOARD.COURSE_PROGRESS + '/' + req.courseId + '?period=' + req.timePeriod);
          break;
        case 'consumption':
          return httpServiceJava.get(config.URL.DASHBOARD.COURSE_CONSUMPTION + '/' + req.courseId + '?period=' + req.timePeriod);
          break;
        default:
          return httpServiceJava.get(config.URL.DASHBOARD.COURSE_PROGRESS + '/' + req.courseId + '?period=' + req.timePeriod);
      }
    };
  }]);
