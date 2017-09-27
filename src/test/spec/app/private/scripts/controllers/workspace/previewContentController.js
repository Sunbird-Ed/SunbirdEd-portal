/**
 * name: PreviewContentController.js
 * author: Anuj Gupta
 * Date: 27-09-2017
 */
'use strict';

describe('Controller:PreviewContentController', function(){
	// load the controller's module
    beforeEach(module('playerApp'));

    var contentService,
        scope,
        rootScope,
        previewContent,
        $q,
        deferred,
        timeout,
        stateParams = { contentId: '12123123124324', courseId : '12123123124324' };

    beforeEach(inject(function($rootScope, $controller) {
        $controller('AppCtrl', {
            $rootScope: $rootScope,
            $scope: $rootScope.$new()
        });
    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function($rootScope, $controller, _contentService_, _$q_, _$timeout_) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        contentService = _contentService_;
        $q = _$q_;
        timeout = _$timeout_;
        deferred = _$q_.defer();

        previewContent = $controller('PreviewContentController', {
            $rootScope: rootScope,
            $scope: scope,
            contentService: contentService,
            $stateParams: stateParams
        });
    }));

    describe("Published content", function() {
    	it("success", function() {
    		spyOn(previewContent, 'publishContent').and.callThrough();
        	previewContent.publishContent();
    	});
    });
});