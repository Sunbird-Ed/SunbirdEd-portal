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
  var enrolledCoursesSuccessResponse = { 'id': 'sunbird.user.courses', 'ver': '1.0', 'ts': '2017-05-13T10:49:58:600+0530', 'params': { 'resmsgid': '7c27cbf5-e299-43b0-bca7-8347f7e5abcf', 'msgid': null, 'err': null, 'status': 'success', 'errmsg': null }, 'responseCode': 'OK', 'result': { 'courses': [{ 'userId': ' user1', 'courseId': ' course1', 'name': ' course name 1', 'description': ' course description 1', 'enrolledDate': '2017-05-136 10:49:58:600+0530', 'progress': 10, 'grade': 'A', 'active': ' true', 'delta': {}, 'tocurl': 'CDN URL of the toc', 'status': '1' }, { 'userId': ' user1', 'courseId': ' course2', 'name': ' course name 2', 'description': ' course description 2', 'enrolledDate': '2017-05-136 10:49:58:600+0530', 'progress': 10, 'grade': 'A', 'active': ' true', 'delta': {}, 'tocurl': 'CDN URL of the toc', 'status': '1' }, { 'userId': ' user1', 'courseId': ' course3', 'name': ' course name 3', 'description': ' course description 3', 'enrolledDate': '2017-05-136 10:49:58:600+0530', 'progress': 10, 'grade': 'A', 'active': ' true', 'delta': {}, 'tocurl': 'CDN URL of the toc', 'status': '1' }] } }

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
    spyOn(learnService, 'enrolledCourses').and.callThrough()
    learnService.enrolledCourses('31231123112-1231232')
    expect(learnService.enrolledCourses).toBeDefined()
  })

  it('should get called go to list', function () {
    spyOn(homeCtrl, 'getToDoList').and.callThrough()
    homeCtrl.getToDoList()
  })

  xit('should get enrolled course', function (done) {
    spyOn(learnService, 'enrolledCourses').and.returnValue(deferred.promise)
    deferred.resolve(enrolledCoursesSuccessResponse)
    spyOn(homeCtrl, 'getToDoList').and.callThrough()
    homeCtrl.getToDoList()
    scope.$apply()
    var response = learnService.enrolledCourses('sdsfsdfsdf').$$state.value
    expect(response).not.toBe(undefined)
    done()
  })

  xit('should not get enrolled course', function (done) {
    spyOn(learnService, 'enrolledCourses').and.returnValue(deferred.promise)
    deferred.resolve({response: {}})
    spyOn(homeCtrl, 'otherSection').and.callThrough()
    homeCtrl.otherSection()
    scope.$apply()
    var response = learnService.enrolledCourses('sdsfsdfsdf').$$state.value
    expect(response).not.toBe(undefined)
    done()
  })

  xit('should not get enrolled course', function (done) {
    spyOn(learnService, 'enrolledCourses').and.returnValue(deferred.promise)
    deferred.reject({})
    spyOn(homeCtrl, 'otherSection').and.callThrough()
    homeCtrl.otherSection()
    done()
  })

  xit('should open course view', function () {
    spyOn(homeCtrl, 'openCourseView').and.callThrough()
    var item = {
      identifier: 'do_211321312312313132',
      name: 'name',
      total: 1,
      id: 12,
      courseId: 'sdfsfsdfsdfsdfsdf'
    }
    homeCtrl.openCourseView(item, 'sdfsd')
  })
})
