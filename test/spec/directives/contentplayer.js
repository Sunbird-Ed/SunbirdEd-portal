'use strict';

describe('Directive: contentPlayer', function () {

  // load the directive's module
  beforeEach(module('playerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<content-player></content-player>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the contentPlayer directive');
  }));
});
