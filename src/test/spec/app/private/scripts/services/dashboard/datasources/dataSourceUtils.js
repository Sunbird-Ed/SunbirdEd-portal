'use strict'

describe('Service: dataSourceUtils', function () {
  beforeEach(module('playerApp'))

  var dataSourceUtils, scope, $q, deferred   // eslint-disable-line
  var testData = dashboardDataSourceTestData.dataSourceUtils // eslint-disable-line
  beforeEach(inject(function ($rootScope, $controller) {   // eslint-disable-line
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  beforeEach(inject(function ($rootScope, $controller, _dataSourceUtils_, _$q_) { // eslint-disable-line
    scope = $rootScope.$new()
    dataSourceUtils = _dataSourceUtils_
    $q = _$q_
    deferred = _$q_.defer()
  }))

  describe('Test data source utils', function () {
    it('should return zero seconds', function () {
      var numericRes = {'value': 12}
      spyOn(dataSourceUtils, 'secondsToMin').and.callThrough()
      var response = dataSourceUtils.secondsToMin(numericRes)
      scope.$apply()
      expect(dataSourceUtils.secondsToMin).toBeDefined()
      expect(response.value).toEqual('0 second(s)')
    })

    it('should return value in a min', function () {
      var numericRes = {'value': 120}
      spyOn(dataSourceUtils, 'secondsToMin').and.callThrough()
      var response = dataSourceUtils.secondsToMin(numericRes)
      scope.$apply()
      expect(dataSourceUtils.secondsToMin).toBeDefined()
      expect(response.value).toEqual('2.00 min(s)')
    })

    it('should return value in a hour', function () {
      var numericRes = {'value': 3601}
      spyOn(dataSourceUtils, 'secondsToMin').and.callThrough()
      var response = dataSourceUtils.secondsToMin(numericRes)
      scope.$apply()
      expect(dataSourceUtils.secondsToMin).toBeDefined()
      expect(response.value).toEqual('1.00 hour(s)')
    })

    it('should return same api response', function () {
      var numericRes = {'value': ''}
      spyOn(dataSourceUtils, 'secondsToMin').and.callThrough()
      var response = dataSourceUtils.secondsToMin(numericRes)
      scope.$apply()
      expect(dataSourceUtils.secondsToMin).toBeDefined()
      expect(response.value).toEqual('0 second(s)')
    })
  })
})
