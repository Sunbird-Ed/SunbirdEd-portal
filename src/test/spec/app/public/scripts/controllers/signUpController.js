/**
 * name: CollectionPlayerController.js
 * author: Aprajita
 * Date: 10-11-2017
 */

'use strict'
describe('SignUpCtrl', function () {
  beforeEach(module('loginApp'))

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('loginCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  var rootScope, $stateParams, signUpService, toasterService, $timeout,
    scope, $state, $q, deferred, element
  var req = {
      firstName: 'ntptest101',
      lastName: 'ntptest101',
      password: 'password',
      email: 'ntptest@gmail.com',
      userName: 'ntptest101',
      phone: '9984848437',
      language: 'en'
    },
    signUpCtrl,
    signUpResponse = {'id': 'api.user.create', 'ver': 'v1', 'ts': '2017-11-14 06:04:00:499+0000', 'params': {'resmsgid': null, 'msgid': '00287764-3c50-41d8-8b6e-c2877cd03657', 'err': null, 'status': 'success', 'errmsg': null}, 'responseCode': 'OK', 'result': {'response': 'SUCCESS', 'accessToken': null, 'userId': '6220d9c2-79f5-4471-b3da-1d5082dedc4b'}},
    signUpResponseFail = {'id': 'api.content.flag', 'ver': '1.0', 'ts': '2017-10-05T10:50:48.801Z', 'params': {'resmsgid': '0c466d10-a9bb-11e7-8938-e1607b8b88ae', 'msgid': null, 'status': 'failed', 'err': 'ERR_GRAPH_SEARCH_UNKNOWN_ERROR', 'errmsg': 'Error'}, 'responseCode': 'RESOURCE_NOT_FOUND', 'result': {}}
  beforeEach(function () {
    setFixtures('<form autocomplete="off" id="signUpForm" class="ui form">' +
      '<input type="text" name="userName" placeholder="eg:user.name , min 5 character required" ng-model="newUser.userName">' +
      '<input type="password" name="password" placeholder="Password" ng-model="newUser.password" />' +
      '</form>')
  })
  beforeEach(inject(function ($rootScope, _$stateParams_, _signUpService_, _toasterService_, _$timeout_,
    _$state_, _$q_, $controller) {
    rootScope = $rootScope
    $stateParams = _$stateParams_
    signUpService = _signUpService_
    toasterService = _toasterService_
    $timeout = _$timeout_
    scope = $rootScope.$new()
    $state = _$state_
    $q = _$q_
    deferred = _$q_.defer()
    signUpCtrl = new $controller('SignUpCtrl', {$scope: scope, $rootScope: rootScope})
    signUpCtrl.userName = 'ntptest101'
  }))

  xit('should validate signUp form success', function () {
    spyOn(signUpCtrl, 'formValidation').and.callThrough()
    signUpCtrl.formValidation()
    spyOn(signUpCtrl, 'formValidation').andReturn(true)

    scope.$apply()
    // collectionPlayerCtrl.getCoursecollectionPlayerCtrl = response.result.content
    expect(signUpCtrl.formValidation).toBe(true)
  })

  it('should show signup modal', function () {
    spyOn(signUpCtrl, 'showModal').and.callThrough()
    signUpCtrl.showModal()
    scope.$apply()
    $timeout.flush()
    // expect(signUpCtrl.showModal).toBe(true)
  })

  it('should call formInit', function () {
    spyOn(signUpCtrl, 'formInit').and.callThrough()
    signUpCtrl.formInit()
    scope.$apply()
    $timeout.flush(1500)
  })

  it('should call submitForm', function () {
    spyOn(signUpCtrl, 'submitForm').and.callThrough()
    var isValid = true
    signUpCtrl.submitForm()
    scope.$apply()
    // expect(signUpCtrl.submitForm).toHaveBeenCalled()
  })

  it('should show error message on getErrorMsg call', function () {
    spyOn(signUpCtrl, 'getErrorMsg').and.callThrough()
    var errorKey = 'USER_ALREADY_EXIST'
    signUpCtrl.getErrorMsg(errorKey)
    scope.$apply()
  })

  it('should show error message on getErrorMsg call', function () {
    spyOn(signUpCtrl, 'getErrorMsg').and.callThrough()
    var errorKey = 'USERNAME_EMAIL_IN_USE'
    signUpCtrl.getErrorMsg(errorKey)
    scope.$apply()
  })

  it('should show error message on getErrorMsg call', function () {
    spyOn(signUpCtrl, 'getErrorMsg').and.callThrough()
    var errorKey = ''
    signUpCtrl.getErrorMsg(errorKey)
    scope.$apply()
  })

  it('Should called signUp service', function () {
    spyOn(signUpService, 'signUp').and.callThrough()
    signUpService.signUp()
    expect(signUpService.signUp).toBeDefined()
  })

  it('should call signUp service', function () {
    spyOn(signUpService, 'signUp').and.returnValue(deferred.promise)
    deferred.resolve(signUpResponse)
    spyOn(signUpCtrl, 'signUp').and.callThrough()
    signUpCtrl.signUp(req)
    $timeout.flush(2000)
    scope.$apply()
    var response = signUpService.signUp().$$state.value
    expect(response).not.toBe(undefined)
    signUpService.signUp = response.result
    expect(signUpService.signUp).not.toBe(undefined)
  })

  it('should fail signUp service call response', function () {
    spyOn(signUpService, 'signUp').and.returnValue(deferred.promise)
    deferred.resolve(signUpResponseFail)
    spyOn(signUpCtrl, 'signUp').and.callThrough()
    signUpCtrl.signUp(req)
    scope.$apply()
    var response = signUpService.signUp().$$state.value
    expect(response).not.toBe(undefined)
    signUpService.signUp = response.result
    expect(signUpService.signUp).not.toBe(undefined)
  })

  it('should reject signUp service call', function () {
    spyOn(signUpService, 'signUp').and.returnValue(deferred.promise)
    deferred.reject({})
    spyOn(signUpCtrl, 'signUp').and.callThrough()
    signUpCtrl.signUp(req)
    scope.$apply()
    expect(signUpService.signUp).not.toBe(undefined)
  })

  it('should call toasterService', function () {
    spyOn(toasterService, 'loader').and.returnValue(deferred.promise)
    deferred.resolve(signUpResponse)
    scope.$apply()
    expect(toasterService.loader).not.toBe(undefined)
  })
})
