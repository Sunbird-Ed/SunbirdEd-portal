'use strict'

describe('Service: orgCreationDataSource', function () {
  beforeEach(module('playerApp'))

  var orgCreateDataSource, scope, $q, deferred, toasterService, httpAdapter // eslint-disable-line
  var testData = dashboardDataSourceTestData.orgCreationData // eslint-disable-line
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
    xit('should return valid api response', function () {
      orgCreateDataSource.numericBlockData = []
      spyOn(httpAdapter, 'httpCall').and.returnValue(deferred.promise)
      deferred.resolve(testData.getSuccessData)
      spyOn(orgCreateDataSource, 'getData').and.callThrough()
      orgCreateDataSource.getData('', '')
      scope.$apply()
      expect(orgCreateDataSource.getData).toBeDefined()
      expect(orgCreateDataSource.numericBlockData.length).not.toBe(0)
    })

    it('should return client error', function () {
      orgCreateDataSource.numericBlockData = []
      spyOn(httpAdapter, 'httpCall').and.returnValue(deferred.promise)
      deferred.resolve(testData.clientError)
      spyOn(orgCreateDataSource, 'getData').and.callThrough()
      orgCreateDataSource.getData('', '')
      scope.$apply()
      expect(orgCreateDataSource.getData).toBeDefined()
      expect(orgCreateDataSource.numericBlockData.length).toBe(0)
    })

    // Catch block
    it('should return invalid response', function () {
      spyOn(httpAdapter, 'httpCall').and.returnValue(deferred.promise)
      deferred.reject(testData.clientError)
      spyOn(orgCreateDataSource, 'getData').and.callThrough()
      orgCreateDataSource.getData('', '')
      scope.$apply()
      expect(orgCreateDataSource.getData).toBeDefined()
      expect(orgCreateDataSource.numericBlockData).not.toBeDefined()
    })
  })
})
