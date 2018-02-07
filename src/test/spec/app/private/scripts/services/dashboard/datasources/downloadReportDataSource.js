'use strict'

describe('Service: downloadReportDataSource', function () {
  beforeEach(module('playerApp'))

  var downloadReportDataSource, scope, $q, deferred, toasterService, httpAdapter // eslint-disable-line
  var testData = dashboardDataSourceTestData.downloadDashboardReport // eslint-disable-line
  beforeEach(inject(function ($rootScope, $controller) {   // eslint-disable-line
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  beforeEach(inject(function ($rootScope, $controller, _downloadReportDataSource_, _$q_, _toasterService_, _httpAdapter_) { // eslint-disable-line
    scope = $rootScope.$new()
    downloadReportDataSource = _downloadReportDataSource_
    $q = _$q_
    deferred = _$q_.defer()
    toasterService = _toasterService_
    httpAdapter = _httpAdapter_
  }))

  describe('Test course consumption data source service', function () {
    it('should return valid api response', function () {
      spyOn(httpAdapter, 'httpCall').and.returnValue(deferred.promise)
      deferred.resolve(testData.getSuccessData)
      spyOn(downloadReportDataSource, 'download').and.callThrough()
      downloadReportDataSource.download('', '')
      scope.$apply()
      expect(downloadReportDataSource.download).toBeDefined()
      expect(scope.response).not.toBe(null)
    })

    it('should check responseCode is OK or not', function () {
      spyOn(httpAdapter, 'httpCall').and.returnValue(deferred.promise)
      deferred.resolve(testData.clientError)
      spyOn(downloadReportDataSource, 'download').and.callThrough()
      downloadReportDataSource.download('', '')
      scope.$apply()
      expect(downloadReportDataSource.download).toBeDefined()
      expect(downloadReportDataSource.returnData).not.toBeDefined()
    })

    // Catch block
    it('should return client error or server error', function () {
      spyOn(httpAdapter, 'httpCall').and.returnValue(deferred.promise)
      deferred.reject(testData.clientError)
      spyOn(downloadReportDataSource, 'download').and.callThrough()
      downloadReportDataSource.download('', '')
      scope.$apply()
      expect(downloadReportDataSource.download).toBeDefined()
      expect(downloadReportDataSource.returnData).not.toBeDefined()
    })
  })
})
