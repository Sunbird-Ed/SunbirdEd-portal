'use strict'
describe('profileVisibilityController', function () {
  beforeEach(module('playerApp'))
  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))
  var rootScope, userService, toasterService, $timeout,
    scope, $q,
    deferred
  var profVisCtrl, createController, profileTestData = testData.profile

  beforeEach(inject(function ($rootScope, _toasterService_, _userService_, _$timeout_,
    _$controller_, _$q_) {
    rootScope = $rootScope
    toasterService = _toasterService_
    $timeout = _$timeout_
    scope = $rootScope.$new()
    userService = _userService_
    $q = _$q_
    deferred = _$q_.defer()
    createController = function () {
      return new _$controller_('profileVisibilityController', {
        $scope: scope,
        $rootScope: rootScope
      })
    }
  }))
  it('should change field visibility to public for private field ', function (done) {
    rootScope.privateProfileFields = ['dob']
    profVisCtrl = createController()
    scope.field = 'dob'
    scope.visibility = 'private'
    spyOn(profVisCtrl, 'setProfileFieldLbl').and.callThrough()
    profVisCtrl.setProfileFieldLbl('public')
    scope.$apply()
    done()
  })
  it('should change field visibility to private for public field ', function (done) {
    rootScope.privateProfileFields = []
    profVisCtrl = createController()
    scope.field = 'dob'
    scope.visibility = 'public'
    spyOn(profVisCtrl, 'setProfileFieldLbl').and.callThrough()
    profVisCtrl.setProfileFieldLbl('private')
    scope.$apply()
    done()
  })
  it('should return true  on success reponse ', function (done) {
    rootScope.privateProfileFields = ['dob']
    profVisCtrl.publicProfileFields = []
    profVisCtrl.privateProfileFields = ['dob']
    rootScope.userId = '2aade7d9-6abf-433b-9a05-3b02cd2eb664'
    profVisCtrl = createController()
    profVisCtrl.profVisInfo = {field: 'dob', visibility: 'public'}
    spyOn(userService, 'updateProfileFieldVisibility').and.returnValue(deferred.promise)
    deferred.resolve(profileTestData.visibilitySuccessReponse)
    spyOn(profVisCtrl, 'updateProfVisFields').and.callThrough()
    profVisCtrl.updateProfVisFields(profVisCtrl.profVisInfo)
    scope.$apply()
    done()
  })
})
