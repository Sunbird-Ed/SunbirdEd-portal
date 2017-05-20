'use strict';

describe('Controller: LoginCtrl', function() {
    // load the controller's module
    beforeEach(module('playerApp'));

    var LoginCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        LogincontrollerCtrl = $controller('LoginCtrl', {
            $scope: scope
                // place here mocked dependencies
        });
    }));
});
