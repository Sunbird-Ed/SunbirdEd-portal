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
     var $injector = angular.injector(['ng']);
            var q = $injector.get('$q');
            var deferred = q.defer();
     var response =  '{"id":"api.sunbird.dashboard.org.creation","ver":"v1","ts":"2017-08-20 19:09:25:260+0000","params":{"resmsgid":null,"msgid":"a8752735-80c5-423f-8f77-327a7704daae","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"period":"7d","org":{"orgName":"ABC Corporation","orgId":"01230654824904294426"},"series":{"org.creation.content.created_on.count":{"name":"Content created by day","split":"content.created_on","group_id":"org.content.count2","buckets":[{"key":1502562600000,"key_name":"2017-08-13","value":0},{"key":1502649000000,"key_name":"2017-08-14","value":9},{"key":1502735400000,"key_name":"2017-08-15","value":0},{"key":1502821800000,"key_name":"2017-08-16","value":2},{"key":1502908200000,"key_name":"2017-08-17","value":3},{"key":1502994600000,"key_name":"2017-08-18","value":4},{"key":1503081000000,"key_name":"2017-08-19","value":1},{"key":1503167400000,"key_name":"2017-08-20","value":0}]},"org.creation.content[@status=draft].count":{"name":"Draft","split":"content.created_on","group_id":"org.content.count","buckets":[{"key":1502562600000,"key_name":"2017-08-13","value":0},{"key":1502649000000,"key_name":"2017-08-14","value":3},{"key":1502735400000,"key_name":"2017-08-15","value":0},{"key":1502821800000,"key_name":"2017-08-16","value":2},{"key":1502908200000,"key_name":"2017-08-17","value":3},{"key":1502994600000,"key_name":"2017-08-18","value":4},{"key":1503081000000,"key_name":"2017-08-19","value":1},{"key":1503167400000,"key_name":"2017-08-20","value":0}]},"org.creation.content[@status=review].count":{"name":"Review","split":"content.reviewed_on","group_id":"org.content.count1","buckets":[{"key":1502651365234,"key_name":"2017-08-13","value":5},{"key":1502737765234,"key_name":"2017-08-14","value":6},{"key":1502824165234,"key_name":"2017-08-15","value":1},{"key":1502910565234,"key_name":"2017-08-16","value":0},{"key":1502996965234,"key_name":"2017-08-17","value":4},{"key":1503083365234,"key_name":"2017-08-18","value":0},{"key":1503169765234,"key_name":"2017-08-19","value":0}]},"org.creation.content[@status=published].count":{"name":"Live","split":"content.published_on","group_id":"org.content.count","buckets":[{"key":1502562600000,"key_name":"2017-08-13","value":0},{"key":1502649000000,"key_name":"2017-08-14","value":0},{"key":1502735400000,"key_name":"2017-08-15","value":0},{"key":1502821800000,"key_name":"2017-08-16","value":0},{"key":1502908200000,"key_name":"2017-08-17","value":1},{"key":1502994600000,"key_name":"2017-08-18","value":0},{"key":1503081000000,"key_name":"2017-08-19","value":1},{"key":1503167400000,"key_name":"2017-08-20","value":0}]}},"snapshot":{"org.creation.content.count":{"name":"Number of content created","value":13},"org.creation.authors.count":{"name":"Number of authors","value":2},"org.creation.reviewers.count":{"name":"Number of reviewers","value":1},"org.creation.content[@status=draft].count":{"name":"Number of content items created","value":13},"org.creation.content[@status=review].count":{"name":"Number of content items reviewed","value":0},"org.creation.content[@status=published].count":{"name":"Number of content items published","value":2}}}}';
     deferred.resolve(response);
            return deferred.promise;
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
