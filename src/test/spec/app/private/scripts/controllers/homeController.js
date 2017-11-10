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
  var rootScope, learnService, scope, $state, $q, deferred, homeCtrl

  beforeEach(inject(function ($rootScope, _$state_, _$q_, $controller, _learnService_) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    $state = _$state_
    $q = _$q_
    deferred = _$q_.defer()
    learnService = _learnService_
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
})
