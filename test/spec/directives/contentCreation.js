'use strict';

describe('Directive: contentCreation', function () {

  // load the directive's module
  beforeEach(module('playerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  xit('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<content-creation></content-creation>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the contentCreation directive');
  }));
});
