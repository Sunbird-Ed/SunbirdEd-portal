'use strict'

describe('Factory: AnnouncementModel', function () {
  beforeEach(module('playerApp'))

  var AnnouncementModel,
    scope,
    rootScope,
    $q,
    deferred,
    annTestData = announcementTestData

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  beforeEach(inject(function ($rootScope, _AnnouncementModel_, _$q_) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    AnnouncementModel = _AnnouncementModel_
    $q = _$q_
    deferred = _$q_.defer()
  }))

  it('should create model instance for Announcement based on input data', function () {
    var announcement = new AnnouncementModel.Announcement({})
    expect(announcement).toBeDefined()
  })
})
