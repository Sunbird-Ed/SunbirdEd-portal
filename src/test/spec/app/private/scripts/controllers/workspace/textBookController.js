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
  var channelApiSuccessResponce = testData.channel.successResponce

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
      spyOn(textBookController, 'getChannel').and.callThrough()
      textBookController.getChannel()

      spyOn(searchService, 'getChannel').and.callThrough()
      searchService.getChannel(stateParams.rootOrgId)
      expect(searchService.getChannel).toBeDefined()
    })

    it('Should not call framework api service', function () {
      stateParams.frameworkId = ''
      spyOn(searchService, 'getFramework').and.callThrough()
      searchService.getFramework(stateParams.frameworkId)
      expect(searchService.getFramework).toHaveBeenCalledWith(stateParams.frameworkId)
    })

    it('Should get framework api service', function () {
      spyOn(searchService, 'getFramework').and.returnValue(deferred.promise)
      deferred.resolve(frameworkSuccessResponce)
      scope.$apply()
      var response = searchService.getFramework().$$state.value
      expect(response.result).not.toBe(undefined)
    })

    it('success channel api', function () {
      spyOn(searchService, 'getChannel').and.returnValue(deferred.promise)
      deferred.resolve(channelApiSuccessResponce)
      // scope.$apply()
      spyOn(searchService, 'getFramework').and.returnValue(deferred.promise)
      deferred.resolve(frameworkSuccessResponce)
      spyOn(textBookController, 'getChannel').and.callThrough()
      textBookController.getChannel()
      scope.$apply()
      var response = searchService.getChannel().$$state.value
      expect(response.result).not.toBe(undefined)
    })

    it('Should not call framework api service', function () {
      stateParams.frameworkId = ''
      spyOn(searchService, 'getFramework').and.callThrough()
      searchService.getFramework(stateParams.frameworkId)
      expect(searchService.getFramework).toHaveBeenCalledWith(stateParams.frameworkId)
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

    it('Should called updatedDependentCategory1', function () {
      var associationsResult = []
      var categoryIndex = '1'
      var categoryVal = 'NCERT'
      var categoryData = [{
        'identifier': 'ncf_board_ncert',
        'code': 'ncert',
        'name': 'NCERT',
        'description': '',
        'index': 1,
        'category': 'board',
        'status': 'Live'
      }]
      spyOn(textBookController, 'updatedDependentCategory').and.callThrough()
      textBookController.updatedDependentCategory(categoryIndex, categoryVal)
      expect(textBookController.updatedDependentCategory).toHaveBeenCalledWith(categoryIndex, categoryVal)

      spyOn(textBookController, 'getAssociations').and.callThrough()
      var associations = textBookController.getAssociations(categoryVal, categoryData)
      expect(associations.length).toEqual(associationsResult.length)
    })
    it('Should called updatedDependentCategory2', function () {
      var associationsResult = []
      var categoryIndex = '2'
      var categoryVal = 'kindergarten'
      var categoryData = [{
        'identifier': 'ncf_board_ncert',
        'code': 'ncert',
        'name': 'NCERT',
        'description': '',
        'index': 1,
        'category': 'board',
        'status': 'Live'
      }]
      spyOn(textBookController, 'updatedDependentCategory').and.callThrough()
      textBookController.updatedDependentCategory(categoryIndex, categoryVal)
      expect(textBookController.updatedDependentCategory).toHaveBeenCalledWith(categoryIndex, categoryVal)

      spyOn(textBookController, 'getAssociations').and.callThrough()
      var associations = textBookController.getAssociations(categoryVal, categoryData)
      expect(associations.length).toEqual(associationsResult.length)
    })

    it('Should called updatedDependentCategory', function () {
      var associationsResult = []
      var categoryIndex = '3'
      var categoryVal = 'mathematics'
      var categoryData = [{
        'identifier': 'ncf_board_ncert',
        'code': 'ncert',
        'name': 'NCERT',
        'description': '',
        'index': 1,
        'category': 'board',
        'status': 'Live'
      }]
      spyOn(textBookController, 'updatedDependentCategory').and.callThrough()
      textBookController.updatedDependentCategory(categoryIndex, categoryVal)
      expect(textBookController.updatedDependentCategory).toHaveBeenCalledWith(categoryIndex, categoryVal)

      spyOn(textBookController, 'getAssociations').and.callThrough()
      var associations = textBookController.getAssociations(categoryVal, categoryData)
      expect(associations.length).toEqual(associationsResult.length)
    })
  })
})
