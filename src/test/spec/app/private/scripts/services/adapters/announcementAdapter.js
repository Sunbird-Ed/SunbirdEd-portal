'use strict'

describe('Service: announcementAdapter', function () {
  beforeEach(module('playerApp'))

  var announcementAdapter
  var scope
  var $q  // eslint-disable-line
  var deferred
  var annTestData = announcementTestData   // eslint-disable-line

  beforeEach(inject(function ($rootScope, $controller) {   // eslint-disable-line
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  beforeEach(inject(function ($rootScope, $controller, _announcementAdapter_, _$q_) { // eslint-disable-line
    scope = $rootScope.$new()
    announcementAdapter = _announcementAdapter_
    $q = _$q_
    deferred = _$q_.defer()
  }))

  describe('Test announcement service', function () {
    it('Outbox success', function () {
      spyOn(announcementAdapter, 'getOutBoxAnnouncementList').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.successResponce)
      var response = announcementAdapter.getOutBoxAnnouncementList().$$state.value
      expect(response).toBe(annTestData.successResponce)
    })

    it('Outbox failure', function () {
      annTestData.getAnnouncementOutbox.failedResponse.responseCode = 'fail'
      spyOn(announcementAdapter, 'getOutBoxAnnouncementList').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.getAnnouncementOutbox.failedResponse)
      var response = announcementAdapter.getOutBoxAnnouncementList().$$state.value
      expect(response).toBe(annTestData.getAnnouncementOutbox.failedResponse)
    })

    it('Outbox reject', function () {
      spyOn(announcementAdapter, 'getOutBoxAnnouncementList').and.returnValue(deferred.promise)
      deferred.reject(annTestData.getAnnouncementOutbox.failedResponse)
      var response = announcementAdapter.getOutBoxAnnouncementList().$$state.value
      expect(response).toBe(annTestData.getAnnouncementOutbox.failedResponse)
    })

    it('Inbox success', function () {
      spyOn(announcementAdapter, 'getInboxAnnouncementList').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.getAnnouncementInbox.successResponce)
      var response = announcementAdapter.getInboxAnnouncementList().$$state.value
      expect(response).toBe(annTestData.getAnnouncementInbox.successResponce)
    })

    it('Inbox failure', function () {
      annTestData.getAnnouncementInbox.failedResponse.responseCode = 'fail'
      spyOn(announcementAdapter, 'getInboxAnnouncementList').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.getAnnouncementInbox.failedResponse)
      var response = announcementAdapter.getInboxAnnouncementList().$$state.value
      expect(response).toBe(annTestData.getAnnouncementInbox.failedResponse)
    })

    it('Inbox reject', function () {
      spyOn(announcementAdapter, 'getInboxAnnouncementList').and.returnValue(deferred.promise)
      deferred.reject(annTestData.getAnnouncementInbox.failedResponse)
      var response = announcementAdapter.getInboxAnnouncementList().$$state.value
      expect(response).toBe(annTestData.getAnnouncementInbox.failedResponse)
    })

    it('Get file extension', function () {
      spyOn(announcementAdapter, 'getFileExtension').and.returnValue(deferred.promise)
      deferred.resolve('PDF')
      var response = announcementAdapter.getFileExtension('application/pdf').$$state.value
      expect(response).toBe('PDF')
    })

    it('Received API success', function () {
      spyOn(announcementAdapter, 'receivedAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.receivedAPI.successResponce)
      var response = announcementAdapter.receivedAnnouncement().$$state.value
      expect(response).toBe(annTestData.receivedAPI.successResponce)
    })

    it('Read API failure', function () {
      annTestData.receivedAPI.failedResponse.responseCode = 'fail'
      spyOn(announcementAdapter, 'receivedAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.receivedAPI.failedResponse)
      var failureData = { 'request': { 'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'channel': 'web' } }
      var response = announcementAdapter.receivedAnnouncement(failureData).$$state.value
      expect(response).toBe(annTestData.receivedAPI.failedResponse)
    })

    it('Read API reject', function () {
      spyOn(announcementAdapter, 'receivedAnnouncement').and.returnValue(deferred.promise)
      deferred.reject(annTestData.receivedAPI.failedResponse)
      var response = announcementAdapter.receivedAnnouncement().$$state.value
      expect(response).toBe(annTestData.receivedAPI.failedResponse)
    })

    it('Read API success', function () {
      spyOn(announcementAdapter, 'readAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.readAPI.successResponce)
      var response = announcementAdapter.readAnnouncement().$$state.value
      expect(response).toBe(annTestData.readAPI.successResponce)
    })

    it('Read API failure', function () {
      annTestData.readAPI.failedResponse.responseCode = 'fail'
      spyOn(announcementAdapter, 'readAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.readAPI.failedResponse)
      var failureData = { 'request': { 'userId': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'channel': 'web' } }
      var response = announcementAdapter.readAnnouncement(failureData).$$state.value
      expect(response).toBe(annTestData.readAPI.failedResponse)
    })

    it('Read API reject', function () {
      spyOn(announcementAdapter, 'readAnnouncement').and.returnValue(deferred.promise)
      deferred.reject(annTestData.readAPI.failedResponse)
      var response = announcementAdapter.readAnnouncement().$$state.value
      expect(response).toBe(annTestData.readAPI.failedResponse)
    })

    it('Create announcement get success', function () {
      spyOn(announcementAdapter, 'createAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.createAnnouncement.successResponce)
      var successReq = { 'request': { 'sourceId': '0123673689120112640', 'createdBy': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'type': 'Circular', 'links': ['http://yahoo.com'], 'title': 'Test title for announcement 9011111111111111111', 'description': 'Test description for announcement 90', 'target': { 'geo': { 'ids': ['0123668627050987529'] } }, 'from': 'test user' } }
      var response = announcementAdapter.createAnnouncement(successReq).$$state.value
      expect(response).toBe(annTestData.createAnnouncement.successResponce)
    })

    it('Create announcement failure', function () {
      annTestData.createAnnouncement.authErrorResponse.responseCode = 'fail'
      spyOn(announcementAdapter, 'createAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.createAnnouncement.authErrorResponse)
      var response = announcementAdapter.createAnnouncement().$$state.value
      expect(response).toBe(annTestData.createAnnouncement.authErrorResponse)
    })

    it('Create announcement reject', function () {
      spyOn(announcementAdapter, 'createAnnouncement').and.returnValue(deferred.promise)
      deferred.reject(annTestData.createAnnouncement.authErrorResponse)
      var response = announcementAdapter.createAnnouncement().$$state.value
      expect(response).toBe(annTestData.createAnnouncement.authErrorResponse)
    })

    it('Create announcement undefined', function () {
      var annObject = { 'sourceId': '', 'createdBy': '', 'type': '', 'links': ['http://yahoo.com'], 'title': '', 'description': '', 'target': { 'geo': { 'ids': ['0123668627050987529'] } }, 'from': '' }
      spyOn(announcementAdapter, 'createAnnouncement').and.callThrough()
      var response = announcementAdapter.createAnnouncement(annObject).$$state.value
      expect(response).toEqual(undefined)
    })

    it('Create announcement field missing', function () {
      spyOn(announcementAdapter, 'createAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.createAnnouncement.fieldMissingResponse)
      var failureData = { 'request': { 'sourceId': '0123673689120112640', 'createdBy': '159e93d1-da0c-4231-be94-e75b0c226d7c', 'type': 'Circular', 'links': ['http://yahoo.com'], 'title': 'Test title for announcement 9011111111111111111', 'description': 'Test description for announcement 90' } }
      var response = announcementAdapter.createAnnouncement(failureData).$$state.value
      expect(response).toBe(annTestData.createAnnouncement.fieldMissingResponse)
    })

    xit('Get definitions', function () {
      spyOn(announcementAdapter, 'getDefinitions').and.callThrough()
      announcementAdapter.getDefinitions()
      expect(announcementAdapter.getDefinitions).toBeDefined()
    })

    it('Delete annnouncement undefined', function () {
      spyOn(announcementAdapter, 'deleteAnnouncement').and.callThrough()
      var response = announcementAdapter.deleteAnnouncement().$$state.value
      expect(response).toEqual(undefined)
    })

    it('Delete annnouncement success', function () {
      spyOn(announcementAdapter, 'deleteAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.deleteAnnouncement.successResponse)
      var requestBody = { 'request': { 'userid': '159e93d1-da0c-4231-be94-e75b0c226d7c',
        'announcenmentid': '430d95d0-c842-11e7-a0fa-0d6c238048d7' } }
      expect(announcementAdapter.deleteAnnouncement).toBeDefined()
      var response = announcementAdapter.deleteAnnouncement(requestBody).$$state.value
      expect(announcementAdapter.deleteAnnouncement).toHaveBeenCalled()
      expect(response).toBe(annTestData.deleteAnnouncement.successResponse)
      scope.$apply()
    })

    it('Delete annnouncement fail', function () {
      spyOn(announcementAdapter, 'deleteAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.deleteAnnouncement.failedResponse)
      var requestBody = { 'request': { 'userid': '159e93d1-da0c-4231-be94-e75b0c226d7c',
        'announcenmentid': '430d95d0-c842-11e7-a0fa-0d6c238048d7' } }
      expect(announcementAdapter.deleteAnnouncement).toBeDefined()
      var response = announcementAdapter.deleteAnnouncement(requestBody).$$state.value
      expect(announcementAdapter.deleteAnnouncement).toHaveBeenCalled()
      expect(response).toBe(annTestData.deleteAnnouncement.failedResponse)
      scope.$apply()
    })

    it('Get resend undefined', function () {
      spyOn(announcementAdapter, 'getResend').and.callThrough()
      var response = announcementAdapter.getResend().$$state.value
      expect(response).toEqual(undefined)
    })

    it('get resend announcement', function () {
      spyOn(announcementAdapter, 'getResend').and.returnValue(deferred.promise)
      deferred.resolve(annTestData.getResend.successResponse)
      expect(announcementAdapter.getResend).toBeDefined()
      var response = announcementAdapter.getResend('90ae7cf0-c5e0-11e7-8744-852d6ada097c').$$state.value
      expect(response).toBe(annTestData.getResend.successResponse)
    })

    it('Get announcement by id undefined', function () {
      spyOn(announcementAdapter, 'getAnnouncementById').and.callThrough()
      var response = announcementAdapter.getAnnouncementById().$$state.value
      expect(response).toEqual(undefined)
    })
  })
})
