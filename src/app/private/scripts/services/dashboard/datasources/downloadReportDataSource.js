/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .service('downloadReportDataSource', ['$q', '$rootScope', 'httpAdapter', 'toasterService',
    'dataSourceUtils', function ($q, $rootScope, httpAdapter, toasterService, dataSourceUtils) {
      var downloadReport = this

      /**
     * @method getData
     * @desc get ord dashboard data based on datasetTye
     * @memberOf Services.orgConsumptionDataSource
     * @param {Object}  req - Request object
     * @param {string}  datasetType - Data set type
     * @returns promise
     * @instance
     */
      downloadReport.download = function (req, url) {
        var URL = dataSourceUtils.constructDownloadReportUrl(req, url)
        var deferred = $q.defer()
        var response = httpAdapter.httpCall(URL, '', 'GET')
        response.then(function (res) {
          if (res && res.responseCode === 'OK') {
            deferred.resolve(res)
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
