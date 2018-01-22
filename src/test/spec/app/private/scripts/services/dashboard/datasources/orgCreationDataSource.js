'use strict'

describe('Service: orgCreationDataSource', function () {
  beforeEach(module('playerApp'))

  var orgCreateDataSource, scope, $q, deferred, toasterService, httpAdapter // eslint-disable-line
  var testData = dashboardDataSourceTestData.orgCreationData // eslint-disable-line
  var requestBody = {identifier: '0123150108807004166', timePeriod: '14d'}
  beforeEach(inject(function ($rootScope, $controller) {   // eslint-disable-line
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  beforeEach(inject(function ($rootScope, $controller, _orgCreationDataSource_, _$q_, _toasterService_, _httpAdapter_) { // eslint-disable-line
    scope = $rootScope.$new()
    orgCreateDataSource = _orgCreationDataSource_
    $q = _$q_
    deferred = _$q_.defer()
    toasterService = _toasterService_
    httpAdapter = _httpAdapter_
  }))

  describe('Test course creation data source service', function () {
    it('should extract api response', function () {
      orgCreateDataSource.blockData = []
      spyOn(orgCreateDataSource, 'parseResponse').and.callThrough()
      var result = orgCreateDataSource.parseResponse(testData.getSuccessData.result)
      scope.$apply()
      expect(orgCreateDataSource.blockData.length).not.toBe(0)
      expect(orgCreateDataSource.graphSeries.length).not.toBe(0)
      expect(result.bucketData).toEqual(testData.getSuccessData.result.series)
    })

    it('should return client error', function () {
      orgCreateDataSource.blockData = []
      spyOn(httpAdapter, 'httpCall').and.returnValue(deferred.promise)
      deferred.resolve(testData.clientError)
      spyOn(orgCreateDataSource, 'getData').and.callThrough()
      orgCreateDataSource.getData(requestBody)
      scope.$apply()
      expect(orgCreateDataSource.getData).toBeDefined()
      expect(orgCreateDataSource.blockData.length).toBe(0)
    })

    // Catch block
    it('should return invalid response', function () {
      orgCreateDataSource.blockData = []
      spyOn(httpAdapter, 'httpCall').and.returnValue(deferred.promise)
      deferred.reject(testData.clientError)
      spyOn(orgCreateDataSource, 'getData').and.callThrough()
      orgCreateDataSource.getData(requestBody)
      scope.$apply()
      expect(orgCreateDataSource.getData).toBeDefined()
      expect(orgCreateDataSource.blockData.length).toBe(0)
    })
  })
})
