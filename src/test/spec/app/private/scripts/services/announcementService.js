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
    timeout

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

    it('Outbox success', function() {
      spyOn(announcementService, 'getOutBoxAnnouncementList').and.callThrough();
      announcementService.getOutBoxAnnouncementList();
      expect(announcementService.getOutBoxAnnouncementList).toBeDefined();
    })

    it('Inbox success', function() {
      spyOn(announcementService, 'getInboxAnnouncementList').and.callThrough();
      announcementService.getInboxAnnouncementList();
      expect(announcementService.getInboxAnnouncementList).toBeDefined();
    })

    it('Get file extension', function() {
      spyOn(announcementService, 'getFileExtension').and.callThrough();
      announcementService.getFileExtension();
      expect(announcementService.getFileExtension).toBeDefined();
    })

    it('Create announcement', function() {
      spyOn(announcementService, 'createAnnouncement').and.callThrough();
      announcementService.createAnnouncement();
      expect(announcementService.createAnnouncement).toBeDefined();
    })

    it('Get definitions', function() {
      spyOn(announcementService, 'getDefinitions').and.callThrough();
      announcementService.getDefinitions();
      expect(announcementService.getDefinitions).toBeDefined();
    })

    it('Delete announcement', function() {
      spyOn(announcementService, 'deleteAnnouncement').and.callThrough();
      announcementService.deleteAnnouncement();
      expect(announcementService.deleteAnnouncement).toBeDefined();
    })

    it('Resend announcement', function() {
      spyOn(announcementService, 'resendAnnouncement').and.callThrough();
      announcementService.resendAnnouncement();
      expect(announcementService.resendAnnouncement).toBeDefined();
    })

    it('get resend announcement', function() {
      spyOn(announcementService, 'getResend').and.callThrough();
      announcementService.getResend();
      expect(announcementService.getResend).toBeDefined();
    })
  })
})
