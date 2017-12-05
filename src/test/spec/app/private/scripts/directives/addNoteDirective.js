/**
 * name: contentFlagDirective.js
 * author: Anuj Gupta
 * Date: 11-10-2017
 */

'use strict'

describe('Directive: addNoteDirective', function () {
    // load the main module
  beforeEach(module('playerApp'))

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  var element, manualCompiledElement, compile, templateCache, scope, ctrl,
    fileName = 'views/note/noteAddCardModal.html'

  beforeEach(inject(function ($rootScope, $controller, $templateCache, $compile) {
    scope = $rootScope.$new()
    ctrl = $controller('NoteCardCtrl', {$scope: scope, $element: null})
    $templateCache.put(fileName, '<div>Add note</div>')
    compile = $compile
    templateCache = $templateCache
  }))

  it('should show add note model', function () {
    element = compile('<add-note shownoteinlecture="true" visibility="true" courseid="toc.courseId" contentid="contentPlayer.contentData.identifier"></add-note>')(scope)
    manualCompiledElement = angular.element(templateCache.get(fileName))
    scope.$digest()
    ctrl.openAddImageModal()
    expect(ctrl.showAddImageModal).toBe(true)
    expect(element.text()).toContain('Add note')
  })
})
