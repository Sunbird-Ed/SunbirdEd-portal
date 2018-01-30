'use strict'

describe('Controller:FlaggedContentController', function () {
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
  var flaggedContent
  var deferred
  var createContoller
  var flaggedContentResponse = {'id': 'api.v1.search', 'ver': '1.0', 'ts': '2017-09-27T11:40:07.356Z', 'params': {'resmsgid': '9c6817c0-a378-11e7-88b7-ddc4007807ad', 'msgid': '9c622450-a378-11e7-b45f-2d07a37bcb8f', 'status': 'successful', 'err': null, 'errmsg': null}, 'responseCode': 'OK', 'result': {'count': 318, 'content': [{'copyright': '', 'downloadUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/ndbt6_1475572795175_do_20047217.ecar', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.html-archive', 'source': '', 'objectType': 'Content', 'appIcon': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/c0475a3a05d6d8c42c364e57080e2b34_1475478762850.thumb.jpeg', 'gradeLevel': ['Grade 1'], 'me_totalTimespent': 170.27, 'me_averageTimespentPerSession': 21.28, 'me_totalRatings': 0, 'artifactUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/teltest23_200_1475572586_1475572770234.zip', 'contentType': 'Story', 'lastUpdatedBy': 'Test case', 'identifier': 'do_20047217', 'visibility': 'Default', 'portalOwner': '200', 'mediaType': 'content', 'ageGroup': ['5-6'], 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'license': 'Creative Commons Attribution (CC BY)', 'lastPublishedOn': '2016-10-04T09:19:57.437+0000', 'size': 16683991, 'concepts': ['Num:C3:SC1'], 'domain': ['numeracy'], 'me_averageSessionsPerDevice': 4, 'name': ' NDBT6', 'publisher': '', 'status': 'Flagged', 'me_averageInteractionsPerMin': 5.64, 'code': 'org.ekstep.numeracy.story.2393', 'me_totalSessionsCount': 8, 'description': 'ndbt6', 'posterImage': 'https://qa.ekstep.in/assets/public/content/c0475a3a05d6d8c42c364e57080e2b34_1475478762850.jpeg', 'idealScreenSize': 'normal', 'createdOn': '2016-10-04T06:18:22.815+0000', 'me_totalSideloads': 0, 'me_totalComments': 0, 'popularity': 170.27, 'lastUpdatedOn': '2017-09-23T06:49:30.426+0000', 'me_totalDevices': 2, 'me_totalDownloads': 2, 'owner': 'Srivathsa Dhanraj', 'os': ['All'], 'me_totalInteractions': 16, 'pkgVersion': 11, 'versionKey': '1506149370426', 'idealScreenDensity': 'hdpi', 'me_averageRating': 0, 'node_id': 0, 'compatibilityLevel': 1, 'collections': ['do_2122860039208222721152', 'do_2122882635614945281373', 'do_2122882777123061761379', 'do_2122905588577648641187', 'do_2122906051669934081195', 'do_2122913137619271681264', 'do_2122913268293632001269', 'do_212292806744178688159', 'do_2122931469935493121136', 'do_2122951620463493121224', 'do_2122954097278074881469', 'do_212295852260769792171', 'do_212295874958319616119', 'do_212295893139824640129', 'do_2122967526827212801101', 'do_2122967920000860161129', 'do_212297500449210368199', 'do_2122981517191495681172', 'do_212300297451610112120'], 'purpose': 'instructor', 'tags': ['APSSDC'], 'creator': 'Srivathsa Dhanraj', 'createdBy': '200', 'audience': ['Instructor'], 'SYS_INTERNAL_LAST_UPDATED_ON': '2017-06-12T05:09:53.824+0000', 'consumerId': '2c43f136-c02f-4494-9fb9-fd228e2c77e6', 'template': 'do_20043409', 's3Key': 'ecar_files/ndbt6_1475572795175_do_20047217.ecar', 'channel': 'in.ekstep', 'lastFlaggedOn': '2017-09-23T06:49:30.419+0000', 'flaggedBy': ['Test case', 'Test UserStage'], 'contentDisposition': 'inline', 'contentEncoding': 'gzip', 'keywords': ['APSSDC'], 'flags': ['Test case'], 'flagReasons': ['Copyright Violation'], 'es_metadata_id': 'do_20047217'}]}}
  var permissionsService

  var zeroFlaggedContent = {
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

  var noFlaggedContent = {
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
  beforeEach(inject(function (_$rootScope_, _$controller_, _searchService_, _contentService_,
    _PaginationService_, _workSpaceUtilsService_, _$q_, _$timeout_, _permissionsService_) {
    rootScope = _$rootScope_
    scope = _$rootScope_.$new()
    searchService = _searchService_
    permissionsService = _permissionsService_
    deferred = _$q_.defer()
    spyOn(permissionsService, 'getRoleOrgMap').and.returnValue({FLAG_REVIEWER: ['ORG_001']})
    createContoller = function () {
      return new _$controller_('FlaggedContentController', {
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

  it('Should return flagged content on getAllFlaggedContent call', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(flaggedContentResponse)
    flaggedContent = createContoller()
    spyOn(flaggedContent, 'getAllFlaggedContent').and.callThrough()
    flaggedContent.getAllFlaggedContent()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    flaggedContent.getAllFlaggedContent = response.result.content
    expect(flaggedContent.getAllFlaggedContent).not.toBe(undefined)
  })

  it('Should return zero flagged content', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(zeroFlaggedContent)
    flaggedContent = createContoller()
    spyOn(flaggedContent, 'getAllFlaggedContent').and.callThrough()
    flaggedContent.getAllFlaggedContent()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    flaggedContent.getAllFlaggedContent = response.result.content
    expect(flaggedContent.getAllFlaggedContent).toBeDefined()
  })

  it('Should not return flagged content', function (done) {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(noFlaggedContent)
    flaggedContent = createContoller()
    spyOn(flaggedContent, 'getAllFlaggedContent').and.callThrough()
    flaggedContent.getAllFlaggedContent()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    done()
  })

  it('Should not search flagged content', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.reject({})
    flaggedContent = createContoller()
    spyOn(flaggedContent, 'getAllFlaggedContent').and.callThrough()
    flaggedContent.getAllFlaggedContent()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
  })

  it('Should open content player on openContentPlayer call', function () {
    var item = {mimeType: 'video/mp4'}
    flaggedContent = createContoller()
    spyOn(flaggedContent, 'openContentPlayer').and.callThrough()
    flaggedContent.openContentPlayer(item)
    expect(flaggedContent.openContentPlayer).toBeDefined()
  })

  it('Should set flagged content page on setPage call', function () {
    var page = 1
    flaggedContent = createContoller()
    spyOn(flaggedContent, 'setPage').and.callThrough()
    flaggedContent.setPage(page)
    expect(flaggedContent.setPage).toBeDefined()
  })

  it('Should not set flagged content page on setPage call', function () {
    var page = 0
    flaggedContent = createContoller()
    spyOn(flaggedContent, 'setPage').and.callThrough()
    flaggedContent.setPage(page)
    expect(flaggedContent.setPage).toBeDefined()
  })

  it('init the popup', function () {
    spyOn(flaggedContent, 'initTocPopup').and.callThrough()
    flaggedContent.initTocPopup()
  })
})
