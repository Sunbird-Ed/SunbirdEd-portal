/**
 * name: textBookController
 * author: Anuj Gupta
 * Date: 26-09-2017
 */

'use strict'

describe('Controller: TextBookController', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  var contentService,
    scope,
    rootScope,
    textBookController,
    $q,
    deferred,
    timeout,
    failedResponce = testData.createContent.failedResponce,
    successResponce = testData.createContent.successResponce

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
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

    textBookController = $controller('TextBookController', {
      $rootScope: rootScope,
      $scope: scope,
      contentService: contentService
    })
  }))

  it('Initialize model', function () {
    	spyOn(textBookController, 'initializeModal').and.callThrough()
    textBookController.initializeModal()
    expect(textBookController.showCreateTextBookModal).toBe(true)
    timeout.flush(10)
  })

  describe('Create textBook', function () {
    it('create service ', function () {
      var contentData = {
        content: {
                	name: 'test textBook'
        }
      }
      spyOn(contentService, 'create').and.callThrough()
      contentService.create(contentData)
      expect(contentService.create).toBeDefined()
    })

    it('success', function () {
      var contentData = {
        name: 'Test'
      }
      spyOn(contentService, 'create').and.returnValue(deferred.promise)
      deferred.resolve(successResponce)
      spyOn(textBookController, 'saveMetaData').and.callThrough()
      textBookController.saveMetaData(contentData)
      scope.$apply()
      var response = contentService.create().$$state.value
      expect(response.result).not.toBe(undefined)
    })

    it('failed due to missing required field', function () {
      var contentData = {
        content: {

        }
      }
      spyOn(contentService, 'create').and.returnValue(deferred.promise)
      deferred.resolve(failedResponce)
      spyOn(textBookController, 'saveMetaData').and.callThrough()
      textBookController.saveMetaData(contentData)
      timeout.flush(2000)
      scope.$apply()
      var response = contentService.create().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('failed due to external error', function () {
      var contentData = {
        content: {}
      }
      spyOn(contentService, 'create').and.returnValue(deferred.promise)
      deferred.reject()
      spyOn(textBookController, 'saveMetaData').and.callThrough()
      textBookController.saveMetaData(contentData)
      timeout.flush(2000)
      scope.$apply()
    })
  })
})
