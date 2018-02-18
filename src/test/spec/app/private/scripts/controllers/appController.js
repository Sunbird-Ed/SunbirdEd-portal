/**
 * name: appController.js
 * author: Anuj Gupta
 * Date: 14-11-2017
 */

describe('App controller', function () {
  beforeEach(module('playerApp'))
  var rootScope, $timeout, scope, deferred, searchService,
    userService, telemetryService, adminService, $httpBackend

  if (typeof Array.prototype.includes !== 'function') {
    Array.prototype.includes = function (iterator) { // eslint-disable-line no-extend-native
      var list = Object(this)
      var length = list.length >>> 0
      var thisArg = arguments[1] // eslint-disable-line no-unused-vars
      var value // eslint-disable-line no-unused-vars
      for (var i = 0; i < length; i++) {
        value = list[i]
        return true
      }
      return undefined
    }
  }
  if (typeof Array.prototype.find !== 'function') {
    Array.prototype.find = function (iterator) { // eslint-disable-line no-extend-native
      var list = Object(this)
      var length = list.length >>> 0
      var thisArg = arguments[1]
      var value

      for (var i = 0; i < length; i++) {
        value = list[i]
        if (iterator.call(thisArg, value, i, list)) {
          return value
        }
      }
      return undefined
    }
  }

  var telemetrySpec = {
    context: {
      env: 'course',
      sid: 'BhOOJNURrm_t0UPQYPGkIc4yLm_zFVfy',
      did: 'ae5cf91de89fc62427fd5ded9e1adbe3',
      cdata: [],
      rollup: {
        l1: '01232002070124134414',
        l2: '012315809814749184151'
      }
    },
    object: {
      id: 'do_212345541699534848166',
      type: 'course-read',
      ver: '1.0'
    },
    tags: [
      '01232002070124134414',
      '012315809814749184151'
    ],
    edata: {
      type: 'CLICK',
      subtype: '',
      id: 'course',
      pageid: 'course'
    }
  }

  // spyOn(Array.prototype, 'find').and.callThrough()

  beforeEach(inject(function ($rootScope, _$stateParams_, _contentService_, _$timeout_, _$q_,
    $controller, _searchService_, _telemetryService_, _adminService_, _userService_,
    _$httpBackend_) {
    rootScope = $rootScope
    $timeout = _$timeout_
    scope = $rootScope.$new()
    deferred = _$q_.defer()
    window.localStorage.redirectUrl = 'sddsf'
    searchService = _searchService_
    adminService = _adminService_
    userService = _userService_
    telemetryService = _telemetryService_
    $httpBackend = _$httpBackend_
    new $controller('AppCtrl', {$scope: scope, $rootScope: rootScope}) // eslint-disable-line no-new
  }))

  it('Called profile service', function () {
    spyOn(userService, 'getUserProfile').and.callThrough()
    userService.getUserProfile()
    expect(userService.getUserProfile).toBeDefined()
  })

  it('should get user profile', function (done) {
    spyOn(userService, 'getUserProfile').and.returnValue(deferred.promise)
    deferred.resolve(testData.profile.profileSuccessData)
    spyOn(scope, 'getProfile').and.callThrough()
    scope.getProfile()
    scope.$apply()
    done()
  })
  it('should fail to get user profile', function (done) {
    spyOn(scope, 'getProfile').and.callThrough()
    var mockProfileFailed = {
      responseCode: 'CLIENT_ERROR'
    }
    deferred.resolve(mockProfileFailed)
    scope.getProfile()
    userService.getUserProfile()
    scope.$apply()
    done()
  })

  it('Should open the link', function () {
    spyOn(rootScope, 'openLink').and.callThrough()
    rootScope.openLink('Url')
  })

  it('Should merge the objects', function () {
    spyOn(rootScope, 'mergeObjects').and.callThrough()
    // var obj1 = {'k1': 1}
    // var mergedObj = rootScope.mergeObjects(obj1, {'k2': 2})
    // expect(mergedObj).toBe(obj1)
  })

  it('Should return the empty objects', function () {
    spyOn(rootScope, 'mergeObjects').and.callThrough()
    var obj1 = {}
    var mergedObj = rootScope.mergeObjects(obj1, {})
    expect(mergedObj).toBeDefined()
  })

  xit('Should logout the app', function () {
    spyOn(scope, 'logout').and.callThrough()
    scope.logout()
    console.log('*******************************', window.document.location)
  })

  it('Should open the profile view', function () {
    spyOn(scope, 'openProfileView').and.callThrough()
    scope.openProfileView()
  })

  describe('Search get org', function () {
    it('Called search service', function () {
      spyOn(searchService, 'getOrgTypes').and.callThrough()
      searchService.getOrgTypes()
      expect(searchService.getOrgTypes).toBeDefined()
    })

    it('Should get org types', function () {
      spyOn(searchService, 'getOrgTypes').and.returnValue(deferred.promise)
      deferred.resolve({responseCode: 'OK'})
      spyOn(scope, 'getOrgTypes').and.callThrough()
      scope.getOrgTypes()
      scope.$apply()
      var response = searchService.getOrgTypes().$$state.value
      expect(response).not.toBe(undefined)
    })
  })

  describe('Search get Badges', function () {
    it('Called badges service', function () {
      spyOn(adminService, 'getBadges').and.callThrough()
      adminService.getBadges()
      expect(adminService.getBadges).toBeDefined()
    })

    it('Should get Badges ', function () {
      spyOn(adminService, 'getBadges').and.returnValue(deferred.promise)
      deferred.resolve({responseCode: 'OK'})
      spyOn(scope, 'getBadges').and.callThrough()
      scope.getBadges()
      scope.$apply()
      var response = adminService.getBadges().$$state.value
      expect(response).not.toBe(undefined)
    })
  })

  it('Should open the link', function () {
    spyOn(rootScope, 'loadProgress').and.callThrough()
    rootScope.loadProgress('Url')
    $timeout.flush(100)
  })

  it('should get user profile', function (done) {
    $httpBackend.whenRoute('GET', '/v1/tenant/info/adsdsas')
      .respond(function (method, url, data, headers, params) {
        return [200, {statusText: 'OK'}]
      })

    spyOn(scope, 'setRootOrgInfo').and.callThrough()
    scope.setRootOrgInfo({rootOrg: { orgName: 'Sunbird' }})
    scope.$apply()
    done()
  })

  it('Should return telemetry interact event spec', function () {
    spyOn(telemetryService, 'interactTelemetryData').and.returnValue(deferred.promise)
    deferred.resolve(telemetrySpec)
    spyOn(rootScope, 'generateInteractEvent').and.callThrough()
    rootScope.generateInteractEvent('course', 'do_212345541699534848166', 'course', '1.0', 'course-read', 'course')
    scope.$apply()
    var response = telemetryService.interactTelemetryData().$$state.value
    expect(response).toBe(telemetrySpec)
  })

  it('Should return telemetry start event spec', function () {
    spyOn(telemetryService, 'startTelemetryData').and.returnValue(deferred.promise)
    deferred.resolve(telemetrySpec)
    spyOn(rootScope, 'generateStartEvent').and.callThrough()
    rootScope.generateStartEvent('course', 'do_21234554169953484567', 'course', '1.0', 'course-read', 'course')
    scope.$apply()
    var response = telemetryService.startTelemetryData().$$state.value
    expect(response).toBe(telemetrySpec)
  })

  it('Should return telemetry end event spec', function () {
    spyOn(telemetryService, 'endTelemetryData').and.returnValue(deferred.promise)
    deferred.resolve(telemetrySpec)
    spyOn(rootScope, 'generateEndEvent').and.callThrough()
    rootScope.generateEndEvent('course', 'do_21234554169953484567', 'course', '1.0', 'course-read', 'course')
    scope.$apply()
    var response = telemetryService.endTelemetryData().$$state.value
    expect(response).toBe(telemetrySpec)
  })

  it('should call on before window unload', function () {
    spyOn(window, 'onbeforeunload').and.callThrough()
    window.onbeforeunload()
    scope.$apply()
    expect(window.onbeforeunload).toBeDefined()
  })
})
