/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .service('courseProgressService', ['$q', '$rootScope', 'config', 'httpAdapter', 'toasterService', function ($q,
    $rootScope, config, httpAdapter, toasterService) {
    /**
     * @method getData
     * @desc get course dashboard data based on datasetTye
     * @memberOf Services.orgDataSource
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
          deferred.resolve(res.result)
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
