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
  var orgTestData = testData.orgDashboard  // eslint-disable-line

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
      orgDashboardController.objQueryClient = new QueryService({ key: 'orgCreationDataSource' })
      spyOn(orgDashboardController.objQueryClient, 'query').and.returnValue(deferred.promise)
      deferred.resolve(orgTestData.creationResponse)
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
      orgDashboardController.showData()
      // spyOn(orgDashboardController, 'getAdminDashboardData').and.callThrough()
      // orgDashboardController.getAdminDashboardData()
      scope.$apply()
      expect(orgDashboardController.showData).not.toBe(undefined)
    })

    it('show Data', function () {
      spyOn(orgDashboardController, 'showData').and.callThrough()
      rootScope.organisationIds = []

      var data = {'id': 'api.org.search', 'ver': 'v1', 'ts': '2018-01-02 11:47:10:719+0000', 'params': {'resmsgid': null, 'msgid': 'a3f0aa32-75e8-489b-9646-837421892c31', 'err': null, 'status': 'success', 'errmsg': null}, 'responseCode': 'OK', 'result': {'response': {'count': 4, 'content': [{'dateTime': null, 'preferredLanguage': 'English', 'approvedBy': null, 'channel': null, 'description': 'EKSTEP Corporation', 'updatedDate': null, 'addressId': '0123131141138350081', 'orgType': 'Training', 'provider': null, 'orgCode': 'ABCL', 'theme': null, 'id': '0123131115383275520', 'communityId': null, 'isApproved': null, 'slug': null, 'identifier': '0123131115383275520', 'thumbnail': null, 'orgName': 'EKSTEP Corporation', 'updatedBy': null, 'address': {'country': 'India', 'updatedBy': null, 'city': 'Chennai', 'updatedDate': null, 'userId': null, 'zipcode': '45678', 'addType': null, 'createdDate': '2017-08-18 13:59:28:684+0000', 'isDeleted': null, 'createdBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'addressLine1': null, 'addressLine2': null, 'id': '0123131141138350081', 'state': 'TN'}, 'externalId': null, 'isRootOrg': true, 'rootOrgId': 'ORG_001', 'approvedDate': null, 'imgUrl': null, 'homeUrl': null, 'isDefault': null, 'contactDetail': '[{"email":"test@test.com","phone":"213124234234"},{"email":"test1@test.com","phone":"+91213124234234"}]', 'createdDate': '2017-08-18 13:59:28:684+0000', 'createdBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'parentOrgId': null, 'hashTagId': '0123131115383275520', 'noOfMembers': 1, 'status': null}, {'dateTime': null, 'preferredLanguage': 'English', 'approvedBy': null, 'channel': null, 'description': 'ABC Corporation', 'updatedDate': '2017-09-04 10:44:30:921+0000', 'addressId': '01230654297501696027', 'orgType': 'Training', 'provider': null, 'orgCode': 'ABCL', 'theme': null, 'id': '01230654824904294426', 'communityId': null, 'isApproved': null, 'slug': null, 'identifier': '01230654824904294426', 'thumbnail': null, 'orgName': 'ABC Corporation', 'updatedBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'address': {'country': 'India', 'updatedBy': null, 'city': 'Chennai', 'updatedDate': null, 'userId': null, 'zipcode': '45678', 'addType': null, 'createdDate': '2017-08-09 07:20:29:343+0000', 'isDeleted': null, 'createdBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'addressLine1': null, 'addressLine2': null, 'id': '01230654297501696027', 'state': 'TN'}, 'externalId': null, 'isRootOrg': false, 'rootOrgId': 'ORG_001', 'approvedDate': null, 'imgUrl': null, 'homeUrl': null, 'isDefault': null, 'contactDetail': null, 'createdDate': '2017-08-09 07:20:29:342+0000', 'createdBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'parentOrgId': null, 'hashTagId': '01230654824904294426', 'noOfMembers': 1, 'status': null}, {'dateTime': null, 'preferredLanguage': 'English', 'approvedBy': null, 'channel': 'ROOT_ORG', 'description': 'Sunbird', 'updatedDate': '2017-08-24 06:02:10:846+0000', 'addressId': null, 'orgType': null, 'provider': null, 'orgCode': 'sunbird', 'theme': null, 'id': 'ORG_001', 'communityId': null, 'isApproved': null, 'slug': 'sunbird', 'identifier': 'ORG_001', 'thumbnail': null, 'orgName': 'Sunbird', 'updatedBy': 'user1', 'externalId': null, 'isRootOrg': true, 'rootOrgId': null, 'approvedDate': null, 'imgUrl': null, 'homeUrl': null, 'isDefault': null, 'contactDetail': '[{"phone":"213124234234","email":"test@test.com"},{"phone":"+91213124234234","email":"test1@test.com"}]', 'createdDate': null, 'createdBy': null, 'parentOrgId': null, 'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d', 'noOfMembers': 1, 'status': null}, {'dateTime': null, 'preferredLanguage': 'English', 'approvedBy': null, 'channel': null, 'description': 'NTP Content Create Testing', 'updatedDate': null, 'addressId': '0123150128754360327', 'orgType': 'Training', 'provider': null, 'orgCode': 'NCCT', 'theme': null, 'id': '0123150108807004166', 'communityId': null, 'isApproved': null, 'slug': null, 'identifier': '0123150108807004166', 'thumbnail': null, 'orgName': 'NTP Content Create Testing', 'updatedBy': null, 'address': {'country': 'India', 'updatedBy': null, 'city': 'Chennai', 'updatedDate': null, 'userId': null, 'zipcode': '45678', 'addType': null, 'createdDate': '2017-08-21 06:26:13:394+0000', 'isDeleted': null, 'createdBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'addressLine1': null, 'addressLine2': null, 'id': '0123150128754360327', 'state': 'TN'}, 'externalId': null, 'isRootOrg': false, 'rootOrgId': 'ORG_001', 'approvedDate': null, 'imgUrl': null, 'homeUrl': null, 'isDefault': null, 'contactDetail': null, 'createdDate': '2017-08-21 06:26:13:393+0000', 'createdBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'parentOrgId': null, 'hashTagId': '0123150108807004166', 'noOfMembers': 1, 'status': null}]}}}   // eslint-disable-line
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

      var data = {'id': 'api.org.search', 'ver': 'v1', 'ts': '2018-01-02 11:47:10:719+0000', 'params': {'resmsgid': null, 'msgid': 'a3f0aa32-75e8-489b-9646-837421892c31', 'err': null, 'status': 'success', 'errmsg': null}, 'responseCode': 'Fail'}   // eslint-disable-line
      spyOn(adminService, 'orgSearch').and.returnValue(deferred.promise)
      deferred.resolve(data)
      orgDashboardController.showOrgWarningDiv = true
      orgDashboardController.showData()
      scope.$apply()
      expect(orgDashboardController.showData).not.toBe(undefined)
    })
  })
})
