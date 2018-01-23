/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .service('orgCreationDataSource', ['$q', '$rootScope', 'httpAdapter', 'toasterService',
    'dataSourceUtils', function ($q, $rootScope, httpAdapter, toasterService,
      dataSourceUtils) {
      var orgCreateDataSource = this
      var contentStatus = {
        'org.creation.content[@status=published].count': ' LIVE',
        'org.creation.content[@status=draft].count': ' Created',
        'org.creation.content[@status=review].count': ' IN REVIEW'
      }

      /**
     * @method getData
     * @desc get ord dashboard data based on datasetTye
     * @memberOf Services.orgCreationDataSource
     * @param {Object}  req - Request object
     * @param {string}  datasetType - Data set type
     * @returns promise
     * @instance
     */
      this.getData = function (req) {
        var URL, deferred, response, header
        URL = dataSourceUtils.constructApiUrl(req, 'ORG_CREATION')
        header = dataSourceUtils.getDefaultHeader()
        deferred = $q.defer()
        response = httpAdapter.httpCall(URL, '', 'GET', header)
        response.then(function (res) {
          if (res && res.responseCode === 'OK') {
            deferred.resolve(orgCreateDataSource.parseResponse(res.result))
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
     * @memberOf Services.orgCreationDataSource
     * @param {Object}  data - api response
     * @return {object} [description]
     */
      orgCreateDataSource.parseResponse = function (data) {
        orgCreateDataSource.blockData = []
        orgCreateDataSource.graphSeries = []
        orgCreateDataSource.extractSnapshotData(data.snapshot)
        return {
          bucketData: data.series,
          name: data.period === '5w' ? 'Content created per week' : 'Content created per day',
          numericData: orgCreateDataSource.blockData,
          series: orgCreateDataSource.graphSeries
        }
      }

      /**
     * @method extractSnapshotData
     * @desc convert time from seconds to min
     * @memberOf Services.orgCreationDataSource
     * @param {Object}  snapshot - snapshot data
     */
      orgCreateDataSource.extractSnapshotData = function (snapshot) {
        angular.forEach(snapshot, function (numericData, key) {
          switch (key) {
          case 'org.creation.authors.count':
          case 'org.creation.reviewers.count':
          case 'org.creation.content.count':
            orgCreateDataSource.blockData.push(numericData)
            break
          default:
            orgCreateDataSource.graphSeries.push(numericData.value + contentStatus[key])
          }
        })
      }
    }])
