/**
 * name: ContentPlayerController.js
 * author: Anuj Gupta
 * Date: 05-10-2017
 */

'use strict'

describe('Controller: contentPlayerCtrl', function () {
  // load the controller's module
  beforeEach(module('playerApp'))
  var contentService,
    scope,
    rootScope,
    contentPlayerController,
    $q,
    deferred,
    timeout

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $controller, _contentService_, _$q_, _$timeout_, $state, $templateCache) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    contentService = _contentService_
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()
    $templateCache.put('views/contentplayer/player.html', '<div>Content</div>')

    contentPlayerController = $controller('contentPlayerCtrl', {
      $rootScope: rootScope,
      $scope: scope,
      contentService: contentService,
      $state: $state
    })
  }))

  it('show detail should be false', function () {
    expect(scope.showModalInLectureView).toBe(true)
  })

  it('Update content with id', function () {
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.resolve(testData.previewContent.getContentSuccess)
    scope.id = 'do_2123463136997294081163'
    spyOn(scope, 'updateContent').and.callThrough()
    scope.updateContent(scope)
    scope.$apply()
    var response = contentService.getById().$$state.value
    expect(response.responseCode).toBe('OK')
  })

  it('Update content with id', function () {
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.resolve(testData.previewContent.getContentFailed)
    scope.id = 'do_2123463136997294081163'
    spyOn(scope, 'updateContent').and.callThrough()
    scope.updateContent(scope)
    scope.$apply()
    var response = contentService.getById().$$state.value
    expect(response.responseCode).toBe('RESOURCE_NOT_FOUND')
    timeout.flush(10)
  })

  it('Update content with body', function () {
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.resolve(testData.previewContent.getContentSuccess)
    scope.body = {identifier: 'do_2123463136997294081163'}
    spyOn(scope, 'updateContent').and.callThrough()
    scope.updateContent(scope)
    scope.$apply()
    var response = contentService.getById().$$state.value
    expect(response.responseCode).toBe('OK')
  })

  it('Call try again function', function (done) {
    scope.id = 'do_2123463136997294081163'
    spyOn(scope, 'tryAgain').and.callThrough()
    scope.tryAgain()
    done()
  })

  it('should return configuration object', function () {
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.resolve(testData.previewContent.getContentSuccess)
    spyOn(scope, 'getContentEditorConfig').and.callThrough()
    scope.id = 'do_2123463136997294081163'
    spyOn(scope, 'updateContent').and.callThrough()
    scope.updateContent(scope)
    scope.$apply()
    scope.getContentEditorConfig(testData.contentEditor.getContentSuccess)
  })

  it('Should get content names', function () {
    var concepts = [
      'LO17',
      'LO17'

    ]
    spyOn(scope, 'getConceptsNames').and.callThrough()
    scope.getConceptsNames(concepts)
  })

  it('Should get content names', function () {
    spyOn(scope, 'adjustPlayerHeight').and.callThrough()
    scope.adjustPlayerHeight()
  })

  it('Call close function', function (done) {
    var dummyElement = document.createElement('contentPlayer')
    // document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement)
    scope.closeurl = 'Content'
    scope.id = 'do_2123463136997294081163'
    rootScope.search = {}
    rootScope.search.searchKeyword = ''
    scope.body = {identifier: 'do_2123463136997294081163'}
    spyOn(scope, 'close').and.callThrough()
    scope.close()
    timeout.flush(0)
    done()
  })

  it('Call close function', function (done) {
    var dummyElement = document.createElement('contentPlayer')
    // document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement)
    scope.closeurl = 'Profile'
    scope.id = 'do_2123463136997294081163'
    rootScope.search = {}
    rootScope.search.searchKeyword = ''
    scope.body = {identifier: 'do_2123463136997294081163'}
    spyOn(scope, 'close').and.callThrough()
    scope.close()
    timeout.flush(0)
    done()
  })

  it('Call close function with search keyword', function () {
    scope.closeurl = 'Content'
    scope.id = 'do_2123463136997294081163'
    rootScope.search = {}
    rootScope.search.searchKeyword = 'some value'
    spyOn(scope, 'close').and.callThrough()
    scope.close()
    timeout.flush(0)
  })

  xit('Should called go to bottom', function () {
    spyOn(scope, 'gotoBottom').and.callThrough()
    scope.gotoBottom()
  })
})
