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
      this.getData = function (req) {
        var URL, deferred, header
        URL = dataSourceUtils.constructApiUrl(req, 'COURSE_PROGRESS')
        deferred = $q.defer()
        header = dataSourceUtils.getDefaultHeader()
        httpAdapter.httpCall(URL, '', 'GET', header).then(function (res) {
          if (res && res.responseCode === 'OK') {
            deferred.resolve(courseProgressDataSource.parseResponse(res.result))
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
     * @memberOf Services.orgCreationDataSource
     * @param {Object}  data - api response
     * @return {object} graph data
     */
      courseProgressDataSource.parseResponse = function (data) {
        courseProgressDataSource.tableData = []
        angular.forEach(data.series, function (seriesData, key) {
          if (key === 'course.progress.course_progress_per_user.count') {
            angular.forEach(seriesData, function (bucketData, key) {
              if (key === 'buckets') {
                courseProgressDataSource.tableData = bucketData
              }
            })
          }
        })
        return courseProgressDataSource.tableData
      }
    }])
