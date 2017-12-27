/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .service('orgConsumptionDataSource', ['$q', 'config', '$rootScope', 'httpAdapter', 'toasterService',
    'dashboardService', function ($q, config,
      $rootScope, httpAdapter, toasterService, dashboardService) {
    /**
     * @method getData
     * @desc get ord dashboard data based on datasetTye
     * @memberOf Services.orgDataSource
     * @param {Object}  req - Request object
     * @param {string}  datasetType - Data set type
     * @param {object} headers headers
     * @returns promise
     * @instance
     */
      this.getData = function (req, url, headers) {
        var URL = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + url + '/' +
      req.orgId + '?period=' + req.timePeriod
        var deferred = $q.defer()
        var response = httpAdapter.httpCall(URL, '', 'GET', headers)
        response.then(function (res) {
          if (res && res.responseCode === 'OK') {
            var numericStatArray = []
            var series = []
            angular.forEach(res.result.snapshot, function (numericData, key) {
              if (key === 'org.consumption.content.session.count' ||
              key === 'org.consumption.content.time_spent.sum' || key === 'org.consumption.content.time_spent.average') { // eslint-disable-line
                if (key === 'org.consumption.content.time_spent.sum' || key === 'org.consumption.content.time_spent.average') { // eslint-disable-line
                  numericData = dashboardService.secondsToMin(numericData)
                  numericStatArray.push(numericData)
                } else {
                  numericStatArray.push(numericData)
                }
              }
            })
            angular.forEach(res.result.series, function (bucketData, key) {
              series.push(bucketData.name)
            })

            var returnData = {apiResponse: res.result, numericData: numericStatArray, series: series}
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
