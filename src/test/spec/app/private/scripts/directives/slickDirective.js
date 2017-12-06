/**
 * name: slickDirective.js
 * author: Aprajita
 * Date: 9-11-2017
 */

'use strict'

describe('Directive: Slick', function () {
  // load the directive's module
  beforeEach(module('playerApp'))

  var element, ctrl, compile, templateCache, scope, timeout, mockEvent

  beforeEach(inject(function ($rootScope, $templateCache, $compile, _$timeout_) {
    scope = $rootScope.$new()
    scope.$last
    timeout = _$timeout_
    $templateCache.put('views/common/pageSection.html', '<div>Slick</div>')
    compile = $compile
    templateCache = $templateCache
  }))

  it('link to slick', function (done) {
    scope.visibility = true
    scope.isclose = true
    scope.$last = true
    element = compile('<div add-slick ng-init="$last && $root.loadProgress()"></div>')(scope)
    scope.$digest()
    done()
  })

  it('should call afterChange', function () {
    scope.visibility = true
    scope.isclose = true
    scope.$last = true
    var slick = {'slideCount': '8'}
    var currentSlide = '10'
    var events = {
      type: 'on',
      afterChange: function (event, slick, currentSlide) {}
    }
    var spy = spyOn(events, 'afterChange')
    events.afterChange('click', slick, currentSlide)
    $('.slick-initialized').trigger(events)
    element = compile('<div add-slick ng-init="$last && $root.loadProgress()"></div>')(scope)
    expect(spy).toHaveBeenCalled()
  })
})
