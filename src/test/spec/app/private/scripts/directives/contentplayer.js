/**
 * name: contentFlagDirective.js
 * author: Anuj Gupta
 * Date: 10-10-2017
 */

'use strict'

describe('Directive: contentPlayer', function () {
    // load the directive's module
  beforeEach(module('playerApp'))

  var element, ctrl, compile, templateCache, contentService,
    scope

  beforeEach(inject(function ($rootScope, $controller, $templateCache, $compile, _contentService_) {
    scope = $rootScope.$new()
    contentService = _contentService_

    ctrl = $controller('contentPlayerCtrl', {$scope: scope, $element: null, contentService: contentService})
    $templateCache.put('views/contentplayer/player.html', '<div>Content</div>')
    compile = $compile
    templateCache = $templateCache
  }))

  it('Initialize content player with body', function () {
    scope.body = {name: 'name'}
    scope.visibility = true
    scope.isclose = true
    element = compile('<content-player visibility="visibility" body="body" isclose="isclose" height="700" width="1000"></content-player>')(scope)
    scope.$digest()
    expect(element.text()).toContain('Content')
  })

  it('Initialize content player with body and percentage', function () {
    scope.body = {name: 'name'}
    scope.visibility = true
    scope.isclose = true
    element = compile('<content-player visibility="visibility" body="body" isclose="isclose" ispercentage=true height="700" width="1000"></content-player>')(scope)
    scope.$digest()
    expect(element.text()).toContain('Content')
  })

  it('Initialize content player with id', function () {
    scope.id = 'do_123221'
    scope.visibility = true
    scope.isclose = true
    element = compile('<content-player visibility="visibility" id="id" isclose="isclose" height="700" width="1000"></content-player>')(scope)
    scope.$digest()
    expect(element.text()).toContain('Content')
  })
})
