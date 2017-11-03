/**
 * name: announcementInboxListController.js
 * author: Sourav Dey
 * Date: 02-11-2017
 */

'use strict'

describe('Controller: announcementInboxListController', function () {
    // load the controller's module
  beforeEach(module('playerApp'))

  var announcementService,
    scope,
    rootScope,
    announcementInboxListController,
    $q,
    deferred,
    timeout,
    annInboxTestData = testData.getAnnouncementInbox

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

    // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $controller, _announcementService_, _$q_, _$timeout_) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    announcementService = _announcementService_
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()

    announcementInboxListController = $controller('announcementInboxListController', {
      $rootScope: rootScope,
      $scope: scope,
      announcementService: announcementService
    })
  }))

  describe('Get inbox announcements', function () {
    it('success', function () {
      spyOn(announcementService, 'getInboxAnnouncementList').and.returnValue(deferred.promise)
      deferred.resolve(annInboxTestData.successResponce)
     // spyOn(announcementInboxListController, 'renderAnnouncementList').and.callThrough()
      //announcementInboxListController.renderAnnouncementList(2)
      var response = announcementService.getInboxAnnouncementList().$$state.value
      expect(response).toBe(annInboxTestData.successResponce)
    })

    it('get file extension', function () {
      spyOn(announcementService, 'getFileExtension').and.returnValue(deferred.promise)
      deferred.resolve('PDF')
      spyOn(announcementInboxListController, 'getFileExtension').and.callThrough()
      announcementInboxListController.getFileExtension('application/pdf')
      var response = announcementService.getFileExtension('application/pdf').$$state.value
      expect(response).toBe('PDF')
    })

    it('Show details', function () {
	  //spyOn(announcementInboxListController, 'showAnnouncementDetails').and.callThrough()
      //announcementInboxListController.showAnnouncementDetails(successResponce1)
      //expect(announcementInboxListController.showAnnouncementDetails).toBe(true)
    })


})
})
