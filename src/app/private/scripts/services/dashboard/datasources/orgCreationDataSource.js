/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .service('orgCreationDataSource', ['$q', 'config', '$rootScope', 'httpAdapter',
    'toasterService', function ($q, config,
      $rootScope, httpAdapter, toasterService) {
      var numericBlockData = []
      var graphSeries = []
      var contentStatus = {
        'org.creation.content[@status=published].count': ' LIVE',
        'org.creation.content[@status=draft].count': ' Created',
        'org.creation.content[@status=review].count': ' IN REVIEW'
      }

      function buildNumericAndSeriesData (numericData, key) {
        switch (key) {
        case 'org.creation.authors.count':
        case 'org.creation.reviewers.count':
        case 'org.creation.content.count':
          numericBlockData.push(numericData)
          break
        default:
          graphSeries.push(numericData.value + contentStatus[key])
        }
      }
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
            angular.forEach(res.result.snapshot, function (numericData, key) {
              buildNumericAndSeriesData(numericData, key)
            })
            var name = res.result.period === '5w' ? 'Content created per week' : 'Content created per day'
            var returnData = {
              bucketData: res.result.series,
              name: name,
              numericData: numericBlockData,
              series: graphSeries
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
