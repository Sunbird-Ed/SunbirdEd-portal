
'use strict'

describe('Controller: createAnnouncementCtrl', function () {
  beforeEach(module('playerApp'))
  var adminCtl
  var createAnn
  var dashboardService
  var announcementService
  var timeout
  var state
  var config
  var scope
  var toasterService
  var permissionsService
  var deferred
  var $state
  var modal
  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))
  beforeEach(inject(function ($rootScope,
       $controller,
       _dashboardService_,
       _announcementService_,
       _toasterService_,
      _permissionsService_,
      _$timeout_,
      _$q_,
      _$state_

          ) {
    dashboardService = _dashboardService_
    announcementService = _announcementService_
    toasterService = _toasterService_
    permissionsService = _permissionsService_
    scope = $rootScope.$new()
    timeout = _$timeout_
    $state = _$state_
    modal = jasmine.createSpyObj('modal', ['show', 'hide'])
    deferred = _$q_.defer()
    spyOn(toasterService, 'success').and.callThrough()
    spyOn(toasterService, 'error').and.callThrough()
    spyOn(announcementService, 'getDefinitions').and.returnValue(deferred.promise)
    createAnn = $controller('createAnnouncementCtrl', {
      $scope: scope,
      $rootScope: $rootScope,
      dashboardService: dashboardService,
      toasterService: toasterService,
      permissionsService: permissionsService,
      $state: $state,
      $modal: modal
    })
  }))

  it('should initialize create announcement Modal', function (done) {
    spyOn(createAnn, 'initializeModal').and.callThrough()
    createAnn.initializeModal()
    timeout.flush(100)
    done()
  })

  it('should initialize create announcement Modal', function (done) {
    spyOn(createAnn, 'initializeModal').and.callThrough()
    createAnn.createAnnouncement()
    done()
  })

  it('Add one more link', function (done) {
    spyOn(createAnn, 'addNewLink').and.callThrough()
    createAnn.addNewLink()
    done()
  })

  it('Remove link', function (done) {
    spyOn(createAnn, 'removeLink').and.callThrough()
    var index = 0
    createAnn.repeatableWebLinks.push({'id': 'choice' + 0})
    createAnn.data.links = {'0': 'https;//google.co.in'}
    createAnn.removeLink(index)
    done()
  })

  it('preview announcement', function (done) {
    spyOn(createAnn, 'previewAnn').and.callThrough()
    var index = 0
    createAnn.repeatableWebLinks.push({'id': 'choice' + 0})
    createAnn.data.links = {0: 'https;//google.co.in', 1: 'https://google.com'}
    createAnn.previewAnn(index)
    done()
  })

  it('convert file size into KB / MB', function (done) {
    spyOn(createAnn, 'convertFileSize').and.callThrough()
    createAnn.convertFileSize(1234)
    done()
  })

  it('should not convert file size into KB / MB', function (done) {
    spyOn(createAnn, 'convertFileSize').and.callThrough()
    createAnn.convertFileSize(0)
    done()
  })

  it('Hide creation modal', function (done) {
    spyOn(createAnn, 'hideModel').and.callThrough()
    createAnn.hideModel()
    done()
  })

  it('Should enable select ricipents button', function (done) {
    spyOn(createAnn, 'enableRecepientBtn').and.callThrough()
    createAnn.data.title = 'Test'
    createAnn.data.from = 'Test'
    createAnn.data.type = 'test'
    createAnn.data.description = 'test'
    createAnn.attachment = []
    createAnn.enableRecepientBtn()
    done()
  })

  it('should not be able to enable button', function (done) {
    spyOn(createAnn, 'enableRecepientBtn').and.callThrough()
    createAnn.data.title = 'Test'
    createAnn.data.from = 'Test'
    createAnn.data.description = 'test'
    createAnn.enableRecepientBtn()
    done()
  })

  it('should refresh form values', function (done) {
    spyOn(createAnn, 'refreshFormValues').and.callThrough()
    createAnn.refreshFormValues()
    done()
  })

  it('Should open form step number 3 ', function (done) {
    spyOn(createAnn, 'confirmRecipients').and.callThrough()
    createAnn.selectedReciepeient = [{name: 'Bangalore'}]
    createAnn.confirmRecipients()
    done()
  })

  it('Should not open form step number 3 ', function (done) {
    spyOn(createAnn, 'confirmRecipients').and.callThrough()
    createAnn.confirmRecipients()
    done()
  })

  it('Should open confirmation modal ', function (done) {
    spyOn(createAnn, 'confirmationModal').and.callThrough()
    createAnn.confirmationModal()
    timeout.flush(100)
    done()
  })

  it('should preview announcement', function (done) {
    spyOn(createAnn, 'previewAnn').and.callThrough()
    var index = 0
    createAnn.repeatableWebLinks.push({'id': 'choice' + 0})
    createAnn.data.link = {'0': 'https;//google.co.in'}
    createAnn.previewAnn()
    done()
  })

  xit('Select recipients', function (done) {

  })

  it('Should remove recipient', function (done) {
    spyOn(createAnn, 'removeRicipients').and.callThrough()
    createAnn.selectedReciepeient = [{id: '12345', location: '12345'}, {id: '456', location: '456'}]
    createAnn.removeRicipients({id: '12345', location: '12345'})
    done()
  })

  it('Shoud test single error', function (done) {
    spyOn(createAnn, 'showError').and.callThrough()
    createAnn.showError(announcementTestData.createAnncmnt.showSingleError)
    done()
  })

  it('Shoud display multiple error message', function (done) {
    spyOn(createAnn, 'showError').and.callThrough()
    createAnn.showError(announcementTestData.createAnncmnt.showMultipleErrors)
    done()
  })

  it('should get announcement type', function (done) {
    var mockRes = announcementTestData.createAnncmnt.getAnncmntTypeRes
    deferred.resolve(mockRes)
    mockRes = mockRes.data = mockRes
    expect(announcementService.getDefinitions).toBeDefined()
    createAnn.resendAnnouncement(announcementTestData.createAnncmnt.getAnncmntTypeReq)
    expect(announcementService.getDefinitions).toHaveBeenCalled()

    announcementService.getDefinitions()
    scope.$apply()
    done()
  })

  it('Save announcement', function (done) {
    createAnn.data.title = 'test'
    createAnn.data.from = 'test'
    createAnn.data.type = 'test'
    createAnn.data.links = {'0': 'https;//google.co.in'}
    createAnn.data.description = 'test'
    spyOn(announcementService, 'createAnnouncement').and.returnValue(deferred.promise)
    deferred.resolve(announcementTestData.createAnncmnt.saveAnncmntSuccessRes)
    spyOn(createAnn, 'saveAnnouncement').and.callThrough()
    createAnn.saveAnnouncement(createAnn.data)
    scope.$apply()
    var response = announcementService.createAnnouncement().$$state.value
    expect(response).not.toBe(undefined)
    done()
  })

  it('should not create announcement', function (done) {
    spyOn(announcementService, 'createAnnouncement').and.returnValue(deferred.promise)
    deferred.resolve(announcementTestData.createAnncmnt.failedAnncmntRes)
    spyOn(createAnn, 'saveAnnouncement').and.callThrough()
    createAnn.data.title = 'test'
    createAnn.data.from = 'test'
    createAnn.data.links = {'0': 'https;//google.co.in'}
    createAnn.data.description = 'test'
    createAnn.saveAnnouncement(createAnn.data)
    done()
  })

  it('should initialize fine uploader', function (done) {
    spyOn(createAnn, 'initializeFileUploader').and.callThrough()
    createAnn.initializeFileUploader()
    timeout.flush(100)
    done()
  })

  describe('Resend announcement', function () {
    it('success', function () {
      spyOn(announcementService, 'resendAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(announcementTestData.resendAnnouncement.successResponse)
      announcementTestData.resendAnnouncement.successResponse.data = announcementTestData.resendAnnouncement.successResponse
      var requestBody = {'sourceid': '0123673908687093760', 'createddate': '2017-11-10 11:59:54:879+0530', 'details': {'description': 'Test description for announcement 87', 'from': 'test user', 'title': 'Test title for announcement 87', 'type': 'Circular'}, 'links': ['http://yahoo.com'], 'id': '90ae7cf0-c5e0-11e7-8744-852d6ada097c', 'userid': 'd56a1766-e138-45e9-bed2-a0db5eb9696a', 'target': {'geo': {'ids': ['0123668622585610242', '0123668627050987529']}}, 'status': 'cancelled'}
      expect(createAnn.resendAnnouncement).toBeDefined()
      createAnn.resendAnnouncement(requestBody)
      expect(announcementService.resendAnnouncement).toHaveBeenCalled()
      scope.$apply()
    })
  })
})
