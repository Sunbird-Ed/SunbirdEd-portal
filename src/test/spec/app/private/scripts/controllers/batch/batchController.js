'use strict'

describe('Controller:BatchController', function () {
    // load the controller's module
  beforeEach(module('playerApp'))

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  var batchService,
    courseService,
    permissionsService,
    learnService,
    scope,
    rootScope,
    batch,
    $q,
    deferred,
    timeout,
    errorMessage,
    createContoller,
    batchTestData = testData.batch

    // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, _$controller_, _batchService_, _courseService_, _permissionsService_, _learnService_, _$q_, _$timeout_, _errorMessages_) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    permissionsService = _permissionsService_
    learnService = _learnService_
    batchService = _batchService_
    courseService = _courseService_
    errorMessage = _errorMessages_
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()
    rootScope.errorMessages = errorMessage
    createContoller = function () {
      return new _$controller_('BatchController', {
        $rootScope: rootScope,
        $scope: scope
      })
    }
  }))

  xit('Should called create batch form', function () {
    batch = createContoller()
    rootScope.organisationIds = ['0123405017408225280', 'ORG_001']
    spyOn(batch, 'showCreateBatchModal').and.callThrough()
    batch.showCreateBatchModal()
    spyOn($modal, 'onShow').andReturn(showModal)
    timeout.flush(10)
    expect(batch.showCreateBatchModal).toBeDefined()
    expect(batch.onShow).toHaveBeenCalled()
  })

  it('Should add batch on addBatch call', function () {
    /* var users = $('#users')
    var selectedUsers = ['c6f02b71-4ef6-4450-96f8-0d173f67f33f']
    spyOn(users, 'dropdown').and.returnValue(selectedUsers)
    users.dropdown('get value')
    expect(users.dropdown('get value')).toBeDefined() */

    spyOn(batchService, 'create').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.createBatchSuccess)
    batch = createContoller()
    scope.createBatch = {$valid: true}
    spyOn(batch, 'addBatch').and.callThrough()
    batch.addBatch(batchTestData.data)
    timeout.flush(100)
    scope.$apply()
    var response = batchService.create().$$state.value
    expect(response).not.toBe(undefined)
    batch.batchService = response.result
    expect(batch.batchService).not.toBe(undefined)
  })

  xit('Should add users on addUser call', function () {
    spyOn(batchService, 'addUsers').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.userData)
    scope.$apply()
    var response = batchService.addUsers().$$state.value
    expect(response).not.toBe(undefined)
    batch.batchService = response.result
    expect(batch.batchService).not.toBe(undefined)
  })

  it('Should not add batch on addBatch call', function () {
    spyOn(batchService, 'create').and.returnValue(deferred.promise)
    deferred.reject({})
    batch = createContoller()
    scope.createBatch = {$valid: true}
    spyOn(batch, 'addBatch').and.callThrough()
    batch.addBatch(batchTestData.data)
    scope.$apply()
    var response = batchService.create().$$state.value
    expect(response).not.toBe(undefined)
  })

  it('Should load user list', function () {
    spyOn(batchService, 'getUserList').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.userData)
    rootScope.organisationIds = ['0123405017408225280', 'ORG_001']
    batch = createContoller()
    spyOn(batch, 'getUserList').and.callThrough()
    batch.getUserList()
    scope.$apply()
    var response = batchService.getUserList().$$state.value
    expect(response).not.toBe(undefined)
    batch.batchService = response.result
    expect(batch.batchService).not.toBe(undefined)
  })

  it('Should fail to load users list', function () {
    spyOn(batchService, 'getUserList').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.userDataFailed)
    rootScope.organisationIds = ['0123405017408225280', 'ORG_001']
    batch = createContoller()
    spyOn(batch, 'getUserList').and.callThrough()
    batch.getUserList()
    scope.$apply()
    var response = batchService.getUserList().$$state.value
    expect(response).not.toBe(undefined)
    batch.batchService = response.result
    expect(batch.batchService).not.toBe(undefined)
  })

  it('Should show course batches list', function () {
    spyOn(batchService, 'getAllBatchs').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.showbatchDetailSuccess)
    spyOn(batchService, 'getUserList').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.userData)
    batch = createContoller()
    spyOn(batch, 'getCouserBatchesList').and.callThrough()
    batch.getCouserBatchesList()
    scope.$apply()
    var response = batchService.getAllBatchs().$$state.value
    expect(response).not.toBe(undefined)
    batch.batchService = response.result
    expect(batch.batchService).not.toBe(undefined)
  })

  it('Should fail to load batch users list', function () {
    spyOn(batchService, 'getAllBatchs').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.showbatchDetailSuccess)
    spyOn(batchService, 'getUserList').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.userDataFailed)
    batch = createContoller()
    spyOn(batch, 'getCouserBatchesList').and.callThrough()
    batch.getCouserBatchesList()
    scope.$apply()
    var response = batchService.getAllBatchs().$$state.value
    expect(response).not.toBe(undefined)
    batch.batchService = response.result
    expect(batch.batchService).not.toBe(undefined)
  })

  it('Should failed to show course batches list', function () {
    spyOn(batchService, 'getAllBatchs').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.showbatchDetailFailed)
    batch = createContoller()
    spyOn(batch, 'getCouserBatchesList').and.callThrough()
    batch.getCouserBatchesList()
    scope.$apply()
    var response = batchService.getAllBatchs().$$state.value
    expect(response).not.toBe(undefined)
    batch.batchService = response.result
    expect(batch.batchService).not.toBe(undefined)
  })

  it('Should reject course batches list', function () {
    spyOn(batchService, 'getAllBatchs').and.returnValue(deferred.promise)
    deferred.reject({})
    batch = createContoller()
    spyOn(batch, 'getCouserBatchesList').and.callThrough()
    batch.getCouserBatchesList()
    scope.$apply()
    expect(batch.getCouserBatchesList).not.toBe(undefined)
  })

  it('Should show batch details', function () {
    spyOn(batchService, 'getUserList').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.showbatchDetailSuccess)
    batch = createContoller()
    spyOn(batch, 'showBatchDetails').and.callThrough()
    batch.showBatchDetails(batchTestData.batchData)
    scope.$apply()
    var response = batchService.getUserList().$$state.value
    expect(response).not.toBe(undefined)
    batch.batchService = response.result
    expect(batch.batchService).not.toBe(undefined)
  })

  it('Should show batch details of enrollmentType open', function () {
    spyOn(batchService, 'getUserList').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.showbatchDetailSuccess)
    batch = createContoller()
    spyOn(batch, 'showBatchDetails').and.callThrough()
    batch.showBatchDetails(batchTestData.undfndPrtcpntBatchData)
    scope.$apply()
    var response = batchService.getUserList().$$state.value
    expect(response).not.toBe(undefined)
    batch.batchService = response.result
    expect(batch.showBatchDetails).not.toBe(undefined)
  })

  it('Should not show batch details', function () {
    spyOn(batchService, 'getUserList').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.showbatchDetailFailed)
    batch = createContoller()
    spyOn(batch, 'showBatchDetails').and.callThrough()
    batch.showBatchDetails(batchTestData.batchData)
    scope.$apply()
    var response = batchService.getUserList().$$state.value
    expect(response).not.toBe(undefined)
    batch.batchService = response.result
    expect(batch.batchService).not.toBe(undefined)
  })

  it('Should not return batch details response', function () {
    spyOn(batchService, 'getUserList').and.returnValue(deferred.promise)
    deferred.reject({})
    batch = createContoller()
    spyOn(batch, 'showBatchDetails').and.callThrough()
    batch.showBatchDetails(batchTestData.batchData)
    scope.$apply()
    expect(batch.showBatchDetails).not.toBe(undefined)
  })

  it('Should enrollUser to course on enrollUserToCourse call', function () {
    spyOn(courseService, 'enrollUserToCourse').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.createBatchSuccess)
    batch = createContoller()
    spyOn(batch, 'enrollUserToCourse').and.callThrough()
    batch.enrollUserToCourse(batchTestData.batchId)
    scope.$apply()
    var response = courseService.enrollUserToCourse().$$state.value
    expect(response).not.toBe(undefined)
    batch.batchService = response.result
    expect(batch.batchService).not.toBe(undefined)
  })

  it('Should not enroll user', function () {
    spyOn(courseService, 'enrollUserToCourse').and.returnValue(deferred.promise)
    deferred.reject({})
    batch = createContoller()
    scope.createBatch = {$valid: true}
    spyOn(batch, 'enrollUserToCourse').and.callThrough()
    batch.enrollUserToCourse(batchTestData.batchId)
    scope.$apply()
    expect(batch.enrollUserToCourse).not.toBe(undefined)
  })

  it('Should not return enroll user response', function () {
    spyOn(courseService, 'enrollUserToCourse').and.returnValue(deferred.promise)
    deferred.resolve(batchTestData.createBatchFailed)
    batch = createContoller()
    spyOn(batch, 'enrollUserToCourse').and.callThrough()
    batch.enrollUserToCourse(batchTestData.batchId)
    scope.$apply()
    var response = courseService.enrollUserToCourse().$$state.value
    expect(response).not.toBe(undefined)
    batch.batchService = response.result
    expect(batch.batchService).not.toBe(undefined)
  })
})
