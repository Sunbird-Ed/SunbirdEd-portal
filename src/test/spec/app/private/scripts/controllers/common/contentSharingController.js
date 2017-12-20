/**
 * name: contentSharingController.js
 * author: Anuj Gupta
 * Date: 05-10-2017
 */

'use strict'

describe('Controller: contentSharingController', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  var scope,
    rootScope,
    contentSharingCtrl,
    timeout

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $controller, _$timeout_, $state) {
    rootScope = $rootScope
    scope = $rootScope.$new()
    timeout = _$timeout_
    rootScope.search = {}
    scope.redirectUrl = 'Content'
    contentSharingCtrl = $controller('contentSharingController', {
      $rootScope: rootScope,
      $scope: scope
    })
  }))

  it('Should not show content share modal ', function () {
    expect(contentSharingCtrl.showContentShareModal).toBe(false)
  })

  it('Initialize content share modal ', function () {
    spyOn(contentSharingCtrl, 'initializeModal').and.callThrough()
    contentSharingCtrl.initializeModal()
    expect(contentSharingCtrl.showContentShareModal).toBe(true)
    timeout.flush(10)
    $('#copyLinkButton').trigger('click')
    timeout.flush(1000)
  })

  it('Close content share modal ', function () {
    spyOn(contentSharingCtrl, 'close').and.callThrough()
    contentSharingCtrl.close()
    expect(contentSharingCtrl.showContentShareModal).toBe(false)
    timeout.flush(0)
  })
})
