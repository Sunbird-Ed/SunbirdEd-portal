'use strict'

describe('Factory: QueryService', function () {
  beforeEach(module('playerApp'))

  var QueryService
  var testData = dashboardsTestData.rendererData   // eslint-disable-line

  beforeEach(inject(function ($rootScope, $controller) {  // eslint-disable-line
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  beforeEach(inject(function ($rootScope, _QueryService_) {  // eslint-disable-line
    QueryService = _QueryService_
  }))

  it('should return course consumption data source instance', function () {
    var objCourseConsumption = new QueryService.CreateNewInstance({eid: 'courseConsumption'})
    expect(objCourseConsumption.getData).not.toBe(undefined)
  })

  it('should return course progress data source instance', function () {
    var objCourseProgress = new QueryService.CreateNewInstance({eid: 'courseProgress'})
    expect(objCourseProgress.getData).not.toBe(undefined)
  })

  it('should return org creation data source instance', function () {
    var objOrgCreation = new QueryService.CreateNewInstance({eid: 'orgCreation'})
    expect(objOrgCreation.getData).not.toBe(undefined)
  })

  it('should return org creation data source instance', function () {
    var objOrgConsumption = new QueryService.CreateNewInstance({eid: 'orgConsumption'})
    expect(objOrgConsumption.getData).not.toBe(undefined)
  })

  it('should return downloadReport data source instance', function () {
    var objDownloadReport = new QueryService.CreateNewInstance({eid: 'downloadReport'})
    expect(objDownloadReport.download).not.toBe(undefined)
  })

  it('should return error ', function () {
    var objDownloadReport = new QueryService.CreateNewInstance({eid: ''})
    expect(objDownloadReport.getData).toBe(undefined)
    expect(objDownloadReport.error).not.toBe(undefined)
  })
})
