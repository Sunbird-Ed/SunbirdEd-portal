'use strict'

describe('Controller:BatchListController', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  var batchService
  var scope
  var rootScope
  var batch
  var deferred
  var createContoller
  var batchTestData = testData.batch
  var permissionsService

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, _$controller_, _batchService_, _userService_,
    _PaginationService_, _$q_, _$timeout_, _permissionsService_) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    batchService = _batchService_
    permissionsService = _permissionsService_
    deferred = _$q_.defer()
    spyOn(permissionsService, 'getRoleOrgMap').and.returnValue({COURSE_MENTOR: ['ORG_001']})

    createContoller = function () {
      return new _$controller_('BatchListController', {
        $rootScope: rootScope,
        $scope: scope
      })
    }
  }))

  it('Should return batch list on listBatches call', function () {
    batch = createContoller()
    spyOn(batchService, 'getAllBatchs').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.batchlist)
    spyOn(batchService, 'getUserList').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.userData)

    spyOn(batch, 'listBatches').and.callThrough()
    batch.listBatches()
    scope.$apply()
    var response = batchService.getAllBatchs().$$state.value
    expect(response).not.toBe(undefined)
    batch.listBatches = response.result
    expect(batch.listBatches).not.toBe(undefined)
  })

  it('Should return empty batch list on listBatches call', function () {
    batch = createContoller()
    spyOn(batchService, 'getAllBatchs').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.emptybatchlist)
    spyOn(batchService, 'getUserList').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.userData)
    spyOn(batch, 'listBatches').and.callThrough()
    batch.listBatches()
    scope.$apply()
    var response = batchService.getAllBatchs().$$state.value
    expect(response).not.toBe(undefined)
    batch.listBatches = response.result
    expect(batch.listBatches).not.toBe(undefined)
  })

  xit('Should not return batch user list on listBatches call', function () {
    spyOn(batchService, 'getAllBatchs').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.batchlist)
    spyOn(batchService, 'getUserList').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.userDataFailed)
    batch = createContoller()
    spyOn(batch, 'listBatches').and.callThrough()
    batch.listBatches()
    scope.$apply()
    var response = batchService.getAllBatchs().$$state.value
    expect(response).not.toBe(undefined)
    var userResponse = batchService.getUserList().$$state.value
    expect(userResponse).toBeDefined()
    expect(batch.listBatches).not.toBe(undefined)
  })

  it('Should not return batch list on listBatches call', function () {
    spyOn(batchService, 'getAllBatchs').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.batchlistFailed)
    batch = createContoller()
    spyOn(batch, 'listBatches').and.callThrough()
    batch.listBatches()
    scope.$apply()
    var response = batchService.getAllBatchs().$$state.value
    expect(response).not.toBe(undefined)
    batch.listBatches = response.result
    expect(batch.listBatches).not.toBe(undefined)
  })

  it('Should reject batch list on listBatches call response', function () {
    spyOn(batchService, 'getAllBatchs').and.returnValue(deferred.promise)
    deferred.reject({})
    batch = createContoller()
    spyOn(batch, 'listBatches').and.callThrough()
    batch.listBatches()
    scope.$apply()
    var response = batchService.getAllBatchs().$$state.value
    expect(response).not.toBe(undefined)
  })

  it('Should show batch content to update batch', function () {
    batch = createContoller()
    spyOn(batch, 'showUpdateBatchModal').and.callThrough()
    batch.showUpdateBatchModal(batchTestData.batchData)
    expect(batch.showUpdateBatchModal).toBeDefined()
  })

  it('Should set batch page on setPage call', function () {
    var page = 1
    batch = createContoller()
    spyOn(batch, 'setPage').and.callThrough()
    batch.setPage(page)
    expect(batch.setPage).toBeDefined()
  })

  it('Should not set batch page on setPage call', function () {
    var page = 0
    batch = createContoller()
    spyOn(batch, 'setPage').and.callThrough()
    batch.setPage(page)
    expect(batch.setPage).toBeDefined()
  })
})
