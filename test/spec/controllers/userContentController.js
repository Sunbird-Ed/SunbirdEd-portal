'use strict';

describe('Controller: userContentCtrl', function() {
    beforeEach(function () {
     module('playerApp');
    });

    var scope, controller, contentService;
    beforeEach(inject(function($rootScope, $controller,_contentService_) {
        scope = $rootScope.$new();
        contentService = _contentService_;
        controller = $controller('userContentCtrl', { $scope: scope });
    }));

    it('should get the published content', function() {
        spyOn(scope, "getPublishedContent").and.callThrough();
        expect(scope.contentItem).toBeUndefined();
    });

});
