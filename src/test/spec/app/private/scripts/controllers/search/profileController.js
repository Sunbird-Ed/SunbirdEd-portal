describe('Controller: PublicProfileController', function () {
  beforeEach(module('playerApp'))
  var profileCtrl
  var timeout
  var scope
  var searchService
  var toasterService
  var deferred
  var $state
  var stateParams
  var rootScope

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))
  beforeEach(inject(function ($rootScope,
    $controller,
    _toasterService_,
    _searchService_,
    _$timeout_,
    _$q_,
    _$state_,
    _$stateParams_

  ) {
    rootScope = $rootScope
    toasterService = _toasterService_
    scope = $rootScope.$new()
    timeout = _$timeout_
    $state = _$state_
    stateParams = _$stateParams_
    searchService = _searchService_
    deferred = _$q_.defer()
    stateParams = { userId: 'YTNkNDE1MWItNGQzZS00MDY4LTg5NTAtZDViMjdiMTA0ODdl' }
    spyOn(toasterService, 'success').and.callThrough()
    spyOn(toasterService, 'error').and.callThrough()
    profileCtrl = $controller('PublicProfileController', {
      $rootScope: $rootScope,
      $scope: scope,
      $state: $state,
      searchService: searchService,
      $stateParams: stateParams

    })
    $rootScope.search = { searchKeyword: 'users' }
  }))

  it('should get profile', function (done) {
    spyOn(profileCtrl, 'profile').and.callThrough()
    spyOn(searchService, 'getPublicUserProfile').and.returnValue(deferred.promise)
    var res = { responseCode: 'OK', result: { response: { dob: '12 - 2 - 1993' } } }
    profileCtrl.user = {}
    deferred.resolve(res)
    profileCtrl.profile()
    searchService.getPublicUserProfile()
    scope.$apply()
    expect(profileCtrl.user.dob).not.toBe(null)
    done()
  })
  it('should return client error for  profile', function (done) {
    spyOn(profileCtrl, 'profile').and.callThrough()
    spyOn(searchService, 'getPublicUserProfile').and.returnValue(deferred.promise)
    var res = {}
    profileCtrl.user = {}
    deferred.resolve(res)
    profileCtrl.profile()
    searchService.getPublicUserProfile()
    scope.$apply()
    expect(toasterService.error).toHaveBeenCalled()
    done()
  })
  it('should close profile and return user to search', function (done) {
    spyOn(profileCtrl, 'close').and.callThrough()
    spyOn(rootScope, '$broadcast').and.callThrough()

    profileCtrl.close()
    timeout.flush(500)
    scope.$apply()
    expect(rootScope.$broadcast).toHaveBeenCalled()
    done()
  })
  it('should close profile and return user to search', function (done) {
    spyOn(profileCtrl, 'close').and.callThrough()
    spyOn($state, 'go').and.callThrough()
    rootScope.search = { searchKeyword: '' }
    profileCtrl.close()

    scope.$apply()
    expect($state.go).toHaveBeenCalled()
    done()
  })
})
