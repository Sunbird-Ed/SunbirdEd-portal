/**
 * name: CollectionEditorController.js
 * author: Anuj Gupta
 * Date: 31-10-2017
 */

'use strict'

describe('Controller: CollectionEditorController', function () {
  // load the controller's module
  beforeEach(module('playerApp'))
  var contentService,
    scope,
    rootScope,
    ceController,
    $q,
    deferred,
    timeout,
    getContentData = testData.contentEditor,
    stateParams = {state: 'WorkSpace.UpForReviewContent', contentId: 'do_212345409736458240151', 'type': 'Course' },
    validateModal = {
      state: ['WorkSpace.UpForReviewContent', 'WorkSpace.ReviewContent',
        'WorkSpace.PublishedContent', 'WorkSpace.FlaggedContent', 'LimitedPublishedContent'],
      status: ['Review', 'Draft', 'Live', 'Flagged', 'Unlisted'],
      mimeType: 'application/vnd.ekstep.content-collection'
    }

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $controller, _contentService_, _$q_, _$timeout_, $state) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    contentService = _contentService_
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()

    ceController = $controller('CollectionEditorController', {
      $rootScope: rootScope,
      $scope: scope,
      contentService: contentService,
      $state: $state,
      $stateParams: stateParams
    })
  }))

  it('check modal is inilialized', function (done) {
    expect(ceController.openCollectionEditor).toBeDefined()
    timeout.flush(200)
    done()
  })

  it('Open textbook', function (done) {
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.resolve(testData.previewContent.getContentSuccess)
    ceController.id = 'do_2123463136997294081163'
    spyOn(ceController, 'openCollectionEditor').and.callThrough()
    ceController.openCollectionEditor({contentId: ceController.id, userId: 'adsfsdfsdfsd', type: 'Course'})
    scope.$apply()
    var response = contentService.getById().$$state.value
    expect(response.responseCode).toBe('OK')
    timeout.flush(100)
    done()
  })

  it('Open collection', function (done) {
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.resolve(testData.contentEditor.getContentSuccess)
    ceController.id = 'do_2123463136997294081163'
    spyOn(ceController, 'openCollectionEditor').and.callThrough()
    ceController.openCollectionEditor({contentId: ceController.id, userId: 'adsfsdfsdfsd', type: 'Collection'})
    scope.$apply()
    var response = contentService.getById().$$state.value
    expect(response.responseCode).toBe('OK')
    timeout.flush(100)
    done()
  })

  it('Open lessopn plan', function (done) {
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.resolve(testData.previewContent.getContentSuccess)
    ceController.id = 'do_2123463136997294081163'
    spyOn(ceController, 'openCollectionEditor').and.callThrough()
    ceController.openCollectionEditor({contentId: ceController.id, userId: 'adsfsdfsdfsd', type: 'LessonPlan'})
    scope.$apply()
    var response = contentService.getById().$$state.value
    expect(response.responseCode).toBe('OK')
    timeout.flush(100)
    done()
  })

  it('Open lessopn plan', function (done) {
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.resolve(testData.previewContent.getContentSuccess)
    ceController.id = 'do_2123463136997294081163'
    spyOn(ceController, 'openCollectionEditor').and.callThrough()
    ceController.openCollectionEditor({contentId: ceController.id, userId: 'adsfsdfsdfsd', type: 'TextBook'})
    scope.$apply()
    var response = contentService.getById().$$state.value
    expect(response.responseCode).toBe('OK')
    timeout.flush(100)
    done()
  })

  it('Success live content', function (done) {
    stateParams.state = 'WorkSpace.PublishedContent'
    rootScope.userId = 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.resolve(getContentData.livecontentData)
    spyOn(ceController, 'openCollectionEditor').and.callThrough()
    ceController.openCollectionEditor(stateParams)
    scope.$apply()
    var response = contentService.getById().$$state.value
    expect(response).not.toBe(undefined)
    done()
  })

  it('Success review content', function (done) {
    stateParams.state = 'WorkSpace.ReviewContent'
    rootScope.userId = 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.resolve(getContentData.reviewcontentData)
    spyOn(ceController, 'openCollectionEditor').and.callThrough()
    ceController.openCollectionEditor(stateParams)
    scope.$apply()
    var response = contentService.getById().$$state.value
    expect(response).not.toBe(undefined)
    done()
  })

  it('Success flagged content', function (done) {
    stateParams.state = 'WorkSpace.FlaggedContent'
    rootScope.userId = 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
    getContentData.reviewcontentData.status = 'Flagged'
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.resolve(getContentData.reviewcontentData)
    spyOn(ceController, 'openCollectionEditor').and.callThrough()
    ceController.openCollectionEditor(stateParams)
    scope.$apply()
    var response = contentService.getById().$$state.value
    expect(response).not.toBe(undefined)
    done()
  })

  it('Content access error', function (done) {
    stateParams.state = 'WorkSpace.FlaggedContent'
    rootScope.userId = ''
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.resolve(getContentData.reviewcontentData)
    spyOn(ceController, 'openCollectionEditor').and.callThrough()
    ceController.openCollectionEditor(stateParams)
    scope.$apply()
    var response = contentService.getById().$$state.value
    expect(response).not.toBe(undefined)
    done()
  })

  it('Content access error due to invalid mime type', function (done) {
    stateParams.state = 'WorkSpace.FlaggedContent'
    rootScope.userId = ''
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.resolve(getContentData.courseContentData)
    spyOn(ceController, 'openCollectionEditor').and.callThrough()
    ceController.openCollectionEditor(stateParams)
    scope.$apply()
    var response = contentService.getById().$$state.value
    expect(response).not.toBe(undefined)
    done()
  })

  it('Failed due to invalid content id', function (done) {
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.resolve(getContentData.getContentFailed)
    spyOn(ceController, 'openCollectionEditor').and.callThrough()
    ceController.openCollectionEditor(stateParams)
    scope.$apply()
    var response = contentService.getById().$$state.value
    expect(response).not.toBe(undefined)
    done()
  })

  it('Failed due to external error', function (done) {
    spyOn(contentService, 'getById').and.returnValue(deferred.promise)
    deferred.reject({})
    spyOn(ceController, 'openCollectionEditor').and.callThrough()
    ceController.openCollectionEditor(stateParams)
    scope.$apply()
    var response = contentService.getById().$$state.value
    expect(response).not.toBe(undefined)
    done()
  })

  it('Check status', function () {
    spyOn(ceController, 'validateRequest').and.callThrough()
    ceController.validateRequest({status: 'Live', userId: 'd5efd1ab-3cad-4034-8143-32c480f5cc9e', createdBy: 'd5efd1ab-3cad-4034-8143-32c480f5cc9e', state: 'WorkSpace.PublishedContent'}, validateModal)
    ceController.validateRequest({status: 'Review', userId: 'd5efd1ab-3cad-4034-8143-32c480f5cc9e', createdBy: 'd5efd1ab-3cad-4034-8143-32c480f5cc9e', state: 'WorkSpace.PublishedContent'}, validateModal)
    // ceController.validateRequest('flagged')
    // ceController.validateRequest('live')
  })

  it('Check status', function () {
    spyOn(ceController, 'updateModeAndStatus').and.callThrough()
    ceController.updateModeAndStatus('draft')
    ceController.updateModeAndStatus('review')
    ceController.updateModeAndStatus('flagged')
    ceController.updateModeAndStatus('live')
  })

  it('Should open model with state', function () {
    spyOn(ceController, 'openModel').and.callThrough()
    ceController.openModel()
    timeout.flush(2000)
  })

  it('Should open model without state', function () {
    stateParams.state = ''
    spyOn(ceController, 'openModel').and.callThrough()
    ceController.openModel()
    timeout.flush(2000)
  })
})
