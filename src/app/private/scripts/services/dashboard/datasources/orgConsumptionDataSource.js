/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .service('orgConsumptionDataSource', ['$rootScope', '$q', 'httpAdapter', 'toasterService',
    'dataSourceUtils', function ($rootScope, $q, httpAdapter, toasterService, dataSourceUtils) {
      var orgConsDataSource = this
      /**
     * @method getData
     * @desc get ord dashboard data based on datasetTye
     * @memberOf Services.orgConsumptionDataSource
     * @param {Object}  req - Request object
     * @param {string}  datasetType - Data set type
     * @returns promise
     * @instance
     */
      this.getData = function (req) {
        var URL, deferred, header, response
        URL = dataSourceUtils.constructApiUrl(req, 'ORG_CONSUMPTION')
        deferred = $q.defer()
        header = dataSourceUtils.getDefaultHeader()
        response = httpAdapter.httpCall(URL, '', 'GET', header)
        response.then(function (res) {
          if (res && res.responseCode === 'OK') {
            deferred.resolve(orgConsDataSource.parseResponse(res.result))
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

      /**
     * @method parseResponse
     * @desc parse api response
     * @memberOf Services.orgConsumptionDataSource
     * @param {Object}  data - api response
     * @return {Object} graph data
     */
      orgConsDataSource.parseResponse = function (data) {
        return {
          bucketData: data.series,
          numericData: orgConsDataSource.extractSnapshotData(data.snapshot),
          series: ''
        }
      }

      /**
     * @method extractSnapshotData
     * @desc convert time from seconds to min
     * @memberOf Services.orgConsumptionDataSource
     * @param {Object}  numericData - snapshot data
     * @param {string}  key - array key
     */
      orgConsDataSource.extractSnapshotData = function (snapshot) {
        orgConsDataSource.blockData = []
        angular.forEach(snapshot, function (numericData, key) {
          switch (key) {
          // case 'org.consumption.content.session.count':
          case 'org.consumption.content.time_spent.sum':
          case 'org.consumption.content.time_spent.average':
            orgConsDataSource.blockData.push(dataSourceUtils.secondsToMin(numericData))
            break
          default:
            orgConsDataSource.blockData.push(numericData)
          }
        })

        return orgConsDataSource.blockData
      }
    }])
