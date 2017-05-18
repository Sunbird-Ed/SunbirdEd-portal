'use strict';

describe('Controller: CreatecontentCtrl', function () {

  // load the controller's module
  beforeEach(module('playerApp'));

  var CreatecontentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreatecontentCtrl = $controller('CreatecontentCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(CreatecontentCtrl.awesomeThings.length).toBe(3);
  });
});
