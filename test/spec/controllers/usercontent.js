'use strict';

describe('Controller: UsercontentCtrl', function () {

  // load the controller's module
  beforeEach(module('playerApp'));

  var UsercontentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UsercontentCtrl = $controller('UsercontentCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UsercontentCtrl.awesomeThings.length).toBe(3);
  });
});
