'use strict'

describe('Factory: fileUpload', function () {
  beforeEach(module('playerApp'))

  var fileUpload,
    scope,
    rootScope,
    $q,
    deferred,
    timeout,
    annTestData = announcementTestData

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  beforeEach(inject(function ($rootScope, _fileUpload_, _$q_, _$timeout_) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    fileUpload = _fileUpload_
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()
  }))

  it('should create model instance for Announcement based on input data', function () {
    var announcement = new fileUpload.createFineUploadInstance({})
    timeout.flush(100)
    expect(announcement).toBeDefined()
  })
})
