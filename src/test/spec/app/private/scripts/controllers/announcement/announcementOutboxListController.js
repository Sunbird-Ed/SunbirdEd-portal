/**
 * name: announcementOutboxListController.js
 * author: Sourav Dey
 * Date: 03-11-2017
 */

'use strict'

describe('Controller: announcementOutboxListController', function() {
  // load the controller's module
  beforeEach(module('playerApp'))

  var announcementService,
    scope,
    rootScope,
    announcementOutboxListController,
    $q,
    deferred,
    timeout,
    annOutboxTestData = announcementTestData.getAnnouncementOutbox,
    annDeleteTestData = announcementTestData.deleteAnnouncement,
    annGetResendTestData = announcementTestData.getResend

  beforeEach(inject(function($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  // Initialize the controller and a mock scope
  beforeEach(inject(function($rootScope, $controller, _announcementService_, _$q_, _$timeout_) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    announcementService = _announcementService_
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()

    announcementOutboxListController = $controller('announcementOutboxListController', {
      $rootScope: rootScope,
      $scope: scope,
      announcementService: announcementService
    })
  }))

  describe('Get Outbox announcements', function() {
    it('success', function() {
        spyOn(announcementService, 'getOutBoxAnnouncementList').and.returnValue(deferred.promise)
        deferred.resolve(annOutboxTestData.successResponce)
        annOutboxTestData.successResponce.data = annOutboxTestData.successResponce;
        spyOn(announcementOutboxListController, 'renderAnnouncementList').and.callThrough()
        announcementOutboxListController.renderAnnouncementList()
        scope.$apply();
    })

    it('Fail', function() {
      annOutboxTestData.successResponce.responseCode = 'fail'
      spyOn(announcementService, 'getOutBoxAnnouncementList').and.returnValue(deferred.promise)
      deferred.resolve(annOutboxTestData.successResponce)
      spyOn(announcementOutboxListController, 'renderAnnouncementList').and.callThrough()
      announcementOutboxListController.renderAnnouncementList()
      scope.$apply();
    })

    it('Reject', function() {
      spyOn(announcementService, 'getOutBoxAnnouncementList').and.returnValue(deferred.promise)
      deferred.reject({})
      spyOn(announcementOutboxListController, 'renderAnnouncementList').and.callThrough()
      announcementOutboxListController.renderAnnouncementList()
      scope.$apply();
    })
  })

  describe('Delete announcement', function() {
      it('success', function() {
        spyOn(announcementService, 'deleteAnnouncement').and.returnValue(deferred.promise)
        deferred.resolve(annDeleteTestData.successResponse)
        var requestBody = { "request": {"userid": "159e93d1-da0c-4231-be94-e75b0c226d7c","announcenmentid": "430d95d0-c842-11e7-a0fa-0d6c238048d7"}}
        annDeleteTestData.successResponse.data = annDeleteTestData.successResponse
        expect(announcementOutboxListController.deleteAnnouncement).toBeDefined()
        announcementOutboxListController.deleteAnnouncement(requestBody)
        expect(announcementService.deleteAnnouncement).toHaveBeenCalled()
        scope.$apply()
	    })

      it('fail', function() {
        spyOn(announcementService, 'deleteAnnouncement').and.returnValue(deferred.promise)
        deferred.resolve(annDeleteTestData.failedResponse)
        var requestBody = { "request": {"userid": "159e93d1-da0c-4231-be94-e75b0c226d7c","announcenmentid": "430d95d0-c842-11e7-a0fa-0d6c238048d7"}}
        annDeleteTestData.failedResponse.data = annDeleteTestData.failedResponse
        expect(announcementOutboxListController.deleteAnnouncement).toBeDefined()
        announcementOutboxListController.deleteAnnouncement(requestBody)
        expect(announcementService.deleteAnnouncement).toHaveBeenCalled()
        scope.$apply()
      })
	})

   describe('Get resend', function() {
      it('success', function() {
        spyOn(announcementService, 'getResend').and.returnValue(deferred.promise)
        deferred.resolve(annGetResendTestData.successResponse)
        annGetResendTestData.successResponse.data = annGetResendTestData.successResponse
        expect(announcementOutboxListController.getResend).toBeDefined()
        var response = announcementOutboxListController.getResend('90ae7cf0-c5e0-11e7-8744-852d6ada097c')
        expect(announcementService.getResend).toHaveBeenCalled()
        scope.$apply()
	    })
	})

	describe('Modal popup', function() {
      it('show modal popup', function() {
        spyOn(announcementOutboxListController, 'showModal').and.callThrough()
        expect(announcementOutboxListController.showModal).toBeDefined()
        announcementOutboxListController.showModal('announcementDeleteModal')
        expect(announcementOutboxListController.showModal).toHaveBeenCalled()
      });

      it('close modal popup', function() {
        spyOn(announcementOutboxListController, 'closeModal').and.callThrough()
        expect(announcementOutboxListController.closeModal).toBeDefined()
        announcementOutboxListController.closeModal('announcementDeleteModal')
        expect(announcementOutboxListController.closeModal).toHaveBeenCalled()
      });
  })
})
