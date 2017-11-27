/**
 * name: announcementInboxListController.js
 * author: Sourav Dey
 * Date: 02-11-2017
 */

'use strict'

describe('Controller: announcementInboxListController', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  var announcementAdapter,
    scope,
    rootScope,
    announcementInboxListController,
    $q,
    deferred,
    timeout,
    annInboxTestData = announcementTestData.getAnnouncementInbox

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $controller, _announcementAdapter_, _$q_, _$timeout_) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    announcementAdapter = _announcementAdapter_
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()

    announcementInboxListController = $controller('announcementInboxListController', {
      $rootScope: rootScope,
      $scope: scope,
      announcementAdapter: announcementAdapter
    })
  }))

  describe('Get inbox announcements', function () {
    it('Success', function () {
      spyOn(announcementAdapter, 'getInboxAnnouncementList').and.returnValue(deferred.promise)
      deferred.resolve(annInboxTestData.successResponce)
      var response = announcementAdapter.getInboxAnnouncementList().$$state.value
      expect(response).toBe(annInboxTestData.successResponce)
    })

    it('Fail', function () {
      annInboxTestData.successResponce.responseCode = 'fail'
      spyOn(announcementAdapter, 'getInboxAnnouncementList').and.returnValue(deferred.promise)
      deferred.resolve(annInboxTestData.successResponce)
      spyOn(announcementInboxListController, 'renderAnnouncementList').and.callThrough()
      announcementInboxListController.renderAnnouncementList()
      scope.$apply()
    })

    it('Reject', function () {
      spyOn(announcementAdapter, 'getInboxAnnouncementList').and.returnValue(deferred.promise)
      deferred.reject({})
      spyOn(announcementInboxListController, 'renderAnnouncementList').and.callThrough()
      announcementInboxListController.renderAnnouncementList()
      scope.$apply()
    })

    it('get file extension success', function () {
      spyOn(announcementInboxListController, 'getFileExtension').and.callThrough()
      var response = announcementInboxListController.getFileExtension('application/pdf')
      expect(response).toBe('PDF')
    })

    it('get file extension error', function () {
      spyOn(announcementInboxListController, 'getFileExtension').and.callThrough()
      var response = announcementInboxListController.getFileExtension('')
      expect(response).toBe(undefined)
    })

    it('Show details', function () {
      scope.announcementInboxData = {}
      scope.announcementInboxData.announcementDetails = annInboxTestData.detailsSuccess
      spyOn(announcementInboxListController, 'showAnnouncementDetails').and.callThrough()
      announcementInboxListController.showAnnouncementDetails(annInboxTestData.detailsSuccess, 2)
      scope.$apply()
    })

    it('Show details undefined', function () {
      spyOn(announcementInboxListController, 'showAnnouncementDetails').and.callThrough()
      var response = announcementInboxListController.showAnnouncementDetails('')
      expect(response).toBe(undefined)
    })
  })
})
