/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .service('courseConsumptionDataSource', ['$q', '$rootScope', 'config', 'httpAdapter', 'toasterService',
    'dashboardService', function ($q,
      $rootScope, config, httpAdapter, toasterService, dashboardService) {
    /**
     * @method getData
     * @desc get course consumption dashboard data
     * @memberOf Services.courseConsumptionDataSource
     * @param {Object}  req - Request object
     * @param {string}  datasetType - Data set type
     * @param {object} headers headers
     * @returns promise
     * @instance
     */
      this.getData = function (req, url, headers) {
        var URL = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + url + '/' +
      req.courseId + '?period=' + req.timePeriod
        var deferred = $q.defer()
        var response = httpAdapter.httpCall(URL, '', 'GET', headers)
        response.then(function (res) {
          if (res && res.responseCode === 'OK') {
            var graphBlockData = []
            var series = []
            angular.forEach(res.result.snapshot, function (numericData, key) {
              if (key !== 'course.consumption.users_completed') {
                dashboardService.secondsToMin(numericData)
              }
              graphBlockData.push(numericData)
            })
            angular.forEach(res.result.series, function (bucketData, key) {
              series.push(bucketData.name)
            })
            var returnData = {
              bucketData: res.result.series,
              numericData: graphBlockData,
              series: series
            }
            deferred.resolve(returnData)
          } else {
            toasterService.error($rootScope.messages.fmsg.m0075)
            deferred.reject(res)
          }
        }, function (err) {
          toasterService.error($rootScope.messages.emsg.m0005)
          deferred.reject(err)
        })
        return deferred.promise
      }
    }])
