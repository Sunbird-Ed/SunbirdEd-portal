/**
 * name: announcementDetailsController.js
 * author: Sourav Dey
 * Date: 21-11-2017
 */

'use strict'

describe('Controller: announcementDetailsController', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  var announcementService,
    scope,
    rootScope,
    announcementDetailsController,
    $q,
    deferred,
    timeout,
    annInboxTestData = announcementTestData.announcementDetails

  beforeEach
(inject(function ($rootScope, $controller) {
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

    announcementDetailsController = $controller('announcementDetailsController', {
      $rootScope: rootScope,
      $scope: scope,
      announcementService: announcementService
    })
  }))

  describe('Get announcement by id', function () {
    it('success', function () {
      spyOn(announcementService, 'getAnnouncementById').and.returnValue(deferred.promise)
      deferred.resolve(annInboxTestData.successResponce)
      annInboxTestData.successResponce.data = annInboxTestData.successResponce
      spyOn(announcementDetailsController, 'renderAnnouncement').and.callThrough()
      announcementDetailsController.renderAnnouncement()

      // announcementDetailsController.announcementDetailsData.annId = '56d79d30-c9c9-11e7-bb89-bba5c80626bd'

      // var response = announcementDetailsController.renderAnnouncement(announcementDetailsController.announcementDetailsData.annId)
      // expect(response).toBe(annInboxTestData.successResponce)

      scope.$apply()
    })

    it('Fail', function () {
      annInboxTestData.successResponce.responseCode = 'fail'
      spyOn(announcementService, 'getAnnouncementById').and.returnValue(deferred.promise)
      deferred.resolve(annInboxTestData.successResponce)
      spyOn(announcementDetailsController, 'renderAnnouncement').and.callThrough()
      announcementDetailsController.renderAnnouncement()
      scope.$apply()
    })

    it('Reject', function () {
      spyOn(announcementService, 'getAnnouncementById').and.returnValue(deferred.promise)
      deferred.reject({})
      spyOn(announcementDetailsController, 'renderAnnouncement').and.callThrough()
      announcementDetailsController.renderAnnouncement()
      scope.$apply()
    })
  })
})
