'use strict';

describe('Directive: contentPlayer', function () {
    
    var contentDetailFailedData = {"id":"api.content.get","ver":"1.0","ts":"2017-06-05T18:20:44.191Z","params":{"resmsgid":"b0628af0-4a1b-11e7-8ff7-3709092de4a3","msgid":null,"status":"failed","err":"ERR_CONTENT_GET_FAILED","errmsg":"Get content failed"},"responseCode":"RESOURCE_NOT_FOUND","result":{}};
    var contentDetailSuccessData = {"id":"api.content.get","ver":"1.0","ts":"2017-06-05T18:21:35.571Z","params":{"resmsgid":"cf028230-4a1b-11e7-8ff7-3709092de4a3","msgid":"123456778","status":"successful","err":null,"errmsg":null},"responseCode":"OK","result":{"content":{"identifier":"do_112240792137957376167","code":"org.sunbird.xtLuNJ","visibility":"Default","downloadUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/do_112240792137957376167/update-name-11_1495788351364_do_112240792137957376167_3.0.ecar","description":"Test Content 1-1_1_1 utils","language":["English"],"mediaType":"content","mimeType":"image/jpg","variants":{"spine":{"ecarUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/do_112240792137957376167/update-name-11_1495788351696_do_112240792137957376167_3.0_spine.ecar","size":851}},"osId":"org.ekstep.quiz.app","languageCode":"en","createdOn":"2017-05-26T08:45:51.299+0000","pkgVersion":3,"versionKey":"1495788352156","lastPublishedOn":"2017-05-26T08:45:51.363+0000","size":263843,"createdBy":"12345678","name":"Update name 11","artifactUrl":"https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_112240792137957376167/artifact/screenshot-from-2017-04-12-111124_1494237439230.png","lastUpdatedOn":"2017-05-24T04:43:57.826+0000","contentType":"TextBook","status":"Live"}}};
    var contentDetailSuccessDataECML = {"id":"api.content.get","ver":"1.0","ts":"2017-06-06T04:47:37.771Z","params":{"resmsgid":"43d35fb0-4a73-11e7-ac52-fb0c238362d8","msgid":"123456778","status":"successful","err":null,"errmsg":null},"responseCode":"OK","result":{"content":{"identifier":"do_11225569745628364815","code":"org.sunbird.PIlknT","visibility":"Default","description":"test","language":["English"],"mediaType":"content","mimeType":"application/vnd.ekstep.ecml-archive","osId":"org.ekstep.quiz.app","languageCode":"en","createdOn":"2017-05-29T11:20:18.394+0000","versionKey":"1496724456390","createdBy":"12345678","name":"test ecml","lastUpdatedOn":"2017-06-06T04:47:36.390+0000","contentType":"Story","status":"Draft"}}};

    // load the directive's module
    beforeEach(module('playerApp'));

    var element, ctrl, manualCompiledElement, compile, templateCache, timeout, $q, deferred, contentService,
            scope;

    beforeEach(inject(function ($rootScope, $controller, $templateCache, $compile, _$timeout_, _contentService_, _$q_) {
        scope = $rootScope.$new();
        contentService = _contentService_

        ctrl = $controller('contentPlayerCtrl', {$scope: scope, $element: null, contentService : contentService});
        $templateCache.put('views/contentplayer/player.html', '<div>Content</div>')
        compile = $compile;
        templateCache = $templateCache;
        $q = _$q_;
        timeout = _$timeout_;
        deferred = _$q_.defer();
    }));

    it("should content play on pass body", function () {

        scope.body = {name : "name"};
        scope.visibility = true;
        scope.isclose = true;
        element = compile('<content-player visibility="visibility" body="body" isclose="isclose" height="700" width="1000"></content-player>')(scope);

        manualCompiledElement = angular.element(templateCache.get('views/contentplayer/player.html'));
        timeout.flush(1000);
        scope.$digest();
        expect(element.text()).toContain('Content');
    });

    it("should content play on pass id", function () {
        scope.id = "do_123221";
        scope.visibility = true;
        scope.isclose = true;
        element = compile('<content-player visibility="visibility" id="id" isclose="isclose" height="700" width="1000"></content-player>')(scope);

        manualCompiledElement = angular.element(templateCache.get('views/contentplayer/player.html'));
        scope.$digest();
        expect(element.text()).toContain('Content');
    });
    
    it('Should not get content data ', function() {
        
        spyOn(contentService, 'getById').and.returnValue(deferred.promise);
        deferred.resolve(contentDetailFailedData);
        scope.id = "do_112240792137957376167";
        scope.visibility = true;
        scope.isclose = true;
        element = compile('<content-player visibility="visibility" id="id" isclose="isclose" height="700" width="1000"></content-player>')(scope);

        manualCompiledElement = angular.element(templateCache.get('views/contentplayer/player.html'));
        scope.$digest();
        expect(element.text()).toContain('Content');
        var response = contentService.getById().$$state.value;
        scope.contentData = response.result.content ;
        expect(response).not.toBe(undefined);
    });
    
    it('Should get content data ', function() {
        
        spyOn(contentService, 'getById').and.returnValue(deferred.promise);
        deferred.resolve(contentDetailSuccessData);
        scope.id = "do_112240792137957376167";
        scope.visibility = true;
        scope.isclose = true;
        element = compile('<content-player visibility="visibility" id="id" isclose="isclose" height="700" width="1000"></content-player>')(scope);

        manualCompiledElement = angular.element(templateCache.get('views/contentplayer/player.html'));
        scope.$digest();
        expect(element.text()).toContain('Content');
        var response = contentService.getById().$$state.value;
        scope.contentData = response.result.content;
        expect(response).not.toBe(undefined);
    });
    
    it('Should get content data for ECML', function() {
        
        spyOn(contentService, 'getById').and.returnValue(deferred.promise);
        deferred.resolve(contentDetailSuccessDataECML);
        scope.id = "do_112240792137957376167";
        scope.visibility = true;
        scope.isclose = true;
        element = compile('<content-player visibility="visibility" id="id" isclose="isclose" height="700" width="1000"></content-player>')(scope);

        manualCompiledElement = angular.element(templateCache.get('views/contentplayer/player.html'));
        scope.$digest();
        expect(element.text()).toContain('Content');
        var response = contentService.getById().$$state.value;
        scope.contentData = response.result.content;
        expect(response).not.toBe(undefined);
    });
    
    
    
    it("Shouls called get content detail service", function() {
        var req = {contentId :  "do_112240792137957376167"};
        spyOn(contentService, 'getById').and.callThrough();
        contentService.getById(req);
        expect(contentService.getById).toBeDefined();
    });

    xit("Should failed get content detail due to external error", function() {

        spyOn(contentService, 'getById').and.returnValue(deferred.promise);
        deferred.reject();
        scope.id = "do_12322178";
        scope.visibility = true;
        scope.isclose = true;
        element = compile('<content-player visibility="visibility" id="id" isclose="isclose" height="700" width="1000"></content-player>')(scope);

        manualCompiledElement = angular.element(templateCache.get('app/views/contentplayer/player.html'));
        scope.$digest();
    });
    
    it("Should close the content player", function() {
        spyOn(scope, 'close').and.callThrough();
        scope.close();
        expect(scope.close).toBeDefined();
        expect(scope.visibility).toBe(false);
    });
    
    it("Should called tryAgain function", function() {
        spyOn(scope, 'tryAgain').and.callThrough();
        scope.tryAgain();
        expect(scope.tryAgain).toBeDefined();
        expect(scope.errorObject).toBeDefined();
    });
    
    it("Should called zoomIn function", function() {
        spyOn(scope, 'zoomIn').and.callThrough();
        scope.zoomIn();
        expect(scope.zoomIn).toBeDefined();
    });
    
    it("Should called zoomOut function", function() {
        spyOn(scope, 'zoomOut').and.callThrough();
        scope.zoomOut();
        expect(scope.zoomOut).toBeDefined();
    });
    
    it("Should called previous function", function() {
        spyOn(scope, 'previous').and.callThrough();
        scope.previous();
        expect(scope.previous).toBeDefined();
    });
    
    it("Should called next function", function() {
        spyOn(scope, 'next').and.callThrough();
        scope.next();
        expect(scope.next).toBeDefined();
    });
    
    it("Should called rotate function", function() {
        spyOn(scope, 'rotate').and.callThrough();
        scope.rotate();
        expect(scope.rotate).toBeDefined();
    });
    
    it("Should called goToPage function", function() {
        spyOn(scope, 'goToPage').and.callThrough();
        scope.goToPage();
        expect(scope.goToPage).toBeDefined();
    });
    
    it("Should called getTotalPage function", function() {
        spyOn(scope, 'getTotalPage').and.callThrough();
        scope.getTotalPage();
        timeout.flush(2000);
        expect(scope.getTotalPage).toBeDefined();
    });


});
