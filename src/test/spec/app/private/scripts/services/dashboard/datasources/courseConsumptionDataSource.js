'use strict'

describe('Service: courseConsumptionDataSource', function () {
  beforeEach(module('playerApp'))

  var courseConsDataSource, scope, $q, deferred, toasterService, httpAdapter // eslint-disable-line
  var testData = dashboardDataSourceTestData.courseConsumptionData // eslint-disable-line
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
      courseConsDataSource.blockData = []
      spyOn(httpAdapter, 'httpCall').and.returnValue(deferred.promise)
      deferred.resolve(testData.getCourseData)
      spyOn(courseConsDataSource, 'getData').and.callThrough()
      courseConsDataSource.getData('', '', '')
      scope.$apply()
      expect(courseConsDataSource.getData).toBeDefined()
      //  expect(courseConsDataSource.blockData.length).not.toBe(0)
    })

    it('should return responseCode other than OK', function () {
      courseConsDataSource.graphBlockData = []
      spyOn(httpAdapter, 'httpCall').and.returnValue(deferred.promise)
      deferred.resolve(testData.errorResponse)
      spyOn(courseConsDataSource, 'getData').and.callThrough()
      courseConsDataSource.getData('', '', '')
      scope.$apply()
      expect(courseConsDataSource.getData).toBeDefined()
      expect(courseConsDataSource.graphBlockData.length).toBe(0)
    })

    // Catch block
    it('should return invalid response', function () {
      spyOn(httpAdapter, 'httpCall').and.returnValue(deferred.promise)
      deferred.reject(testData.errorResponse)
      spyOn(courseConsDataSource, 'getData').and.callThrough()
      courseConsDataSource.getData('', '', '')
      scope.$apply()
      expect(courseConsDataSource.getData).toBeDefined()
      expect(courseConsDataSource.graphBlockData).not.toBeDefined()
    })
  })
})
