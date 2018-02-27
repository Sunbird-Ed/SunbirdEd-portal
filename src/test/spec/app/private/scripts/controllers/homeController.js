/**
 * name: homeController.js
 * author: Anuj Gupta
 * Date: 02-11-2017
 */

'use strict'
describe('HomeController', function () {
  beforeEach(module('playerApp'))
  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))
  var rootScope, learnService, scope, deferred, homeCtrl, telemetryService

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

  beforeEach(inject(function ($rootScope, _$state_, _$q_, $controller, _learnService_, _telemetryService_) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    deferred = _$q_.defer()
    learnService = _learnService_
    telemetryService = _telemetryService_
    $rootScope.enrolledCourseIds = ['sdfsfsdfsdfsdfsdf']
    homeCtrl = new $controller('HomeController', {$scope: scope, $rootScope: rootScope})
  }))

  it('Should called get enrolled courses', function () {
    spyOn(learnService, 'recommendedCourses').and.callThrough()
    learnService.recommendedCourses('31231123112-1231232')
    expect(learnService.recommendedCourses).toBeDefined()
  })

  it('should get called go to list', function () {
    rootScope.profileCompleteness = 99
    spyOn(homeCtrl, 'getToDoList').and.callThrough()
    homeCtrl.getToDoList()
    expect(homeCtrl.getToDoList).toBeDefined()
  })

  it('Should load Carousel', function () {
    spyOn(homeCtrl, 'loadCarousel').and.callThrough()
    homeCtrl.loadCarousel()
    expect(homeCtrl.loadCarousel).toBeDefined()
  })

  it('Should load featured Carousel', function () {
    spyOn(homeCtrl, 'loadFeaturedCarousel').and.callThrough()
    homeCtrl.loadFeaturedCarousel()
    expect(homeCtrl.loadFeaturedCarousel).toBeDefined()
  })
  it('should get enrolled course', function (done) {
    spyOn(learnService, 'recommendedCourses').and.returnValue(deferred.promise)
    var res = {
      responseCode: 'OK',
      result: {
        response: {}
      }
    }
    deferred.resolve(res)
    spyOn(homeCtrl, 'otherSection').and.callThrough()
    homeCtrl.otherSection()
    scope.$apply()
    var response = learnService.recommendedCourses('sdsfsdfsdf').$$state.value
    expect(response).not.toBe(undefined)
    done()
  })

  it('should not get enrolled course', function () {
    spyOn(learnService, 'recommendedCourses').and.returnValue(deferred.promise)
    deferred.resolve({response: {}})
    spyOn(homeCtrl, 'otherSection').and.callThrough()
    homeCtrl.otherSection()
    scope.$apply()
    var response = learnService.recommendedCourses('sdsfsdfsdf').$$state.value
    expect(response).not.toBe(undefined)
  })

  it('should not get enrolled course', function (done) {
    spyOn(learnService, 'recommendedCourses').and.returnValue(deferred.promise)
    deferred.reject({})
    spyOn(homeCtrl, 'otherSection').and.callThrough()
    homeCtrl.otherSection()
    scope.$apply()
    done()
  })

  it('should open course view', function () {
    spyOn(homeCtrl, 'openCourseView').and.callThrough()
    var item = {
      identifier: 'do_211321312312313132',
      name: 'name',
      total: 1,
      id: 12,
      courseId: 'sdfsfsdfsdfsdfsdf'
    }
    homeCtrl.openCourseView(item, 'sdfsd')
    expect(homeCtrl.openCourseView).toBeDefined()
  })

  it('Should return telemetry interact event spec', function () {
    spyOn(telemetryService, 'interactTelemetryData').and.returnValue(deferred.promise)
    deferred.resolve(telemetrySpec)
    spyOn(homeCtrl, 'generateInteractEvent').and.callThrough()
    homeCtrl.generateInteractEvent('course', 'do_212345541699534848166', 'course', '1.0', 'course-read', 'course')
    scope.$apply()
    var response = telemetryService.interactTelemetryData().$$state.value
    expect(response).toBe(telemetrySpec)
  })

  it('Should called lineInview method', function () {
    var item = {
      identifier: 'do_211321312312313132',
      contentType: 'course'
    }
    spyOn(homeCtrl, 'lineInView').and.callThrough()
    homeCtrl.lineInView(5, true, item, 'my course')
    scope.$apply()
    expect(homeCtrl.lineInView).toBeDefined()
  })
})
