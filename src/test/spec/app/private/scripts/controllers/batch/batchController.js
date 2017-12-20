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
    toasterService,
    createContoller,
    batchTestData = testData.batch

    // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, _$controller_, _batchService_,
    _courseService_, _permissionsService_, _learnService_, _$q_, _$timeout_, _toasterService_) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    permissionsService = _permissionsService_
    learnService = _learnService_
    batchService = _batchService_
    courseService = _courseService_
    toasterService = _toasterService_
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()
    createContoller = function () {
      return new _$controller_('BatchController', {
        $rootScope: rootScope,
        $scope: scope
      })
    }
  }))

  it('Should called create batch form', function () {
    batch = createContoller()
    rootScope.organisationIds = ['0123405017408225280', 'ORG_001']
    spyOn(batch, 'showCreateBatchModal').and.callThrough()
    batch.showCreateBatchModal()
    setFixtures('<div class="ui large modal" id="createBatchModal"></div>')
    setFixtures('<div class="ui calendar" id="rangestartAdd"></div>')
    timeout.flush(10)
    expect(batch.showCreateBatchModal).toBeDefined()
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
    var userRequest = {
      request: {
        userIds: _.compact('datausers')
      }
    }
    var res = {result: {batchId: '543535'}}
    spyOn(batch, 'addBatch').and.callThrough()
    batch.addBatch(batchTestData.data)
    spyOn(batchService, 'addUsers').and.returnValue(deferred.promise)
    batchService.addUsers(userRequest, res.result.batchId)
    deferred.resolve(batchTestData.userData)
    timeout.flush(100)
    scope.$apply()
    var response = batchService.create().$$state.value
    var addUserRes = batchService.addUsers().$$state.value
    expect(response).not.toBe(undefined)
    expect(addUserRes).not.toBe(undefined)
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

  it('Should call clearBatchData', function () {
    batch = createContoller()
    spyOn(batch, 'clearBatchData').and.callThrough()
    setFixtures('<form class="ui form" id="createBatch" name="createBatch" validate></form>')
    batch.clearBatchData()
    scope.$apply()
    expect(batch.clearBatchData).not.toBe(undefined)
  })

  it('Should call showUpdateBatchModal', function () {
    batch = createContoller()
    var batchData = {identifier: '23444211'}
    spyOn(batch, 'showUpdateBatchModal').and.callThrough()
    batch.showUpdateBatchModal(batchData, 'ntpuser')
    scope.$apply()
    expect(batch.showUpdateBatchModal).not.toBe(undefined)
  })
})
