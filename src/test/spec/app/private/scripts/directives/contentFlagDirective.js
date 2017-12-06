/**
 * name: contentFlagDirective.js
 * author: Anuj Gupta
 * Date: 11-10-2017
 */

'use strict'

describe('Directive: contentFlag', function () {
  // load the main module
  beforeEach(module('playerApp'))

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  var element, manualCompiledElement, compile, templateCache, scope, ctrl,
    fileName = 'views/common/contentFlagModal.html'

  beforeEach(inject(function ($rootScope, $controller, $templateCache, $compile) {
    scope = $rootScope.$new()
    ctrl = $controller('contentFlagController', {$scope: scope, $element: null})
    $templateCache.put(fileName, '<div>Content flag</div>')
    compile = $compile
    templateCache = $templateCache
  }))

  it('Should show the content flag model', function () {
    element = compile('<content-flag type="course" contentid="toc.courseId" contentname="toc.courseHierarchy.name" versionkey="toc.courseHierarchy.versionKey" redirect=" "Courses" "></content-flag>')(scope)
    manualCompiledElement = angular.element(templateCache.get(fileName))
    scope.$digest()
    expect(element.text()).toContain('Content flag')
    ctrl.initializeModal()
    expect(ctrl.showContentFlagModal).toBe(true)
  })
})
