'use strict'

describe('Controller: resendAnnouncementCtrl', function () {
  beforeEach(module('playerApp'))
  var adminCtl
  var createAnn
  var announcementAdapter
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
    _announcementAdapter_,
    _toasterService_,
    _permissionsService_,
    _$timeout_,
    _$q_,
    _$state_

  ) {
    announcementAdapter = _announcementAdapter_
    toasterService = _toasterService_
    permissionsService = _permissionsService_
    scope = $rootScope.$new()
    timeout = _$timeout_
    $state = _$state_
    modal = jasmine.createSpyObj('modal', ['show', 'hide'])
    deferred = _$q_.defer()
    spyOn(toasterService, 'success').and.callThrough()
    spyOn(toasterService, 'error').and.callThrough()
    //  spyOn(announcementAdapter, 'getDefinitions').and.returnValue(deferred.promise)
    createAnn = $controller('resendAnnouncementCtrl', {
      $scope: scope,
      $rootScope: $rootScope,
      toasterService: toasterService,
      permissionsService: permissionsService,
      $state: $state,
      $modal: modal
    })
  }))

  it('should initialize resend announcement Modal', function () {
    spyOn(createAnn, 'initializeModal').and.callThrough()
    createAnn.resendAnnouncement()
    expect(createAnn.resendAnnouncement).toBeDefined()
    createAnn.initializeModal()
    expect(createAnn.isMetaModified).toEqual(false)
    scope.$apply()
  })

  it('Add one more link', function () {
    spyOn(createAnn, 'addNewLink').and.callThrough()
    createAnn.addNewLink()
    expect(createAnn.repeatableWebLinks.length).toEqual(1)
    expect(createAnn.showUrlField).toBeDefined()
  })

  it('convert file size into KB / MB', function () {
    spyOn(createAnn, 'getReadableFileSize').and.callThrough()
    createAnn.getReadableFileSize(1234)
    expect(createAnn.convertedFileSize).toBeDefined()
  })

  it('should not convert file size into KB / MB', function () {
    spyOn(createAnn, 'getReadableFileSize').and.callThrough()
    createAnn.getReadableFileSize(0)
    expect(createAnn.convertedFileSize).toEqual('0 Byte')
  })

  it('Hide creation modal', function () {
    spyOn(createAnn, 'hideModel').and.callThrough()
    createAnn.hideModel()
    expect(createAnn.hideModel).toBeDefined()
  })

  it('Should enable select recipents button', function () {
    createAnn.announcement = announcementTestData.createAnncmnt.annObject
    spyOn(createAnn, 'enableRecepientBtn').and.callThrough()
    createAnn.data.title = 'Test'
    createAnn.data.from = 'Test'
    createAnn.data.type = 'test'
    createAnn.data.description = 'test test'
    createAnn.data.links = { '0': 'https;//google.co.in' }
    createAnn.enableRecepientBtn()
    expect(createAnn.disableBtn).toBeDefined()
    expect(createAnn.disableBtn).toEqual(false)
  })

  it('should not be able to enable button', function () {
    createAnn.announcement = announcementTestData.createAnncmnt.annObject
    spyOn(createAnn, 'enableRecepientBtn').and.callThrough()
    createAnn.data.title = 'Test'
    createAnn.data.from = 'Test'
    createAnn.data.description = 'test'
    createAnn.enableRecepientBtn()
    expect(createAnn.disableBtn).toBeDefined()
    expect(createAnn.disableBtn).toEqual(false)
  })

  it('enableRecepientBtn else part', function () {
    createAnn.announcement = { 'details': { 'description': '', 'from': '', 'title': '', 'type': '' } }
    spyOn(createAnn, 'enableRecepientBtn').and.callThrough()
    createAnn.enableRecepientBtn()
    scope.$apply()
    expect(createAnn.disableBtn).toEqual(true)
  })

  it('init with definition successResponse', function () {
    spyOn(announcementAdapter, 'getResend').and.returnValue(deferred.promise)
    deferred.resolve(announcementTestData.getResend.successResponse)
    spyOn(createAnn, 'init').and.callThrough()
    createAnn.init()
    var response = announcementAdapter.getResend().$$state.value
    expect(response).toBe(announcementTestData.getResend.successResponse)
    scope.$apply()
  })

  it('init with definition successResponse', function () {
    spyOn(announcementAdapter, 'getDefinitions').and.returnValue(deferred.promise)
    deferred.resolve(announcementTestData.createAnncmnt.getAnncmntTypeRes)
    spyOn(createAnn, 'init').and.callThrough()
    createAnn.init()
    var response = announcementAdapter.getDefinitions().$$state.value
    expect(response).toBe(announcementTestData.createAnncmnt.getAnncmntTypeRes)
    scope.$apply()
  })

  it('init with definition reject', function () {
    spyOn(createAnn, 'init').and.callThrough()
    createAnn.init()
    createAnn.stepNumber = 2
    scope.$apply()
  })

  it('should refresh form values', function () {
    spyOn(createAnn, 'refreshFormValues').and.callThrough()
    createAnn.refreshFormValues()
    expect(createAnn.refreshFormValues).toBeDefined()
    expect(createAnn.isMetaModified).toBeDefined()
    expect(createAnn.isMetaModified).toEqual(false)
    expect(createAnn.editAction).toEqual(true)
    expect(createAnn.showUrlField).toEqual(false)
    expect(createAnn.stepNumber).toEqual(1)
    expect(createAnn.repeatableWebLinks.length).toEqual(0)
    expect(createAnn.attachment.length).toEqual(0)
  })

  it('Should through error for confirm recipients', function () {
    createAnn.announcement = {}
    createAnn.announcement.selTar = {}
    createAnn.announcement.selTar.length = 0
    spyOn(createAnn, 'confirmRecipients').and.callThrough()
    var response = createAnn.confirmRecipients()
    expect(response).toEqual(false)
  })

  it('Should open form step number 3 ', function () {
    createAnn.announcement = announcementTestData.createAnncmnt.annTarObject
    spyOn(createAnn, 'confirmRecipients').and.callThrough()
    createAnn.stepNumber = 3
    createAnn.selectedRecipients = [{ name: 'Bangalore' }]
    createAnn.confirmRecipients()
    expect(createAnn.stepNumber).toBeDefined()
    expect(createAnn.stepNumber).toEqual(3)
  })

  it('Should not open form step number 3 ', function () {
    createAnn.announcement = announcementTestData.createAnncmnt.annTarObject
    createAnn.stepNumber = 3
    spyOn(createAnn, 'confirmRecipients').and.callThrough()
    createAnn.confirmRecipients()
    expect(createAnn.stepNumber).toBeDefined()
    expect(createAnn.stepNumber).toEqual(3)
  })

  it('Should open confirmation modal ', function () {
    createAnn.isMetaModified = true
    spyOn(createAnn, 'confirmationModal').and.callThrough()
    createAnn.confirmationModal()
    timeout.flush(100)
    expect(createAnn.confirmationModal).toBeDefined()
    expect(createAnn.isMetaModified).toBeDefined()
    expect(createAnn.isMetaModified).toEqual(true)
  })

  it('Should not open confirmation modal ', function () {
    createAnn.isMetaModified = false
    spyOn(createAnn, 'confirmationModal').and.callThrough()
    createAnn.confirmationModal()
    timeout.flush(100)
    expect(createAnn.confirmationModal).toBeDefined()
    expect(createAnn.isMetaModified).toBeDefined()
    expect(createAnn.isMetaModified).toEqual(false)
  })

  it('Should remove recipient', function () {
    createAnn.announcement = announcementTestData.createAnncmnt.annObject
    createAnn.stepNumber = 3
    createAnn.stepNumber = 3
    spyOn(createAnn, 'removeRecipients').and.callThrough()
    createAnn.selectedRecipients = [{ id: '12345', location: '12345' }, { id: '456', location: '456' }]
    createAnn.removeRecipients({ id: '12345', location: '12345' })
    expect(createAnn.selectedRecipients).toBeDefined()
    expect(createAnn.selectedRecipients.length).toEqual(2)
    createAnn.confirmRecipients()
    expect(createAnn.stepNumber).toBeDefined()
    expect(createAnn.stepNumber).toEqual(3)
  })

  it('on announcement upload complete', function () {
    createAnn.announcement = announcementTestData.createAnncmnt.annObject
    spyOn(createAnn, 'onUploadComplete').and.callThrough()
    createAnn.onUploadComplete(1, 'abc.png', { name: 'abc.png', size: 1027 })
    expect(createAnn.onUploadComplete).toBeDefined()
    expect(createAnn.uploadAttchement).toEqual(true)
  })

  it('on announcement cancel', function () {
    createAnn.announcement = announcementTestData.createAnncmnt.annObject
    createAnn.attachment = ['{"name":"swing-846077_960_720.jpg","mimetype":"ima…chments/announcement/File-012380339474472960127"}']
    spyOn(createAnn, 'onUploadCancel').and.callThrough()
    createAnn.onUploadCancel(1, 'swing-846077_960_720.jpg')
    expect(createAnn.onUploadCancel).toBeDefined()
    expect(createAnn.uploadAttchement).toEqual(false)
    expect(createAnn.attachment.length).toEqual(0)
  })

  it('should get announcement type', function () {
    var mockRes = announcementTestData.createAnncmnt.getAnncmntTypeRes
    deferred.resolve(mockRes)
    mockRes = mockRes.data = mockRes
    scope.$apply()
    expect(createAnn.errorFlag).toEqual(false)
  })

  it('should initialize fine uploader', function () {
    spyOn(createAnn, 'initializeFileUploader').and.callThrough()
    createAnn.initializeFileUploader()
    timeout.flush(100)
    expect(createAnn.initializeFileUploader).toBeDefined()
    expect(createAnn.initializeFileUploader).toHaveBeenCalled()
  })

  it('Save announcement without title to handle error in catch block', function () {
    createAnn.linkArray = []
    createAnn.attachment = ['url']
    spyOn(announcementAdapter, 'resendAnnouncement').and.returnValue(deferred.promise)
    deferred.resolve(announcementTestData.createAnncmnt.saveAnncmntSuccessRes)
    announcementTestData.createAnncmnt.createAnncmntWithoutTitleResponse.data = announcementTestData.createAnncmnt.createAnncmntWithoutTitleResponse
    spyOn(createAnn, 'saveAnnouncement').and.callThrough()
    expect(createAnn.saveAnnouncement).toBeDefined()
    createAnn.saveAnnouncement(announcementTestData.createAnncmnt.createAnncmntWithoutTitleReq)
    expect(announcementAdapter.resendAnnouncement).toHaveBeenCalled()
    scope.$apply()
    spyOn(createAnn, 'refreshFormValues').and.callThrough()
    expect(createAnn.refreshFormValues).toBeDefined()
    createAnn.refreshFormValues()
    expect(createAnn.isMetaModified).toEqual(false)
  })

  it('Save announcement', function () {
    createAnn.linkArray = []
    spyOn(announcementAdapter, 'resendAnnouncement').and.returnValue(deferred.promise)
    deferred.resolve(announcementTestData.createAnncmnt.saveAnncmntSuccessRes)
    announcementTestData.createAnncmnt.saveAnncmntSuccessRes.data = announcementTestData.createAnncmnt.saveAnncmntSuccessRes
    spyOn(createAnn, 'saveAnnouncement').and.callThrough()
    expect(createAnn.saveAnnouncement).toBeDefined()
    createAnn.saveAnnouncement(announcementTestData.createAnncmnt.createAnncmntRequest)
    expect(announcementAdapter.resendAnnouncement).toHaveBeenCalled()
    scope.$apply()
    spyOn(createAnn, 'refreshFormValues').and.callThrough()
    expect(createAnn.refreshFormValues).toBeDefined()
    createAnn.refreshFormValues()
    expect(createAnn.isMetaModified).toEqual(false)
  })

  it('Save announcement reject', function () {
    spyOn(announcementAdapter, 'resendAnnouncement').and.returnValue(deferred.promise)
    deferred.reject({})
    spyOn(createAnn, 'resendAnnouncement').and.callThrough()
    createAnn.saveAnnouncement()
    scope.$apply()
    expect(createAnn.isMetaModified).toEqual(false)
  })

  it('goToBackStep', function () {
    spyOn(createAnn, 'goToBackStep').and.callThrough()
    createAnn.goToBackStep()
    scope.$apply()
  })

  it('goToNextStep', function () {
    createAnn.stepNumber = 2
    createAnn.announcement = announcementTestData.createAnncmnt.annTarObject
    spyOn(createAnn, 'goToNextStep').and.callThrough()
    createAnn.goToNextStep()
    scope.$apply()
  })

  it('goToNextStep else part', function () {
    createAnn.stepNumber = 2
    createAnn.announcement = {}
    createAnn.announcement.selTar = {}
    createAnn.announcement.selTar.length = 0
    spyOn(createAnn, 'goToNextStep').and.callThrough()
    createAnn.goToNextStep()
    scope.$apply()
  })
})
