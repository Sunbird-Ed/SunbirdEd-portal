/**
 * name: ContentEditorController.js
 * author: Anuj Gupta
 * Date: 27-09-2017
 */
'use strict'

describe('Controller:ContentEditorController', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  var contentService,
    scope,
    rootScope,
    contentEditor,
    $q,
    deferred,
    timeout,
    stateParams = {state: 'WorkSpace.UpForReviewContent', contentId: 'do_212345409736458240151' },
    getContentData = testData.contentEditor

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new(),
      $stateParams: stateParams
    })
  }))

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $controller, _contentService_, _$q_, _$timeout_) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    contentService = _contentService_
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()
    rootScope.orgLogo = 'imageFilePath'

    contentEditor = $controller('ContentEditorController', {
      $rootScope: rootScope,
      $scope: scope,
      contentService: contentService,
      $stateParams: stateParams
    })
  }))

  function ddispatchEvent (event) {
    document.dispatchEvent(event)
  }

  describe('get content', function () {
    it('Should called get content service', function () {
      spyOn(contentService, 'getById').and.callThrough()
      contentService.getById({contentId: stateParams.contentId})
      expect(contentService.getById).toBeDefined()
    })

    it('Success', function (done) {
      spyOn(contentService, 'getById').and.returnValue(deferred.promise)
      deferred.resolve(getContentData.getContentSuccess)
      spyOn(contentEditor, 'getContentData').and.callThrough()
      contentEditor.getContentData()
      scope.$apply()
      var response = contentService.getById().$$state.value
      expect(response).not.toBe(undefined)
      done()
    })

    it('Success live content', function (done) {
      stateParams.state = 'WorkSpace.PublishedContent'
      rootScope.userId = 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
      spyOn(contentService, 'getById').and.returnValue(deferred.promise)
      deferred.resolve(getContentData.livecontentData)
      spyOn(contentEditor, 'getContentData').and.callThrough()
      contentEditor.getContentData()
      scope.$apply()
      var response = contentService.getById().$$state.value
      expect(response).not.toBe(undefined)
      done()
    })

    it('Success review content', function (done) {
      stateParams.state = ''
      rootScope.userId = 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
      spyOn(contentService, 'getById').and.returnValue(deferred.promise)
      deferred.resolve(getContentData.reviewcontentData)
      spyOn(contentEditor, 'getContentData').and.callThrough()
      contentEditor.getContentData()
      scope.$apply()
      var response = contentService.getById().$$state.value
      expect(response).not.toBe(undefined)
      done()
    })

    it('Content access error', function (done) {
      stateParams.state = ''
      rootScope.userId = ''
      spyOn(contentService, 'getById').and.returnValue(deferred.promise)
      deferred.resolve(getContentData.reviewcontentData)
      spyOn(contentEditor, 'getContentData').and.callThrough()
      contentEditor.getContentData()
      scope.$apply()
      var response = contentService.getById().$$state.value
      expect(response).not.toBe(undefined)
      done()
    })

    it('Content access error due to invalid mime type', function (done) {
      stateParams.state = ''
      rootScope.userId = ''
      spyOn(contentService, 'getById').and.returnValue(deferred.promise)
      deferred.resolve(getContentData.courseContentData)
      spyOn(contentEditor, 'getContentData').and.callThrough()
      contentEditor.getContentData()
      scope.$apply()
      var response = contentService.getById().$$state.value
      expect(response).not.toBe(undefined)
      done()
    })

    it('Failed due to invalid content id', function () {
      spyOn(contentService, 'getById').and.returnValue(deferred.promise)
      deferred.resolve(getContentData.getContentFailed)
      spyOn(contentEditor, 'getContentData').and.callThrough()
      contentEditor.getContentData()
      scope.$apply()
      var response = contentService.getById().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('Failed due to external error', function () {
      spyOn(contentService, 'getById').and.returnValue(deferred.promise)
      deferred.reject({})
      spyOn(contentEditor, 'getContentData').and.callThrough()
      contentEditor.getContentData()
      scope.$apply()
      var response = contentService.getById().$$state.value
      expect(response).not.toBe(undefined)
    })
  })

  it('Should dispatch editor close event without state value', function () {
    org.sunbird.portal.eventManager.dispatchEvent('sunbird:portal:editor:close')
  })

  it('Should dispatch editor close event with state value', function () {
    stateParams.state = 'WorkSpace.PublishedContent'
    org.sunbird.portal.eventManager.dispatchEvent('sunbird:portal:editor:close')
  })

  it('Should dispatch content review event without state value', function () {
    stateParams.state = ''
    org.sunbird.portal.eventManager.dispatchEvent('sunbird:portal:content:review')
  })

  it('Should dispatch content review event with state value', function () {
    stateParams.state = 'WorkSpace.PublishedContent'
    org.sunbird.portal.eventManager.dispatchEvent('sunbird:portal:content:review')
  })

  it('Should open model with state', function () {
    spyOn(contentEditor, 'openModel').and.callThrough()
    contentEditor.openModel()
    timeout.flush(2000)
  })

  it('Should open model without state', function () {
    stateParams.state = ''
    spyOn(contentEditor, 'openModel').and.callThrough()
    contentEditor.openModel()
    timeout.flush(2000)
  })
})
