/**
 * name: ContentPlayer.js
 * author: Anuj Gupta
 * Date: 02-11-2017
 */

'use strict'
describe('playerCtrl', function () {
  beforeEach(module('playerApp'))
  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))
  var rootScope, $stateParams, contentService, $timeout,
    scope, $state, $q, deferred, player, c

  beforeEach(inject(function ($rootScope, _$stateParams_, _contentService_, _$timeout_,
    _$state_, _$q_, $controller) {
    rootScope = $rootScope
    $stateParams = _$stateParams_
    contentService = _contentService_
    $timeout = _$timeout_
    scope = $rootScope.$new()
    $state = _$state_
    $q = _$q_
    deferred = _$q_.defer()
    player = new $controller('playerCtrl', {$scope: scope, $rootScope: rootScope})
  }))

  it('should play when have content object', function () {
    spyOn(player, 'ngInit').and.callThrough()
    $stateParams.content = {
      identifier: 'do_211321312312313132'
    }
    player.ngInit()
    $timeout.flush(500)
  })

  it('should play when have content id', function () {
    spyOn(player, 'ngInit').and.callThrough()
    $stateParams.contentId = 'do_211321312312313132'
    player.ngInit()
    $timeout.flush(500)
  })

  it('should play when have location hash', function () {
    spyOn(player, 'ngInit').and.callThrough()
    player.contentPlayer = {}
    player.ngInit()
    $timeout.flush(500)
  })
})
