/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .service('courseConsumptionDataSource', ['$rootScope', '$q', 'httpAdapter', 'toasterService',
    'dataSourceUtils', function ($rootScope, $q, httpAdapter, toasterService, dataSourceUtils) {
      var courseConsDataSource = this
      /**
     * @method getData
     * @desc get course consumption dashboard data
     * @memberOf Services.courseConsumptionDataSource
     * @param {Object}  req - Request object
     * @param {string}  datasetType - Data set type
     * @returns promise
     * @instance
     */
      this.getData = function (req) {
        var URL, deferred, header
        URL = dataSourceUtils.constructApiUrl(req, 'COURSE_CONSUMPTION')
        header = dataSourceUtils.getDefaultHeader()
        deferred = $q.defer()
        httpAdapter.httpCall(URL, '', 'GET', header).then(function (res) {
          if (res && res.responseCode === 'OK') {
            deferred.resolve(courseConsDataSource.parseResponse(res.result))
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

      /**
     * @method parseResponse
     * @desc parse api response
     * @memberOf Services.courseConsumptionDataSource
     * @param {Object}  data - api response
     * @return {Object} graph data
     */
      courseConsDataSource.parseResponse = function (data) {
        courseConsDataSource.blockData = []
        angular.forEach(data.snapshot, function (numericData, key) {
          if (key !== 'course.consumption.users_completed') {
            dataSourceUtils.secondsToMin(numericData)
          }
          courseConsDataSource.blockData.push(numericData)
        })

        return {
          bucketData: data.series,
          numericData: courseConsDataSource.blockData,
          series: ''
        }
      }
    }])
