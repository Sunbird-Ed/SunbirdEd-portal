/**
 * name: resourceController.js
 * author: Anuj Gupta
 * Date: 02-11-2017
 */

'use strict'
describe('resourceCtrl', function () {
  beforeEach(module('playerApp'))
  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))
  var rootScope, contentService, scope, $state, $q, deferred, player

  beforeEach(inject(function ($rootScope, _$state_, _$q_, $controller) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    $state = _$state_
    $q = _$q_
    deferred = _$q_.defer()
    player = new $controller('resourceCtrl', {$scope: scope, $rootScope: rootScope})
  }))

  it('should play content', function () {
    spyOn(player, 'playContent').and.callThrough()
    var item = {
      identifier: 'do_211321312312313132',
      name: 'name'
    }
    player.playContent(item)
  })

  it('should open course view', function () {
    spyOn(player, 'openCourseView').and.callThrough()
    var item = {
      identifier: 'do_211321312312313132',
      name: 'name',
      total: 1,
      id: 12,
      courseId: 1
    }
    player.openCourseView(item, 'sdfsd')
  })
})
