/**
 * name: contentBadgeController.js
 * author: Anuj Gupta
 * Date: 14-03-2018
 */

'use strict'
describe('contentBadgeCtrl', function () {
  beforeEach(module('playerApp'))
  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))
  var rootScope
  var scope
  var contentBadge
  var timeout
  var badgeService
  var badgeTestData = testData.badges
  var deferred
  var selectedBadge = { 'image': 'https://sunbirddev.blob.core.windows.net/badgr/uploads/badges/issuer_badgeclass_ba684c5c-5490-4c16-a091-759f1e689723', 'badgeId': 'official', 'criteria': 'http://localhost:8000/public/badges/official/criteria', 'roles': ['COURSE_MENTOR'], 'description': 'something', 'type': 'content', 'rootOrgId': 'ORG_001', 'issuerId': 'swarn-2', 'createdDate': '2018-03-21T10:16:33.631893Z', 'recipientCount': 4, 'subtype': 'award', 'issuerIdUrl': 'http://localhost:8000/public/issuers/swarn-2', 'name': 'OFFICIAL', 'badgeIdUrl': 'http://localhost:8000/public/badges/official' }

  beforeEach(inject(function ($rootScope, _$q_, $controller, _$timeout_, _badgeService_) {
    rootScope = $rootScope
    timeout = _$timeout_
    scope = $rootScope.$new()
    deferred = _$q_.defer()
    badgeService = _badgeService_
    contentBadge = new $controller('contentBadgeController', { $scope: scope, $rootScope: rootScope })
    contentBadge.contentId = 'do_21244053300423884811149'
    contentBadge.type = 'content'
  }))

  describe('Search badge service', function () {
    it('Should called get all badges', function () {
      spyOn(badgeService, 'getAllBadgesList').and.callThrough()
      badgeService.getAllBadgesList()
      expect(badgeService.getAllBadgesList).toBeDefined()
    })

    it('failed due to invalid request', function () {
      spyOn(badgeService, 'getAllBadgesList').and.returnValue(deferred.promise)
      deferred.resolve(badgeTestData.getAllBadgeFailureResponse)
      spyOn(contentBadge, 'getAllBadges').and.callThrough()
      contentBadge.getAllBadges()
      scope.$apply()
      var response = badgeService.getAllBadgesList().$$state.value
      expect(response).toBeDefined()
      expect(response.responseCode).toBe('CLIENT_ERROR')
    })

    it('failed due to external error', function () {
      spyOn(badgeService, 'getAllBadgesList').and.returnValue(deferred.promise)
      deferred.reject({})
      spyOn(contentBadge, 'getAllBadges').and.callThrough()
      contentBadge.getAllBadges()
      scope.$apply()
      var response = badgeService.getAllBadgesList().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('success', function () {
      spyOn(badgeService, 'getAllBadgesList').and.returnValue(deferred.promise)
      deferred.resolve(badgeTestData.getAllBadgesSuccessResponse)
      spyOn(contentBadge, 'getAllBadges').and.callThrough()
      contentBadge.getAllBadges()
      scope.$apply()
      var response = badgeService.getAllBadgesList().$$state.value
      expect(response).not.toBe(undefined)
      expect(response.responseCode).toBe('OK')
    })
  })

  it('Show content badge assign model', function (done) {
    spyOn(contentBadge, 'initializeModal').and.callThrough()
    contentBadge.initializeModal({
      'issuerId': 'islug123',
      'badgeClassId': 'bslug123',
      'badgeClassName': 'OFFICIAL',
      'badgeClassImage': '/common/images/pdf.png',
      'assertionId': 'aslug123',
      'createdTS': 1520586333
    })
    timeout.flush(10)
    expect(contentBadge.showBadgeAssingModel).toBe(true)
    done()
  })

  it('Hide content badge assign model', function (done) {
    spyOn(contentBadge, 'hideContentBadgeModal').and.callThrough()
    contentBadge.showBadgeAssingModel = true
    contentBadge.hideContentBadgeModal()
    expect(contentBadge.showBadgeAssingModel).toBeDefined()
    done()
  })

  describe('Assign badge service', function () {
    var req = {
      'issuerId': selectedBadge.issuerId,
      'badgeId': selectedBadge.badgeId,
      'recipientId': 'do_21244053300423884811149',
      'recipientType': 'content'
    }
    it('Should called get assign badges', function () {
      spyOn(badgeService, 'addBadges').and.callThrough()
      badgeService.addBadges({ request: req })
      expect(badgeService.addBadges).toBeDefined()
    })

    it('failed due to invalid request', function () {
      spyOn(badgeService, 'addBadges').and.returnValue(deferred.promise)
      deferred.resolve(badgeTestData.getAllBadgeFailureResponse)
      spyOn(contentBadge, 'assignBadge').and.callThrough()
      contentBadge.assignBadge(selectedBadge)
      scope.$apply()
      var response = badgeService.addBadges().$$state.value
      expect(response).toBeDefined()
      expect(response.responseCode).toBe('CLIENT_ERROR')
    })

    it('failed due to external error', function () {
      spyOn(badgeService, 'addBadges').and.returnValue(deferred.promise)
      deferred.reject({})
      spyOn(contentBadge, 'assignBadge').and.callThrough()
      contentBadge.assignBadge(selectedBadge)
      scope.$apply()
      var response = badgeService.addBadges().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('success', function () {
      spyOn(badgeService, 'addBadges').and.returnValue(deferred.promise)
      deferred.resolve(badgeTestData.assignBadgeSuccessResponse)
      spyOn(contentBadge, 'assignBadge').and.callThrough()
      contentBadge.assignBadge(selectedBadge)
      scope.$apply()
      var response = badgeService.addBadges().$$state.value
      expect(response).not.toBe(undefined)
      expect(response.responseCode).toBe('OK')
    })
  })
})
