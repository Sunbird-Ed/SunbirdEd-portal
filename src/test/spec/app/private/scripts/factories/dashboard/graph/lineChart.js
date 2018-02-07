'use strict'

describe('Factory: LineChart', function () {
  beforeEach(module('playerApp'))

  var LineChart
  var testData = dashboardsTestData.rendererData   // eslint-disable-line

  beforeEach(inject(function ($rootScope, $controller) {  // eslint-disable-line
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  beforeEach(inject(function ($rootScope, _LineChart_) {  // eslint-disable-line
    LineChart = _LineChart_
  }))

  it('Checking renderer with valid data', function () {
    var data = testData.series
    var chart = new LineChart()
    var rendererData = chart.render(data)
    rendererData = JSON.stringify(rendererData[0][0])
    var responseData = '["21 Created","0 IN REVIEW","7 LIVE"]'
    expect(rendererData).toEqual(responseData)
  })

  xit('Checking renderer with empty series data', function () {
    var data = testData.noSeries
    var chart = new LineChart()
    var rendererData = chart.render(data)
    rendererData = JSON.stringify(rendererData[0][0])
    var responseData = '["Number of users per day"]'
    expect(rendererData).toEqual(responseData)
  })

  it('Renderer should return undefined', function () {
    var chart = new LineChart()
    var rendererData = chart.render()
    expect(rendererData).toBe(undefined)
  })
})
