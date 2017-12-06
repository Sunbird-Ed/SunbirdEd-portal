/**
 * name: searchController.js
 * author: Anuj Gupta
 * Date: 02-11-2017
 */

'use strict'
describe('SearchCtrl', function () {
  beforeEach(module('playerApp'))
  var rootScope, $stateParams, contentService, $timeout,
    scope, $state, $q, deferred, player

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
    player = new $controller('SearchCtrl', {$scope: scope, $rootScope: rootScope})
  }))

  it('should init search', function () {
    spyOn(player, 'initSearch').and.callThrough()
    var item = {
      identifier: 'do_211321312312313132',
      name: 'name'
    }
    player.initSearch()
    $timeout.flush(500)
  })

  it('should init search with root scope', function () {
    spyOn(player, 'initSearch').and.callThrough()
    rootScope.search = {}
    player.initSearch()
    $timeout.flush(500)
  })
})
