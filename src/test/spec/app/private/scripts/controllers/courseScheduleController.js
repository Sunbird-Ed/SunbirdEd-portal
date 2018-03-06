
'use strict'
describe('courseScheduleCtrl', function () {
  beforeEach(module('playerApp'))
  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))
  var rootScope
  var $stateParams
  var courseService
  var $timeout
  var scope
  var batchService
  var deferred
  var telemetryService
  var toc
  var courseTestData = testData.course
  var contentId = '1234555456'
  var trigger = ''
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
  beforeEach(inject(function ($rootScope, _$stateParams_, _courseService_, _$timeout_,
    _contentStateService_, _$location_, _batchService_, $controller, _telemetryService_, _$q_) {
    rootScope = $rootScope
    $stateParams = _$stateParams_
    courseService = _courseService_
    $timeout = _$timeout_
    scope = $rootScope.$new()
    batchService = _batchService_
    telemetryService = _telemetryService_
    deferred = _$q_.defer()
    toc = new $controller('courseScheduleCtrl', {$scope: scope, $rootScope: rootScope})
  }))

  it('should load course hierarchy', function () {
    spyOn(courseService, 'courseHierarchy').and.returnValue(deferred.promise)
    deferred.resolve(courseTestData.courseHierarchyResponse)
    spyOn(toc, 'getCourseToc').and.callThrough()
    toc.getCourseToc()
    scope.$apply()
    var response = courseService.courseHierarchy().$$state.value
    expect(response).not.toBe(undefined)
    toc.getCourseToc = response.result.content
    expect(toc.getCourseToc).toBeDefined()
  })

  it('should call content state after load hierarchy for enrolled course ', function () {
    toc.courseType = 'ENROLLED_COURSE'
    spyOn(courseService, 'courseHierarchy').and.returnValue(deferred.promise)
    deferred.resolve(courseTestData.courseHierarchyResponse)
    spyOn(toc, 'getCourseToc').and.callThrough()
    toc.getCourseToc()
    scope.$apply()
    var response = courseService.courseHierarchy().$$state.value
    expect(response).not.toBe(undefined)
    toc.getCourseToc = response.result.content
    expect(toc.getCourseToc).toBeDefined()
  })

  it('should load batch card details ', function () {
    toc.courseId = 'do_212345541699534848166'
    toc.courseHierarchy = {status: ''}
    rootScope.isTocPage = true
    $stateParams.lectureView = 'no'
    rootScope.enrolledCourses = [{'dateTime': '2017-10-06 09:14:44:132+0000', 'identifier': '24ae626c6f6486dddc11a4e525338b613dfd1e2d5b024c827a3d1be94031adbb', 'lastReadContentStatus': 2, 'enrolledDate': '2017-10-06 06:08:51:411+0000', 'addedBy': '39d460e8-80ef-4045-8fe0-de4a78e78bc4', 'contentId': 'do_2123475531394826241107', 'description': 'test', 'active': true, 'courseLogoUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123475531394826241107/artifact/1-1_1485252935201.thumb.png', 'batchId': '0123475642937835520', 'userId': '39d460e8-80ef-4045-8fe0-de4a78e78bc4', 'courseName': 'test single content', 'leafNodesCount': 1, 'progress': 1, 'id': '24ae626c6f6486dddc11a4e525338b613dfd1e2d5b024c827a3d1be94031adbb', 'lastReadContentId': 'do_2123229899264573441612', 'courseId': 'do_2123475531394826241107', 'status': 2}, {'dateTime': '2017-10-06 05:40:32:553+0000', 'identifier': '04f3b1d7a0e6f20ce2c1cfd1e38cbc2e99eb28465c2c02bbe7692d43e8ffbb89', 'lastReadContentStatus': 2, 'enrolledDate': '2017-10-03 10:15:41:596+0000', 'addedBy': '39d460e8-80ef-4045-8fe0-de4a78e78bc4', 'contentId': 'do_212345541699534848166', 'description': 'test course for oct release', 'active': true, 'courseLogoUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_212345541699534848166/artifact/b5c2ff92ab5512754a24b7ed0a09e97f_1478082514640.thumb.jpeg', 'batchId': '0123455555175464967', 'userId': '39d460e8-80ef-4045-8fe0-de4a78e78bc4', 'courseName': 'course oct test', 'leafNodesCount': 13, 'progress': 13, 'id': '04f3b1d7a0e6f20ce2c1cfd1e38cbc2e99eb28465c2c02bbe7692d43e8ffbb89', 'lastReadContentId': 'do_212243656752766976112', 'courseId': 'do_212345541699534848166', 'status': 2}, {'dateTime': '2017-10-04 10:17:10:037+0000', 'identifier': '13e69256748d56fcdcddc68ba4faaa92dff2c198015440d644a9c5330962e635', 'enrolledDate': '2017-10-04 10:17:10:037+0000', 'addedBy': '39d460e8-80ef-4045-8fe0-de4a78e78bc4', 'contentId': 'do_2123412199319552001265', 'description': 'test', 'active': true, 'courseLogoUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123412199319552001265/artifact/a2b1d5cf96ad28f15e79df61dbb21fdf_1478083821843.thumb.jpeg', 'batchId': '01234122440174796827', 'userId': '39d460e8-80ef-4045-8fe0-de4a78e78bc4', 'courseName': '27-sept', 'leafNodesCount': 0, 'progress': 0, 'id': '13e69256748d56fcdcddc68ba4faaa92dff2c198015440d644a9c5330962e635', 'courseId': 'do_2123412199319552001265', 'status': 0}]
    spyOn(batchService, 'getBatchDetails').and.returnValue(deferred.promise)
    deferred.resolve(courseTestData.batchServiceResponse)
    spyOn(toc, 'showBatchCardList').and.callThrough()
    toc.showBatchCardList()
    scope.$apply()
    var response = batchService.getBatchDetails().$$state.value
    expect(response).not.toBe(undefined)
    toc.showBatchCardList = response.result.response
    expect(toc.showBatchCardList).toBeDefined()
  })

  it('should resume course if batch is not completed', function () {
    rootScope.isTocPage = true
    toc.courseContents = 'coursesss'
    spyOn(toc, 'resumeCourse').and.callThrough()
    toc.resumeCourse()
    scope.$apply()
  })

  it('should resume course if batch is not completed', function () {
    rootScope.isTocPage = false
    toc.courseContents = 'coursesss'
    spyOn(toc, 'resumeCourse').and.callThrough()
    toc.resumeCourse()
    scope.$apply()
  })

  it('should resume course if batch is not completed', function () {
    toc.courseContents = ''
    spyOn(toc, 'resumeCourse').and.callThrough()
    toc.resumeCourse()
    scope.$apply()
  })

  it('should call scrollToPlayer', function () {
    // $anchorScroll = 'tocPlayer'
    spyOn(toc, 'scrollToPlayer').and.callThrough()
    toc.scrollToPlayer()
    $timeout.flush(500)
    scope.$apply()
  })

  it('should call openContent', function () {
    toc.playContent = true
    toc.itemIndex = 5
    toc.courseContents = 'course'
    spyOn(toc, 'openContent').and.callThrough()
    toc.openContent(contentId, trigger)
    scope.$apply()
  })

  it('should call initTocView', function () {
    spyOn(toc, 'initTocView').and.callThrough()
    toc.initTocView()
    setFixtures('<div class="toc-tree-item fancy-tree-container"></div>')
    $timeout.flush(100)
    scope.$apply()
  })

  it('should call openRecentCollection', function () {
    toc.itemIndex = 10
    spyOn(toc, 'openRecentCollection').and.callThrough()
    toc.openRecentCollection()
    $timeout.flush(100)
    setFixtures('<div class="toc-tree-item fancy-tree-container"></div>')
    scope.$apply()
  })

  it('should not run foreach when itemIndex is blank', function () {
    toc.itemIndex = ''
    spyOn(toc, 'openRecentCollection').and.callThrough()
    toc.openRecentCollection()
    $timeout.flush(100)
    scope.$apply()
  })

  it('should call expandAccordion', function () {
    var event = {target: 'click'}
    spyOn(toc, 'expandAccordion').and.callThrough()
    toc.expandAccordion(event)
    scope.$apply()
  })

  it('should call updateAccordionIcon', function () {
    var isPlus = false
    var icon = 'star'
    spyOn(toc, 'updateAccordionIcon').and.callThrough()
    toc.updateAccordionIcon(icon, isPlus)
    scope.$apply()
  })

  it('should call updateCourseProgress', function () {
    toc.itemIndex = 2
    spyOn(toc, 'updateCourseProgress').and.callThrough()
    toc.updateCourseProgress()
    $timeout.flush(500)
    scope.$apply()
  })

  it('should call updateBreadCrumbs', function () {
    toc.courseHierarchy = {name: 'course'}
    scope.contentPlayer = {isContentPlayerEnabled: true}
    toc.itemIndex = 0
    toc.courseContents = [{name: 'Testcourse'}]
    spyOn(toc, 'updateBreadCrumbs').and.callThrough()
    toc.updateBreadCrumbs()
    scope.$apply()
  })

  it('should call updateBreadCrumbs', function () {
    toc.courseHierarchy = {name: 'course'}
    scope.contentPlayer = {isContentPlayerEnabled: false}
    toc.itemIndex = 0
    toc.courseContents = [{name: 'Testcourse'}]
    rootScope.breadCrumbsData = [{name: 'Home', link: 'home'}, {name: 'Library', link: 'learn'},
      {name: 'course', link: 'course'}, {name: 'profile', link: 'profile'}]
    spyOn(toc, 'updateBreadCrumbs').and.callThrough()
    toc.updateBreadCrumbs()
    scope.$apply()
  })

  it('should call getContentIcon', function () {
    var stsClass = ''
    var contentMimeType = 'application/vnd.ekstep.h5p-archive'
    spyOn(toc, 'getContentIcon').and.callThrough()
    toc.getContentIcon(contentMimeType, stsClass)
    scope.$apply()
  })

  it('should not load course hierarchy', function () {
    spyOn(courseService, 'courseHierarchy').and.returnValue(deferred.promise)
    deferred.resolve(courseTestData.courseHierarchyFailedResponse)
    spyOn(toc, 'getCourseToc').and.callThrough()
    toc.getCourseToc()
    scope.$apply()
    var response = courseService.courseHierarchy().$$state.value
    expect(response.result.content).toBe(undefined)
  })
  it('should failed on loading course hierarchy', function () {
    spyOn(courseService, 'courseHierarchy').and.returnValue(deferred.promise)
    deferred.reject({})
    spyOn(toc, 'getCourseToc').and.callThrough()
    toc.getCourseToc()
    scope.$apply()
    var response = courseService.courseHierarchy().$$state.value
    expect(response).not.toBe(undefined)
  })

  it('should use init method should assign course params and should trigger course hierarchy function', function () {
    $stateParams = {courseId: 'do_212345541699534848166'}
    rootScope.enrolledCourseIds = ['do_212345541699534848166']
    spyOn(toc, 'init').and.callThrough()
    toc.init()
  })

  it('Should return telemetry interact event spec', function () {
    spyOn(telemetryService, 'interactTelemetryData').and.returnValue(deferred.promise)
    deferred.resolve(telemetrySpec)
    spyOn(toc, 'generateInteractEvent').and.callThrough()
    toc.generateInteractEvent('course', 'do_212345541699534848166', 'course', '1.0', 'course-read', 'course')
    scope.$apply()
    var response = telemetryService.interactTelemetryData().$$state.value
    expect(response).toBe(telemetrySpec)
  })
})
