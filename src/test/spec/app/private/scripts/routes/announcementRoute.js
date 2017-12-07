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

    it('On announcement create enter when status available', function (done) {
      $stateParams.stepNumber = 2
      $rootScope.userIdHashTag = 1
      $stateParams.announcement = {'sourceId': '', 'attachments': [], 'createdDate': null, 'createdBy': null, 'description': 'sds', 'from': 'sdsd', 'title': 'sds', 'type': 'News', 'links': [], 'id': '', 'target': {'geo': {'ids': []}}, 'status': null, 'hideDate': true}
      goFrom('/').toState('announcementCreate', $stateParams)
      done()
    })

    it('On announcement create enter when status not available', function (done) {
      $stateParams.stepNumber = 2
      $rootScope.userIdHashTag = 1
      goFrom('/').toState('announcementCreate', $stateParams)
      done()
    })

    it('On announcement create enter when step number is 1', function (done) {
      $stateParams.stepNumber = 1
      $rootScope.userIdHashTag = 1
      goFrom('/').toState('announcementCreate', $stateParams)
      done()
    })

    it('On announcement resend enter when status available', function (done) {
      $stateParams.announcementId = '1714e050-db20-11e7-94e7-2ff540b1e328'
      $stateParams.stepNumber = 2
      $rootScope.userIdHashTag = 1
      $stateParams.announcement = {'sourceId': '', 'attachments': [], 'createdDate': null, 'createdBy': null, 'description': 'sds', 'from': 'sdsd', 'title': 'sds', 'type': 'News', 'links': [], 'id': '', 'target': {'geo': {'ids': []}}, 'status': null, 'hideDate': true}
      goFrom('/').toState('announcementResend', $stateParams)
      done()
    })

    it('On announcement resend enter when status not available', function (done) {
      $stateParams.announcementId = '1714e050-db20-11e7-94e7-2ff540b1e328'
      $stateParams.stepNumber = 2
      $rootScope.userIdHashTag = 1
      goFrom('/').toState('announcementResend', $stateParams)
      done()
    })

    it('On announcement resend enter when step number is 1', function (done) {
      $stateParams.announcementId = '1714e050-db20-11e7-94e7-2ff540b1e328'
      $stateParams.stepNumber = 1
      $rootScope.userIdHashTag = 1
      goFrom('/').toState('announcementResend', $stateParams)
      done()
    })
  })
})
