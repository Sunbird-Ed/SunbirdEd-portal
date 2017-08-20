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
  .service('dashboardService', ['httpServiceJava', 'config', '$http', 'httpService', function(httpServiceJava, config, $http, httpService) {
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
            backgroundColor: '#292929',
            borderColor: '#292929',
            fill: false
        }];
      }
    };

    this.getChartOptions = function(labelString) {
      return {
        legend: { display: true },
        scales: {
          xAxes: [{
            gridLines: { display: false },
            ticks: {
              autoSkip: true,
              maxRotation: 30,
              minRotation: 30
            }
          }],
          yAxes: [{
            scaleLabel: { display: true, labelString: labelString }
          }]
        }
      };
    };

    /**
     * @Function time convertor
     * @Description convert seconds to min/hrs
     * @Author nilesh
     */
    this.secondsToMin = function(numericData){
        var iNum   = '';
        var result = '';
        if (numericData.value < 60) {
            numericData.value = numericData.value + ' second';
        } else if (numericData.value >= 60 && numericData.value <= 3600) {
            iNum = numericData.value / 60;
            result = iNum.toFixed(2)
            numericData.value = result + ' min';
        } else if (numericData.value >= 3600) {
            iNum = numericData.value / 3600;
            result = iNum.toFixed(2);
            numericData.value = result + ' hour';
        } else{
            return numericData;
        }

        return numericData;
    }

    /**
     * @Function getCourseDashboard data
     * @Description [description]
     */
    this.getCourseDashboardData = function(req, datasetType){
        var apiUrl = 'dashboard/v1/' + datasetType + '/course/' + req.courseId + '?period='+ req.timePeriod;
        return httpServiceJava.get(apiUrl);
    };
  }]);
