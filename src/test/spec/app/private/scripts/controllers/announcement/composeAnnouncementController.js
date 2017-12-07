'use strict'
describe('Controller: composeAnnouncementCtrl', function () {
  beforeEach(module('playerApp'))
  var adminCtl
  var composeAnn
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
  var $stateParams
  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))
  beforeEach(inject(function ($rootScope, $controller, _announcementAdapter_, _toasterService_,
    _permissionsService_, _$timeout_, _$q_, _$state_, _$stateParams_) {
    announcementAdapter = _announcementAdapter_
    toasterService = _toasterService_
    permissionsService = _permissionsService_
    scope = $rootScope.$new()
    timeout = _$timeout_
    $state = _$state_
    $stateParams = _$stateParams_
    modal = jasmine.createSpyObj('modal', ['show', 'hide'])
    deferred = _$q_.defer()
    spyOn(toasterService, 'success').and.callThrough()
    spyOn(toasterService, 'error').and.callThrough()
    composeAnn = $controller('composeAnnouncementCtrl', {
      $scope: scope,
      $rootScope: $rootScope,
      toasterService: toasterService,
      permissionsService: permissionsService,
      $state: $state,
      $modal: modal
    })
  }))
  it('should initialize create announcement Modal', function () {
    spyOn(composeAnn, 'initializeModal').and.callThrough()
    composeAnn.initializeModal()
    timeout.flush(100)
    expect(composeAnn.initializeModal).toBeDefined()
  })
  it('should initialize create announcement Modal', function () {
    spyOn(composeAnn, 'initializeModal').and.callThrough()
    composeAnn.createAnnouncement()
    expect(composeAnn.createAnnouncement).toBeDefined()
  })
  it('Add one more link', function () {
    spyOn(composeAnn, 'addNewLink').and.callThrough()
    composeAnn.addNewLink()
    expect(composeAnn.repeatableWebLinks.length).toEqual(1)
    expect(composeAnn.showUrlField).toBeDefined()
  })
  it('Remove link', function () {
    composeAnn.announcement = announcementTestData.composeAnncmnt.annObject
    spyOn(composeAnn, 'removeLink').and.callThrough()
    var index = 0
    composeAnn.repeatableWebLinks.push({
      'id': 'choice' + 0
    })
    composeAnn.announcement.links = {
      '0': 'https;//google.co.in'
    }
    composeAnn.removeLink(index)
    expect(composeAnn.repeatableWebLinks.length).toEqual(0)
    expect(composeAnn.announcement.links).not.toBe(null)
  })
  it('convert file size into KB / MB', function () {
    spyOn(composeAnn, 'getReadableFileSize').and.callThrough()
    composeAnn.getReadableFileSize(1234)
    expect(composeAnn.convertedFileSize).toBeDefined()
  })
  it('should not convert file size into KB / MB', function () {
    spyOn(composeAnn, 'getReadableFileSize').and.callThrough()
    composeAnn.getReadableFileSize(0)
    expect(composeAnn.convertedFileSize).toEqual('0 Byte')
  })
  it('Hide creation modal', function () {
    spyOn(composeAnn, 'hideModel').and.callThrough()
    composeAnn.hideModel()
    expect(composeAnn.hideModel).toBeDefined()
  })
  it('Should enable select recipents button', function () {
    composeAnn.announcement = announcementTestData.composeAnncmnt.annObject
    spyOn(composeAnn, 'enableRecepientBtn').and.callThrough()
    composeAnn.announcement.title = 'Test'
    composeAnn.announcement.from = 'Test'
    composeAnn.announcement.type = 'test'
    composeAnn.announcement.description = 'test test'
    composeAnn.announcement.links = {
      '0': 'https;//google.co.in'
    }
    composeAnn.enableRecepientBtn()
    expect(composeAnn.disableBtn).toBeDefined()
    expect(composeAnn.disableBtn).toEqual(false)
  })
  it('should not be able to enable button', function () {
    composeAnn.announcement = announcementTestData.composeAnncmnt.annObject
    spyOn(composeAnn, 'enableRecepientBtn').and.callThrough()
    composeAnn.announcement.title = 'Test'
    composeAnn.announcement.from = 'Test'
    composeAnn.announcement.description = 'test'
    composeAnn.enableRecepientBtn()
    expect(composeAnn.disableBtn).toBeDefined()
    expect(composeAnn.disableBtn).toEqual(false)
  })
  it('enableRecepientBtn else part', function () {
    composeAnn.announcement = {
      details: {
        description: '',
        from: '',
        title: '',
        type: ''
      }
    }
    spyOn(composeAnn, 'enableRecepientBtn').and.callThrough()
    composeAnn.enableRecepientBtn(false)
    scope.$apply()
    expect(composeAnn.disableBtn).toEqual(true)
  })
  it('init with create flow', function () {
    $stateParams.stepNumber = 1
    $stateParams.announcement = announcementTestData.getResend.successResponse.result
    spyOn(announcementAdapter, 'getDefinitions').and.returnValue(deferred.promise)
    deferred.resolve(announcementTestData.composeAnncmnt.getAnncmntTypeRes)
    spyOn(composeAnn, 'init').and.callThrough()
    composeAnn.init()
    scope.$apply()
    expect(composeAnn.init).toBeDefined()
    expect(announcementAdapter.getDefinitions).toHaveBeenCalled()
  })
  it('init with resend calling getResend', function () {
    $stateParams.stepNumber = 1
    $stateParams.announcement = null
    $stateParams.announcementId = '90ae7cf0-c5e0-11e7-8744-852d6ada097c'
    $stateParams.isResend = true
    spyOn(announcementAdapter, 'getDefinitions').and.returnValue(deferred.promise)
    deferred.resolve(announcementTestData.composeAnncmnt.getAnncmntTypeRes)
    spyOn(announcementAdapter, 'getResend').and.returnValue(deferred.promise)
    deferred.resolve(announcementTestData.getResend.successResponse)
    spyOn(composeAnn, 'init').and.callThrough()
    composeAnn.init()
    scope.$apply()
    expect(composeAnn.init).toBeDefined()
    expect(announcementAdapter.getDefinitions).toHaveBeenCalled()
  })
  it('init with create calling model', function () {
    $stateParams.stepNumber = 1
    $stateParams.announcement = null
    $stateParams.isResend = false
    spyOn(announcementAdapter, 'getDefinitions').and.returnValue(deferred.promise)
    deferred.resolve(announcementTestData.composeAnncmnt.getAnncmntTypeRes)
    spyOn(composeAnn, 'init').and.callThrough()
    composeAnn.init()
    scope.$apply()
    expect(composeAnn.init).toBeDefined()
    expect(announcementAdapter.getDefinitions).toHaveBeenCalled()
  })
  it('init with create flow step 1', function () {
    $stateParams.stepNumber = 1
    $stateParams.announcement = announcementTestData.getResend.successResponse.result
    $stateParams.isResend = false
    spyOn(announcementAdapter, 'getDefinitions').and.returnValue(deferred.promise)
    deferred.resolve(announcementTestData.composeAnncmnt.getAnncmntTypeRes)
    spyOn(composeAnn, 'init').and.callThrough()
    composeAnn.init()
    scope.$apply()
    expect(composeAnn.init).toBeDefined()
    expect(announcementAdapter.getDefinitions).toHaveBeenCalled()
  })
  it('init with create flow step 2', function () {
    $stateParams.stepNumber = 2
    $stateParams.announcement = announcementTestData.getResend.successResponse.result
    $stateParams.isResend = false
    spyOn(composeAnn, 'init').and.callThrough()
    composeAnn.init()
    scope.$apply()
    expect(composeAnn.init).toBeDefined()
    expect(composeAnn.init).toHaveBeenCalled()
  })
  it('init with resend flow step 2', function () {
    $stateParams.stepNumber = 2
    composeAnn.announcement = {}
    $stateParams.announcement = announcementTestData.getResend.successResponse.result
    $stateParams.isResend = true
    spyOn(composeAnn, 'init').and.callThrough()
    composeAnn.init()
    scope.$apply()
    expect(composeAnn.init).toBeDefined()
    expect(composeAnn.init).toHaveBeenCalled()
  })
  it('should refresh form values', function () {
    spyOn(composeAnn, 'refreshFormValues').and.callThrough()
    composeAnn.refreshFormValues()
    expect(composeAnn.refreshFormValues).toBeDefined()
    expect(composeAnn.isMetaModified).toBeDefined()
    expect(composeAnn.isMetaModified).toEqual(false)
    expect(composeAnn.editAction).toEqual(false)
    expect(composeAnn.showUrlField).toEqual(false)
    expect(composeAnn.stepNumber).toEqual(1)
    expect(composeAnn.repeatableWebLinks.length).toEqual(0)
  })
  it('Should through error for confirm recipients', function () {
    composeAnn.announcement = {}
    composeAnn.announcement.selTar = {}
    composeAnn.announcement.selTar.length = 0
    spyOn(composeAnn, 'confirmRecipients').and.callThrough()
    var response = composeAnn.confirmRecipients()
    expect(response).toEqual(false)
  })
  it('Should open form step number 3 ', function () {
    composeAnn.announcement = announcementTestData.composeAnncmnt.annTarObject
    spyOn(composeAnn, 'confirmRecipients').and.callThrough()
    composeAnn.stepNumber = 3
    composeAnn.selectedRecipients = [{
      name: 'Bangalore'
    }]
    composeAnn.confirmRecipients()
    expect(composeAnn.stepNumber).toBeDefined()
    expect(composeAnn.stepNumber).toEqual(3)
  })
  it('Should not open form step number 3 ', function () {
    composeAnn.announcement = announcementTestData.composeAnncmnt.annTarObject
    composeAnn.stepNumber = 3
    spyOn(composeAnn, 'confirmRecipients').and.callThrough()
    composeAnn.confirmRecipients()
    expect(composeAnn.stepNumber).toBeDefined()
    expect(composeAnn.stepNumber).toEqual(3)
  })
  it('Should open confirmation modal ', function () {
    composeAnn.isMetaModified = true
    spyOn(composeAnn, 'confirmationModal').and.callThrough()
    composeAnn.confirmationModal()
    timeout.flush(100)
    expect(composeAnn.confirmationModal).toBeDefined()
    expect(composeAnn.isMetaModified).toBeDefined()
    expect(composeAnn.isMetaModified).toEqual(true)
  })
  it('Should not open confirmation modal ', function () {
    composeAnn.isMetaModified = false
    spyOn(composeAnn, 'confirmationModal').and.callThrough()
    composeAnn.confirmationModal()
    timeout.flush(100)
    expect(composeAnn.confirmationModal).toBeDefined()
    expect(composeAnn.isMetaModified).toBeDefined()
    expect(composeAnn.isMetaModified).toEqual(false)
  })
  it('Should remove recipient', function () {
    composeAnn.announcement = announcementTestData.composeAnncmnt.annTarObject
    composeAnn.stepNumber = 3
    composeAnn.stepNumber = 3
    spyOn(composeAnn, 'removeRecipients').and.callThrough()
    composeAnn.selectedRecipients = [{
      id: '12345',
      location: '12345'
    }, {
      id: '456',
      location: '456'
    }]
    composeAnn.removeRecipients({
      id: '12345',
      location: '12345'
    })
    expect(composeAnn.selectedRecipients).toBeDefined()
    expect(composeAnn.selectedRecipients.length).toEqual(2)
    composeAnn.confirmRecipients()
    expect(composeAnn.stepNumber).toBeDefined()
    expect(composeAnn.stepNumber).toEqual(3)
  })
  it('Shoud test single error', function () {
    spyOn(composeAnn, 'showError').and.callThrough()
    composeAnn.showError(announcementTestData.composeAnncmnt.showSingleError)
    expect(composeAnn.showError).toBeDefined()
    expect(composeAnn.errorFlag).toBeDefined()
    expect(composeAnn.errorFlag).toEqual(true)
    expect(toasterService.error).toHaveBeenCalled()
  })
  it('Shoud display multiple error message', function () {
    spyOn(composeAnn, 'showError').and.callThrough()
    composeAnn.showError(announcementTestData.composeAnncmnt.showMultipleErrors)
    expect(composeAnn.showError).toBeDefined()
    expect(composeAnn.errorFlag).toBeDefined()
    expect(composeAnn.errorFlag).toEqual(true)
    expect(toasterService.error).toHaveBeenCalled()
  })
  it('on announcement upload complete', function () {
    composeAnn.announcement = announcementTestData.composeAnncmnt.annObject
    spyOn(composeAnn, 'onUploadComplete').and.callThrough()
    composeAnn.onUploadComplete(1, 'abc.png', {
      name: 'abc.png',
      size: 1027
    })
    expect(composeAnn.onUploadComplete).toBeDefined()
    expect(composeAnn.uploadAttchement).toEqual(true)
  })
  it('on announcement cancel', function () {
    composeAnn.announcement = announcementTestData.getResend.successResponse.result.announcement
    spyOn(composeAnn, 'onUploadCancel').and.callThrough()
    composeAnn.onUploadCancel(1, 'swing-846077_960_720.jpg')
    expect(composeAnn.onUploadCancel).toBeDefined()
    expect(composeAnn.uploadAttchement).toEqual(false)
  })
  it('on announcement cancel empty attachments', function () {
    composeAnn.announcement = announcementTestData.getResend.successResponse.result
    composeAnn.announcement.attachments = []
    spyOn(composeAnn, 'onUploadCancel').and.callThrough()
    composeAnn.onUploadCancel(1, 'swing-846077_960_720.jpg')
    expect(composeAnn.onUploadCancel).toBeDefined()
    expect(composeAnn.uploadAttchement).toEqual(false)
  })
  it('should get announcement type', function () {
    var mockRes = announcementTestData.composeAnncmnt.getAnncmntTypeRes
    deferred.resolve(mockRes)
    mockRes = mockRes.data = mockRes
    scope.$apply()
    expect(composeAnn.errorFlag).toEqual(false)
  })
  it('should initialize fine uploader', function () {
    spyOn(composeAnn, 'initializeFileUploader').and.callThrough()
    composeAnn.initializeFileUploader()
    timeout.flush(100)
    expect(composeAnn.initializeFileUploader).toBeDefined()
    expect(composeAnn.initializeFileUploader).toHaveBeenCalled()
  })
  it('should not create announcement', function () {
    composeAnn.announcement = announcementTestData.composeAnncmnt.annObject
    spyOn(announcementAdapter, 'createAnnouncement').and.returnValue(deferred.promise)
    deferred.resolve(announcementTestData.composeAnncmnt.failedAnncmntRes)
    announcementTestData.composeAnncmnt.failedAnncmntRes.data = announcementTestData.composeAnncmnt
            .failedAnncmntRes
    spyOn(composeAnn, 'saveAnnouncement').and.callThrough()
    composeAnn.announcement.from = 'test'
    composeAnn.linkArray = ['https;//google.co.in']
    composeAnn.announcement.description = 'test'
    expect(composeAnn.saveAnnouncement).toBeDefined()
    var response = composeAnn.saveAnnouncement(composeAnn.data)
    expect(composeAnn.saveAnnouncement).toHaveBeenCalled()
    spyOn(composeAnn, 'showError').and.callThrough()
    composeAnn.showError(announcementTestData.composeAnncmnt.failedAnncmntRes)
    expect(composeAnn.showError).toHaveBeenCalled()
    expect(composeAnn.errorFlag).toEqual(true)
  })
  it('Save announcement without title to handle error in catch block', function () {
    composeAnn.announcement = announcementTestData.composeAnncmnt.annObject
    composeAnn.linkArray = []
    composeAnn.attachment = ['url']
    spyOn(announcementAdapter, 'createAnnouncement').and.returnValue(deferred.promise)
    deferred.resolve(announcementTestData.composeAnncmnt.saveAnncmntSuccessRes)
    announcementTestData.composeAnncmnt.composeAnncmntWithoutTitleResponse.data =
            announcementTestData.composeAnncmnt.composeAnncmntWithoutTitleResponse
    spyOn(composeAnn, 'saveAnnouncement').and.callThrough()
    expect(composeAnn.saveAnnouncement).toBeDefined()
    composeAnn.saveAnnouncement(announcementTestData.composeAnncmnt.composeAnncmntWithoutTitleReq)
    expect(announcementAdapter.createAnnouncement).toHaveBeenCalled()
    scope.$apply()
    spyOn(composeAnn, 'refreshFormValues').and.callThrough()
    expect(composeAnn.refreshFormValues).toBeDefined()
    composeAnn.refreshFormValues()
    expect(composeAnn.isMetaModified).toEqual(false)
  })
  it('Save announcement', function () {
    composeAnn.announcement = announcementTestData.composeAnncmnt.annObject
    composeAnn.linkArray = []
    spyOn(announcementAdapter, 'createAnnouncement').and.returnValue(deferred.promise)
    deferred.resolve(announcementTestData.composeAnncmnt.saveAnncmntSuccessRes)
    announcementTestData.composeAnncmnt.saveAnncmntSuccessRes.data = announcementTestData
            .composeAnncmnt.saveAnncmntSuccessRes
    spyOn(composeAnn, 'saveAnnouncement').and.callThrough()
    expect(composeAnn.saveAnnouncement).toBeDefined()
    composeAnn.saveAnnouncement(announcementTestData.composeAnncmnt.composeAnncmntRequest)
    expect(announcementAdapter.createAnnouncement).toHaveBeenCalled()
    scope.$apply()
    spyOn(composeAnn, 'refreshFormValues').and.callThrough()
    expect(composeAnn.refreshFormValues).toBeDefined()
    composeAnn.refreshFormValues()
    expect(composeAnn.isMetaModified).toEqual(false)
  })
  it('Resend announcement', function () {
    composeAnn.editAction = true
    composeAnn.announcement = announcementTestData.composeAnncmnt.annObject
    composeAnn.linkArray = []
    spyOn(announcementAdapter, 'createAnnouncement').and.returnValue(deferred.promise)
    deferred.resolve(announcementTestData.composeAnncmnt.saveAnncmntSuccessRes)
    announcementTestData.composeAnncmnt.saveAnncmntSuccessRes.data = announcementTestData
            .composeAnncmnt.saveAnncmntSuccessRes
    spyOn(composeAnn, 'saveAnnouncement').and.callThrough()
    expect(composeAnn.saveAnnouncement).toBeDefined()
    composeAnn.saveAnnouncement(announcementTestData.composeAnncmnt.composeAnncmntRequest)
    expect(announcementAdapter.createAnnouncement).toHaveBeenCalled()
    scope.$apply()
    spyOn(composeAnn, 'refreshFormValues').and.callThrough()
    expect(composeAnn.refreshFormValues).toBeDefined()
    composeAnn.refreshFormValues()
    expect(composeAnn.isMetaModified).toEqual(false)
  })
  it('Save announcement reject', function () {
    composeAnn.announcement = announcementTestData.composeAnncmnt.annObject
    spyOn(announcementAdapter, 'createAnnouncement').and.returnValue(deferred.promise)
    deferred.reject({})
    spyOn(composeAnn, 'saveAnnouncement').and.callThrough()
    composeAnn.saveAnnouncement()
    scope.$apply()
    expect(composeAnn.isMetaModified).toEqual(true)
  })
  it('goToBackStep', function () {
    spyOn(composeAnn, 'goToBackStep').and.callThrough()
    composeAnn.goToBackStep()
    scope.$apply()
  })
  it('goToNextStep', function () {
    composeAnn.announcement = announcementTestData.composeAnncmnt.annTarObject
    spyOn(composeAnn, 'goToNextStep').and.callThrough()
    composeAnn.goToNextStep()
    scope.$apply()
  })
  it('goToNextStep else part', function () {
    composeAnn.announcement = {}
    composeAnn.announcement.selTar = {}
    composeAnn.announcement.selTar.length = 0
    spyOn(composeAnn, 'goToNextStep').and.callThrough()
    composeAnn.goToNextStep()
    scope.$apply()
  })
  it('Get definition success', function () {
    composeAnn.announcementType = []
    composeAnn.announcement = { type: 'Circular' }
    spyOn(announcementAdapter, 'getDefinitions').and.returnValue(deferred.promise)
    deferred.resolve(announcementTestData.composeAnncmnt.getAnncmntTypeRes)
    spyOn(composeAnn, 'getDefinitions').and.callThrough()
    composeAnn.getDefinitions('ORG_001')
    scope.$apply()
    expect(composeAnn.announcementType).not.toBe([])
  })
  it('Get definition reject', function () {
    composeAnn.hideAnncmntBtn = false
    spyOn(announcementAdapter, 'getDefinitions').and.returnValue(deferred.promise)
    deferred.reject({})
    spyOn(composeAnn, 'getDefinitions').and.callThrough()
    composeAnn.getDefinitions('ORG_001')
    scope.$apply()
    expect(composeAnn.hideAnncmntBtn).toBeTruthy()
  })
  it('Get Resend success', function () {
    composeAnn.announcement = {}
    spyOn(announcementAdapter, 'getResend').and.returnValue(deferred.promise)
    deferred.resolve(announcementTestData.getResend.successResponse)
    spyOn(composeAnn, 'getResend').and.callThrough()
    composeAnn.getResend('90ae7cf0-c5e0-11e7-8744-852d6ada097c')
    scope.$apply()
    expect(composeAnn.announcement).not.toBeEmpty()
  })
  it('Create announcement metamodified flag false', function () {
    composeAnn.announcement = null
    composeAnn.isMetaModified = false
    spyOn(composeAnn, 'onHideCreateAnnModal').and.callThrough()
    composeAnn.onHideCreateAnnModal()
    scope.$apply()
    expect(composeAnn.isMetaModified).toBeFalsy()
  })
  it('Create announcement metamodified flag true', function () {
    composeAnn.announcement = {}
    composeAnn.isMetaModified = false
    spyOn(composeAnn, 'onHideCreateAnnModal').and.callThrough()
    composeAnn.onHideCreateAnnModal()
    scope.$apply()
    expect(composeAnn.isMetaModified).toBeTruthy()
  })
  it('Create announcement meta modified flag false agin', function () {
    composeAnn.isApprove = true
    composeAnn.isMetaModified = false
    spyOn(composeAnn, 'onHideCreateAnnModal').and.callThrough()
    composeAnn.onHideCreateAnnModal()
    scope.$apply()
    expect(composeAnn.isMetaModified).toBeFalsy()
  })
  it('Create announcement refresh form', function () {
    composeAnn.stepNumber = 1
    composeAnn.isApprove = true
    composeAnn.isMetaModified = false
    spyOn(composeAnn, 'onHideCreateAnnModal').and.callThrough()
    spyOn(composeAnn, 'refreshFormValues').and.callThrough()
    composeAnn.onHideCreateAnnModal()
    scope.$apply()
    expect(composeAnn.refreshFormValues).toHaveBeenCalled()
  })
  it('Confirmation popup approved', function () {
    spyOn(composeAnn, 'onApproveConfirmationModal').and.callThrough()
    spyOn(composeAnn, 'refreshFormValues').and.callThrough()
    composeAnn.onApproveConfirmationModal()
    scope.$apply()
    expect(composeAnn.refreshFormValues).toHaveBeenCalled()
  })
  it('Remove recipients', function () {
    composeAnn.announcement = {
      selTar: [{
        location: 'Chikodi'
      }]
    }
    spyOn(composeAnn, 'removeRecipients').and.callThrough()
    spyOn(composeAnn, 'confirmRecipients').and.callThrough()
    composeAnn.removeRecipients({
      location: 'Chikodi'
    })
    scope.$apply()
    expect(composeAnn.confirmRecipients).toHaveBeenCalled()
  })
  it('File remove', function () {
    composeAnn.announcement = announcementTestData.getResend.successResponse.result
    var item = $('#removeFile')
    spyOn(window, 'removeCreateAnnAttachment').and.callThrough()
    window.removeCreateAnnAttachment(item, 1)
    scope.$apply()
    expect(window.removeCreateAnnAttachment).toHaveBeenCalled()
  })
  it('Prepopulate files', function () {
    composeAnn.announcement = {
      attachments: announcementTestData.getResend.successResponse.result.attachments
    }
    spyOn(composeAnn, 'prepopulateFilesCallback').and.callThrough()
    composeAnn.prepopulateFilesCallback()
    scope.$apply()
    expect(composeAnn.prepopulateFilesCallback).toBeDefined()
    expect(composeAnn.prepopulateFilesCallback).toHaveBeenCalled()
  })
})
