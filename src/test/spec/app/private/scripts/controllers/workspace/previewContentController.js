/**
 * name: PreviewContentController.js
 * author: Anuj Gupta
 * Date: 27-09-2017
 */
'use strict'

describe('Controller:PreviewContentController', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  var contentService,
    scope,
    rootScope,
    previewContent,
    $q,
    deferred,
    timeout,
    stateParams = { backState: 'WorkSpace.UpForReviewContent', contentId: 'do_212345409736458240151' },
    previewContentTestData = testData.previewContent

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

    previewContent = $controller('PreviewContentController', {
      $rootScope: rootScope,
      $scope: scope,
      contentService: contentService,
      $stateParams: stateParams
    })
  }))

  describe('get content', function () {
    it('Should called get content service', function () {
      spyOn(contentService, 'getById').and.callThrough()
      contentService.getById({contentId: stateParams.contentId})
      expect(contentService.getById).toBeDefined()
    })

    it('Success', function (done) {
      spyOn(contentService, 'getById').and.returnValue(deferred.promise)
      deferred.resolve(previewContentTestData.getContentSuccess)
      spyOn(previewContent, 'getContent').and.callThrough()
      previewContent.getContent(stateParams.contentId)
      scope.$apply()
      var response = contentService.getById().$$state.value
      expect(response).not.toBe(undefined)
      done()
    })

    it('Success live content', function () {
      stateParams.backState = 'WorkSpace.PublishedContent'
      rootScope.userId = 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
      spyOn(contentService, 'getById').and.returnValue(deferred.promise)
      deferred.resolve(previewContentTestData.livecontentData)
      spyOn(previewContent, 'getContent').and.callThrough()
      previewContent.getContent(stateParams.contentId)
      scope.$apply()
      var response = contentService.getById().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('Success review content', function () {
      stateParams.backState = ''
      rootScope.userId = 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
      spyOn(contentService, 'getById').and.returnValue(deferred.promise)
      deferred.resolve(previewContentTestData.reviewcontentData)
      spyOn(previewContent, 'getContent').and.callThrough()
      previewContent.getContent(stateParams.contentId)
      scope.$apply()
      var response = contentService.getById().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('Content access error', function () {
      stateParams.backState = ''
      rootScope.userId = ''
      spyOn(contentService, 'getById').and.returnValue(deferred.promise)
      deferred.resolve(previewContentTestData.reviewcontentData)
      spyOn(previewContent, 'getContent').and.callThrough()
      previewContent.getContent(stateParams.contentId)
      scope.$apply()
      var response = contentService.getById().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('Content access error due to invalid mime type', function () {
      stateParams.backState = ''
      rootScope.userId = ''
      spyOn(contentService, 'getById').and.returnValue(deferred.promise)
      deferred.resolve(previewContentTestData.courseContentData)
      spyOn(previewContent, 'getContent').and.callThrough()
      previewContent.getContent(stateParams.contentId)
      scope.$apply()
      var response = contentService.getById().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('Failed due to invalid content id', function () {
      spyOn(contentService, 'getById').and.returnValue(deferred.promise)
      deferred.resolve(previewContentTestData.getContentFailed)
      spyOn(previewContent, 'getContent').and.callThrough()
      previewContent.getContent(stateParams.contentId)
      scope.$apply()
      var response = contentService.getById().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('Failed due to external error', function () {
      spyOn(contentService, 'getById').and.returnValue(deferred.promise)
      deferred.reject({})
      spyOn(previewContent, 'getContent').and.callThrough()
      previewContent.getContent(stateParams.contentId)
      scope.$apply()
      var response = contentService.getById().$$state.value
      expect(response).not.toBe(undefined)
    })
  })

  describe('Published content', function () {
    it('Should called publish content service', function () {
      spyOn(contentService, 'publish').and.callThrough()
      contentService.publish({}, stateParams.contentId)
      expect(contentService.publish).toBeDefined()
    })

    it('Success', function () {
      spyOn(contentService, 'publish').and.returnValue(deferred.promise)
      deferred.resolve(previewContentTestData.publishSuccessResp)
      spyOn(previewContent, 'publishContent').and.callThrough()
      previewContent.publishContent()
      scope.$apply()
      var response = contentService.publish().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('Failed due to invalid content id', function () {
      spyOn(contentService, 'publish').and.returnValue(deferred.promise)
      deferred.resolve(previewContentTestData.publishFailedResp)
      spyOn(previewContent, 'publishContent').and.callThrough()
      previewContent.publishContent()
      scope.$apply()
      var response = contentService.publish().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('Failed due to external error', function () {
      spyOn(contentService, 'publish').and.returnValue(deferred.promise)
      deferred.reject({})
      spyOn(previewContent, 'publishContent').and.callThrough()
      previewContent.publishContent()
      scope.$apply()
      var response = contentService.publish().$$state.value
      expect(response).not.toBe(undefined)
    })
  })

  describe('Reject content', function () {
    it('Should called reject content service', function () {
      spyOn(contentService, 'reject').and.callThrough()
      contentService.reject({}, stateParams.contentId)
      expect(contentService.reject).toBeDefined()
    })

    it('Success', function () {
      spyOn(contentService, 'reject').and.returnValue(deferred.promise)
      deferred.resolve(previewContentTestData.rejectSuccessResp)
      spyOn(previewContent, 'rejectContent').and.callThrough()
      previewContent.rejectContent()
      scope.$apply()
      var response = contentService.reject().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('Failed due to invalid content id', function () {
      spyOn(contentService, 'reject').and.returnValue(deferred.promise)
      deferred.resolve(previewContentTestData.rejectFailedResp)
      spyOn(previewContent, 'rejectContent').and.callThrough()
      previewContent.rejectContent()
      scope.$apply()
      var response = contentService.reject().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('Failed due to external error', function () {
      spyOn(contentService, 'reject').and.returnValue(deferred.promise)
      deferred.reject({})
      spyOn(previewContent, 'rejectContent').and.callThrough()
      previewContent.rejectContent()
      scope.$apply()
      var response = contentService.reject().$$state.value
      expect(response).not.toBe(undefined)
    })
  })

  describe('Delete content', function () {
    it('Success', function () {
      spyOn(contentService, 'retire').and.returnValue(deferred.promise)
      deferred.resolve(previewContentTestData.deleteSuccessResp)
      spyOn(previewContent, 'deleteContent').and.callThrough()
      previewContent.deleteContent()
      timeout.flush(2000)
      scope.$apply()
      var response = contentService.retire().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('Failed due to invalid content id', function () {
      spyOn(contentService, 'retire').and.returnValue(deferred.promise)
      deferred.resolve(previewContentTestData.deleteFailedResp)
      spyOn(previewContent, 'deleteContent').and.callThrough()
      previewContent.deleteContent()
      scope.$apply()
      var response = contentService.retire().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('Failed due to external error', function () {
      spyOn(contentService, 'retire').and.returnValue(deferred.promise)
      deferred.reject({})
      spyOn(previewContent, 'deleteContent').and.callThrough()
      previewContent.deleteContent()
      scope.$apply()
      var response = contentService.retire().$$state.value
      expect(response).not.toBe(undefined)
    })
  })

  describe('Accept content flag', function () {
    var request = {
      'versionKey': '150167687998'
    }

    it('Should called accept content flag service', function () {
      spyOn(contentService, 'acceptContentFlag').and.callThrough()
      contentService.acceptContentFlag(request, stateParams.contentId)
      expect(contentService.acceptContentFlag).toBeDefined()
    })

    it('Success', function () {
      spyOn(contentService, 'acceptContentFlag').and.returnValue(deferred.promise)
      deferred.resolve(previewContentTestData.acceptFlagSuccessResp)
      spyOn(previewContent, 'acceptContentFlag').and.callThrough()
      previewContent.acceptContentFlag(request)
      scope.$apply()
      var response = contentService.acceptContentFlag().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('Failed due to invalid content id', function () {
      spyOn(contentService, 'acceptContentFlag').and.returnValue(deferred.promise)
      deferred.resolve(previewContentTestData.acceptFlagFailedResp)
      spyOn(previewContent, 'acceptContentFlag').and.callThrough()
      previewContent.acceptContentFlag(request)
      scope.$apply()
      var response = contentService.acceptContentFlag().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('Failed due to external error', function () {
      spyOn(contentService, 'acceptContentFlag').and.returnValue(deferred.promise)
      deferred.reject({})
      spyOn(previewContent, 'acceptContentFlag').and.callThrough()
      previewContent.acceptContentFlag(request)
      scope.$apply()
      var response = contentService.acceptContentFlag().$$state.value
      expect(response).not.toBe(undefined)
    })
  })

  describe('Discard content flag', function () {
    var request = {
      'versionKey': '150167687998'
    }

    it('Should called accept content flag service', function () {
      spyOn(contentService, 'discardContentFlag').and.callThrough()
      contentService.discardContentFlag(request, stateParams.contentId)
      expect(contentService.discardContentFlag).toBeDefined()
    })

    it('Success', function () {
      spyOn(contentService, 'discardContentFlag').and.returnValue(deferred.promise)
      deferred.resolve(previewContentTestData.discardFlagSuccessResp)
      spyOn(previewContent, 'discardContentFlag').and.callThrough()
      previewContent.discardContentFlag(request)
      scope.$apply()
      var response = contentService.discardContentFlag().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('Failed due to invalid content id', function () {
      spyOn(contentService, 'discardContentFlag').and.returnValue(deferred.promise)
      deferred.resolve(previewContentTestData.discardFlagFailedResp)
      spyOn(previewContent, 'discardContentFlag').and.callThrough()
      previewContent.discardContentFlag(request)
      scope.$apply()
      var response = contentService.discardContentFlag().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('Failed due to external error', function () {
      spyOn(contentService, 'discardContentFlag').and.returnValue(deferred.promise)
      deferred.reject({})
      spyOn(previewContent, 'discardContentFlag').and.callThrough()
      previewContent.discardContentFlag(request)
      scope.$apply()
      var response = contentService.discardContentFlag().$$state.value
      expect(response).not.toBe(undefined)
    })
  })

  it('Should get content names', function () {
    var concepts = [
      'LO17',
      'LO17'

    ]
    spyOn(previewContent, 'getConceptsNames').and.callThrough()
    previewContent.getConceptsNames(concepts)
  })
})
