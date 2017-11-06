
'use strict'

describe('Controller: createAnnouncementCtrl', function () {
  beforeEach(module('playerApp'))
  var adminCtl
  var createAnn
  var dashboardService
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
       _toasterService_,
      _permissionsService_,
      _$timeout_,
      _$q_,
      _$state_

          ) {
    dashboardService = _dashboardService_
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
    createAnn.data.link = {'0': 'https;//google.co.in'}
    createAnn.removeLink(index)
    done()
  })

  it('Detect URL change', function (done) {
    spyOn(createAnn, 'detectChange').and.callThrough()
    createAnn.detectChange()
    done()
  })

  it('Detect Dropdown change', function (done) {
    spyOn(createAnn, 'detectDropdownChange').and.callThrough()
    createAnn.detectDropdownChange()
    done()
  })

  it('Track back button steps', function (done) {
    spyOn(createAnn, 'previousStep').and.callThrough()
    createAnn.pageNumber = 2
    createAnn.previousStep()
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
})
