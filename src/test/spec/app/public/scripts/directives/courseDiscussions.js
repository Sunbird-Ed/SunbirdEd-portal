/**
 * name: courseDiscussions.js
 * author: Anuj Gupta
 * Date: 11-10-2017
 */

'use strict'

describe('Directive: courseDiscussion', function () {
  // load the main module
  beforeEach(module('loginApp'))

  var element, compile, templateCache, scope,
    fileName = 'views/course/courseDiscussions.html'

  beforeEach(inject(function ($rootScope, $templateCache, $compile) {
    scope = $rootScope.$new()
    $templateCache.put(fileName, '<div>course discussions</div>')
    compile = $compile
    templateCache = $templateCache
  }))

  it('initialize course discussions directive', function () {
    element = compile('<course-discussions showaskquestion=true></course-discussions>')(scope)
    scope.$digest()
    expect(element.text()).toContain('course discussions')
  })
})
