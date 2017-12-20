/**
 * name: GenericEditorController.js
 * author: Anuj Gupta
 * Date: 05-10-2017
 */

'use strict'

describe('Controller: GenericEditorController', function () {
  // load the controller's module
  beforeEach(module('playerApp'))
  var contentService,
    scope,
    rootScope,
    geController,
    $q,
    deferred,
    timeout,
    getContentData = testData.contentEditor,
    stateParams = {state: 'WorkSpace.UpForReviewContent', contentId: 'do_212345409736458240151', 'type': 'Course' },
    validateModal = {
      state: ['WorkSpace.UpForReviewContent', 'WorkSpace.ReviewContent',
        'WorkSpace.PublishedContent', 'WorkSpace.FlaggedContent', 'LimitedPublishedContent'],
      status: ['Review', 'Draft', 'Live', 'Flagged', 'Unlisted'],
      mimeType: 'application/vnd.ekstep.content-collection'
    }

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $controller, _contentService_, _$q_, _$timeout_, $state) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    contentService = _contentService_
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()

    geController = $controller('GenericEditorController', {
      $rootScope: rootScope,
      $scope: scope,
      contentService: contentService,
      $state: $state,
      $stateParams: stateParams
    })
  }))

  it('check modal is inilialized', function () {
    expect(geController.openGenericEditor).toBeDefined()
    timeout.flush(200)
    var spyEvent = spyOnEvent('#genericEditor', 'close')
    $('#genericEditor').trigger('close')
  })

  it('Should open model with state', function () {
    spyOn(geController, 'openModel').and.callThrough()
    geController.openModel()
    timeout.flush(2000)
  })

  it('Should open model without state', function () {
    stateParams.state = ''
    spyOn(geController, 'openModel').and.callThrough()
    geController.openModel()
    timeout.flush(2000)
  })
})
