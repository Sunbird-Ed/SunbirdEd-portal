/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .service('courseProgressDataSource', ['$q', '$rootScope', 'httpAdapter', 'toasterService', 'dataSourceUtils',
    function ($q, $rootScope, httpAdapter, toasterService, dataSourceUtils) {
      var courseProgressDataSource = this
      /**
     * @method getData
     * @desc get course dashboard data based on datasetTye
     * @memberOf Services.orgDataSource
     * @param {Object}  req - Request object
     * @param {string}  datasetType - Data set type
     * @returns promise
     * @instance
     */
      this.getData = function (req, url) {
        var URL = dataSourceUtils.constructApiUrl(req, url)
        var deferred = $q.defer()
        httpAdapter.httpCall(URL, '', 'GET').then(function (res) {
          courseProgressDataSource.tableData = []
          if (res && res.responseCode === 'OK') {
            angular.forEach(res.result.series, function (seriesData, key) {
              if (key === 'course.progress.course_progress_per_user.count') {
                angular.forEach(seriesData, function (bucketData, key) {
                  if (key === 'buckets') {
                    courseProgressDataSource.tableData = bucketData
                  }
                })
              }
            })
            deferred.resolve(courseProgressDataSource.tableData)
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
