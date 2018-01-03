'use strict'

describe('Factory: rendererService', function () {
  beforeEach(module('playerApp'))

  var rendererService
  // var annTestData = announcementTestData

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
    var data = { 'bucketData': { 'org.creation.content[@status=draft].count': { 'name': 'Draft', 'split': 'content.created_on', 'group_id': 'org.content.count', 'buckets': [{ 'key': 1514226600000, 'key_name': '2017-12-26', 'value': 6 }, { 'key': 1514313000000, 'key_name': '2017-12-27', 'value': 3 }, { 'key': 1514399400000, 'key_name': '2017-12-28', 'value': 1 }, { 'key': 1514485800000, 'key_name': '2017-12-29', 'value': 5 }, { 'key': 1514572200000, 'key_name': '2017-12-30', 'value': 0 }, { 'key': 1514658600000, 'key_name': '2017-12-31', 'value': 0 }, { 'key': 1514745000000, 'key_name': '2018-01-01', 'value': 6 }] }, 'org.creation.content[@status=review].count': { 'name': 'Review', 'split': 'content.reviewed_on', 'group_id': 'org.content.count', 'buckets': [{ 'key': 1514277252644, 'key_name': '2017-12-26', 'value': 0 }, { 'key': 1514363652644, 'key_name': '2017-12-27', 'value': 0 }, { 'key': 1514450052644, 'key_name': '2017-12-28', 'value': 0 }, { 'key': 1514536452644, 'key_name': '2017-12-29', 'value': 0 }, { 'key': 1514622852644, 'key_name': '2017-12-30', 'value': 0 }, { 'key': 1514709252644, 'key_name': '2017-12-31', 'value': 0 }, { 'key': 1514795652644, 'key_name': '2018-01-01', 'value': 0 }] }, 'org.creation.content[@status=published].count': { 'name': 'Live', 'split': 'content.published_on', 'group_id': 'org.content.count', 'buckets': [{ 'key': 1514226600000, 'key_name': '2017-12-26', 'value': 0 }, { 'key': 1514313000000, 'key_name': '2017-12-27', 'value': 0 }, { 'key': 1514399400000, 'key_name': '2017-12-28', 'value': 2 }, { 'key': 1514485800000, 'key_name': '2017-12-29', 'value': 0 }, { 'key': 1514572200000, 'key_name': '2017-12-30', 'value': 3 }, { 'key': 1514658600000, 'key_name': '2017-12-31', 'value': 0 }, { 'key': 1514745000000, 'key_name': '2018-01-01', 'value': 2 }] } }, 'name': 'Content created per day', 'numericData': [{ 'name': 'Number of contents created', 'value': 21 }, { 'name': 'Number of authors', 'value': 6 }, { 'name': 'Number of reviewers', 'value': 5 }], 'series': ['21 Created', '0 IN REVIEW', '7 LIVE'] }

    var rendererData = new rendererService.Render(data)
    rendererData = JSON.stringify(rendererData.chartList[0][0])
    var responseData = '["21 Created","0 IN REVIEW","7 LIVE"]'
    expect(rendererData).toEqual(responseData)
  })

  it('Checking renderer with empty series data', function () {
    var data = { 'bucketData': { 'org.consumption.content.users.count': { 'name': 'Number of users per day', 'split': 'content.users.count', 'group_id': 'org.users.count', 'buckets': [{ 'key': 1514270177342, 'key_name': '2017-12-26', 'value': 0 }, { 'key': 1514356577342, 'key_name': '2017-12-27', 'value': 0 }, { 'key': 1514442977342, 'key_name': '2017-12-28', 'value': 0 }, { 'key': 1514529377342, 'key_name': '2017-12-29', 'value': 0 }, { 'key': 1514615777342, 'key_name': '2017-12-30', 'value': 0 }, { 'key': 1514702177342, 'key_name': '2017-12-31', 'value': 0 }, { 'key': 1514788577342, 'key_name': '2018-01-01', 'value': 0 }] }, 'org.consumption.content.time_spent.sum': { 'name': 'Time spent by day', 'split': 'content.time_spent.user.count', 'time_unit': 'seconds', 'group_id': 'org.timespent.sum', 'buckets': [{ 'key': 1514270177342, 'key_name': '2017-12-26', 'value': 0 }, { 'key': 1514356577342, 'key_name': '2017-12-27', 'value': 0 }, { 'key': 1514442977342, 'key_name': '2017-12-28', 'value': 0 }, { 'key': 1514529377342, 'key_name': '2017-12-29', 'value': 0 }, { 'key': 1514615777342, 'key_name': '2017-12-30', 'value': 0 }, { 'key': 1514702177342, 'key_name': '2017-12-31', 'value': 0 }, { 'key': 1514788577342, 'key_name': '2018-01-01', 'value': 0 }] } }, 'numericData': [{ 'name': 'Number of visits by users', 'value': '0 second(s)' }, { 'name': 'Content consumption time', 'value': '0 second(s)', 'time_unit': 'seconds' }, { 'name': 'Average time spent by user per visit', 'value': '0 second(s)', 'time_unit': 'seconds' }], 'series': '' }

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
