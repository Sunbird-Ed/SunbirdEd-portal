
'use strict'

describe('Directive: userSearch', function () {
  beforeEach(module('playerApp'))
  var element // eslint-disable-line no-unused-vars
  var compile
  var templateCache // eslint-disable-line no-unused-vars
  var scope
  var fileName = 'views/search/userSearch.html'

  beforeEach(inject(function ($rootScope, $templateCache, $compile) {
    scope = $rootScope.$new()
    $templateCache.put(fileName, '<div>user search</div>')
    compile = $compile
    templateCache = $templateCache
  }))

  it('should show loader', function (done) {
    scope.visibilty = true
    var ele = '<user-search></user-search>'

    element = compile(ele)(scope)
    scope.$digest()
    done()
  })
})
