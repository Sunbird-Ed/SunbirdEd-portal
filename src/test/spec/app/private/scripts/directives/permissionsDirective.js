/**
 * name: permissionsDirective.js
 * author: Aprajita
 * Date: 8-11-2017
 */

'use strict'

describe('Directive: Permissions', function () {
  // load the directive's module
  beforeEach(module('playerApp'))

  var element, ctrl, compile, templateCache, permissionsService, scope, timeout

  beforeEach(inject(function ($rootScope, $templateCache, $compile, _permissionsService_, _$timeout_) {
    scope = $rootScope.$new()
    permissionsService = _permissionsService_
    timeout = _$timeout_
    $templateCache.put('views/workSpace/workSpaceSideBar.html', '<div>Permissions</div>')
    compile = $compile
    templateCache = $templateCache
  }))

  it('check role permission only', function (done) {
    scope.visibility = true
    scope.isclose = true
    element = compile('<a class="item" sb-permissions permission-only="CONTENT_CREATOR,CONTENT_CREATION,CONTENT_REVIEWER,CONTENT_REVIEW">conten creator</a>')(scope)
    scope.$digest()
    done()
    // expect(element.permissionsService()).toContain('Permissions')
  })

  it('check role permission', function (done) {
    scope.visibility = true
    scope.isclose = true
    element = compile('<a class="item" sb-permissions permission-except="CONTENT_REVIEW">conten review</a>')(scope)
    scope.$digest()
    done()
  })
})
