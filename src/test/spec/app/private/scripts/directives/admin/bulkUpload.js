
'use strict'

describe('Directive: bulkUpload', function () {
  beforeEach(module('playerApp'))
  var element
  var compile
  var templateCache
  var scope
  var fileName = 'views/admin/uploadFile.html'

  beforeEach(inject(function ($rootScope, $templateCache, $compile) {
    scope = $rootScope.$new()
    $templateCache.put(fileName, '<div>bulk upload</div>')
    compile = $compile
    templateCache = $templateCache
  }))

  it('should show loader', function (done) {
    scope.visibilty = true
    var ele = '<bulk-upload ></bulk-upload>'

    element = compile(ele)(scope)
    scope.$digest()
    done()
  })
})
