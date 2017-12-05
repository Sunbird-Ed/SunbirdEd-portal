/**
 * name: noteCardDirective.js
 * author: Anuj Gupta
 * Date: 11-10-2017
 */

'use strict'

describe('Directive: noteCard', function () {
    // load the main module
  beforeEach(module('playerApp'))

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  var element, manualCompiledElement, compile, templateCache, scope, ctrl,
    fileName = 'views/note/noteCard.html'

  beforeEach(inject(function ($rootScope, $controller, $templateCache, $compile) {
    scope = $rootScope.$new()
    ctrl = $controller('NoteCardCtrl', {$scope: scope, $element: null})
    $templateCache.put(fileName, '<div>note card</div>')
    compile = $compile
    templateCache = $templateCache
  }))

  it('should show add note model', function () {
    element = compile('<note-card courseid=toc.courseId></note-card>')(scope)
    manualCompiledElement = angular.element(templateCache.get(fileName))
    scope.$digest()
    ctrl.openAddImageModal()
    expect(ctrl.showAddImageModal).toBe(true)
    expect(element.text()).toContain('note card')
  })
})
