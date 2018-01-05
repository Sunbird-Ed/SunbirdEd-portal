'use strict'

describe('Service: orgConsumptionDataSource', function () {
  beforeEach(module('playerApp'))

  var orgConsDataSource, scope, $q, deferred, toasterService, httpAdapter // eslint-disable-line
  var testData = dashboardDataSourceTestData.orgConsumptionData // eslint-disable-line
  beforeEach(inject(function ($rootScope, $controller) {   // eslint-disable-line
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  beforeEach(inject(function ($rootScope, $controller, _orgConsumptionDataSource_, _$q_, _toasterService_, _httpAdapter_) { // eslint-disable-line
    scope = $rootScope.$new()
    orgConsDataSource = _orgConsumptionDataSource_
    $q = _$q_
    deferred = _$q_.defer()
    toasterService = _toasterService_
    httpAdapter = _httpAdapter_
  }))

  describe('Test course consumption data source service', function () {
    // Extract snapshot data
    it('should extract snapshot data', function () {
      orgConsDataSource.blockData = []
      // To cover switch case
      testData.getSuccessData.result.snapshot[3] = { 'dummy_index': {'count': 0} }
      spyOn(orgConsDataSource, 'extractSnapshotData').and.callThrough()
      orgConsDataSource.extractSnapshotData(testData.getSuccessData.result.snapshot)
      scope.$apply()
      expect(orgConsDataSource.extractSnapshotData).toBeDefined()
      expect(orgConsDataSource.blockData).toBeDefined()
      expect(orgConsDataSource.blockData.length).toBeGreaterThan(2)
    })

    // Parse api response
    it('should extract snapshot data', function () {
      spyOn(orgConsDataSource, 'parseResponse').and.callThrough()
      var response = orgConsDataSource.parseResponse(testData.getSuccessData.result)
      scope.$apply()
      expect(orgConsDataSource.parseResponse).toBeDefined()
      expect(orgConsDataSource.parseResponse).toHaveBeenCalled()
      expect(response.bucketData).toBeDefined()
      expect(response.series).not.toBe(null)
    })

    it('should return valid api response', function () {
      spyOn(httpAdapter, 'httpCall').and.returnValue(deferred.promise)
      deferred.resolve(testData.getSuccessData)
      spyOn(orgConsDataSource, 'getData').and.callThrough()
      orgConsDataSource.getData({identifier: '1234567', timePeriod: '7d'})
      spyOn(orgConsDataSource, 'parseResponse').and.callThrough()
      scope.$apply()
      expect(orgConsDataSource.getData).toBeDefined()
      expect(orgConsDataSource.parseResponse).toHaveBeenCalled()
      expect(orgConsDataSource.blockData).not.toBe(null)
      expect(orgConsDataSource.blockData.length).toBeGreaterThan(2)
    })

    it('should return client error', function () {
      spyOn(httpAdapter, 'httpCall').and.returnValue(deferred.promise)
      deferred.resolve(testData.clientError)
      spyOn(orgConsDataSource, 'getData').and.callThrough()
      orgConsDataSource.getData({identifier: '1234567', timePeriod: '7d'})
      scope.$apply()
      expect(orgConsDataSource.getData).toBeDefined()
      expect(orgConsDataSource.blockData).not.toBeDefined()
    })

    // Catch block
    it('should return invalid response', function () {
      spyOn(httpAdapter, 'httpCall').and.returnValue(deferred.promise)
      deferred.reject(testData.clientError)
      spyOn(orgConsDataSource, 'getData').and.callThrough()
      orgConsDataSource.getData({identifier: '1234567', timePeriod: '7d'})
      scope.$apply()
      expect(orgConsDataSource.getData).toBeDefined()
      expect(orgConsDataSource.blockData).not.toBeDefined()
    })
  })
})
