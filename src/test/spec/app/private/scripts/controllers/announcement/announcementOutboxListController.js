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
    annOutboxTestData = announcementTestData.getAnnouncementOutbox

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
})
