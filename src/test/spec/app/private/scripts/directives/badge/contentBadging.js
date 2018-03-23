/**
 * name: contentBadgeDirective.js
 * author: Anuj Gupta
 * Date: 14-03-2018
 */

'use strict'

describe('Directive: contentBadge', function () {
  // load the main module
  beforeEach(module('playerApp'))

  var fileName = 'views/badge/contentBadge.html'

  var element, compile, scope

  beforeEach(inject(function ($rootScope, $controller, $templateCache, $compile) {
    scope = $rootScope.$new()
    $templateCache.put(fileName, '<div>content badge</div>')
    compile = $compile
  }))

  it('check content badge directive initialized ', function () {
    element = compile('<content-badge contentid="12334" type="textbook"></content-badge>')(scope)
    scope.$digest()
    expect(element.text()).toContain('content badge')
  })
})
