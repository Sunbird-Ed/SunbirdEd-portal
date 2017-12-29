/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .service('courseConsumptionDataSource', ['$q', '$rootScope', 'config', 'httpAdapter', 'toasterService',
    'dashboardService', function ($q,
      $rootScope, config, httpAdapter, toasterService, dashboardService) {
      var courseConsDataSource = this
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
        httpAdapter.httpCall(URL, '', 'GET', headers).then(function (res) {
          if (res && res.responseCode === 'OK') {
            courseConsDataSource.graphBlockData = []
            angular.forEach(res.result.snapshot, function (numericData, key) {
              if (key !== 'course.consumption.users_completed') {
                dashboardService.secondsToMin(numericData)
              }
              courseConsDataSource.graphBlockData.push(numericData)
            })
            var returnData = {
              bucketData: res.result.series,
              numericData: courseConsDataSource.graphBlockData,
              series: ''
            }
            deferred.resolve(returnData)
          } else {
            toasterService.error($rootScope.messages.fmsg.m0075)
            deferred.reject(res)
          }
        }).catch(function (err) {
          toasterService.error($rootScope.messages.emsg.m0005)
          deferred.reject(err)
        })
        return deferred.promise
      }
    }])
