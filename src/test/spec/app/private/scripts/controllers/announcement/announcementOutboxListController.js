/**
 * name: announcementOutboxListController.js
 * author: Sourav Dey
 * Date: 03-11-2017
 */
'use strict'
describe('Controller: announcementOutboxListController', function() {
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
    beforeEach(inject(function($rootScope, $controller) {
        $controller('AppCtrl', {
            $rootScope: $rootScope,
            $scope: $rootScope.$new()
        })
    }))
    // Initialize the controller and a mock scope
    beforeEach(inject(function($rootScope, $controller, _$q_, _$timeout_, _announcementAdapter_) {
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
    describe('Get Outbox announcements', function() {
        it('Should called announcement service', function() {
            spyOn(announcementAdapter, 'getOutBoxAnnouncementList').and.callThrough()
            announcementAdapter.getOutBoxAnnouncementList()
            expect(announcementAdapter.getOutBoxAnnouncementList).toBeDefined()
            spyOn(announcementAdapter, 'deleteAnnouncement').and.callThrough()
            announcementAdapter.deleteAnnouncement()
            expect(announcementAdapter.deleteAnnouncement).toBeDefined()
        })
        it('success', function() {
            announcementOutboxListController.result = undefined
            // spyOn(announcementAdapter, 'getOutBoxAnnouncementList').and.callThrough()
            spyOn(announcementAdapter, 'getOutBoxAnnouncementList').and.returnValue(deferred.promise)
            deferred.resolve(announcementTestData.getAnnouncementOutbox.successResponce)
            spyOn(announcementOutboxListController, 'renderAnnouncementList').and.callThrough()
            announcementOutboxListController.renderAnnouncementList()
            scope.$apply()
            expect(announcementOutboxListController.result).toBeDefined()
        })
        it('Fail', function() {
            annOutboxTestData.successResponce.responseCode = 'fail'
            spyOn(announcementAdapter, 'getOutBoxAnnouncementList').and.returnValue(deferred.promise)
            deferred.resolve(annOutboxTestData.successResponce)
            spyOn(announcementOutboxListController, 'renderAnnouncementList').and.callThrough()
            announcementOutboxListController.renderAnnouncementList()
            scope.$apply()
            expect(announcementOutboxListController.showLoader).toEqual(false)
        })
        it('Reject', function() {
            spyOn(announcementAdapter, 'getOutBoxAnnouncementList').and.returnValue(deferred.promise)
            deferred.reject({})
            spyOn(announcementOutboxListController, 'renderAnnouncementList').and.callThrough()
            announcementOutboxListController.renderAnnouncementList()
            scope.$apply()
            expect(announcementOutboxListController.showLoader).toEqual(false)
        })
    })
    describe('Delete announcement', function() {
        it('success', function() {
            spyOn(announcementAdapter, 'deleteAnnouncement').and.returnValue(deferred.promise)
            deferred.resolve(annDeleteTestData.successResponse)
            annDeleteTestData.successResponse.data = annDeleteTestData.successResponse
            expect(announcementOutboxListController.deleteAnnouncement).toBeDefined()
            announcementOutboxListController.deleteAnnouncement(annDeleteTestData.requestBody)
            expect(announcementAdapter.deleteAnnouncement).toHaveBeenCalled()
            scope.$apply()
        })
        it('fail', function() {
            spyOn(announcementAdapter, 'deleteAnnouncement').and.returnValue(deferred.promise)
            deferred.resolve(annDeleteTestData.failedResponse)
            annDeleteTestData.failedResponse.data = annDeleteTestData.failedResponse
            expect(announcementOutboxListController.deleteAnnouncement).toBeDefined()
            announcementOutboxListController.deleteAnnouncement(annDeleteTestData.requestBody)
            expect(announcementAdapter.deleteAnnouncement).toHaveBeenCalled()
            scope.$apply()
        })
        it('Reject', function() {
            spyOn(announcementAdapter, 'deleteAnnouncement').and.returnValue(deferred.promise)
            deferred.reject({})
            expect(announcementOutboxListController.deleteAnnouncement).toBeDefined()
            announcementOutboxListController.deleteAnnouncement(annDeleteTestData.requestBody)
            expect(announcementAdapter.deleteAnnouncement).toHaveBeenCalled()
            scope.$apply()
        })
    })
    xdescribe('Get resend', function() {
        it('success', function() {
            spyOn(announcementAdapter, 'getResend').and.returnValue(deferred.promise)
            deferred.resolve(annGetResendTestData.successResponse)
            annGetResendTestData.successResponse.data = annGetResendTestData.successResponse
            expect(announcementOutboxListController.getResend).toBeDefined()
            var response = announcementOutboxListController.getResend('90ae7cf0-c5e0-11e7-8744-852d6ada097c', 'test')
            expect(announcementAdapter.getResend).toHaveBeenCalled()
            scope.$apply()
        })
        it('failed', function() {
            spyOn(announcementAdapter, 'getResend').and.returnValue(deferred.promise)
            deferred.resolve(annGetResendTestData.failedResponse)
            expect(announcementOutboxListController.getResend).toBeDefined()
            var response = announcementOutboxListController.getResend('blah-blah', 'test')
            expect(announcementAdapter.getResend).toHaveBeenCalled()
            scope.$apply()
        })
    })
    describe('Modal popup', function() {
        it('show modal popup', function() {
            spyOn(announcementOutboxListController, 'showModal').and.callThrough()
            expect(announcementOutboxListController.showModal).toBeDefined()
            announcementOutboxListController.showModal('announcementDeleteModal')
            expect(announcementOutboxListController.showModal).toHaveBeenCalled()
        })
        it('close modal popup', function() {
            spyOn(announcementOutboxListController, 'closeModal').and.callThrough()
            expect(announcementOutboxListController.closeModal).toBeDefined()
            announcementOutboxListController.closeModal('announcementDeleteModal')
            expect(announcementOutboxListController.closeModal).toHaveBeenCalled()
        })
        it('Show details undefined', function() {
            spyOn(announcementOutboxListController, 'showAnnouncementDetails').and.callThrough()
            var response = announcementOutboxListController.showAnnouncementDetails('', {
                details: {
                    title: 'test'
                }
            })
            expect(response).toBe(undefined)
        })
    })
})