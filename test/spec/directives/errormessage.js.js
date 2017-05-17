'use strict';

describe('Directive: errorMessage.js', function () {

  // load the directive's module
  beforeEach(module('playerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<error-message.js></error-message.js>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the errorMessage.js directive');
  }));
});
