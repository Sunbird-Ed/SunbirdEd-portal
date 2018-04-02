'use strict'

describe('Controller:ReviewContentController', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  var searchService
  var scope
  var rootScope
  var reviewContent
  var deferred
  var createContoller
  var reviewContentResponse = {'id': 'api.v1.search', 'ver': '1.0', 'ts': '2017-09-27T12:22:18.494Z', 'params': {'resmsgid': '811519e0-a37e-11e7-88b7-ddc4007807ad', 'msgid': '810ed850-a37e-11e7-b45f-2d07a37bcb8f', 'status': 'successful', 'err': null, 'errmsg': null}, 'responseCode': 'OK', 'result': {'count': 877, 'content': [{'code': 'org.ekstep.textbook.1490001165992', 'subject': 'Maths', 'description': 'test', 'language': ['English'], 'medium': 'Bengali', 'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal', 'createdOn': '2017-03-20T09:12:35.575+0000', 'objectType': 'Content', 'gradeLevel': ['Kindergarten'], 'appIcon': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_212206089466478592111/artifact/55a16ff0ce5f86507f8deddcc81aae4e_1489405491273.thumb.jpeg', 'lastUpdatedOn': '2017-03-20T09:44:47.440+0000', 'contentType': 'TextBook', 'owner': 'test', 'lastUpdatedBy': '239', 'identifier': 'do_212206089466478592111', 'visibility': 'Default', 'os': ['All'], 'portalOwner': '436', 'mediaType': 'content', 'ageGroup': ['5-6'], 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1496993036444', 'idealScreenDensity': 'hdpi', 'compatibilityLevel': 2, 'name': '   !@@@^^^', 'board': 'CBSE', 'status': 'Review', 'node_id': 51687, 'tags': ['test'], 'children': [], 'lastPublishedBy': '239', 'lastPublishedOn': '2017-03-20T09:28:59.998+0000', 'posterImage': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_212201209784377344146/artifact/55a16ff0ce5f86507f8deddcc81aae4e_1489405491273.jpeg', 'pkgVersion': 1, 'audience': ['Learner'], 'createdBy': '436', 'consumerId': '2c43f136-c02f-4494-9fb9-fd228e2c77e6', 'SYS_INTERNAL_LAST_UPDATED_ON': '2017-06-09T07:23:56.444+0000', 'notes': '', 'publishError': 'Failed to cleanup the input    !@@@^^^', 'edition': '', 'publication': '', 'prevState': 'Review', 'channel': 'in.ekstep', 'appId': 'qa.ekstep.in', 'contentDisposition': 'inline', 'contentEncoding': 'gzip', 'keywords': ['test'], 'es_metadata_id': 'do_212206089466478592111'}]}}

  var zeroReviewContent = {
    id: 'api.v1.search',
    ver: '1.0',
    ts: '2017-09-22T11:42:07.455Z',
    params: {
      resmsgid: '0fecfef0-9f8b-11e7-b050-d9109721da9d',
      msgid: null,
      status: 'successful',
      err: null,
      errmsg: null
    },
    responseCode: 'OK',
    result: {count: 0, content: []}
  }

  var noReviewContent = {
    id: 'api.v1.search',
    ver: '1.0',
    ts: '2017-09-22T11:40:07.356Z',
    params: {
      resmsgid: '0fecfef0-9f8b-11e7-b050-d9109721da9d',
      msgid: null,
      status: 'failed',
      err: 'WORKSPACE_DRAFT_NO_CONTENT',
      errmsg: 'Get draft content failed'
    },
    responseCode: 'RESOURCE_NOT_FOUND',
    result: {count: 0, content: [{}]}
  }

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$rootScope_, _$controller_, _searchService_, _$q_) {
    rootScope = _$rootScope_
    scope = _$rootScope_.$new()
    searchService = _searchService_
    deferred = _$q_.defer()
    createContoller = function () {
      return new _$controller_('ReviewContentController', {
        $rootScope: rootScope,
        $scope: scope
      })
    }
  }))

  xit('Should called search service', function () {
    spyOn(searchService, 'search').and.callThrough()
    searchService.search()
    expect(searchService.search).toBeDefined()
  })

  xit('Should return flagged content on getReviewContent call', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(reviewContentResponse)
    reviewContent = createContoller()
    spyOn(reviewContent, 'getReviewContent').and.callThrough()
    reviewContent.getReviewContent()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    reviewContent.getReviewContent = response.result.content
    expect(reviewContent.getReviewContent).not.toBe(undefined)
  })

  it('Should return zero flagged content', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(zeroReviewContent)
    reviewContent = createContoller()
    spyOn(reviewContent, 'getReviewContent').and.callThrough()
    reviewContent.getReviewContent()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    reviewContent.getReviewContent = response.result.content
    expect(reviewContent.getReviewContent).toBeDefined()
  })

  it('Should not return flagged content', function (done) {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(noReviewContent)
    reviewContent = createContoller()
    spyOn(reviewContent, 'getReviewContent').and.callThrough()
    reviewContent.getReviewContent()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    done()
  })

  it('Should not search flagged content', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.reject({})
    reviewContent = createContoller()
    spyOn(reviewContent, 'getReviewContent').and.callThrough()
    reviewContent.getReviewContent()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
  })

  it('Should open content player on openContentPlayer call', function () {
    reviewContent = createContoller()
    spyOn(reviewContent, 'openContentPlayer').and.callThrough()
    expect(reviewContent.openContentPlayer).toBeDefined()
  })

  it('Should set flagged content page on setPage call', function () {
    var page = 1
    reviewContent = createContoller()
    spyOn(reviewContent, 'setPage').and.callThrough()
    reviewContent.setPage(page)
    expect(reviewContent.setPage).toBeDefined()
  })

  it('Should not set flagged content page on setPage call', function () {
    var page = 0
    reviewContent = createContoller()
    spyOn(reviewContent, 'setPage').and.callThrough()
    reviewContent.setPage(page)
    expect(reviewContent.setPage).toBeDefined()
  })

  it('init the popup', function () {
    spyOn(reviewContent, 'initTocPopup').and.callThrough()
    reviewContent.initTocPopup()
  })
})
