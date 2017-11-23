/**
 * name: applyScripts.js
 * author: Aprajita
 * Date: 9-11-2017
 */

'use strict'

describe('Directive: applyScript', function () {
    // load the directive's module
  beforeEach(module('playerApp'))

  var element, ctrl, compile, templateCache, scope, timeout

  beforeEach(function () {
    setFixtures('<div class="ui calendar" id="rangestart"></div>')
  })

  beforeEach(inject(function ($rootScope, $templateCache, $compile, _$timeout_) {
    scope = $rootScope.$new()
    scope.$last
    timeout = _$timeout_
    $templateCache.put('views/header/courseFilter.html', '<div>Slick</div>')
    compile = $compile
    templateCache = $templateCache
  }))

  it('link to slick', function (done) {
    scope.visibility = true
    scope.isclose = true
    scope.$last = true
    element = compile('<div apply-script class="ui inline dropdown search-dropdown"></div>')(scope)
    timeout.flush(0)
    scope.$digest()
    done()
  })

  it('should call afterChange', function () {
    scope.visibility = true
    scope.isclose = true
    scope.$last = true
    var slick = {'slideCount': '8'}
    var currentSlide = '10'
    var event = 'click'
    element = compile('<div apply-script class="ui inline dropdown search-dropdown"></div>')(scope)
    scope.$digest()
    // do whatever triggers the "$emit" call
    // expect(scope.emit).toBeDefined()
  })
})
