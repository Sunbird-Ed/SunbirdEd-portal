/**
 * name: contentFlagController.js
 * author: Anuj Gupta
 * Date: 05-10-2017
 */

'use strict'

describe('Controller: contentFlagController', function () {
  // load the controller's module
  beforeEach(module('playerApp'))
  var contentService,
    scope,
    rootScope,
    contentFlagCtrl,
    $q,
    deferred,
    timeout,
    contentFlagTestData = testData.contentFlag

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
    rootScope.search = {}
    scope.redirectUrl = 'Content'
    contentFlagCtrl = $controller('contentFlagController', {
      $rootScope: rootScope,
      $scope: scope,
      contentService: contentService,
      $state: $state
    })
  }))

  it('Should not show content flag modal ', function () {
    expect(contentFlagCtrl.showContentFlagModal).toBe(false)
  })

  it('Initialize content flag modal ', function () {
    spyOn(contentFlagCtrl, 'initializeModal').and.callThrough()
    contentFlagCtrl.initializeModal()
    expect(contentFlagCtrl.showContentFlagModal).toBe(true)
    timeout.flush(10)
  })

  describe('Create flag', function () {
    it('Should called get content service', function () {
      spyOn(contentService, 'flag').and.callThrough()
      contentService.flag({request: {}}, 'do_2123347975635599361299')
      expect(contentService.flag).toBeDefined()
    })

    it('Success', function (done) {
      var data = {flagReasons: ['Reason'], comment: ['Comment']}
      rootScope.search.searchKeyword = 'some value'
      spyOn(contentService, 'flag').and.returnValue(deferred.promise)
      deferred.resolve(contentFlagTestData.successResp)
      spyOn(contentFlagCtrl, 'saveMetaData').and.callThrough()
      contentFlagCtrl.saveMetaData(data)
      scope.$apply()
      timeout.flush()
      var response = contentService.flag().$$state.value
      expect(response.responseCode).toBe('OK')
      done()
    })

    it('Success without searchkeyword', function (done) {
      var data = {flagReasons: ['Reason'], comment: ['Comment']}
      rootScope.search.searchKeyword = ''
      spyOn(contentService, 'flag').and.returnValue(deferred.promise)
      deferred.resolve(contentFlagTestData.successResp)
      spyOn(contentFlagCtrl, 'saveMetaData').and.callThrough()
      contentFlagCtrl.saveMetaData(data)
      scope.$apply()
      timeout.flush()
      var response = contentService.flag().$$state.value
      expect(response.responseCode).toBe('OK')
      done()
    })

    it('Failed due to invalid content id', function () {
      var data = {flagReasons: ['Reason'], comment: ['Comment']}
      rootScope.search = {}
      spyOn(contentService, 'flag').and.returnValue(deferred.promise)
      deferred.resolve(contentFlagTestData.failedResp)
      spyOn(contentFlagCtrl, 'saveMetaData').and.callThrough()
      contentFlagCtrl.saveMetaData(data)
      scope.$apply()
      var response = contentService.flag().$$state.value
      expect(response.responseCode).toBe('RESOURCE_NOT_FOUND')
    })

    it('Failed due to external error', function () {
      var data = {flagReasons: ['Reason'], comment: ['Comment']}
      spyOn(contentService, 'flag').and.returnValue(deferred.promise)
      deferred.reject({})
      spyOn(contentFlagCtrl, 'saveMetaData').and.callThrough()
      contentFlagCtrl.saveMetaData(data)
      scope.$apply()
      var response = contentService.flag().$$state.value
      expect(response).not.toBe(undefined)
    })
  })
})
