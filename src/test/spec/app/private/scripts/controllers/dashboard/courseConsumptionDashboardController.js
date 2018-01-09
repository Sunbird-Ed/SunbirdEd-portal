'use strict'

describe('Controller:courseConsumptionDashboardCtrl', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  var searchService // eslint-disable-line
  var scope
  var rootScope
  var courseDashboard
  var QueryService
  var $q // eslint-disable-line
  var deferred
  var timeout // eslint-disable-line
  var testData = dashboardsTestData.courseConsumption // eslint-disable-line

  beforeEach(inject(function($rootScope, $controller) { // eslint-disable-line
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_$rootScope_, $controller, _searchService_, _$q_, _$timeout_, _QueryService_) { // eslint-disable-line
    rootScope = _$rootScope_
    scope = _$rootScope_.$new()
    searchService = _searchService_
    QueryService = _QueryService_, // eslint-disable-line
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()

    courseDashboard = $controller('courseConsumptionDashboardCtrl', {
      $rootScope: rootScope,
      $scope: scope,
      QueryService: QueryService
    })
  }))

  it('Should return list of courses createdByMe', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(testData.searchSuccess)
    spyOn(courseDashboard, 'loadData').and.callThrough()
    courseDashboard.loadData()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    courseDashboard.getUpForReviewContent = response.result.content
    expect(courseDashboard.loadData).not.toBe(undefined)
  })

  it('Should return only one course createdByMe', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(testData.oneCourseCreatedByMeResponse)
    spyOn(courseDashboard, 'loadData').and.callThrough()
    courseDashboard.loadData()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    courseDashboard.getUpForReviewContent = response.result.content
    expect(courseDashboard.loadData).not.toBe(undefined)
  })

  it('getCourseDashboardData', function (done) {
    var getInstanceObj = new QueryService.CreateNewInstance({ eid: 'courseConsumption' })
    spyOn(getInstanceObj, 'getData').and.returnValue(deferred.promise)
    deferred.resolve(testData.courseConsumptionSuccess)
    courseDashboard.filterTimePeriod = '7d'
    spyOn(courseDashboard, 'getCourseDashboardData').and.callThrough()
    courseDashboard.getCourseDashboardData()
    scope.$apply()
    done()
    expect(courseDashboard.showError).toEqual(false)
  })

  it('onAfterCourseChange if case', function () {
    courseDashboard.courseIdentifier = '123'
    spyOn(courseDashboard, 'onAfterCourseChange').and.callThrough()
    courseDashboard.onAfterCourseChange('123', 'TestCourse')
  })

  it('onAfterCourseChange', function () {
    spyOn(courseDashboard, 'onAfterCourseChange').and.callThrough()
    courseDashboard.onAfterCourseChange('123', 'TestCourse')
  })

  it('onAfterFilterChange', function () {
    spyOn(courseDashboard, 'onAfterFilterChange').and.callThrough()
    courseDashboard.onAfterFilterChange('7d')
  })

  it('Should initialize course dropdwon', function () {
    spyOn(courseDashboard, 'initDropdwon').and.callThrough()
    courseDashboard.initDropdwon()
  })

  it('Should return zero courses createdByMe', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(testData.zeroContentCreatedByMe)
    spyOn(courseDashboard, 'loadData').and.callThrough()
    courseDashboard.loadData()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    courseDashboard.getUpForReviewContent = response.result.content
    expect(courseDashboard.getUpForReviewContent).toBeDefined()
  })

  it('Should return errorMessage', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(testData.invalidResponse)
    spyOn(courseDashboard, 'loadData').and.callThrough()
    courseDashboard.loadData(testData.invalidResponse)
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    courseDashboard.courseDashboard = response.result.content
    expect(courseDashboard.showErrors).not.toBe(undefined)
  })

  it('Should return errorMessage', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(testData.invalidResponse)
    spyOn(courseDashboard, 'showErrors').and.callThrough()
    courseDashboard.showErrors(testData.invalidResponse)
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    courseDashboard.courseDashboard = response.result.content
    expect(courseDashboard.showErrors).not.toBe(undefined)
  })

  it('Search service reject', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.reject({})
    spyOn(courseDashboard, 'loadData').and.callThrough()
    courseDashboard.loadData()
    scope.$apply()
  })
})
