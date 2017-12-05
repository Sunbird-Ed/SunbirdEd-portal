/**
 * name: announcementDetailsController.js
 * author: Sourav Dey
 * Date: 21-11-2017
 */
'use strict'
describe('Controller: announcementDetailsController', function() {
    // load the controller's module
    beforeEach(module('playerApp'))
    var announcementAdapter,
        scope,
        rootScope,
        announcementDetailsController,
        $q,
        deferred,
        timeout,
        annDetailsTestData = announcementTestData.announcementDetails
    beforeEach(inject(function($rootScope, $controller) {
        $controller('AppCtrl', {
            $rootScope: $rootScope,
            $scope: $rootScope.$new()
        })
    }))
    // Initialize the controller and a mock scope
    beforeEach(inject(function($rootScope, $controller, _announcementAdapter_, _$q_, _$timeout_) {
        rootScope = $rootScope
        scope = $rootScope.$new()
        announcementAdapter = _announcementAdapter_
        $q = _$q_
        timeout = _$timeout_
        deferred = _$q_.defer()
        announcementDetailsController = $controller('announcementDetailsController', {
            $rootScope: rootScope,
            $scope: scope,
            announcementAdapter: announcementAdapter
        })
    }))
    describe('Get announcement by id', function() {
        it('success', function() {
            spyOn(announcementAdapter, 'getAnnouncementById').and.returnValue(deferred.promise)
            deferred.resolve(annDetailsTestData.successResponce)
            var response = announcementAdapter.getAnnouncementById().$$state.value
            expect(response).toBe(annDetailsTestData.successResponce)
        })
        it('Fail', function() {
            annDetailsTestData.successResponce.responseCode = 'fail'
            spyOn(announcementAdapter, 'getAnnouncementById').and.returnValue(deferred.promise)
            deferred.resolve(annDetailsTestData.successResponce)
            spyOn(announcementDetailsController, 'renderAnnouncement').and.callThrough()
            announcementDetailsController.renderAnnouncement()
            scope.$apply()
            expect(announcementDetailsController.showLoader).toEqual(false)
        })
        it('Reject', function() {
            spyOn(announcementAdapter, 'getAnnouncementById').and.returnValue(deferred.promise)
            deferred.reject({})
            spyOn(announcementDetailsController, 'renderAnnouncement').and.callThrough()
            announcementDetailsController.renderAnnouncement()
            scope.$apply()
            expect(announcementDetailsController.showLoader).toEqual(false)
        })
    })
})