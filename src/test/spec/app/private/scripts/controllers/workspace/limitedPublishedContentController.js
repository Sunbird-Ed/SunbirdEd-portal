/**
 * name: limitedPublishedContentController.js
 * author: Anuj Gupta
 * Date: 26-09-2017
 */

'use strict'

describe('Controller: limitedPublishedContentController', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  var failedResponce = {'id': 'api.v1.search', 'ver': '1.0', 'ts': '2017-09-27T04:44:47.209Z', 'params': {'resmsgid': '96d76d90-a33e-11e7-b050-d9109721da9d', 'msgid': null, 'status': 'failed', 'err': 'ERR_CONTENT_SEARCH_FIELDS_MISSING', 'errmsg': 'Required fields for search content are missing'}, 'responseCode': 'CLIENT_ERROR', 'result': {}}

  var successResponce = {'id': 'api.v1.search', 'ver': '1.0', 'ts': '2017-09-27T04:44:13.926Z', 'params': {'resmsgid': '8300d860-a33e-11e7-b050-d9109721da9d', 'msgid': '82fa48b0-a33e-11e7-9161-9b28d749346d', 'status': 'successful', 'err': null, 'errmsg': null}, 'responseCode': 'OK', 'result': {'count': 119, 'content': [{'code': 'org.sunbird.pYaAS2', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'description': 'MP4 upload', 'language': ['English'], 'mimeType': 'video/mp4', 'idealScreenSize': 'normal', 'createdOn': '2017-08-18T05:11:10.664+0000', 'objectType': 'Content', 'appId': 'sunbird.portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-08-18T05:18:44.348+0000', 'contentEncoding': 'identity', 'contentType': 'Story', 'identifier': 'do_2123128469148876801121', 'creator': 'AmitKumar', 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1503033524348', 'idealScreenDensity': 'hdpi', 'createdBy': 'ac6fd279-ff03-4323-93a2-19a3cd2c7d47', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': '18-10 video', 'IL_UNIQUE_ID': 'do_2123128469148876801121', 'status': 'Draft', 'node_id': 56312, 'artifactUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/do_2123128469148876801121/Krishna%20-%20A%20Most%20Beautiful%20Song...%20Wonderful%20Composition%20on%20Lord%20Krishna.mp4', 'gradeLevel': ['Grade 4'], 'subject': 'Assamese', 'medium': 'Hindi', 'es_metadata_id': 'do_2123128469148876801121'}]}}
  var successResponseWithNoResult = {'id': 'api.v1.search', 'ver': '1.0', 'ts': '2017-09-27T11:52:42.620Z', 'params': {'resmsgid': '5e943bc0-a37a-11e7-88b7-ddc4007807ad', 'msgid': '5e8ee490-a37a-11e7-b45f-2d07a37bcb8f', 'status': 'successful', 'err': null, 'errmsg': null}, 'responseCode': 'OK', 'result': {'count': 0}}
  var retireFailedResponce = {'id': 'api.content.retire', 'ver': '1.0', 'ts': '2017-09-27T04:47:55.604Z', 'params': {'resmsgid': '07223940-a33f-11e7-bec3-f181544afb13', 'msgid': null, 'status': 'failed', 'err': 'ERR_CONTENT_CREATE_FIELDS_MISSING', 'errmsg': 'Required fields for create content are missing'}, 'responseCode': 'CLIENT_ERROR', 'result': {}}

  var retireSuccessResponce = {'id': 'api.content.retire', 'ver': '1.0', 'ts': '2017-09-27T04:46:47.720Z', 'params': {'resmsgid': 'deabf280-a33e-11e7-bec3-f181544afb13', 'msgid': 'dea2a3b0-a33e-11e7-bfa6-ef4d4c0ba89e', 'status': 'successful', 'err': null, 'errmsg': null}, 'responseCode': 'OK', 'result': []}

  var contentService,
    searchService,
    scope,
    rootScope,
    limitedPublishedContent,
    $q,
    deferred,
    timeout

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $controller, _contentService_, _searchService_, _$q_, _$timeout_) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    contentService = _contentService_
    searchService = _searchService_
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()

    limitedPublishedContent = $controller('LimitedPublishedContentController', {
      $rootScope: rootScope,
      $scope: scope,
      contentService: contentService,
      searchService: searchService
    })
  }))

  it('Should return when pass invalid page number', function () {
    limitedPublishedContent.pager.totalPages = 5
    spyOn(limitedPublishedContent, 'setPage').and.callThrough()
    limitedPublishedContent.setPage(10)
  })

  describe('Get all uploaded content', function () {
    it('search service ', function () {
      var contentData = {
        'request': {
          'filter': {
            'status': 'Draft',
            'mimeType': ['video/mp4']
          },
          'limit': 1
        }
      }
      spyOn(searchService, 'search').and.callThrough()
      searchService.search(contentData)
      expect(searchService.search).toBeDefined()
    })

    it('success', function () {
      spyOn(searchService, 'search').and.returnValue(deferred.promise)
      deferred.resolve(successResponce)
      spyOn(limitedPublishedContent, 'setPage').and.callThrough()
      limitedPublishedContent.setPage(1)
      scope.$apply()
      var response = searchService.search().$$state.value
      expect(response.result).not.toBe(undefined)
    })

    it('success with no content', function () {
      spyOn(searchService, 'search').and.returnValue(deferred.promise)
      deferred.resolve(successResponseWithNoResult)
      spyOn(limitedPublishedContent, 'setPage').and.callThrough()
      limitedPublishedContent.setPage(1)
      scope.$apply()
      var response = searchService.search().$$state.value
      expect(response.result).not.toBe(undefined)
    })

    it('failed due to missing required field', function () {
      spyOn(searchService, 'search').and.returnValue(deferred.promise)
      deferred.resolve(failedResponce)
      spyOn(limitedPublishedContent, 'setPage').and.callThrough()
      limitedPublishedContent.setPage(1)
      scope.$apply()
      var response = searchService.search().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('failed due to external error', function () {
      spyOn(searchService, 'search').and.returnValue(deferred.promise)
      deferred.reject()
      spyOn(limitedPublishedContent, 'setPage').and.callThrough()
      limitedPublishedContent.setPage(1)
      scope.$apply()
    })
  })

  it('Should open content editor', function () {
    spyOn(limitedPublishedContent, 'openContentPlayer').and.callThrough()
    limitedPublishedContent.openContentPlayer({mimeType: 'video/mp4'})
  })

  it('Should initialize ui element', function () {
    spyOn(limitedPublishedContent, 'initializeUIElement').and.callThrough()
    limitedPublishedContent.initializeUIElement()
  })

  it('Should open remove content model', function () {
    spyOn(limitedPublishedContent, 'openRemoveContentModel').and.callThrough()
    limitedPublishedContent.openRemoveContentModel('223423423')
    timeout.flush(10)
    expect(limitedPublishedContent.showRemoveContentModel).toBe(true)
  })

  it('Should remove content model', function () {
    spyOn(limitedPublishedContent, 'openRemoveContentModel').and.callThrough()
    limitedPublishedContent.openRemoveContentModel('223423423')
    timeout.flush(10)
    expect(limitedPublishedContent.showRemoveContentModel).toBe(true)
  })

  describe('Remove content', function () {
    it('retire service ', function () {
      var contentData = {
        contentIds: ['do_212342342342342']
      }
      spyOn(contentService, 'retire').and.callThrough()
      contentService.retire(contentData)
      expect(contentService.retire).toBeDefined()
    })

    it('success', function () {
      spyOn(contentService, 'retire').and.returnValue(deferred.promise)
      deferred.resolve(retireSuccessResponce)
      spyOn(limitedPublishedContent, 'deleteContent').and.callThrough()
      limitedPublishedContent.deleteContent('do_212342342342342')
      scope.$apply()
      var response = contentService.retire().$$state.value
      expect(response.result).not.toBe(undefined)
    })

    it('failed due to missing required field', function () {
      spyOn(contentService, 'retire').and.returnValue(deferred.promise)
      deferred.resolve(retireFailedResponce)
      spyOn(limitedPublishedContent, 'deleteContent').and.callThrough()
      limitedPublishedContent.deleteContent('do_212342342342342')
      scope.$apply()
      var response = contentService.retire().$$state.value
      expect(response).not.toBe(undefined)
    })

    it('failed due to external error', function () {
      spyOn(contentService, 'retire').and.returnValue(deferred.promise)
      deferred.reject({})
      spyOn(limitedPublishedContent, 'deleteContent').and.callThrough()
      limitedPublishedContent.deleteContent('do_212342342342342')
      scope.$apply()
    })
  })

  it('Check condition after deleting content', function () {
    spyOn(contentService, 'retire').and.returnValue(deferred.promise)
    deferred.resolve(retireSuccessResponce)
    limitedPublishedContent.limitedPublishedContentData = []
    spyOn(limitedPublishedContent, 'deleteContent').and.callThrough()
    limitedPublishedContent.deleteContent('12321312312')
    scope.$apply()
    var response = contentService.retire().$$state.value
    expect(response).not.toBe(undefined)
  })

  it('init the popup', function () {
    spyOn(limitedPublishedContent, 'initTocPopup').and.callThrough()
    limitedPublishedContent.initTocPopup()
  })
})
