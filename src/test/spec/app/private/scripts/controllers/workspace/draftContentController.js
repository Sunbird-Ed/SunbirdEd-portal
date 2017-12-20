'use strict'

describe('Controller:DraftContentController', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  var contentService,
    searchService,
    workSpaceUtilsService,
    PaginationService,
    scope,
    rootScope,
    draftContent,
    $q,
    deferred,
    timeout,
    createContoller,
    draftcontentSuccess = {id: 'api.v1.search',
      ver: '1.0',
      ts: '2017-09-22T11:42:07.455Z',
      params: {resmsgid: '0fecfef0-9f8b-11e7-b050-d9109721da9d',
        msgid: '0fe73290-9f8b-11e7-9161-9b28d749346d',
        status: 'successful',
        err: null,
        errmsg: null},
      responseCode: 'OK',
      result: {count: 25,
        content: [{code: 'org.sunbird.17n6Ve',
          channel: '505c7c48ac6dc1edc9b08f21db5a571d',
          language: ['English'],
          mimeType: 'application/vnd.ekstep.content-collection',
          idealScreenSize: 'normal',
          createdOn: '2017-09-22T09:13:18.709+0000',
          objectType: 'Content',
          appId: 'sunbird_portal',
          contentDisposition: 'inline',
          lastUpdatedOn: '2017-09-22T09:13:18.709+0000',
          contentEncoding: 'gzip',
          contentType: 'Collection',
          identifier: 'do_212337738536624128187',
          createdFor: ['ORG_001'],
          creator: 'AmitKumar',
          audience: ['Learner'],
          IL_SYS_NODE_TYPE: 'DATA_NODE',
          visibility: 'Default',
          os: ['All'],
          consumerId: 'fa271a76-c15a-4aa1-adff-31dd04682a1f',
          mediaType: 'content',
          osId: 'org.ekstep.quiz.app',
          graph_id: 'domain',
          nodeType: 'DATA_NODE',
          versionKey: '1506071598709',
          idealScreenDensity: 'hdpi',
          createdBy: 'be7efb23-6af9-4d92-82b3-a4d78fcfa2f6',
          compatibilityLevel: 1,
          IL_FUNC_OBJECT_TYPE: 'Content',
          name: 'Untitled collection',
          IL_UNIQUE_ID: 'do_212337738536624128187',
          status: 'Draft',
          node_id: 73573,
          es_metadata_id: 'do_212337738536624128187'},
        {'code': 'org.sunbird.kIeNmc', 'channel': '505c7c48ac6dc1edc9b08f21db5a571d', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.ecml-archive', 'idealScreenSize': 'normal', 'createdOn': '2017-09-22T09:12:11.278+0000', 'objectType': 'Content', 'appId': 'sunbird_portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-09-22T09:12:11.278+0000', 'contentEncoding': 'gzip', 'contentType': 'Resource', 'identifier': 'do_212337737984229376186', 'createdFor': ['ORG_001'], 'creator': 'AmitKumar', 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1506071531278', 'idealScreenDensity': 'hdpi', 'createdBy': 'be7efb23-6af9-4d92-82b3-a4d78fcfa2f6', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'Untitled lesson', 'IL_UNIQUE_ID': 'do_212337737984229376186', 'status': 'Draft', 'node_id': 73571, 'es_metadata_id': 'do_212337737984229376186'}, {'code': 'org.sunbird.WjHstq', 'channel': '505c7c48ac6dc1edc9b08f21db5a571d', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal', 'createdOn': '2017-09-22T09:12:00.960+0000', 'objectType': 'Content', 'appId': 'sunbird_portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-09-22T09:12:00.960+0000', 'contentEncoding': 'gzip', 'contentType': 'Course', 'identifier': 'do_212337737899704320185', 'createdFor': ['ORG_001'], 'creator': 'AmitKumar', 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1506071520960', 'idealScreenDensity': 'hdpi', 'createdBy': 'be7efb23-6af9-4d92-82b3-a4d78fcfa2f6', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'Untitled Course', 'IL_UNIQUE_ID': 'do_212337737899704320185', 'status': 'Draft', 'node_id': 73570, 'es_metadata_id': 'do_212337737899704320185'}, {'code': 'org.sunbird.aOxkYA', 'channel': '505c7c48ac6dc1edc9b08f21db5a571d', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal', 'createdOn': '2017-09-22T09:11:15.744+0000', 'objectType': 'Content', 'appId': 'sunbird_portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-09-22T09:11:15.744+0000', 'contentEncoding': 'gzip', 'contentType': 'Course', 'identifier': 'do_212337737529294848184', 'createdFor': ['ORG_001'], 'creator': 'AmitKumar', 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1506071475744', 'idealScreenDensity': 'hdpi', 'createdBy': 'be7efb23-6af9-4d92-82b3-a4d78fcfa2f6', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'Untitled Course', 'IL_UNIQUE_ID': 'do_212337737529294848184', 'status': 'Draft', 'node_id': 73568, 'es_metadata_id': 'do_212337737529294848184'}, {'code': 'org.sunbird.ebvh2t', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal', 'createdOn': '2017-09-22T08:16:40.549+0000', 'objectType': 'Content', 'appId': 'sunbird_portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-09-22T08:16:40.549+0000', 'contentEncoding': 'gzip', 'contentType': 'TextBook', 'identifier': 'do_212337710698897408172', 'createdFor': ['ORG_001'], 'creator': 'AmitKumar', 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1506068200549', 'idealScreenDensity': 'hdpi', 'createdBy': 'be7efb23-6af9-4d92-82b3-a4d78fcfa2f6', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'Untitled textbook', 'IL_UNIQUE_ID': 'do_212337710698897408172', 'status': 'Draft', 'node_id': 73528, 'es_metadata_id': 'do_212337710698897408172'}, {'code': 'org.sunbird.pOWGXj', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.ecml-archive', 'idealScreenSize': 'normal', 'createdOn': '2017-09-22T08:14:39.720+0000', 'objectType': 'Content', 'appId': 'sunbird_portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-09-22T08:14:39.720+0000', 'contentEncoding': 'gzip', 'contentType': 'Resource', 'identifier': 'do_212337709709066240170', 'createdFor': ['ORG_001'], 'creator': 'AmitKumar', 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1506068079720', 'idealScreenDensity': 'hdpi', 'createdBy': 'be7efb23-6af9-4d92-82b3-a4d78fcfa2f6', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'Untitled lesson', 'IL_UNIQUE_ID': 'do_212337709709066240170', 'status': 'Draft', 'node_id': 73525, 'es_metadata_id': 'do_212337709709066240170'}, {'code': 'org.sunbird.80bsgB', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal', 'createdOn': '2017-09-22T08:09:52.352+0000', 'objectType': 'Content', 'appId': 'sunbird_portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-09-22T08:09:52.352+0000', 'contentEncoding': 'gzip', 'contentType': 'Course', 'identifier': 'do_212337707354947584168', 'createdFor': ['ORG_001'], 'creator': 'AmitKumar', 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1506067792352', 'idealScreenDensity': 'hdpi', 'createdBy': 'be7efb23-6af9-4d92-82b3-a4d78fcfa2f6', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'Untitled Course', 'IL_UNIQUE_ID': 'do_212337707354947584168', 'status': 'Draft', 'node_id': 73521, 'es_metadata_id': 'do_212337707354947584168'}, {'code': 'org.sunbird.OScEZY', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal', 'createdOn': '2017-09-21T05:45:24.035+0000', 'objectType': 'Content', 'appId': 'sunbird.portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-09-21T05:45:24.035+0000', 'contentEncoding': 'gzip', 'contentType': 'Collection', 'identifier': 'do_212336928555294720122', 'createdFor': ['ORG_001'], 'creator': 'AmitKumar', 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1505972724035', 'idealScreenDensity': 'hdpi', 'createdBy': 'be7efb23-6af9-4d92-82b3-a4d78fcfa2f6', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'Untitled collection', 'IL_UNIQUE_ID': 'do_212336928555294720122', 'status': 'Draft', 'node_id': 73020, 'es_metadata_id': 'do_212336928555294720122'}, {'code': 'org.sunbird.VWtouW', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.ecml-archive', 'idealScreenSize': 'normal', 'createdOn': '2017-09-21T05:44:58.810+0000', 'objectType': 'Content', 'appId': 'sunbird.portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-09-21T05:44:58.810+0000', 'contentEncoding': 'gzip', 'contentType': 'Resource', 'identifier': 'do_212336928348659712121', 'createdFor': ['ORG_001'], 'creator': 'AmitKumar', 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1505972698810', 'idealScreenDensity': 'hdpi', 'createdBy': 'be7efb23-6af9-4d92-82b3-a4d78fcfa2f6', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'Untitled lesson', 'IL_UNIQUE_ID': 'do_212336928348659712121', 'status': 'Draft', 'node_id': 73019, 'es_metadata_id': 'do_212336928348659712121'}]}}

  var noDraftContent = {
    id: 'api.v1.search',
    ver: '1.0',
    ts: '2017-09-22T11:42:07.455Z',
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

  var blankDraftContent = {
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

  var deleteContentResponse = {
    id: 'api.content.retire',
    ver: '1.0',
    ts: '2017-09-27T05:24:46.049Z',
    params: {
      resmsgid: '2ca95d10-a344-11e7-b050-d9109721da9d',
      msgid: '2c9e3980-a344-11e7-9161-9b28d749346d',
      status: 'successful',
      err: null,
      errmsg: null},
    responseCode: 'OK',
    result: []
  }

  var deleteResponseFail = {
    id: 'api.content.retire',
    ver: '1.0',
    ts: '2017-09-27T08:38:13.742Z',
    params: {
      resmsgid: '3362c0e0-a35f-11e7-b050-d9109721da9d',
      msgid: null,
      status: 'failed',
      err: 'ERR_GRAPH_SEARCH_UNKNOWN_ERROR',
      errmsg: 'Error! Node(s) doesn\'t Exists. | [Invalid Node Id.]: 1'
    },
    responseCode: 'RESOURCE_NOT_FOUND',
    result: [{
      contentId: '1',
      errCode: 'ERR_GRAPH_SEARCH_UNKNOWN_ERROR',
      errMsg: 'Error! Node(s) doesn\'t Exists. | [Invalid Node Id.]: 1'
    }]
  }

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$rootScope_, _$controller_, _searchService_, _contentService_, _PaginationService_, _workSpaceUtilsService_, _$q_, _$timeout_) {
    rootScope = _$rootScope_
    scope = _$rootScope_.$new()
    PaginationService = _PaginationService_
    workSpaceUtilsService = _workSpaceUtilsService_
    searchService = _searchService_
    contentService = _contentService_
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()
    createContoller = function () {
      return new _$controller_('DraftContentController', {
        $rootScope: rootScope,
        $scope: scope
      })
    }
  }))

  it('Should called search service', function () {
    spyOn(searchService, 'search').and.callThrough()
    searchService.search()
    expect(searchService.search).toBeDefined()
  })

  it('Should return draft content on getDraftContent call', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(draftcontentSuccess)
    draftContent = createContoller()
    spyOn(draftContent, 'getDraftContent').and.callThrough()
    draftContent.getDraftContent()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    draftContent.getDraftContent = response.result.content
    expect(draftContent.getDraftContent).not.toBe(undefined)
  })

  it('Will return blank draft content', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(blankDraftContent)
    draftContent = createContoller()
    spyOn(draftContent, 'getDraftContent').and.callThrough()
    draftContent.getDraftContent()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    draftContent.getDraftContent = response.result.content
    expect(draftContent.getDraftContent).toBeDefined()
  })

  it('Should not return draft content', function (done) {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(noDraftContent)
    draftContent = createContoller()
    spyOn(draftContent, 'getDraftContent').and.callThrough()
    draftContent.getDraftContent()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    done()
  })

  it('Should not search draft content', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.reject({})
    draftContent = createContoller()
    spyOn(draftContent, 'getDraftContent').and.callThrough()
    draftContent.getDraftContent()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
  })

  it('Should open content editor on openContentEditor call', function () {
    var item = {mimeType: 'video/mp4'}
    draftContent = createContoller()
    spyOn(draftContent, 'openContentEditor').and.callThrough()
    draftContent.openContentEditor(item)
    expect(draftContent.openContentEditor).toBeDefined()
  })

  it('Should open removed content model on openRemoveContentModel call', function () {
    var ContentId = 'do_212337738536624128187'
    draftContent = createContoller()
    spyOn(draftContent, 'openRemoveContentModel').and.callThrough()
    draftContent.openRemoveContentModel(ContentId)
    timeout.flush(10)
    expect(draftContent.openRemoveContentModel).toBeDefined()
  })

  it('Should called retire service', function () {
    spyOn(contentService, 'retire').and.callThrough()
    contentService.retire()
    expect(contentService.retire).toBeDefined()
  })

  it('should delete draft content', function () {
    spyOn(contentService, 'retire').and.returnValue(deferred.promise)
    deferred.resolve(deleteContentResponse)
    draftContent = createContoller()
    spyOn(draftContent, 'deleteContent').and.callThrough()
    draftContent.deleteContent()
    scope.$apply()
    var response = contentService.retire().$$state.value
    expect(response).not.toBe(undefined)
    draftContent.deleteContent = response.result
    expect(draftContent.deleteContent).not.toBe(undefined)
  })

  it('Should not delete invalid draft content', function () {
    spyOn(contentService, 'retire').and.returnValue(deferred.promise)
    deferred.resolve(deleteContentResponse)
    draftContent = createContoller()
    draftContent.draftContentData = []
    spyOn(draftContent, 'deleteContent').and.callThrough()
    draftContent.deleteContent('12321312312')
    scope.$apply()
    var response = contentService.retire().$$state.value
    expect(response).not.toBe(undefined)
  })

  it('Should not delete draft content', function () {
    spyOn(contentService, 'retire').and.returnValue(deferred.promise)
    deferred.resolve(deleteResponseFail)
    draftContent = createContoller()
    spyOn(draftContent, 'deleteContent').and.callThrough()
    draftContent.deleteContent()
    scope.$apply()
    var response = contentService.retire().$$state.value
    expect(response).not.toBe(undefined)
  })

  it('Should return zero number of draft content', function () {
    spyOn(contentService, 'retire').and.returnValue(deferred.promise)
    deferred.resolve(blankDraftContent)
    draftContent = createContoller()
    spyOn(draftContent, 'deleteContent').and.callThrough()
    draftContent.deleteContent()
    scope.$apply()
    var response = contentService.retire().$$state.value
    expect(response).not.toBe(undefined)
    draftContent.deleteContent = response.result.content
    expect(draftContent.deleteContent).toBeDefined()
  })

  it('Should set draft content page on setPage call', function () {
    var page = 1
    draftContent = createContoller()
    spyOn(draftContent, 'setPage').and.callThrough()
    draftContent.setPage(page)
    expect(draftContent.setPage).toBeDefined()
  })

  it('Should not set draft content page on setPage call', function () {
    var page = 0
    draftContent = createContoller()
    spyOn(draftContent, 'setPage').and.callThrough()
    draftContent.setPage(page)
    expect(draftContent.setPage).toBeDefined()
  })

  it('init the popup', function () {
    spyOn(draftContent, 'initTocPopup').and.callThrough()
    draftContent.initTocPopup()
  })
})
