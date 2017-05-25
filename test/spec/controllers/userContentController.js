'use strict';

describe('Controller: UsercontentCtrl', function() {
    // load the controller's module
    beforeEach(module('playerApp'));

    var UsercontentCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        UsercontentCtrl = $controller('userContentCtrl', {
            $scope: scope
        });
    }));

    xit('should get the published content', function() {
        spyOn(scope,"getPublishedContent").and.callThrough();
        scope.getPublishedContent();
        scope.$digest();
    });
});
