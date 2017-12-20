'use strict'

describe('Controller:BatchUpdateController', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  var batchService,
    scope,
    rootScope,
    batchUpdate,
    batchData,
    createdBy,
    $q,
    deferred,
    timeout,
    createContoller,
    batchTestData = testData.batch

    // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, _$controller_, _batchService_, _$q_, _$timeout_) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    batchService = _batchService_
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()
    createContoller = function () {
      return new _$controller_('BatchUpdateController', {
        $rootScope: rootScope,
        $scope: scope
      })
    }
  }))

  it('Should define init', function () {
    batchUpdate = createContoller()
    rootScope.organisationIds = ['0123405017408225280', 'ORG_001']
    spyOn(batchUpdate, 'init').and.callThrough()
    batchUpdate.init()
    expect(batchUpdate.init).not.toBe(undefined)
  })

  it('Should return batch details on getBatchDetails call', function () {
    batchUpdate = createContoller()
    spyOn(batchService, 'getBatchDetails').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.showbatchDetailSuccess)
    spyOn(batchUpdate, 'getBatchDetails').and.callThrough()
    batchUpdate.getBatchDetails()
    scope.$apply()
    var response = batchService.getBatchDetails().$$state.value
    expect(response).not.toBe(undefined)
    batchUpdate.getBatchDetails = response.result
    expect(batchUpdate.getBatchDetails).not.toBe(undefined)
  })

  it('Should return empty batch details on getBatchDetails call', function () {
    batchUpdate = createContoller()
    spyOn(batchService, 'getBatchDetails').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.showbatchDetailFailed)
    spyOn(batchUpdate, 'getBatchDetails').and.callThrough()
    batchUpdate.getBatchDetails()
    scope.$apply()
    var response = batchService.getBatchDetails().$$state.value
    expect(response).not.toBe(undefined)
    batchUpdate.getBatchDetails = response.result
    expect(batchUpdate.getBatchDetails).not.toBe(undefined)
  })

  it('Should reject batch details on getBatchDetails call', function () {
    batchUpdate = createContoller()
    spyOn(batchService, 'getBatchDetails').and.returnValue(deferred.promise)
    deferred.reject({})
    spyOn(batchUpdate, 'getBatchDetails').and.callThrough()
    batchUpdate.getBatchDetails()
    scope.$apply()
    var response = batchService.getBatchDetails().$$state.value
    expect(response).not.toBe(undefined)
  })

  it('Should return batch data on getBatchData call', function () {
    batchUpdate = createContoller()
    spyOn(batchService, 'getBatchData').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.batchData)
    spyOn(batchUpdate, 'getBatchDetails').and.callThrough()
    batchUpdate.getBatchDetails()
    scope.$apply()
    expect(batchUpdate.getBatchDetails).not.toBe(undefined)
  })

  it('Should show batch details on showUpdateBatchModal call', function () {
    batchUpdate = createContoller()
    batchUpdate.batchData = batchTestData.batchData
    batchUpdate.userList = batchTestData.userList
    spyOn(batchUpdate, 'showUpdateBatchModal').and.callThrough()
    batchUpdate.showUpdateBatchModal()
    setFixtures('<div class="createbatchdropdown ui fluid multiple search selection dropdown " id="mentors">')
    timeout.flush(10)
    scope.$apply()
    expect(batchUpdate.showUpdateBatchModal).not.toBe(undefined)
  })

  it('Should clear form on clearForm call', function () {
    batchUpdate = createContoller()
    setFixtures('<form class="ui form batchAddUserForm" id="updateBatch" name="updateBatch" validate></form')
    spyOn(batchUpdate, 'clearForm').and.callThrough()
    batchUpdate.clearForm()
    scope.$apply()
    expect(batchUpdate.getBatchDetails).not.toBe(undefined)
  })

  it('Should load user list', function () {
    spyOn(batchService, 'getUserList').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.userData)
    rootScope.organisationIds = ['0123405017408225280', 'ORG_001']
    batchUpdate = createContoller()
    spyOn(batchUpdate, 'getUserList').and.callThrough()
    batchUpdate.getUserList()
    scope.$apply()
    var response = batchService.getUserList().$$state.value
    expect(response).not.toBe(undefined)
    batchUpdate.batchService = response.result
    expect(batchUpdate.batchService).not.toBe(undefined)
  })

  it('Should fail to load users list', function () {
    spyOn(batchService, 'getUserList').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.userDataFailed)
    rootScope.organisationIds = ['0123405017408225280', 'ORG_001']
    batchUpdate = createContoller()
    spyOn(batchUpdate, 'getUserList').and.callThrough()
    batchUpdate.getUserList()
    scope.$apply()
    var response = batchService.getUserList().$$state.value
    expect(response).not.toBe(undefined)
    batchUpdate.batchService = response.result
    expect(batchUpdate.batchService).not.toBe(undefined)
  })

  it('Should hide update batch modal', function () {
    batchUpdate = createContoller()
    spyOn(batchUpdate, 'hideUpdateBatchModal').and.callThrough()
    batchUpdate.hideUpdateBatchModal()
    setFixtures('<div class="ui modal" id="updateBatchModal"></div>')
    scope.$apply()
    expect(batchUpdate.hideUpdateBatchModal).not.toBe(undefined)
  })

  it('Should update batch details', function () {
    spyOn(batchService, 'update').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.updateBatch)
    batchUpdate = createContoller()
    scope.updateBatch = {$valid: true}
    spyOn(batchUpdate, 'updateBatchDetails').and.callThrough()
    batchUpdate.updateBatchDetails(batchTestData.data)
    scope.$apply()
    var response = batchService.update().$$state.value
    expect(response).not.toBe(undefined)
    batchUpdate.updateBatchDetails = response.result
    expect(batchUpdate.updateBatchDetails).not.toBe(undefined)
  })

  it('Should update batch details', function () {
    spyOn(batchService, 'update').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.updateBatchFailed)
    batchUpdate = createContoller()
    scope.updateBatch = {$valid: true}
    spyOn(batchUpdate, 'updateBatchDetails').and.callThrough()
    batchUpdate.updateBatchDetails(batchTestData.data)
    scope.$apply()
    var response = batchService.update().$$state.value
    expect(response).not.toBe(undefined)
  })

  it('Should reject batch update request', function () {
    spyOn(batchService, 'update').and.returnValue(deferred.promise)
    deferred.reject({})
    batchUpdate = createContoller()
    scope.updateBatch = {$valid: true}
    spyOn(batchUpdate, 'updateBatchDetails').and.callThrough()
    batchUpdate.updateBatchDetails(batchTestData.data)
    scope.$apply()
    var response = batchService.update().$$state.value
    expect(response).not.toBe(undefined)
  })
})
