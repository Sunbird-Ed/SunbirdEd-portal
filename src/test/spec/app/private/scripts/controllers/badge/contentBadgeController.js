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
  var rootScope, scope, contentBadge, timeout, badgeService
  // $q, deferred,

  beforeEach(inject(function ($rootScope, _$q_, $controller, _$timeout_, _badgeService_) {
    rootScope = $rootScope
    timeout = _$timeout_
    scope = $rootScope.$new()
    // $q = _$q_
    // deferred = $q.defer()
    badgeService = _badgeService_
    contentBadge = new $controller('contentBadgeController', { $scope: scope, $rootScope: rootScope })
  }))

  it('Get all badge list', function () {
    spyOn(contentBadge, 'getAllBadges').and.callThrough()
    contentBadge.getAllBadges()
    timeout.flush(10)
    expect(contentBadge.getAllBadges).toBeDefined()
  })

  it('Should defined get all badge service   ', function () {
    spyOn(badgeService, 'getAllBadgesList').and.callThrough()
    badgeService.getAllBadgesList()
    expect(badgeService.getAllBadgesList).toBeDefined()
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
    timeout.flush(10)
    expect(contentBadge.showBadgeAssingModel).toBe(false)
    done()
  })

  it('should called assign badge', function (done) {
    spyOn(contentBadge, 'assignBadge').and.callThrough()
    contentBadge.allBadgeList = [{
      'issuerId': 'islug123',
      'badgeClassId': 'bslug123',
      'badgeClassName': 'OFFICIAL',
      'badgeClassImage': '/common/images/pdf.png',
      'assertionId': 'aslug123',
      'createdTS': 1520586333
    },
    {
      'issuerId': 'islug123',
      'badgeClassId': 'bslug1234',
      'badgeClassName': 'EDITOR\'S PICK',
      'badgeClassImage': '/common/images/mp4.png',
      'assertionId': 'aslug123',
      'createdTS': 1520586333
    }, {
      'issuerId': 'islug123',
      'badgeClassId': 'bslug1235',
      'badgeClassName': 'OFFICIAL2',
      'badgeClassImage': '/common/images/pdf.png',
      'assertionId': 'aslug125',
      'createdTS': 1520586333
    },
    {
      'issuerId': 'islug123',
      'badgeClassId': 'bslug12346',
      'badgeClassName': 'EDITOR\'S PICK 2',
      'badgeClassImage': '/common/images/mp4.png',
      'assertionId': 'aslug1236',
      'createdTS': 1520586333
    }]
    contentBadge.assignBadge({
      'issuerId': 'islug123',
      'badgeClassId': 'bslug123',
      'badgeClassName': 'OFFICIAL',
      'badgeClassImage': '/common/images/pdf.png',
      'assertionId': 'aslug123',
      'createdTS': 1520586333
    })
    expect(contentBadge.assignBadge).toBeDefined()
    done()
  })
})
