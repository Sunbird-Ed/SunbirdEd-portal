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
    deferred,
    annOutboxTestData = announcementTestData.getAnnouncementOutbox,
    annDeleteTestData = announcementTestData.deleteAnnouncement
  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))
  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $controller, _$q_, _announcementAdapter_) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    announcementAdapter = _announcementAdapter_
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
      announcementOutboxListController.listData = annDeleteTestData.outboxData
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
    it('delete success then update list', function () {
      announcementOutboxListController.listData = annDeleteTestData.outboxData
      announcementOutboxListController.announcementId = 'f92da4b0-e3c5-11e7-ae69-f19bbefb810c'
      spyOn(announcementAdapter, 'deleteAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(annDeleteTestData.successResponse)
      announcementOutboxListController.deleteAnnouncement()
      expect(announcementOutboxListController.listData[0].status).toBe('cancelled')
      expect(announcementOutboxListController.deleteAnnouncement).toBeDefined()
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
