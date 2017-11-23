describe('controller test', function () {
  var $compile, $state, scope, httpMock, $location, $rootScope, $templateCache, $stateParams, $httpBackend

  beforeEach(module('playerApp'))

  beforeEach(inject(function (_$rootScope_, _$httpBackend_, _$state_, $controller, _$templateCache_, _$location_, _$stateParams_) {
    $state = _$state_
    $stateParams = _$stateParams_
    scope = _$rootScope_.$new()
    $templateCache = _$templateCache_
    $location = _$location_
    $rootScope = _$rootScope_
    $httpBackend = _$httpBackend_
  }))

  function goFrom (url) {
    return {
      toState: function (state, params) {
        $location.replace().url(url) // Don't actually trigger a reload
        $state.go(state, params)
        $rootScope.$digest()
      }
    }
  }

  describe('OnEnter', function () {
    it('On announcement outbox enter ', function (done) {
      goFrom('/').toState('announcementOutbox', $stateParams)
      done()
    })

    it('On announcement inbox enter ', function (done) {
      goFrom('/').toState('announcementInbox', $stateParams)
      done()
    })

    it('On announcement details enter ', function (done) {
      goFrom('/').toState('announcementDetails', $stateParams)
      done()
    })
  })
})
