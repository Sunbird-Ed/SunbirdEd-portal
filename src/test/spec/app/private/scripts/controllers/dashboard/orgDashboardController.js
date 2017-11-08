/**
 * name: orgDashboardController.js
 * author: Sourav Dey
 */

'use strict'

describe('Controller: orgDashboardController', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  var dashboardService,
    scope,
    rootScope,
    orgDashboardController,
    adminService,
    dashboardData,
    $q,
    deferred,
    timeout,
    orgTestData = testData.orgDashboard

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $controller, _dashboardService_, _$q_, _$timeout_, _adminService_) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    dashboardService = _dashboardService_
    adminService = _adminService_
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()

    orgDashboardController = $controller('orgDashboardController', {
      $rootScope: rootScope,
      $scope: scope,
      dashboardService: dashboardService
    })
  }))

  describe('Get Organisation dashboard', function () {
    it('creation success', function (done) {
      spyOn(dashboardService, 'getAdminDashboardData').and.returnValue(deferred.promise)
      deferred.resolve(orgTestData.creationResponse)
      orgDashboardController.timePeriod = '5w'
      spyOn(orgDashboardController, 'getAdminDashboardData').and.callThrough()
      orgDashboardController.getAdminDashboardData()
      scope.$apply()
      done()
    })

    it('consumption success', function (done) {
      spyOn(dashboardService, 'getAdminDashboardData').and.returnValue(deferred.promise)
      deferred.resolve(orgTestData.consumptionResponse)
      orgDashboardController.datasetPreviousValue = 'consumption'
      spyOn(orgDashboardController, 'getAdminDashboardData').and.callThrough()
      orgDashboardController.getAdminDashboardData()
      scope.$apply()
      done()
    })

    it('creation fail', function () {
      orgTestData.creationResponse.responseCode = 'fail'
      spyOn(dashboardService, 'getAdminDashboardData').and.returnValue(deferred.promise)
      deferred.resolve(orgTestData.creationResponse)
      orgDashboardController.showDataDiv = false
      spyOn(orgDashboardController, 'getAdminDashboardData').and.callThrough()
      orgDashboardController.getAdminDashboardData()
      scope.$apply()
    })

    it('creation reject', function () {
      spyOn(dashboardService, 'getAdminDashboardData').and.returnValue(deferred.promise)
      deferred.reject(orgTestData.creationResponse)
      spyOn(orgDashboardController, 'getAdminDashboardData').and.callThrough()
      orgDashboardController.getAdminDashboardData()
      scope.$apply()
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

    it('next Graph', function () {
      spyOn(orgDashboardController, 'nextGraph').and.callThrough()
      orgDashboardController.nextGraph()
    })

    it('previous Graph', function () {
      spyOn(orgDashboardController, 'previousGraph').and.callThrough()
      orgDashboardController.previousGraph()
    })

    it('show Data', function () {
      spyOn(orgDashboardController, 'showData').and.callThrough()
      rootScope.organisationIds = ['3']
      // orgDashboardController.orgIds.length = 1
      orgDashboardController.showData()
      spyOn(orgDashboardController, 'getAdminDashboardData').and.callThrough()
      orgDashboardController.getAdminDashboardData()
      scope.$apply()
      expect(orgDashboardController.showData).not.toBe(undefined)
    })

    it('show Data', function () {
      spyOn(orgDashboardController, 'showData').and.callThrough()
      rootScope.organisationIds = []
      orgDashboardController.showOrgWarningDiv = true
      orgDashboardController.showData()
      scope.$apply()
      expect(orgDashboardController.showData).not.toBe(undefined)
    })
  })
})
