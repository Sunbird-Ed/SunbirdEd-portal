/**
 * name: ContentPlayerController.js
 * author: Anuj Gupta
 * Date: 05-10-2017
 */

'use strict';

describe('Controller: contentPlayerCtrl', function() {
    // load the controller's module
    beforeEach(module('playerApp'));
    var contentService,
        scope,
        rootScope,
        contentPlayerController,
        $q,
        deferred,
        timeout;

    beforeEach(inject(function($rootScope, $controller) {
        $controller('AppCtrl', {
            $rootScope: $rootScope,
            $scope: $rootScope.$new()
        });
    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function($rootScope, $controller, _contentService_, _$q_, _$timeout_, $state) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        contentService = _contentService_;
        $q = _$q_;
        timeout = _$timeout_;
        deferred = _$q_.defer();

        contentPlayerController = $controller('contentPlayerCtrl', {
            $rootScope: rootScope,
            $scope: scope,
            contentService: contentService,
            $state: $state
        });
    }));

    it("show detail should be false", function() {
    	expect(scope.showModalInLectureView).toBe(true);
    });

    it("Update content with id", function() {
        spyOn(contentService, 'getById').and.returnValue(deferred.promise);
        deferred.resolve(testData.previewContent.getContentSuccess);
    	scope.id = "do_2123463136997294081163";
        spyOn(scope, 'updateContent').and.callThrough();
        scope.updateContent(scope);
        scope.$apply();
        var response = contentService.getById().$$state.value;
        expect(response.responseCode).toBe('OK');
        timeout.flush(10);
    });

    it("Update content with id", function() {
        spyOn(contentService, 'getById').and.returnValue(deferred.promise);
        deferred.resolve(testData.previewContent.getContentFailed);
        scope.id = "do_2123463136997294081163";
        spyOn(scope, 'updateContent').and.callThrough();
        scope.updateContent(scope);
        scope.$apply();
        var response = contentService.getById().$$state.value;
        expect(response.responseCode).toBe('RESOURCE_NOT_FOUND');
        timeout.flush(10);
    });

    it("Update content with body", function() {
        spyOn(contentService, 'getById').and.returnValue(deferred.promise);
        deferred.resolve(testData.previewContent.getContentSuccess);
    	scope.body = {identifier : "do_2123463136997294081163"};
        spyOn(scope, 'updateContent').and.callThrough();
        scope.updateContent(scope);
        scope.$apply();
        var response = contentService.getById().$$state.value;
        expect(response.responseCode).toBe('OK');
        timeout.flush(10);
    });

    it("Call try again function", function() {
    	scope.id = "do_2123463136997294081163";
        spyOn(scope, 'tryAgain').and.callThrough();
        scope.tryAgain();
        // expect(scope.errorObject).toBe({ });
    });

    it("Should get content names", function() {
        var concepts = [
                    "LO17",
                   "LO17"
                
            ];
        spyOn(scope, 'getConceptsNames').and.callThrough();
        scope.getConceptsNames(concepts);
    });

    xit("Call close function", function() {
        scope.closeurl  = "Content";
        scope.id = "do_2123463136997294081163";
        rootScope.search = {};
        rootScope.search.searchKeyword = '';
        scope.body = {identifier : "do_2123463136997294081163"};
        spyOn(scope, 'close').and.callThrough();
        scope.close();
        timeout.flush(0);
    });

    xit("Call close function with search keyword", function() {
        scope.closeurl  = "Content";
        scope.id = "do_2123463136997294081163";
        rootScope.search = {};
        rootScope.search.searchKeyword = 'some value';
        spyOn(scope, 'close').and.callThrough();
        scope.close();
        timeout.flush(0);
    });
});