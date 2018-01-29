'use strict'

describe('Controller:courseProgressDashboardCtrl', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  var batchService // eslint-disable-line
  var scope
  var rootScope
  var courseDashboard
  var QueryService
  var $q // eslint-disable-line
  var deferred
  var timeout // eslint-disable-line
  var testData = dashboardsTestData.courseProgress // eslint-disable-line

  beforeEach(inject(function($rootScope, $controller) { // eslint-disable-line
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_$rootScope_, $controller, _batchService_, _$q_, _$timeout_, _QueryService_) { // eslint-disable-line
    rootScope = _$rootScope_
    scope = _$rootScope_.$new()
    batchService = _batchService_
    QueryService = _QueryService_, // eslint-disable-line
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()

    courseDashboard = $controller('courseProgressDashboardCtrl', {
      $rootScope: rootScope,
      $scope: scope,
      QueryService: QueryService
    })
  }))

  it('onAfterFilterChange - should call getCourseDashboardData function ', function () {
    spyOn(courseDashboard, 'onAfterFilterChange').and.callThrough()
    spyOn(courseDashboard, 'getCourseDashboardData').and.callThrough()
    courseDashboard.identifier = '0124147958692249604'
    courseDashboard.onAfterFilterChange('7d')
    scope.$apply()
    expect(courseDashboard.onAfterFilterChange).not.toBe(undefined)
    expect(courseDashboard.orderByField).not.toBe(undefined)
    expect(courseDashboard.getCourseDashboardData).toHaveBeenCalled()
  })

  it('Should return more than one batches createdByMe', function () {
    spyOn(batchService, 'getAllBatchs').and.returnValue(deferred.promise)
    deferred.resolve(testData.getMyBatchesList)
    spyOn(courseDashboard, 'loadData').and.callThrough()
    courseDashboard.loadData()
    scope.$apply()
    var response = batchService.getAllBatchs().$$state.value
    expect(response).not.toBe(undefined)
    expect(courseDashboard.loadData).not.toBe(undefined)
  })

  it('Should buildMyBatchesDropdown', function () {
    courseDashboard.myBatches = testData.getMyBatch.result.response.content
    spyOn(courseDashboard, 'buildMyBatchesDropdown').and.callThrough()
    spyOn(courseDashboard, 'getCourseDashboardData').and.callThrough()
    courseDashboard.buildMyBatchesDropdown()
    scope.$apply()
    expect(courseDashboard.batchIdentifier).not.toBe(undefined)
    expect(courseDashboard.courseName).not.toBe(undefined)
    expect(courseDashboard.getCourseDashboardData).toHaveBeenCalled()
  })

  it('should not call onAfterFilterChange function', function () {
    spyOn(courseDashboard, 'onAfterFilterChange').and.callThrough()
    courseDashboard.identifier = '0124147958692249604'
    courseDashboard.timePeriod = '7d'
    courseDashboard.onAfterFilterChange('7d')
    scope.$apply()
    expect(courseDashboard.onAfterFilterChange).not.toBe(undefined)
    expect(courseDashboard.orderByField).toEqual(undefined)
  })

  it('should make api call - onAfterBatchChange', function () {
    courseDashboard.isMultipleCourses = true
    spyOn(courseDashboard, 'onAfterBatchChange').and.callThrough()
    courseDashboard.onAfterBatchChange('0124147958692249604')
    scope.$apply()
    expect(courseDashboard.onAfterBatchChange).not.toBe(undefined)
    expect(courseDashboard.isMultipleCourses).toEqual(false)
  })

  it('should not make api call - onAfterBatchChange', function () {
    courseDashboard.isMultipleCourses = true
    spyOn(courseDashboard, 'onAfterBatchChange').and.callThrough()
    courseDashboard.batchIdentifier = '0124147958692249604'
    courseDashboard.onAfterBatchChange('0124147958692249604')
    scope.$apply()
    expect(courseDashboard.onAfterBatchChange).not.toBe(undefined)
    expect(courseDashboard.isMultipleCourses).toEqual(true)
  })

  it('should call resetDropdown function', function () {
    spyOn(courseDashboard, 'resetDropdown').and.callThrough()
    courseDashboard.resetDropdown()
    scope.$apply()
    expect(courseDashboard.resetDropdown).not.toBe(undefined)
  })

  it('should call initDropdwon function', function () {
    spyOn(courseDashboard, 'initDropdwon').and.callThrough()
    courseDashboard.initDropdwon()
    scope.$apply()
    expect(courseDashboard.initDropdwon).not.toBe(undefined)
  })

  it('should check responseCode other than OK while fetching batches create by me ', function () {
    spyOn(batchService, 'getAllBatchs').and.returnValue(deferred.promise)
    testData.getMyBatch.responseCode = 'SERVER_ERROR'
    deferred.resolve(testData.getMyBatch.responseCode)
    spyOn(courseDashboard, 'loadData').and.callThrough()
    spyOn(courseDashboard, 'showErrors').and.callThrough()
    courseDashboard.loadData()
    scope.$apply()
    var response = batchService.getAllBatchs().$$state.value
    expect(response).not.toBe(undefined)
    expect(courseDashboard.loadData).not.toBe(undefined)
    expect(courseDashboard.showErrors).toHaveBeenCalled()
    expect(courseDashboard.showError).toEqual(true)
  })

  it('should reject getAllBatchs api call', function () {
    spyOn(batchService, 'getAllBatchs').and.returnValue(deferred.promise)
    deferred.reject({})
    spyOn(courseDashboard, 'loadData').and.callThrough()
    spyOn(courseDashboard, 'showErrors').and.callThrough()
    courseDashboard.loadData()
    scope.$apply()
    var response = batchService.getAllBatchs().$$state.value
    expect(response).not.toBe(undefined)
    expect(courseDashboard.loadData).not.toBe(undefined)
    expect(courseDashboard.showErrors).toHaveBeenCalled()
    expect(courseDashboard.showError).toEqual(true)
  })

  it('should return valid api response', function (done) {
    courseDashboard.batchIdentifier = '01240505557369651216'
    var getInstanceObj = new QueryService.CreateNewInstance({ eid: 'courseProgress' })
    spyOn(getInstanceObj, 'getData').and.returnValue(deferred.promise)
    deferred.resolve(testData.getBatchDetailsSuccessData)
    spyOn(courseDashboard, 'getCourseDashboardData').and.callThrough()
    courseDashboard.getCourseDashboardData('5w')
    scope.$apply()
    expect(courseDashboard.showError).toEqual(false)
    expect(courseDashboard.timePeriod).toEqual('5w')
    done()
  })

  it('Download sucess', function (done) {
    courseDashboard.timePeriod = '7d'
    courseDashboard.batchIdentifier = '0124147958692249604'
    courseDashboard.timePeriod = '7d'
    var downloadInstanceObj = new QueryService.CreateNewInstance({ eid: 'downloadReport' })
    spyOn(downloadInstanceObj, 'download').and.returnValue(deferred.promise)
    deferred.resolve(testData.downloadReportResponse)
    spyOn(courseDashboard, 'downloadReport').and.callThrough()
    courseDashboard.downloadReport()
    scope.$apply()
    done()
    expect(courseDashboard.disabledClass).toEqual(false)
  })

  it('Download reject', function (done) {
    var downloadInstanceObj = new QueryService.CreateNewInstance({ eid: 'downloadReport' })
    spyOn(downloadInstanceObj, 'download').and.returnValue(deferred.promise)
    deferred.reject({})
    spyOn(courseDashboard, 'downloadReport').and.callThrough()
    courseDashboard.downloadReport()
    scope.$apply()
    done()
    expect(courseDashboard.disabledClass).toEqual(false)
  })
})
