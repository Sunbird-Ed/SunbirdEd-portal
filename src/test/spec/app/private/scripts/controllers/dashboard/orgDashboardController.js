/**
 * name: orgDashboardController.js
 * author: Sourav Dey
 */

'use strict'

describe('Controller: orgDashboardController', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  var QueryService
  var scope
  var rootScope
  var orgDashboardController
  var adminService
  var $q   // eslint-disable-line
  var deferred  // eslint-disable-line
  var timeout  // eslint-disable-line
  var testData = dashboardsTestData.orgData   // eslint-disable-line

  beforeEach(inject(function ($rootScope, $controller) {  // eslint-disable-line
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $controller, _QueryService_, _$q_, _$timeout_, _adminService_) {   // eslint-disable-line
    rootScope = $rootScope
    scope = $rootScope.$new()
    QueryService = _QueryService_
    adminService = _adminService_
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()

    orgDashboardController = $controller('orgDashboardController', {
      $rootScope: rootScope,
      $scope: scope,
      QueryService: QueryService
    })
  }))

  describe('Get Organisation dashboard', function () {
    it('getAdminDashboardData', function (done) {
      var getInstanceObj = new QueryService.CreateNewInstance({ eid: 'orgCreation' })
      spyOn(getInstanceObj, 'getData').and.returnValue(deferred.promise)
      deferred.resolve(testData.creationResponse)
      orgDashboardController.timePeriod = '5w'
      spyOn(orgDashboardController, 'getAdminDashboardData').and.callThrough()
      orgDashboardController.getAdminDashboardData()
      scope.$apply()
      done()
      expect(orgDashboardController.showDataDiv).toEqual(true)
    })

    it('on after change', function () {
      spyOn(orgDashboardController, 'onAfterOrgChange').and.callThrough()
      orgDashboardController.onAfterOrgChange('sunbird')
    })

    it('init Drop down', function () {
      spyOn(orgDashboardController, 'initDropdwon').and.callThrough()
      orgDashboardController.initDropdwon()
    })

    it('on After Filter Change', function () {
      spyOn(orgDashboardController, 'onAfterFilterChange').and.callThrough()
      orgDashboardController.onAfterFilterChange('7d')
    })

    it('on After Filter Change if clause', function () {
      spyOn(orgDashboardController, 'onAfterFilterChange').and.callThrough()
      orgDashboardController.timePeriod = '7d'
      orgDashboardController.onAfterFilterChange('7d')
    })

    it('on After Dataset Change', function () {
      spyOn(orgDashboardController, 'onAfterDatasetChange').and.callThrough()
      orgDashboardController.onAfterDatasetChange('creation')
    })

    it('on After Dataset Change when not creation', function () {
      spyOn(orgDashboardController, 'onAfterDatasetChange').and.callThrough()
      orgDashboardController.onAfterDatasetChange('consumption')
    })

    it('show Data', function () {
      spyOn(orgDashboardController, 'showData').and.callThrough()
      rootScope.organisationIds = ['3']
      orgDashboardController.showData()
      scope.$apply()
      expect(orgDashboardController.showData).not.toBe(undefined)
    })

    it('show Data', function () {
      spyOn(orgDashboardController, 'showData').and.callThrough()
      rootScope.organisationIds = []

      var data = testData.orgSearchSuccess
      spyOn(adminService, 'orgSearch').and.returnValue(deferred.promise)
      deferred.resolve(data)
      orgDashboardController.showOrgWarningDiv = true
      orgDashboardController.showData()
      scope.$apply()
      expect(orgDashboardController.showData).not.toBe(undefined)
    })

    it('show Data when org api fails', function () {
      spyOn(orgDashboardController, 'showData').and.callThrough()
      rootScope.organisationIds = []

      var data = testData.orgSearchFailure
      spyOn(adminService, 'orgSearch').and.returnValue(deferred.promise)
      deferred.resolve(data)
      orgDashboardController.showOrgWarningDiv = true
      orgDashboardController.showData()
      scope.$apply()
      expect(orgDashboardController.showData).not.toBe(undefined)
    })

    it('Download sucess', function (done) {
      var downloadInstanceObj = new QueryService.CreateNewInstance({ eid: 'downloadReport' })

      spyOn(downloadInstanceObj, 'download').and.returnValue(deferred.promise)
      deferred.resolve(testData.creationResponse)
      spyOn(orgDashboardController, 'downloadReport').and.callThrough()
      orgDashboardController.downloadReport()
      scope.$apply()
      done()
      expect(orgDashboardController.disabledClass).toEqual(false)
    })

    it('Download reject', function (done) {
      var downloadInstanceObj = new QueryService.CreateNewInstance({ eid: 'downloadReport' })
      spyOn(downloadInstanceObj, 'download').and.returnValue(deferred.promise)
      deferred.reject({})
      spyOn(orgDashboardController, 'downloadReport').and.callThrough()
      orgDashboardController.downloadReport()
      scope.$apply()
      done()
    })
  })
})
