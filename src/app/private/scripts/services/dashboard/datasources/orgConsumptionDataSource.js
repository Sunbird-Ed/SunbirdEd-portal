/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .service('orgConsumptionDataSource', ['$q', 'config', '$rootScope', 'httpAdapter', 'toasterService',
    'dataUtils', function ($q, config,
      $rootScope, httpAdapter, toasterService, dataUtils) {
      var orgConsDataSource = this
      /**
     * @method buildNumericData
     * @desc convert time from seconds to min
     * @memberOf Services.orgConsumptionDataSource
     * @param {Object}  numericData - snapshot data
     * @param {string}  key - array key
     */
      orgConsDataSource.buildNumericData = function (numericData, key) {
        switch (key) {
        case 'org.consumption.content.session.count':
        case 'org.consumption.content.time_spent.sum':
        case 'org.consumption.content.time_spent.average':
          orgConsDataSource.numericBlockData.push(dataUtils.secondsToMin(numericData))
          break
        default:
          orgConsDataSource.numericBlockData.push(numericData)
        }
      }
      /**
     * @method getData
     * @desc get ord dashboard data based on datasetTye
     * @memberOf Services.orgConsumptionDataSource
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
            orgConsDataSource.numericBlockData = []

            // Get graph block data
            angular.forEach(res.result.snapshot, function (numericData, key) {
              orgConsDataSource.buildNumericData(numericData, key)
            })

            // DataSource return data
            var returnData = {
              bucketData: res.result.series, // Graph bucket data
              numericData: orgConsDataSource.numericBlockData,
              series: ''
            }

            // Resolve promise
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
