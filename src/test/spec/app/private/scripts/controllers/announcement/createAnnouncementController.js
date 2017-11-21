
'use strict'

describe('Controller: createAnnouncementCtrl', function () {
  beforeEach(module('playerApp'))
  var adminCtl
  var createAnn
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
       _announcementService_,
       _toasterService_,
      _permissionsService_,
      _$timeout_,
      _$q_,
      _$state_

          ) {
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
      toasterService: toasterService,
      permissionsService: permissionsService,
      $state: $state,
      $modal: modal
    })
  }))

  it('should initialize create announcement Modal', function () {
    spyOn(createAnn, 'initializeModal').and.callThrough()
    createAnn.initializeModal()
    timeout.flush(100)
    expect(createAnn.initializeModal).toBeDefined()
  })

  it('should initialize create announcement Modal', function () {
    spyOn(createAnn, 'initializeModal').and.callThrough()
    createAnn.createAnnouncement()
    expect(createAnn.createAnnouncement).toBeDefined()
  })

  it('Add one more link', function () {
    spyOn(createAnn, 'addNewLink').and.callThrough()
    createAnn.addNewLink()
    expect(createAnn.repeatableWebLinks.length).toEqual(1)
    expect(createAnn.showUrlField).toBeDefined()
  })

  it('Remove link', function () {
    spyOn(createAnn, 'removeLink').and.callThrough()
    var index = 0
    createAnn.repeatableWebLinks.push({'id': 'choice' + 0})
    createAnn.data.links = {'0': 'https;//google.co.in'}
    createAnn.removeLink(index)
    expect(createAnn.repeatableWebLinks.length).toEqual(0)
    expect(createAnn.data.links).not.toBe(null)
  })

  it('preview announcement', function () {
    spyOn(createAnn, 'previewAnn').and.callThrough()
    var index = 0
    createAnn.repeatableWebLinks.push({'id': 'choice' + 0})
    createAnn.data.links = {0: 'https;//google.co.in', 1: 'https://google.com'}
    createAnn.previewAnn()
    expect(createAnn.previewData).toBeDefined()
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
    spyOn(createAnn, 'enableRecepientBtn').and.callThrough()
    createAnn.data.title = 'Test'
    createAnn.data.from = 'Test'
    createAnn.data.type = 'test'
    createAnn.data.description = 'test test'
    createAnn.data.links = {'0': 'https;//google.co.in'}
    createAnn.enableRecepientBtn()
    expect(createAnn.disableBtn).toBeDefined()
    expect(createAnn.disableBtn).toEqual(false)
  })

  it('should not be able to enable button', function () {
    spyOn(createAnn, 'enableRecepientBtn').and.callThrough()
    createAnn.data.title = 'Test'
    createAnn.data.from = 'Test'
    createAnn.data.description = 'test'
    createAnn.enableRecepientBtn()
    expect(createAnn.disableBtn).toBeDefined()
    expect(createAnn.disableBtn).toEqual(true)
  })

  it('should refresh form values', function () {
    spyOn(createAnn, 'refreshFormValues').and.callThrough()
    createAnn.refreshFormValues()
    expect(createAnn.refreshFormValues).toBeDefined()
    expect(createAnn.isMetaModified).toBeDefined()
    expect(createAnn.isMetaModified).toEqual(false)
    expect(createAnn.editAction).toEqual(false)
    expect(createAnn.showUrlField).toEqual(false)
    expect(createAnn.stepNumber).toEqual(1)
    expect(createAnn.repeatableWebLinks.length).toEqual(0)
    expect(createAnn.attachment.length).toEqual(0)
  })

  it('Should open form step number 3 ', function () {
    spyOn(createAnn, 'confirmRecipients').and.callThrough()
    createAnn.selectedReciepeient = [{name: 'Bangalore'}]
    createAnn.confirmRecipients()
    expect(createAnn.stepNumber).toBeDefined()
    expect(createAnn.stepNumber).toEqual(3)
  })

  it('Should not open form step number 3 ', function () {
    spyOn(createAnn, 'confirmRecipients').and.callThrough()
    createAnn.confirmRecipients()
    expect(createAnn.stepNumber).toBeDefined()
    expect(createAnn.stepNumber).toEqual(2)
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
    spyOn(createAnn, 'removeRicipients').and.callThrough()
    createAnn.selectedReciepeient = [{id: '12345', location: '12345'}, {id: '456', location: '456'}]
    createAnn.removeRicipients({id: '12345', location: '12345'})
    expect(createAnn.selectedReciepeient).toBeDefined()
    expect(createAnn.selectedReciepeient.length).toEqual(1)
    createAnn.confirmRecipients()
    expect(createAnn.stepNumber).toBeDefined()
    expect(createAnn.stepNumber).toEqual(3)
  })

  it('Shoud test single error', function () {
    spyOn(createAnn, 'showError').and.callThrough()
    createAnn.showError(announcementTestData.createAnncmnt.showSingleError)
    expect(createAnn.showError).toBeDefined()
    expect(createAnn.errorFlag).toBeDefined()
    expect(createAnn.errorFlag).toEqual(true)
    expect(toasterService.error).toHaveBeenCalled()
  })

  it('Shoud display multiple error message', function () {
    spyOn(createAnn, 'showError').and.callThrough()
    createAnn.showError(announcementTestData.createAnncmnt.showMultipleErrors)
    expect(createAnn.showError).toBeDefined()
    expect(createAnn.errorFlag).toBeDefined()
    expect(createAnn.errorFlag).toEqual(true)
    expect(toasterService.error).toHaveBeenCalled()
  })

  it('should get announcement type', function () {
    var mockRes = announcementTestData.createAnncmnt.getAnncmntTypeRes
    deferred.resolve(mockRes)
    mockRes = mockRes.data = mockRes
    expect(announcementService.getDefinitions).toBeDefined()
    announcementService.getDefinitions(announcementTestData.createAnncmnt.getAnncmntTypeReq)
    expect(announcementService.getDefinitions).toHaveBeenCalled()
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

  it('should not create announcement', function () {
    spyOn(announcementService, 'createAnnouncement').and.returnValue(deferred.promise)
    deferred.resolve(announcementTestData.createAnncmnt.failedAnncmntRes)
    announcementTestData.createAnncmnt.failedAnncmntRes.data = announcementTestData.createAnncmnt.failedAnncmntRes
    spyOn(createAnn, 'saveAnnouncement').and.callThrough()
    createAnn.data.from = 'test'
    createAnn.linkArray = ['https;//google.co.in']
    createAnn.data.description = 'test'
    expect(createAnn.saveAnnouncement).toBeDefined()
    var response = createAnn.saveAnnouncement(createAnn.data)
    expect(createAnn.saveAnnouncement).toHaveBeenCalled()
    spyOn(createAnn, 'showError').and.callThrough()
    createAnn.showError(announcementTestData.createAnncmnt.failedAnncmntRes)
    expect(createAnn.showError).toHaveBeenCalled()
    expect(createAnn.errorFlag).toEqual(true)
  })

  it('Save announcement without title to handle error in catch block', function () {
    createAnn.linkArray = []
    createAnn.attachment = ['url']
    spyOn(announcementService, 'createAnnouncement').and.returnValue(deferred.promise)
    deferred.resolve(announcementTestData.createAnncmnt.saveAnncmntSuccessRes)
    announcementTestData.createAnncmnt.createAnncmntWithoutTitleResponse.data = announcementTestData.createAnncmnt.createAnncmntWithoutTitleResponse
    spyOn(createAnn, 'saveAnnouncement').and.callThrough()
    expect(createAnn.saveAnnouncement).toBeDefined()
    createAnn.saveAnnouncement(announcementTestData.createAnncmnt.createAnncmntWithoutTitleReq)
    expect(announcementService.createAnnouncement).toHaveBeenCalled()
    scope.$apply()
    spyOn(createAnn, 'refreshFormValues').and.callThrough()
    expect(createAnn.refreshFormValues).toBeDefined()
    createAnn.refreshFormValues()
    expect(createAnn.isMetaModified).toEqual(false)
  })

  it('Save announcement', function () {
    createAnn.linkArray = []
    spyOn(announcementService, 'createAnnouncement').and.returnValue(deferred.promise)
    deferred.resolve(announcementTestData.createAnncmnt.saveAnncmntSuccessRes)
    announcementTestData.createAnncmnt.saveAnncmntSuccessRes.data = announcementTestData.createAnncmnt.saveAnncmntSuccessRes
    spyOn(createAnn, 'saveAnnouncement').and.callThrough()
    expect(createAnn.saveAnnouncement).toBeDefined()
    createAnn.saveAnnouncement(announcementTestData.createAnncmnt.createAnncmntRequest)
    expect(announcementService.createAnnouncement).toHaveBeenCalled()
    scope.$apply()
    spyOn(createAnn, 'refreshFormValues').and.callThrough()
    expect(createAnn.refreshFormValues).toBeDefined()
    createAnn.refreshFormValues()
    expect(createAnn.isMetaModified).toEqual(false)
  })

  describe('Resend announcement', function () {
    it('success', function () {
      spyOn(announcementService, 'resendAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(announcementTestData.resendAnnouncement.successResponse)
      announcementTestData.resendAnnouncement.successResponse.data = announcementTestData.resendAnnouncement.successResponse
      expect(createAnn.resendAnnouncement).toBeDefined()
      createAnn.resendAnnouncement(announcementTestData.resendAnnouncement.requestBody)
      expect(announcementService.resendAnnouncement).toHaveBeenCalled()
      scope.$apply()
    })
    it('fail', function () {
      spyOn(announcementService, 'resendAnnouncement').and.returnValue(deferred.promise)
      deferred.resolve(announcementTestData.resendAnnouncement.failedResponse)
      announcementTestData.resendAnnouncement.failedResponse.data = announcementTestData.resendAnnouncement.failedResponse
      spyOn(createAnn, 'resendAnnouncement').and.callThrough()
      var response = createAnn.resendAnnouncement(announcementTestData.resendAnnouncement.requestBody)
      expect(createAnn.resendAnnouncement).toHaveBeenCalled()
      expect(response).not.toBe(announcementTestData.resendAnnouncement.failedResponse)
      scope.$apply()
    })
    it('editAnnouncementBeforeResend', function () {
      scope.$broadcast('editAnnouncementBeforeResend', announcementTestData.getResend.successResponse.result)
      expect(createAnn.editAction).toBeTruthy()
      scope.$apply()
    })
    it('should initialize geo component', function (done) {
      scope.$broadcast('editAnnouncementBeforeResend', announcementTestData.getResend.successResponse.result)
      timeout.flush(100)
      done()
    })
  })
})
