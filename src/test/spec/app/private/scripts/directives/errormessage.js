/**
 * name: errorMessage.js
 * author: Anuj Gupta
 * Date: 11-10-2017
 */

'use strict'

describe('Directive: errorMessage', function () {
    // load the main module
  beforeEach(module('playerApp'))

  var element, compile, templateCache, scope,
    fileName = 'views/common/errorPage.html'
  var error = {}
  error.showError = true
  error.isClose = true

  beforeEach(inject(function ($rootScope, $templateCache, $compile) {
    scope = $rootScope.$new()
    $templateCache.put(fileName, '<div>error page</div>')
    compile = $compile
    templateCache = $templateCache
  }))

  it('Show info message', function (done) {
    scope.visibilty = true
    error.messageType = 'info'
    error.message = 'Info message'
    var ele = '<error-message data="{{error}}" visibility=true></error-message>'
    scope.error = error
    element = compile(ele)(scope)
    scope.$digest()

    error.message = ''
    error.isClose = false
    scope.error = error
    element = compile(ele)(scope)
    scope.$digest()
    done()
  })

  it('Show warning message', function (done) {
    scope.visibilty = true
    error.messageType = 'warning'
    error.message = 'Warning message'
    var ele = '<error-message data="{{error}}" visibility=true></error-message>'
    scope.error = error
    element = compile(ele)(scope)
    scope.$digest()

    error.message = ''
    error.isClose = false
    scope.error = error
    element = compile(ele)(scope)
    scope.$digest()
    done()
  })

  it('Show error message', function (done) {
    scope.visibilty = true
    error.messageType = 'error'
    error.message = 'Error message'
    var ele = '<error-message data="{{error}}" visibility=true></error-message>'
    scope.error = error
    element = compile(ele)(scope)
    scope.$digest()

    error.message = ''
    error.isClose = false
    scope.error = error
    element = compile(ele)(scope)
    scope.$digest()
    done()
  })

  it('Show success message', function (done) {
    scope.visibilty = true
    error.messageType = 'success'
    error.message = 'Success message'
    var ele = '<error-message data="{{error}}" visibility=true></error-message>'
    scope.error = error
    element = compile(ele)(scope)
    scope.$digest()

    error.message = ''
    error.isClose = false
    scope.error = error
    element = compile(ele)(scope)
    scope.$digest()
    expect(element.text()).toContain('error page')
    done()
  })

  it('Show no-results message', function (done) {
    scope.visibilty = true
    error.messageType = 'no-results'
    error.message = 'No result message'
    var ele = '<error-message data="{{error}}" visibility=true></error-message>'
    scope.error = error
    element = compile(ele)(scope)
    scope.$digest()

    error.message = ''
    error.isClose = false
    scope.error = error
    element = compile(ele)(scope)
    scope.$digest()
    done()
  })

  xit('Close error message', function () {
    var ele = '<error-message data="{{error}}" visibility=true></error-message>'
    scope.error = error
    element = compile(ele)(scope)
    scope.$digest()
    console.log(scope)
    spyOn(scope, 'closeErrorMessage').and.callThrough()
    scope.closeErrorMessage()
    expect(scope.visibility).toBe(false)
  })
})
