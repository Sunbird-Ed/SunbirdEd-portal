/**
 * name: profileBadgeDirective.js
 * author: Anuj Gupta
 * Date: 14-03-2018
 */

'use strict'

describe('Directive: profileBadge', function () {
  // load the main module
  beforeEach(module('playerApp'))

  var fileName = 'views/badge/profileBadge.html'

  var element, compile, scope

  beforeEach(inject(function ($rootScope, $controller, $templateCache, $compile) {
    scope = $rootScope.$new()
    $templateCache.put(fileName, '<div>profile badge</div>')
    compile = $compile
  }))

  it('check profile badge directive initialized ', function () {
    element = compile('<profile-badge contentid="12334" type="textbook"></profile-badge>')(scope)
    scope.$digest()
    expect(element.text()).toContain('profile badge')
  })
})
