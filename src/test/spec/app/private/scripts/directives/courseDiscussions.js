/**
 * name: courseDiscussions.js
 * author: Anuj Gupta
 * Date: 11-10-2017
 */

'use strict'

describe('Directive: courseDiscussions', function () {
    // load the main module
  beforeEach(module('playerApp'))

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  var element, manualCompiledElement, compile, templateCache, scope,
    fileName = 'views/course/courseDiscussions.html'

  beforeEach(inject(function ($rootScope, $templateCache, $compile) {
    scope = $rootScope.$new()
    $templateCache.put(fileName, '<div>course discussions</div>')
    compile = $compile
    templateCache = $templateCache
  }))

  it('initialize course discussions directive', function () {
    element = compile('<course-discussions showaskquestion=false></course-discussions>')(scope)
    manualCompiledElement = angular.element(templateCache.get(fileName))
    scope.$digest()
    expect(element.text()).toContain('course discussions')
  })
})
