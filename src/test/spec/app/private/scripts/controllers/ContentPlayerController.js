/**
 * name: ContentPlayerController.js
 * author: Anuj Gupta
 * Date: 05-10-2017
 */

'use strict';

describe('Controller: contentPlayerCtrl', function() {
    // load the controller's module
    beforeEach(module('playerApp'));

    var getContentSuccess = {"id":"api.content.read","ver":"1.0","ts":"2017-10-03T05:27:51.111Z","params":{"resmsgid":"99721570-a7fb-11e7-88b7-ddc4007807ad","msgid":"996d0c60-a7fb-11e7-b45f-2d07a37bcb8f","status":"successful","err":null,"errmsg":null},"responseCode":"OK","result":{"content":{"code":"org.sunbird.RR0n9e","downloadUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_212345409736458240151/h5p_1507008446566_do_212345409736458240151_1.0.ecar","channel":"in.ekstep","description":"Test Content h5p email test","language":["English"],"mimeType":"application/vnd.ekstep.h5p-archive","variants":{"spine":{"ecarUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_212345409736458240151/h5p_1507008446824_do_212345409736458240151_1.0_spine.ecar","size":839}},"idealScreenSize":"normal","createdOn":"2017-10-03T05:20:24.470+0000","contentDisposition":"inline","artifactUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_212345409736458240151/artifact/1507008075979_do_212345409736458240151.zip","contentEncoding":"gzip","lastUpdatedOn":"2017-10-03T05:25:13.691+0000","sYS_INTERNAL_LAST_UPDATED_ON":"2017-10-03T05:27:26.992+0000","contentType":"Story","lastUpdatedBy":"349","identifier":"do_212345409736458240151","audience":["Learner"],"os":["All"],"visibility":"Default","consumerId":"fa271a76-c15a-4aa1-adff-31dd04682a1f","mediaType":"content","osId":"org.ekstep.quiz.app","lastPublishedBy":"349","languageCode":"en","pkgVersion":1,"versionKey":"1507008446993","idealScreenDensity":"hdpi","s3Key":"ecar_files/do_212345409736458240151/h5p_1507008446566_do_212345409736458240151_1.0.ecar","lastPublishedOn":"2017-10-03T05:27:26.566+0000","size":647576,"createdBy":"d5efd1ab-3cad-4034-8143-32c480f5cc9e","compatibilityLevel":4,"name":"h5p","status":"Live"}}};
    var getContentFailed = {"id":"api.content.read","ver":"1.0","ts":"2017-10-03T05:54:52.515Z","params":{"resmsgid":"5fe0b330-a7ff-11e7-bfbf-79d3eb8b325a","msgid":null,"status":"failed","err":"ERR_CONTENT_NOT_FOUND","errmsg":"Content not found with id: do_21234540973645824015"},"responseCode":"RESOURCE_NOT_FOUND","result":{}};


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
        deferred.resolve(getContentSuccess);
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
        deferred.resolve(getContentFailed);
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
        deferred.resolve(getContentSuccess);
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