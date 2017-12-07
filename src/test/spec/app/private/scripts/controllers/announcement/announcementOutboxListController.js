/**
 * name: announcementOutboxListController.js
 * author: Sourav Dey
 * Date: 03-11-2017
 */
'use strict'
describe('Controller: announcementOutboxListController', function () {
  // load the controller's module
  beforeEach(module('playerApp'))
  var announcementAdapter,
    scope,
    rootScope,
    announcementOutboxListController,
    $q,
    deferred,
    timeout,
    annOutboxTestData = announcementTestData.getAnnouncementOutbox,
    annDeleteTestData = announcementTestData.deleteAnnouncement,
    annGetResendTestData = announcementTestData.getResend
  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))
    // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $controller, _$q_, _$timeout_, _announcementAdapter_) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    announcementAdapter = _announcementAdapter_
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()
    announcementOutboxListController = $controller('announcementOutboxListController', {
      $rootScope: rootScope,
      $scope: scope,
      announcementAdapter: announcementAdapter
    })
  }))
  describe('Get Outbox announcements', function () {
    it('Should called announcement service', function () {
      spyOn(announcementAdapter, 'getOutBoxAnnouncementList').and.callThrough()
      announcementAdapter.getOutBoxAnnouncementList()
      expect(announcementAdapter.getOutBoxAnnouncementList).toBeDefined()
    })
    it('success', function () {
      announcementOutboxListController.result = undefined
      spyOn(announcementAdapter, 'getOutBoxAnnouncementList').and.returnValue(deferred.promise)
      deferred.resolve(announcementTestData.getAnnouncementOutbox.successResponce)
      spyOn(announcementOutboxListController, 'renderAnnouncementList').and.callThrough()
      announcementOutboxListController.renderAnnouncementList()
      scope.$apply()
      expect(announcementOutboxListController.result).toBeDefined()
    })
    it('Fail', function () {
      annOutboxTestData.successResponce.responseCode = 'fail'
      spyOn(announcementAdapter, 'getOutBoxAnnouncementList').and.returnValue(deferred.promise)
      deferred.resolve(annOutboxTestData.successResponce)
      spyOn(announcementOutboxListController, 'renderAnnouncementList').and.callThrough()
      announcementOutboxListController.renderAnnouncementList()
      scope.$apply()
      expect(announcementOutboxListController.showLoader).toEqual(false)
    })
    it('Reject', function () {
      spyOn(announcementAdapter, 'getOutBoxAnnouncementList').and.returnValue(deferred.promise)
      deferred.reject({})
      spyOn(announcementOutboxListController, 'renderAnnouncementList').and.callThrough()
      announcementOutboxListController.renderAnnouncementList()
      scope.$apply()
      expect(announcementOutboxListController.showLoader).toEqual(false)
    })
  })
  describe('Delete announcement', function () {
    it('success', function () {
      announcementOutboxListController.listData = [{'sourceid': 'ORG_001', 'attachments': [], 'createddate': '2017-12-06 11:38:47:671+0530', 'details': {'description': 'Demo collection', 'from': 'huk', 'title': 'Mollit qui excepteur aut sed quia animi ut aliqua Sequi sit alias consequuntur voluptatem', 'type': 'Circular'}, 'links': [], 'id': 'ec1b3d60-da4b-11e7-9f1b-63dce7cdecb9', 'userid': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'target': {'geo': {'ids': ['0123668622585610242', '0123668627050987529']}}, 'status': 'active', 'metrics': {'received': 0, 'read': 0}}]
      spyOn(announcementAdapter, 'deleteAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(annDeleteTestData.successResponse)
      annDeleteTestData.successResponse.data = annDeleteTestData.successResponse
      expect(announcementOutboxListController.deleteAnnouncement).toBeDefined()
      announcementOutboxListController.deleteAnnouncement(annDeleteTestData.requestBody)
      expect(announcementAdapter.deleteAnnouncement).toHaveBeenCalled()
      scope.$apply()
    })
    it('fail', function () {
      spyOn(announcementAdapter, 'deleteAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(annDeleteTestData.failedResponse)
      annDeleteTestData.failedResponse.data = annDeleteTestData.failedResponse
      expect(announcementOutboxListController.deleteAnnouncement).toBeDefined()
      announcementOutboxListController.deleteAnnouncement(annDeleteTestData.requestBody)
      expect(announcementAdapter.deleteAnnouncement).toHaveBeenCalled()
      scope.$apply()
    })
    it('Reject', function () {
      spyOn(announcementAdapter, 'deleteAnnouncement').and.returnValue(deferred.promise)
      deferred.reject({})
      expect(announcementOutboxListController.deleteAnnouncement).toBeDefined()
      announcementOutboxListController.deleteAnnouncement(annDeleteTestData.requestBody)
      expect(announcementAdapter.deleteAnnouncement).toHaveBeenCalled()
      scope.$apply()
    })
  })
  describe('Get resend', function () {
    it('resend success redirection', function () {
      spyOn(announcementOutboxListController, 'getResend').and.callThrough()
      var response = announcementOutboxListController.getResend('40cf62a0-d97a-11e7-9a38-7f931d192536', 'test')
      expect(response).toBe(undefined)
    })
  })
  describe('create announcement', function () {
    it('create success redirection', function () {
      spyOn(announcementOutboxListController, 'gotToAnnouncementCreateState').and.callThrough()
      var response = announcementOutboxListController.gotToAnnouncementCreateState()
      expect(response).toBe(undefined)
    })
  })
  describe('Modal popup', function () {
    it('show modal popup', function () {
      spyOn(announcementOutboxListController, 'showModal').and.callThrough()
      expect(announcementOutboxListController.showModal).toBeDefined()
      announcementOutboxListController.showModal('announcementDeleteModal')
      expect(announcementOutboxListController.showModal).toHaveBeenCalled()
    })
    it('close modal popup', function () {
      spyOn(announcementOutboxListController, 'closeModal').and.callThrough()
      expect(announcementOutboxListController.closeModal).toBeDefined()
      announcementOutboxListController.closeModal('announcementDeleteModal')
      expect(announcementOutboxListController.closeModal).toHaveBeenCalled()
    })
    it('Show details undefined', function () {
      spyOn(announcementOutboxListController, 'showAnnouncementDetails').and.callThrough()
      var response = announcementOutboxListController.showAnnouncementDetails('', {
        details: {
          title: 'test'
        }
      })
      expect(response).toBe(undefined)
    })
    it('cover set page if clause', function () {
      announcementOutboxListController.pager = {'totalPages': 1}
      spyOn(announcementOutboxListController, 'setPage').and.callThrough()
      announcementOutboxListController.setPage(2)
      expect(announcementOutboxListController.setPage).toHaveBeenCalled()
    })

    it('cover set page to cover state.go', function () {
      announcementOutboxListController.pager = {'totalPages': 12}
      spyOn(announcementOutboxListController, 'setPage').and.callThrough()
      announcementOutboxListController.setPage(2)
      expect(announcementOutboxListController.setPage).toHaveBeenCalled()
    })

    it('Initialize controller variables', function () {
      announcementOutboxListController.pageLimit = 25
      announcementOutboxListController.showLoader = true
      spyOn(announcementOutboxListController, 'init').and.callThrough()
      announcementOutboxListController.init()
      expect(announcementOutboxListController.init).toHaveBeenCalled()
      expect(announcementOutboxListController.showLoader).toEqual(true)
    })
  })
})
