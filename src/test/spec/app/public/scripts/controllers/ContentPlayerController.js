/**
 * name: ContentPlayerController.js
 * author: Anuj Gupta
 * Date: 05-10-2017
 */

'use strict'

describe('Controller: contentPlayerCtrl', function () {
  // load the controller's module
  beforeEach(module('loginApp'))
  var contentService,
    scope,
    rootScope,
    contentPlayerController,
    $q,
    deferred,
    timeout,
    element, compile, templateCache

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('loginCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $controller, _contentService_, _$q_, _$timeout_, $state, $templateCache, $compile) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    contentService = _contentService_
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()

    contentPlayerController = $controller('contentPlayerCtrl', {
      $rootScope: rootScope,
      $scope: scope,
      contentService: contentService,
      $state: $state,
      timeout: _$timeout_
    })
    $templateCache.put('views/contentplayer/player.html', '<div>Content</div>')
    compile = $compile
    templateCache = $templateCache
  }))

  it('Should called get content service', function () {
    spyOn(contentService, 'getById').and.callThrough()
    contentService.getById({contentId: 'do_2123463136997294081163'})
    expect(contentService.getById).toBeDefined()
  })

  it('Update content with id', function () {
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.resolve(testData.previewContent.getContentSuccess)
    scope.id = 'do_2123463136997294081163'
    spyOn(scope, 'init').and.callThrough()
    scope.init()
    scope.$apply()
    element = compile('<content-player visibility="visibility" body="body" isclose="isclose" height="700" width="1000"></content-player>')(scope)
    scope.$digest()
    var response = contentService.getById().$$state.value
    expect(response.responseCode).toBe('OK')
    // timeout.flush(2000);
  })

  it('Update content with id', function () {
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.resolve(testData.previewContent.getContentSuccess)
    scope.id = 'do_2123463136997294081163'
    spyOn(scope, 'init').and.callThrough()
    scope.init()
    scope.$apply()
    var response = contentService.getById().$$state.value
    expect(response.responseCode).toBe('OK')
  })

  it('Update content with id', function () {
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.resolve(testData.previewContent.getContentSuccess)
    scope.id = 'do_2123463136997294081163'
    spyOn(scope, 'init').and.callThrough()
    scope.init()
    scope.$apply()
    var response = contentService.getById().$$state.value
    expect(response.responseCode).toBe('OK')
  })

  it('Check share for collection', function () {
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    testData.previewContent.getContentSuccess.result.content.mimeType = 'application/vnd.ekstep.content-collection'
    deferred.resolve(testData.previewContent.getContentSuccess)
    scope.id = 'do_2123463136997294081163'
    spyOn(scope, 'init').and.callThrough()
    scope.init()
    scope.$apply()
    var response = contentService.getById().$$state.value
    expect(response.responseCode).toBe('OK')
  })

  it('Update content with id', function () {
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.resolve(testData.previewContent.getFailedResponse)
    scope.id = 'do_2123463136997294081163'
    spyOn(scope, 'init').and.callThrough()
    scope.init()
    scope.$apply()
    var response = contentService.getById().$$state.value
    // expect(response.responseCode).toBe('OK');
  })

  it('Update content with id', function () {
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.reject({})
    scope.id = 'do_2123463136997294081163'
    spyOn(scope, 'init').and.callThrough()
    scope.init()
    scope.$apply()
    var response = contentService.getById().$$state.value
    // expect(response.responseCode).toBe('OK');
  })

  it('Call close function', function () {
    scope.closeurl = 'Content'
    scope.id = 'do_2123463136997294081163'
    rootScope.search = {}
    rootScope.search.searchKeyword = ''
    scope.body = {identifier: 'do_2123463136997294081163'}
    spyOn(scope, 'close').and.callThrough()
    scope.close()
    timeout.flush(0)
  })

  it('should return configuration object', function () {
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.resolve(testData.previewContent.getContentSuccess)
    spyOn(scope, 'getContentEditorConfig').and.callThrough()
    scope.id = 'do_2123463136997294081163'
    spyOn(scope, 'init').and.callThrough()
    scope.init(scope)
    scope.$apply()
    scope.contentData = testData.previewContent.getContentSuccess.result.content
    var res = scope.getContentEditorConfig(testData.previewContent.getContentSuccess)
    expect(res.context).toBeDefined()
  })

  xit('Call close function with search keyword', function () {
    scope.closeurl = 'Content'
    scope.id = 'do_2123463136997294081163'
    rootScope.search = {}
    rootScope.search.searchKeyword = 'some value'
    spyOn(scope, 'close').and.callThrough()
    scope.close()
    timeout.flush(0)
  })

  it('Should get content names', function () {
    spyOn(scope, 'adjustPlayerHeight').and.callThrough()
    scope.adjustPlayerHeight()
  })
})
