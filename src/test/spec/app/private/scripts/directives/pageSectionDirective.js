/**
 * name: pageSectionDirective.js
 * author: Anuj Gupta
 * Date: 13-10-2017
 */

'use strict'

describe('Directive: pageSectionDirective', function () {
  // load the main module
  beforeEach(module('playerApp'))

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  var element, compile, templateCache, scope,
    fileName = 'views/common/pageSection.html'

  beforeEach(inject(function ($rootScope, $templateCache, $compile) {
    scope = $rootScope.$new()
    $templateCache.put(fileName, '<div>Page Section</div>')
    compile = $compile
    templateCache = $templateCache
  }))

  it('Initialize page section directiove for course', function () {
    element = compile(' <page-section type=\'course\'></page-section>')(scope)
    scope.$digest()
    expect(element.text()).toContain('Page Section')
  })
})
