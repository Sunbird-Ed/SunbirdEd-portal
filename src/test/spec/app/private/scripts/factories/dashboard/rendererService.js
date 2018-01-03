'use strict'

describe('Factory: rendererService', function () {
  beforeEach(module('playerApp'))

  var rendererService
  var testData = dashboardsTestData.rendererData   // eslint-disable-line

  beforeEach(inject(function ($rootScope, $controller) {  // eslint-disable-line
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  beforeEach(inject(function ($rootScope, _rendererService_) {  // eslint-disable-line
    rendererService = _rendererService_
  }))

  it('Checking renderer with valid data', function () {
    var data = testData.series
    var rendererData = new rendererService.Render(data)
    rendererData = JSON.stringify(rendererData.chartList[0][0])
    var responseData = '["21 Created","0 IN REVIEW","7 LIVE"]'
    expect(rendererData).toEqual(responseData)
  })

  it('Checking renderer with empty series data', function () {
    var data = testData.noSeries
    var rendererData = new rendererService.Render(data)
    rendererData = JSON.stringify(rendererData.chartList[0][0])
    var responseData = '["Number of users per day"]'
    expect(rendererData).toEqual(responseData)
  })

  it('Renderer should return undefined', function () {
    var rendererData = new rendererService.Render()
    expect(rendererData.chartList).toBe(undefined)
  })
})
