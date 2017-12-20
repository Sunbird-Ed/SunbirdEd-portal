/**
 * name: contentSharingDirective.js
 * author: Anuj Gupta
 * Date: 11-10-2017
 */

'use strict'

describe('Directive: contentShare', function () {
  // load the main module
  beforeEach(module('playerApp'))

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  var element, manualCompiledElement, compile, templateCache, scope, ctrl,
    fileName = 'views/common/contentSharing.html'

  beforeEach(inject(function ($rootScope, $controller, $templateCache, $compile) {
    scope = $rootScope.$new()
    ctrl = $controller('contentSharingController', {$scope: scope, $element: null})
    $templateCache.put(fileName, '<div>Content share</div>')
    compile = $compile
    templateCache = $templateCache
  }))

  it('Should show the content share model', function () {
    scope.type = 'course'
    element = compile('<content-share type=""course"" id="toc.courseId"></content-share>')(scope)
    manualCompiledElement = angular.element(templateCache.get(fileName))
    scope.$digest()
    expect(element.text()).toContain('Content share')
    ctrl.initializeModal()
    expect(ctrl.showContentShareModal).toBe(true)
  })
})
