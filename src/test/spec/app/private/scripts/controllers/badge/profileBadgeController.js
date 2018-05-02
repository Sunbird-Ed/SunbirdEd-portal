/**
 * name: profileBadgeController.js
 * author: Anuj Gupta
 * Date: 14-03-2018
 */

'use strict'
describe('profileBadgeCtrl', function () {
  beforeEach(module('playerApp'))
  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))
  var rootScope
  var scope
  var profileBadge
  var badgeService
  var badgeTestData = testData.badges
  var deferred

  beforeEach(inject(function ($rootScope, _$q_, $controller, _badgeService_) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    deferred = _$q_.defer()
    badgeService = _badgeService_
    profileBadge = new $controller('profileBadgeController', { $scope: scope, $rootScope: rootScope })
    profileBadge.profileId = 'do_21244053300423884811149'
    profileBadge.type = 'profile'
  }))

  describe('Search badge service', function () {
    it('Should called get all badges', function () {
      spyOn(badgeService, 'getDetailedBadgeAssertions').and.callThrough()
      badgeService.getDetailedBadgeAssertions()
      expect(badgeService.getDetailedBadgeAssertions).toBeDefined()
    })

    it('failed due to invalid request', function () {
      spyOn(badgeService, 'getDetailedBadgeAssertions').and.returnValue(deferred.promise)
      deferred.resolve(badgeTestData.getAllBadgeFailureResponse)
      spyOn(profileBadge, 'getAllBadges').and.callThrough()
      profileBadge.getAllBadges()
      scope.$apply()
      var response = badgeService.getDetailedBadgeAssertions().$$state.value
      expect(response).toBeDefined()
      expect(response.responseCode).toBe('CLIENT_ERROR')
    })

    it('failed due to external error', function () {
      spyOn(badgeService, 'getDetailedBadgeAssertions').and.returnValue(deferred.promise)
      deferred.reject({})
      spyOn(profileBadge, 'getAllBadges').and.callThrough()
      profileBadge.getAllBadges()
      scope.$apply()
      var response = badgeService.getDetailedBadgeAssertions().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('success', function () {
      spyOn(badgeService, 'getDetailedBadgeAssertions').and.returnValue(deferred.promise)
      deferred.resolve(badgeTestData.getAllBadgesSuccessResponse)
      spyOn(profileBadge, 'getAllBadges').and.callThrough()
      profileBadge.getAllBadges()
      scope.$apply()
      var response = badgeService.getDetailedBadgeAssertions().$$state.value
      expect(response).not.toBe(undefined)
      expect(response.responseCode).toBe('OK')
    })
  })
})
