'use strict'

describe('Service: courseConsumptionDataSource', function () {
  beforeEach(module('playerApp'))

  var courseConsDataSource, scope, $q, deferred, toasterService, httpAdapter // eslint-disable-line
  var testData = dashboardDataSourceTestData.courseConsumptionData // eslint-disable-line
  var requestBody = {identifier: 'do_2124000017636802561576', timePeriod: '7d'}
  beforeEach(inject(function ($rootScope, $controller) {   // eslint-disable-line
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  beforeEach(inject(function ($rootScope, $controller, _courseConsumptionDataSource_, _$q_, _toasterService_, _httpAdapter_) { // eslint-disable-line
    scope = $rootScope.$new()
    courseConsDataSource = _courseConsumptionDataSource_
    $q = _$q_
    deferred = _$q_.defer()
    toasterService = _toasterService_
    httpAdapter = _httpAdapter_
  }))

  describe('Test course consumption data source service', function () {
    it('should return valid api response', function () {
      spyOn(httpAdapter, 'httpCall').and.returnValue(deferred.promise)
      deferred.resolve(testData.getCourseData)
      spyOn(courseConsDataSource, 'getData').and.callThrough()
      courseConsDataSource.getData(requestBody)
      spyOn(courseConsDataSource, 'parseResponse').and.callThrough()
      scope.$apply()
      expect(courseConsDataSource.getData).toBeDefined()
      expect(courseConsDataSource.parseResponse).toHaveBeenCalled()
      expect(courseConsDataSource.blockData).toBeDefined()
      expect(courseConsDataSource.blockData.length).toBeGreaterThan(2)
    })

    it('should return valid api response', function () {
      spyOn(courseConsDataSource, 'parseResponse').and.callThrough()
      var result = courseConsDataSource.parseResponse(testData.getCourseData.result)
      scope.$apply()
      expect(courseConsDataSource.parseResponse).toBeDefined()
      expect(result.bucketData).toEqual(testData.getCourseData.result.series)
      expect(result).not.toBe(null)
      expect(result.series).toEqual('') // series should be empty
    })

    it('should check responseCode other than OK', function () {
      courseConsDataSource.blockData = []
      spyOn(httpAdapter, 'httpCall').and.returnValue(deferred.promise)
      deferred.resolve(testData.errorResponse)
      spyOn(courseConsDataSource, 'getData').and.callThrough()
      courseConsDataSource.getData(requestBody)
      scope.$apply()
      expect(courseConsDataSource.getData).toBeDefined()
      expect(courseConsDataSource.blockData.length).toBe(0)
    })

    // Catch block
    it('should return invalid response', function () {
      spyOn(httpAdapter, 'httpCall').and.returnValue(deferred.promise)
      deferred.reject(testData.errorResponse)
      spyOn(courseConsDataSource, 'getData').and.callThrough()
      courseConsDataSource.getData(requestBody)
      scope.$apply()
      expect(courseConsDataSource.getData).toBeDefined()
      expect(courseConsDataSource.blockData).not.toBeDefined()
    })
  })
})
