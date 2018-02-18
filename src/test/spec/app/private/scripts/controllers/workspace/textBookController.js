/**
 * name: textBookController
 * author: Anuj Gupta
 * Date: 26-09-2017
 */

'use strict'

describe('Controller: TextBookController', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  var contentService
  var searchService
  var scope
  var rootScope
  var textBookController
  var deferred
  var timeout
  var stateParams = { rootOrgId: 'ORG_001', frameworkId: 'NCF' }
  var failedResponce = testData.createContent.failedResponce
  var successResponce = testData.createContent.successResponce
  var frameworkSuccessResponce = testData.frameworkApi.successResponce
  var frameworkFailedResponce = testData.frameworkApi.failedResponce

  beforeEach(inject(function ($rootScope, $controller) { // eslint-disable-line no-undef
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $controller, _searchService_, _contentService_, _$q_, _$timeout_) { // eslint-disable-line no-undef
    rootScope = $rootScope
    scope = $rootScope.$new()
    contentService = _contentService_
    searchService = _searchService_
    timeout = _$timeout_
    deferred = _$q_.defer()

    textBookController = $controller('TextBookController', {
      $rootScope: rootScope,
      $scope: scope,
      contentService: contentService,
      searchService: searchService
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

    it('Should called channel api service', function () {
      spyOn(searchService, 'getChannel').and.callThrough()
      searchService.getChannel(stateParams.rootOrgId)
      expect(searchService.getChannel).toBeDefined()
    })

    it('Should not call channel api service', function () {
      stateParams.rootOrgId = ''
      spyOn(searchService, 'getChannel').and.callThrough()
      searchService.getChannel(stateParams.rootOrgId)
      expect(searchService.getChannel).toBeDefined()
    })

    it('Should called framework api service', function () {
      spyOn(searchService, 'getFramework').and.callThrough()
      searchService.getFramework(stateParams.frameworkId)
      expect(searchService.getFramework).toBeDefined()
    })

    it('Should not call framework api service', function () {
      stateParams.frameworkId = ''
      spyOn(searchService, 'getFramework').and.callThrough()
      searchService.getFramework(stateParams.frameworkId)
      expect(searchService.getChannel).toBeDefined()
    })

    it('Should get framework api service', function () {
      spyOn(searchService, 'getFramework').and.returnValue(deferred.promise)
      deferred.resolve(frameworkSuccessResponce)
      scope.$apply()
      var response = searchService.getFramework().$$state.value
      expect(response.result).not.toBe(undefined)
    })

    it('Should not get framework api service', function () {
      spyOn(searchService, 'getFramework').and.returnValue(deferred.promise)
      deferred.resolve(frameworkFailedResponce)
      scope.$apply()
      var response = searchService.getFramework().$$state.value
      expect(response.result).not.toBe(undefined)
    })

    it('Should call getAssociations', function () {
      spyOn(textBookController, 'getAssociations').and.callThrough()
      textBookController.getAssociations('textbook', 'fdss')
      scope.$apply()
      expect(textBookController.getAssociations).toBeDefined()
    })

    it('Should call updatedDependentCategory', function () {
      spyOn(textBookController, 'updatedDependentCategory').and.callThrough()
      textBookController.updatedDependentCategory(10, 'story')
      scope.$apply()
      expect(textBookController.updatedDependentCategory).toBeDefined()
    })

    it('Should call getTemsByindex', function () {
      spyOn(textBookController, 'getTemsByindex').and.callThrough()
      textBookController.getTemsByindex(8)
      scope.$apply()
      expect(textBookController.getTemsByindex).toBeDefined()
    })
  })
})
