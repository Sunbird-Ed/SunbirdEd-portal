'use strict'

describe('Controller:UpForReviewContentController', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  beforeEach(inject(function ($rootScope, $controller) { // eslint-disable-line no-undef
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  var searchService, // eslint-disable-line one-var
    scope,
    telemetryService,
    rootScope,
    upForReviewContent,
    deferred,
    timeout,
    upForReviewController,
    upforReviewContentResponse = {'id': 'api.v1.search', 'ver': '1.0', 'ts': '2017-09-27T11:40:07.356Z', 'params': {'resmsgid': '9c6817c0-a378-11e7-88b7-ddc4007807ad', 'msgid': '9c622450-a378-11e7-b45f-2d07a37bcb8f', 'status': 'successful', 'err': null, 'errmsg': null}, 'responseCode': 'OK', 'result': {'count': 318, 'content': [{'copyright': '', 'downloadUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/ndbt6_1475572795175_do_20047217.ecar', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.html-archive', 'source': '', 'objectType': 'Content', 'appIcon': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/c0475a3a05d6d8c42c364e57080e2b34_1475478762850.thumb.jpeg', 'gradeLevel': ['Grade 1'], 'me_totalTimespent': 170.27, 'me_averageTimespentPerSession': 21.28, 'me_totalRatings': 0, 'artifactUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/teltest23_200_1475572586_1475572770234.zip', 'contentType': 'Story', 'lastUpdatedBy': 'Test case', 'identifier': 'do_20047217', 'visibility': 'Default', 'portalOwner': '200', 'mediaType': 'content', 'ageGroup': ['5-6'], 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'license': 'Creative Commons Attribution (CC BY)', 'lastPublishedOn': '2016-10-04T09:19:57.437+0000', 'size': 16683991, 'concepts': ['Num:C3:SC1'], 'domain': ['numeracy'], 'me_averageSessionsPerDevice': 4, 'name': ' NDBT6', 'publisher': '', 'status': 'Review', 'me_averageInteractionsPerMin': 5.64, 'code': 'org.ekstep.numeracy.story.2393', 'me_totalSessionsCount': 8, 'description': 'ndbt6', 'posterImage': 'https://qa.ekstep.in/assets/public/content/c0475a3a05d6d8c42c364e57080e2b34_1475478762850.jpeg', 'idealScreenSize': 'normal', 'createdOn': '2016-10-04T06:18:22.815+0000', 'me_totalSideloads': 0, 'me_totalComments': 0, 'popularity': 170.27, 'lastUpdatedOn': '2017-09-23T06:49:30.426+0000', 'me_totalDevices': 2, 'me_totalDownloads': 2, 'owner': 'Srivathsa Dhanraj', 'os': ['All'], 'me_totalInteractions': 16, 'pkgVersion': 11, 'versionKey': '1506149370426', 'idealScreenDensity': 'hdpi', 'me_averageRating': 0, 'node_id': 0, 'compatibilityLevel': 1, 'collections': ['do_2122860039208222721152', 'do_2122882635614945281373', 'do_2122882777123061761379', 'do_2122905588577648641187', 'do_2122906051669934081195', 'do_2122913137619271681264', 'do_2122913268293632001269', 'do_212292806744178688159', 'do_2122931469935493121136', 'do_2122951620463493121224', 'do_2122954097278074881469', 'do_212295852260769792171', 'do_212295874958319616119', 'do_212295893139824640129', 'do_2122967526827212801101', 'do_2122967920000860161129', 'do_212297500449210368199', 'do_2122981517191495681172', 'do_212300297451610112120'], 'purpose': 'instructor', 'tags': ['APSSDC'], 'creator': 'Srivathsa Dhanraj', 'createdBy': '200', 'audience': ['Instructor'], 'SYS_INTERNAL_LAST_UPDATED_ON': '2017-06-12T05:09:53.824+0000', 'consumerId': '2c43f136-c02f-4494-9fb9-fd228e2c77e6', 'template': 'do_20043409', 's3Key': 'ecar_files/ndbt6_1475572795175_do_20047217.ecar', 'channel': 'in.ekstep', 'lastFlaggedOn': '2017-09-23T06:49:30.419+0000', 'flaggedBy': ['Test case', 'Test UserStage'], 'contentDisposition': 'inline', 'contentEncoding': 'gzip', 'keywords': ['APSSDC'], 'flags': ['Test case'], 'flagReasons': ['Copyright Violation'], 'es_metadata_id': 'do_20047217'}]}},
    permissionsService

  var zeroupForReviewContent = {
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

  var noupForReviewContent = {
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

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$rootScope_, _$controller_, _searchService_, _telemetryService_,
    _$timeout_, _$q_, _permissionsService_) { // eslint-disable-line no-undef
    rootScope = _$rootScope_
    scope = _$rootScope_.$new()
    searchService = _searchService_
    telemetryService = _telemetryService_
    timeout = _$timeout_
    permissionsService = _permissionsService_
    deferred = _$q_.defer()
    spyOn(permissionsService, 'getRoleOrgMap').and.returnValue({'CONTENT_REVIEWER': ['ORG_001']})
    upForReviewController = function () {
      return new _$controller_('UpForReviewContentController', {
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

  it('Should return upforReview content on getUpForReviewContent call', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(upforReviewContentResponse)
    upForReviewContent = upForReviewController()
    spyOn(upForReviewContent, 'getUpForReviewContent').and.callThrough()
    upForReviewContent.getUpForReviewContent()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    upForReviewContent.getUpForReviewContent = response.result.content
    expect(upForReviewContent.getUpForReviewContent).not.toBe(undefined)
  })

  it('Should return zero upforReview content', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(zeroupForReviewContent)
    upForReviewContent = upForReviewController()
    spyOn(upForReviewContent, 'getUpForReviewContent').and.callThrough()
    upForReviewContent.getUpForReviewContent()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    upForReviewContent.getUpForReviewContent = response.result.content
    expect(upForReviewContent.getUpForReviewContent).toBeDefined()
  })

  it('Should not return upforReview content', function (done) {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(noupForReviewContent)
    upForReviewContent = upForReviewController()
    spyOn(upForReviewContent, 'getUpForReviewContent').and.callThrough()
    upForReviewContent.getUpForReviewContent()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    done()
  })

  it('Should not search upforReview content', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.reject({})
    upForReviewContent = upForReviewController()
    spyOn(upForReviewContent, 'getUpForReviewContent').and.callThrough()
    upForReviewContent.getUpForReviewContent()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
  })

  it('Should open content player on openContentPlayer call', function () {
    var item = {mimeType: 'video/mp4'}
    upForReviewContent = upForReviewController()
    spyOn(upForReviewContent, 'openContentPlayer').and.callThrough()
    upForReviewContent.openContentPlayer(item)
    expect(upForReviewContent.openContentPlayer).toBeDefined()
  })

  it('Should set upforReview content page on setPage call', function () {
    var page = 1
    upForReviewContent = upForReviewController()
    spyOn(upForReviewContent, 'setPage').and.callThrough()
    upForReviewContent.setPage(page)
    expect(upForReviewContent.setPage).toBeDefined()
  })

  it('Should not set upforReview content page on setPage call', function () {
    var page = 0
    upForReviewContent = upForReviewController()
    spyOn(upForReviewContent, 'setPage').and.callThrough()
    upForReviewContent.setPage(page)
    expect(upForReviewContent.setPage).toBeDefined()
  })

  it('init the popup', function () {
    upForReviewContent = upForReviewController()
    spyOn(upForReviewContent, 'initTocPopup').and.callThrough()
    upForReviewContent.initTocPopup()
  })

  it('On press keyup', function () {
    upForReviewContent = upForReviewController()
    spyOn(upForReviewContent, 'keyUp').and.callThrough()
    upForReviewContent.keyUp()
    expect(upForReviewContent.typingTimer).toBeDefined(1000)
    timeout.flush(1000)
  })

  it('On press keyDown', function () {
    upForReviewContent = upForReviewController()
    spyOn(upForReviewContent, 'keyDown').and.callThrough()
    upForReviewContent.keyDown()
    expect(upForReviewContent.typingTimer).toBeDefined(-1)
  })

  it('Should add active class for selected filter option', function () {
    upForReviewContent = upForReviewController()
    upForReviewContent.search.selectedMedium = []
    spyOn(upForReviewContent.search, 'selectFilter').and.callThrough()
    upForReviewContent.search.selectFilter('selectedMedium', 'English', {target: ''})
    timeout.flush(0)
    expect(upForReviewContent.search.selectedMedium.length).toBe(1)
    scope.$apply()
  })

  it('Should remove active class for unselected filter option', function () {
    upForReviewContent = upForReviewController()
    upForReviewContent.search.selectedMedium = ['English']
    spyOn(upForReviewContent.search, 'selectFilter').and.callThrough()
    upForReviewContent.search.selectFilter('selectedMedium', 'English', {target: ''})
    timeout.flush(0)
    expect(upForReviewContent.search.selectedMedium.length).toBe(0)
    scope.$apply()
  })

  it('Should remove medium filter', function () {
    upForReviewContent = upForReviewController()
    upForReviewContent.search.selectedMedium = ['English']
    upForReviewContent.search.appliedMedium = ['English']
    upForReviewContent.appliedFilter = true
    spyOn(upForReviewContent.search, 'removeFilterSelection').and.callThrough()
    upForReviewContent.search.removeFilterSelection('appliedMedium', 'English', 'selectedMedium')
    expect(upForReviewContent.search.appliedMedium.length).toBe(0)
    scope.$apply()
  })

  it('Should remove medium filter with all other filter', function () {
    upForReviewContent = upForReviewController()
    upForReviewContent.search.selectedMedium = ['English', 'Hindi']
    upForReviewContent.search.selectedContentType = ['Book']
    upForReviewContent.search.selectedBoard = ['CBSE']
    upForReviewContent.search.selectedSubject = ['English']
    upForReviewContent.search.selectedGrades = ['Grade1']
    upForReviewContent.search.appliedMedium = ['English']
    upForReviewContent.appliedFilter = true
    spyOn(upForReviewContent.search, 'removeFilterSelection').and.callThrough()
    upForReviewContent.search.removeFilterSelection('appliedMedium', 'English', 'selectedMedium')
    expect(upForReviewContent.search.appliedMedium.length).toBe(1)
    scope.$apply()
  })

  it('Should apply sorting on search result call applySorting', function () {
    upForReviewContent = upForReviewController()
    upForReviewContent.searchText = 'text'
    upForReviewContent.appliedFilter = true
    upForReviewContent.search.selectedMedium = ['Medium']
    upForReviewContent.search.selectedContentType = ['TextBook']
    upForReviewContent.search.selectedBoard = ['ICSE']
    upForReviewContent.search.selectedSubject = ['English']
    upForReviewContent.search.selectedGrades = ['Grade1']
    upForReviewContent.search.sortByOption = 'Name A-Z'
    upForReviewContent.search.sortIcon = false
    spyOn(upForReviewContent.search, 'applySorting').and.callThrough()
    upForReviewContent.search.applySorting()
    expect(upForReviewContent.search.sortBy['Name A-Z']).toBe('desc')
    scope.$apply()
  })

  it('Should reset all the filters', function () {
    upForReviewContent = upForReviewController()
    spyOn(upForReviewContent.search, 'resetFilter').and.callThrough()
    upForReviewContent.search.resetFilter()
    expect(upForReviewContent.search.appliedMedium.length).toBe(0)
    scope.$apply()
  })

  it('Should get content Type values ', function () {
    upForReviewContent = upForReviewController()
    spyOn(upForReviewContent.search, 'getSelectedContentTypeValue').and.callThrough()
    var value = upForReviewContent.search.getSelectedContentTypeValue([{key: 'Book', value: 'Book'}], 'Book')
    expect(value).toBe('Book')
    scope.$apply()
  })

  it('Should get defined show error', function () {
    upForReviewContent = upForReviewController()
    spyOn(upForReviewContent, 'showErrorMessage').and.callThrough()
    var errorObj = upForReviewContent.showErrorMessage(true, 'message', 'error', 'User defined Message')
    expect(errorObj.messageText).toBe('User defined Message')
    scope.$apply()
  })

  it('Should show filter popup', function () {
    upForReviewContent = upForReviewController()
    spyOn(upForReviewContent, 'showFilterPopup').and.callThrough()
    upForReviewContent.showFilterPopup()
    timeout.flush(0)
    expect(upForReviewContent.hideFilterPopup).toBe(true)
    scope.$apply()
  })

  it('Should hide filter popup', function () {
    upForReviewContent = upForReviewController()
    spyOn(upForReviewContent, 'hideFilter').and.callThrough()
    upForReviewContent.hideFilter()
    expect(upForReviewContent.hideFilterPopup).toBe(false)
    scope.$apply()
  })

  it('Should return telemetry interact event spec', function () {
    upForReviewContent = upForReviewController()
    spyOn(telemetryService, 'interactTelemetryData').and.returnValue(deferred.promise)
    deferred.resolve(telemetrySpec)
    spyOn(upForReviewContent, 'generateInteractEvent').and.callThrough()
    upForReviewContent.generateInteractEvent('course', 'do_212345541699534848166', 'course',
      '1.0', 'course-read', 'course')
    scope.$apply()
    var response = telemetryService.interactTelemetryData().$$state.value
    expect(response).toBe(telemetrySpec)
  })
})
