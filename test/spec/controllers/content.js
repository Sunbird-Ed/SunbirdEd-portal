'use strict';

describe('Controller: ContentCtrl', function () {

  // load the controller's module
  beforeEach(module('playerApp'));

  var ContentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContentCtrl = $controller('ContentCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ContentCtrl.awesomeThings.length).toBe(3);
  });
});
