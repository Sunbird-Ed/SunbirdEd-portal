/**
 * name: announcementService.js
 * author: Sourav Dey
 * Date: 10-11-2017
 */

'use strict'

describe('Service: announcementService', function() {
  beforeEach(module('playerApp'))

  var announcementService,
    scope,
    rootScope,
    $q,
    deferred,
    timeout,
    annTestData = announcementTestData

  beforeEach(inject(function($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  beforeEach(inject(function($rootScope, $controller, _announcementService_, _$q_, _$timeout_) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    announcementService = _announcementService_
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()
  }))

  describe('Test announcement service', function() {

    it('Define Outbox', function() {
      spyOn(announcementService, 'getOutBoxAnnouncementList').and.callThrough();
      announcementService.getOutBoxAnnouncementList();
      expect(announcementService.getOutBoxAnnouncementList).toBeDefined();
    })

    it('Define Inbox', function() {
      spyOn(announcementService, 'getInboxAnnouncementList').and.callThrough();
      announcementService.getInboxAnnouncementList();
      expect(announcementService.getInboxAnnouncementList).toBeDefined();
    })

    it('Define Create Announcement', function() {
      spyOn(announcementService, 'createAnnouncement').and.callThrough();
      announcementService.createAnnouncement();
      expect(announcementService.createAnnouncement).toBeDefined();
    })

    it('Define file extension', function() {
      spyOn(announcementService, 'getFileExtension').and.callThrough();
      announcementService.getFileExtension();
      expect(announcementService.getFileExtension).toBeDefined();
    })

    it('Outbox success', function() {
      spyOn(announcementService, 'getOutBoxAnnouncementList').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.successResponce)
      var response = announcementService.getOutBoxAnnouncementList().$$state.value
      expect(response).toBe(annTestData.successResponce)
    })

    it('Outbox failure', function() {
      annTestData.getAnnouncementOutbox.failedResponse.responseCode = 'fail'
      spyOn(announcementService, 'getOutBoxAnnouncementList').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.getAnnouncementOutbox.failedResponse)
      var response = announcementService.getOutBoxAnnouncementList().$$state.value
      expect(response).toBe(annTestData.getAnnouncementOutbox.failedResponse)
    })

    it('Outbox reject', function() {
      spyOn(announcementService, 'getOutBoxAnnouncementList').and.returnValue(deferred.promise)
      deferred.reject(annTestData.getAnnouncementOutbox.failedResponse)
      var response = announcementService.getOutBoxAnnouncementList().$$state.value
      expect(response).toBe(annTestData.getAnnouncementOutbox.failedResponse)
    })

    it('Inbox success', function() {
      spyOn(announcementService, 'getInboxAnnouncementList').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.getAnnouncementInbox.successResponce)
      var response = announcementService.getInboxAnnouncementList().$$state.value
      expect(response).toBe(annTestData.getAnnouncementInbox.successResponce)
    })

    it('Inbox failure', function() {
      annTestData.getAnnouncementInbox.failedResponse.responseCode = 'fail'
      spyOn(announcementService, 'getInboxAnnouncementList').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.getAnnouncementInbox.failedResponse)
      var response = announcementService.getInboxAnnouncementList().$$state.value
      expect(response).toBe(annTestData.getAnnouncementInbox.failedResponse)
    })

    it('Inbox reject', function() {
      spyOn(announcementService, 'getInboxAnnouncementList').and.returnValue(deferred.promise)
      deferred.reject(annTestData.getAnnouncementInbox.failedResponse)
      var response = announcementService.getInboxAnnouncementList().$$state.value
      expect(response).toBe(annTestData.getAnnouncementInbox.failedResponse)
    })

    it('Get file extension', function() {
      spyOn(announcementService, 'getFileExtension').and.returnValue(deferred.promise)
      deferred.resolve('PDF')
      var response = announcementService.getFileExtension('application/pdf').$$state.value
      expect(response).toBe('PDF')
    })

    it('Received API success', function() {
      spyOn(announcementService, 'receivedAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.receivedAPI.successResponce)
      var response = announcementService.receivedAnnouncement().$$state.value
      expect(response).toBe(annTestData.receivedAPI.successResponce)
    })

    it('Read API failure', function() {
      annTestData.receivedAPI.failedResponse.responseCode = 'fail'
      spyOn(announcementService, 'receivedAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.receivedAPI.failedResponse)
      var failureData = { "request": { "userId": "d56a1766-e138-45e9-bed2-a0db5eb9696a", "channel": "web" } }
      var response = announcementService.receivedAnnouncement(failureData).$$state.value
      expect(response).toBe(annTestData.receivedAPI.failedResponse)
    })

    it('Read API reject', function() {
      spyOn(announcementService, 'receivedAnnouncement').and.returnValue(deferred.promise)
      deferred.reject(annTestData.receivedAPI.failedResponse)
      var response = announcementService.receivedAnnouncement().$$state.value
      expect(response).toBe(annTestData.receivedAPI.failedResponse)
    })

    it('Read API success', function() {
      spyOn(announcementService, 'readAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.readAPI.successResponce)
      var response = announcementService.readAnnouncement().$$state.value
      expect(response).toBe(annTestData.readAPI.successResponce)
    })

    it('Read API failure', function() {
      annTestData.readAPI.failedResponse.responseCode = 'fail'
      spyOn(announcementService, 'readAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.readAPI.failedResponse)
      var failureData = { "request": { "userId": "d56a1766-e138-45e9-bed2-a0db5eb9696a", "channel": "web" } }
      var response = announcementService.readAnnouncement(failureData).$$state.value
      expect(response).toBe(annTestData.readAPI.failedResponse)
    })

    it('Read API reject', function() {
      spyOn(announcementService, 'readAnnouncement').and.returnValue(deferred.promise)
      deferred.reject(annTestData.readAPI.failedResponse)
      var response = announcementService.readAnnouncement().$$state.value
      expect(response).toBe(annTestData.readAPI.failedResponse)
    })

    it('Create announcement get success', function() {
      spyOn(announcementService, 'createAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.createAnnouncement.successResponce)
      var successData = { "id": "api.plugin.announcement.create", "ver": "1.0", "ts": "2017-11-13 12:31:09:794+0000", "params": { "resmsgid": "872d4c20-c86e-11e7-a0fa-0d6c238048d7", "msgid": null, "status": "successful", "err": "", "errmsg": "" }, "responseCode": "OK", "result": { "announcement": { "id": "87222890-c86e-11e7-a0fa-0d6c238048d7" } } }
      var response = announcementService.createAnnouncement(successData).$$state.value
      expect(response).toBe(annTestData.createAnnouncement.successResponce)
    })

    it('Create announcement failure', function() {
      annTestData.createAnnouncement.authErrorResponse.responseCode = 'fail'
      spyOn(announcementService, 'createAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.createAnnouncement.authErrorResponse)
      var response = announcementService.createAnnouncement().$$state.value
      expect(response).toBe(annTestData.createAnnouncement.authErrorResponse)
    })

    it('Create announcement reject', function() {
      spyOn(announcementService, 'createAnnouncement').and.returnValue(deferred.promise)
      deferred.reject(annTestData.createAnnouncement.authErrorResponse)
      var response = announcementService.createAnnouncement().$$state.value
      expect(response).toBe(annTestData.createAnnouncement.authErrorResponse)
    })

    it('Create announcement field missing', function() {
      spyOn(announcementService, 'createAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.createAnnouncement.fieldMissingResponse)
      var failureData = { "request": { "sourceId": "0123673689120112640", "createdBy": "159e93d1-da0c-4231-be94-e75b0c226d7c", "type": "Circular", "links": ["http://yahoo.com"], "title": "Test title for announcement 9011111111111111111", "description": "Test description for announcement 90" } }
      var response = announcementService.createAnnouncement(failureData).$$state.value
      expect(response).toBe(annTestData.createAnnouncement.fieldMissingResponse)
    })

    it('Get definitions', function() {
      spyOn(announcementService, 'getDefinitions').and.callThrough();
      announcementService.getDefinitions();
      expect(announcementService.getDefinitions).toBeDefined();
    })
  })
})
