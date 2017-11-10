
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
        // spyOn(createAnn, 'initializeModal').and.callThrough();
    createAnn.createAnnouncement()
        // expect(modal.show).toHaveBeenCalled();
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

  it('preview announcement', function(done){
    spyOn(createAnn, 'previewAnn').and.callThrough()
    var index = 0
    createAnn.repeatableWebLinks.push({'id': 'choice' + 0})
    createAnn.data.links = {0: 'https;//google.co.in', 1: 'https://google.com'}
    createAnn.previewAnn(index)
    done()
  })

  it('Hide creation modal', function(done){
    spyOn(createAnn, 'hideModel').and.callThrough()
    createAnn.hideModel()
    done()
  })

  it('Should enable select ricipents button', function (done) {
    spyOn(createAnn, 'enableRecepientBtn').and.callThrough()
    createAnn.data.title = 'Test'
    createAnn.data.type = 'Test'
    createAnn.data.announcementType = 'test'
    createAnn.data.description = 'test'
    createAnn.enableRecepientBtn()
    done()
  })

  it('should refresh form values', function (done) {
    spyOn(createAnn, 'refreshFormValues').and.callThrough()
    createAnn.refreshFormValues()
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

  it('Select recipients', function(){
  	createAnn.selectedReciepeient
  })
  it('Save announcement', function (done) {
    var failedApiResponse = {"id":"api.plugin.announcement.create","ver":"1.0","ts":"2017-11-10 02:58:46:236+0000","params":{"resmsgid":"119520d0-c5c3-11e7-882c-23b3000f6c3b","msgid":null,"status":"failed","err":"","errmsg":"user has no create access"},"responseCode":"CLIENT_ERROR","result":{}}
    spyOn(announcementService, 'createAnnouncement').and.returnValue(deferred.promise);
    deferred.resolve(failedApiResponse);
    spyOn(createAnn, 'saveAnnouncement').and.callThrough()
    createAnn.data.title = 'test'
    createAnn.data.from = 'test'
    createAnn.data.link = {'0': 'https;//google.co.in'}
    createAnn.data.description = 'test'
    createAnn.saveAnnouncement(createAnn.data)
    done()
  })
})
