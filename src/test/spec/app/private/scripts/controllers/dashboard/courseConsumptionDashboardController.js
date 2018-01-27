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
    expect(courseDashboard.loadData).not.toBe(undefined)
    expect(courseDashboard.myCoursesList).toBeDefined()
    expect(response.responseCode).toEqual('OK')
    expect(courseDashboard.myCoursesList.length).toBeGreaterThan(1)
  })

  it('Should return only one course createdByMe', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(testData.oneCourseCreatedByMeResponse)
    spyOn(courseDashboard, 'loadData').and.callThrough()
    spyOn(courseDashboard, 'getCourseDashboardData').and.callThrough()
    spyOn(courseDashboard, 'buildMyCoursesDropdown').and.callThrough()
    courseDashboard.loadData()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    expect(courseDashboard.loadData).not.toBe(undefined)
    expect(courseDashboard.buildMyCoursesDropdown).toHaveBeenCalled()
    expect(courseDashboard.myCoursesList.length).toEqual(1)
    expect(courseDashboard.courseIdentifier).toBeDefined()
    expect(courseDashboard.courseName).toBeDefined()
    expect(courseDashboard.getCourseDashboardData).toHaveBeenCalled()
    expect(courseDashboard.timePeriod).toEqual('7d')
  })

  it('getCourseDashboardData', function (done) {
    var getInstanceObj = new QueryService.CreateNewInstance({ eid: 'courseConsumption' })
    spyOn(getInstanceObj, 'getData').and.returnValue(deferred.promise)
    deferred.resolve(testData.courseConsumptionSuccess)
    spyOn(courseDashboard, 'getCourseDashboardData').and.callThrough()
    courseDashboard.getCourseDashboardData('7d')
    scope.$apply()
    done()
    expect(courseDashboard.data).not.toBe(undefined)
    expect(courseDashboard.showError).toEqual(false)
    expect(courseDashboard.showLoader).toEqual(false)
  })

  it('onAfterCourseChange if case', function () {
    courseDashboard.isMultipleCourses = true
    courseDashboard.courseIdentifier = '123'
    spyOn(courseDashboard, 'onAfterCourseChange').and.callThrough()
    var res = courseDashboard.onAfterCourseChange('123')
    expect(courseDashboard.isMultipleCourses).toEqual(true)
    expect(res).toEqual(false)
  })

  it('onAfterCourseChange - else case', function () {
    spyOn(courseDashboard, 'onAfterCourseChange').and.callThrough()
    courseDashboard.onAfterCourseChange('123')
    expect(courseDashboard.isMultipleCourses).toEqual(false)
    expect(courseDashboard.courseIdentifier).toEqual('123')
  })

  it('onAfterFilterChange - if case', function () {
    courseDashboard.timePeriod = '7d'
    spyOn(courseDashboard, 'onAfterFilterChange').and.callThrough()
    var res = courseDashboard.onAfterFilterChange('7d')
    expect(res).toEqual(false)
  })

  it('onAfterFilterChange - else case', function () {
    spyOn(courseDashboard, 'onAfterFilterChange').and.callThrough()
    spyOn(courseDashboard, 'getCourseDashboardData').and.callThrough()
    courseDashboard.onAfterFilterChange('7d')
    expect(courseDashboard.getCourseDashboardData).toHaveBeenCalled()
    expect(courseDashboard.timePeriod).toEqual('7d')
  })

  it('Should initialize course dropdwon', function () {
    spyOn(courseDashboard, 'initDropdwon').and.callThrough()
    courseDashboard.initDropdwon()
    expect(courseDashboard.initDropdwon).not.toBe(undefined)
  })

  it('Should return zero courses createdByMe', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(testData.zeroContentCreatedByMe)
    spyOn(courseDashboard, 'loadData').and.callThrough()
    courseDashboard.loadData()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    expect(response.result.content).toBeDefined()
    expect(courseDashboard.myCoursesList).toBeDefined()
    expect(courseDashboard.myCoursesList.length).toEqual(0)
  })

  it('Should return errorMessage', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(testData.invalidResponse)
    spyOn(courseDashboard, 'loadData').and.callThrough()
    courseDashboard.loadData(testData.invalidResponse)
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    expect(courseDashboard.showErrors).not.toBe(undefined)
    expect(courseDashboard.showError).toEqual(true)
  })

  it('Should return errorMessage', function () {
    spyOn(courseDashboard, 'showErrors').and.callThrough()
    courseDashboard.showErrors()
    scope.$apply()
    expect(courseDashboard.showErrors).not.toBe(undefined)
    expect(courseDashboard.showError).toEqual(true)
  })

  it('Search service reject', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.reject({})
    spyOn(courseDashboard, 'loadData').and.callThrough()
    courseDashboard.loadData()
    scope.$apply()
    expect(courseDashboard.loadData).not.toBe(undefined)
    expect(courseDashboard.showError).toEqual(true)
  })
})
