/**
 * name: appLoader.js
 * author: Anuj Gupta
 * Date: 12-10-2017
 */

'use strict'

describe('Directive: appLoader', function () {
  // load the main module
  beforeEach(module('loginApp'))

  var element, compile, templateCache, scope,
    fileName = 'views/errorhandler/loaderWithMessage.html'

  beforeEach(inject(function ($rootScope, $templateCache, $compile) {
    scope = $rootScope.$new()
    $templateCache.put(fileName, '<div>app loader</div>')
    compile = $compile
    templateCache = $templateCache
  }))

  it('should show loader with default message', function (done) {
    var loader = {}
    var ele = '<app-loader></app-loader>'
    scope.loader = loader
    element = compile(ele)(scope)
    scope.$digest()
    done()
  })

  it('should show loader', function (done) {
    var loader = {}
    loader.headerMessage = 'Header Message'
    loader.loaderMessage = 'Loader Message'
    var ele = '<app-loader data="{{loader}}"></app-loader>'
    scope.loader = loader
    element = compile(ele)(scope)
    scope.$digest()
    done()
  })
})
