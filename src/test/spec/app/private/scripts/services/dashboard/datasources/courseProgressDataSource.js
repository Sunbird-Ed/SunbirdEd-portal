'use strict'

describe('Service: courseProgressDataSource', function () {
  beforeEach(module('playerApp'))

  var courseProgressDataSource, scope, $q, deferred, toasterService, httpAdapter   // eslint-disable-line
  var testData = dashboardDataSourceTestData.courseProgressData // eslint-disable-line
  var requestBody = {identifier: 'do_2124000017636802561576', timePeriod: '7d'}
  beforeEach(inject(function ($rootScope, $controller) {   // eslint-disable-line
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  beforeEach(inject(function ($rootScope, $controller, _courseProgressDataSource_, _$q_, _toasterService_, _httpAdapter_) { // eslint-disable-line
    scope = $rootScope.$new()
    courseProgressDataSource = _courseProgressDataSource_
    $q = _$q_
    deferred = _$q_.defer()
    toasterService = _toasterService_
    httpAdapter = _httpAdapter_
  }))

  describe('Test course consumption data source service', function () {
    it('should return valid api response', function () {
      courseProgressDataSource.tableData = []
      spyOn(httpAdapter, 'httpCall').and.returnValue(deferred.promise)
      deferred.resolve(testData.getBatchDetails)
      spyOn(courseProgressDataSource, 'getData').and.callThrough()
      courseProgressDataSource.getData(requestBody)
      scope.$apply()
      expect(courseProgressDataSource.getData).toBeDefined()
      expect(courseProgressDataSource.tableData.length).not.toBe(0)
    })

    it('should return client error', function () {
      courseProgressDataSource.tableData = []
      spyOn(httpAdapter, 'httpCall').and.returnValue(deferred.promise)
      deferred.resolve(testData.errorResponse)
      spyOn(courseProgressDataSource, 'getData').and.callThrough()
      courseProgressDataSource.getData(requestBody)
      scope.$apply()
      expect(courseProgressDataSource.getData).toBeDefined()
      expect(courseProgressDataSource.tableData.length).toBe(0)
    })

    // Catch block
    it('should return invalid response', function () {
      spyOn(httpAdapter, 'httpCall').and.returnValue(deferred.promise)
      deferred.reject(testData.errorResponse)
      spyOn(courseProgressDataSource, 'getData').and.callThrough()
      courseProgressDataSource.getData('', '', '')
      scope.$apply()
      expect(courseProgressDataSource.getData).toBeDefined()
      expect(courseProgressDataSource.tableData).not.toBeDefined()
    })
  })
})
