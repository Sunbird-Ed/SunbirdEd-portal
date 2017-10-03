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
        stateParams = { backState: 'WorkSpace.UpForReviewContent', contentId : 'do_212345409736458240151' };

    var getContentSuccess = {"id":"api.content.read","ver":"1.0","ts":"2017-10-03T05:27:51.111Z","params":{"resmsgid":"99721570-a7fb-11e7-88b7-ddc4007807ad","msgid":"996d0c60-a7fb-11e7-b45f-2d07a37bcb8f","status":"successful","err":null,"errmsg":null},"responseCode":"OK","result":{"content":{"code":"org.sunbird.RR0n9e","downloadUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_212345409736458240151/h5p_1507008446566_do_212345409736458240151_1.0.ecar","channel":"in.ekstep","description":"Test Content h5p email test","language":["English"],"mimeType":"application/vnd.ekstep.h5p-archive","variants":{"spine":{"ecarUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_212345409736458240151/h5p_1507008446824_do_212345409736458240151_1.0_spine.ecar","size":839}},"idealScreenSize":"normal","createdOn":"2017-10-03T05:20:24.470+0000","contentDisposition":"inline","artifactUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_212345409736458240151/artifact/1507008075979_do_212345409736458240151.zip","contentEncoding":"gzip","lastUpdatedOn":"2017-10-03T05:25:13.691+0000","sYS_INTERNAL_LAST_UPDATED_ON":"2017-10-03T05:27:26.992+0000","contentType":"Story","lastUpdatedBy":"349","identifier":"do_212345409736458240151","audience":["Learner"],"os":["All"],"visibility":"Default","consumerId":"fa271a76-c15a-4aa1-adff-31dd04682a1f","mediaType":"content","osId":"org.ekstep.quiz.app","lastPublishedBy":"349","languageCode":"en","pkgVersion":1,"versionKey":"1507008446993","idealScreenDensity":"hdpi","s3Key":"ecar_files/do_212345409736458240151/h5p_1507008446566_do_212345409736458240151_1.0.ecar","lastPublishedOn":"2017-10-03T05:27:26.566+0000","size":647576,"createdBy":"d5efd1ab-3cad-4034-8143-32c480f5cc9e","compatibilityLevel":4,"name":"h5p","status":"Live"}}};
    var getContentFailed = {"id":"api.content.read","ver":"1.0","ts":"2017-10-03T05:54:52.515Z","params":{"resmsgid":"5fe0b330-a7ff-11e7-bfbf-79d3eb8b325a","msgid":null,"status":"failed","err":"ERR_CONTENT_NOT_FOUND","errmsg":"Content not found with id: do_21234540973645824015"},"responseCode":"RESOURCE_NOT_FOUND","result":{}};
    var publishSuccessResp = {"id":"api.content.publish","ver":"1.0","ts":"2017-10-03T05:26:21.206Z","params":{"resmsgid":"63dbab60-a7fb-11e7-88b7-ddc4007807ad","msgid":"63cd7a90-a7fb-11e7-b45f-2d07a37bcb8f","status":"successful","err":null,"errmsg":null},"responseCode":"OK","result":{"content_id":"do_212345409736458240151","versionKey":"1507008313691","publishStatus":"Publish Operation for Content Id 'do_212345409736458240151' Started Successfully!"}};
    var publishFailedResp = {"id":"api.content.publish","ver":"1.0","ts":"2017-10-03T06:03:25.056Z","params":{"resmsgid":"91604000-a800-11e7-bfbf-79d3eb8b325a","msgid":null,"status":"failed","err":"ERR_TOKEN_INVALID","errmsg":"Invalid token"},"responseCode":"UNAUTHORIZED_ACCESS","result":{}};
    var rejectSuccessResp = {"id":"api.content.reject","ver":"1.0","ts":"2017-10-03T10:11:19.292Z","params":{"resmsgid":"331c8bc0-a823-11e7-bfbf-79d3eb8b325a","msgid":"3309ee20-a823-11e7-a02d-39375ec54822","status":"successful","err":null,"errmsg":null},"responseCode":"OK","result":{"node_id":"do_212345531489861632163","versionKey":"1507025411726"}};
    var rejectFailedResp = {"id":"api.content.reject","ver":"1.0","ts":"2017-10-03T09:34:15.433Z","params":{"resmsgid":"05969790-a81e-11e7-bfbf-79d3eb8b325a","msgid":null,"status":"failed","err":"ERR_CONTENT_NOT_FOUND","errmsg":"Content not found with id: do_2123455314898616321632"},"responseCode":"RESOURCE_NOT_FOUND","result":{}};
    var deleteSuccessResp = {"id":"api.content.retire","ver":"1.0","ts":"2017-10-03T10:22:06.601Z","params":{"resmsgid":"b4f00f90-a824-11e7-bfbf-79d3eb8b325a","msgid":"b49b38d0-a824-11e7-a02d-39375ec54822","status":"successful","err":null,"errmsg":null},"responseCode":"OK","result":[]};
    var deleteFailedResp = {"id":"api.content.retire","ver":"1.0","ts":"2017-10-03T10:21:26.448Z","params":{"resmsgid":"9d013300-a824-11e7-bfbf-79d3eb8b325a","msgid":null,"status":"failed","err":"ERR_TOKEN_INVALID","errmsg":"Invalid token"},"responseCode":"UNAUTHORIZED_ACCESS","result":{}};
    var acceptFlagSuccessResp = {"id":"api.flag.accept","ver":"1.0","ts":"2017-10-03T10:29:17.048Z","params":{"resmsgid":"b5810f80-a825-11e7-bfbf-79d3eb8b325a","msgid":"b56d8780-a825-11e7-a02d-39375ec54822","status":"successful","err":null,"errmsg":null},"responseCode":"OK","result":{"node_id":"do_212345409736458240151","versionKey":"1507026489477"}};
    var acceptFlagFailedResp = {"id":"api.flag.accept","ver":"1.0","ts":"2017-10-03T10:29:42.154Z","params":{"resmsgid":"c477eea0-a825-11e7-88b7-ddc4007807ad","msgid":null,"status":"failed","err":"ERR_CONTENT_NOT_FOUND","errmsg":"Content not found with id: do_21234540973645824015"},"responseCode":"RESOURCE_NOT_FOUND","result":{}};
    var discardFlagSuccessResp = {"id":"api.flag.reject","ver":"1.0","ts":"2017-10-03T10:30:09.523Z","params":{"resmsgid":"d4c81c30-a825-11e7-bfbf-79d3eb8b325a","msgid":"d4a10c30-a825-11e7-a02d-39375ec54822","status":"successful","err":null,"errmsg":null},"responseCode":"OK","result":{"node_id":"do_212345409736458240151","versionKey":"1507026541936"}};
    var discardFlagFailedResp = {"id":"api.flag.reject","ver":"1.0","ts":"2017-10-03T10:32:20.350Z","params":{"resmsgid":"22c2b9e0-a826-11e7-88b7-ddc4007807ad","msgid":null,"status":"failed","err":"ERR_CONTENT_NOT_FOUND","errmsg":"Content not found with id: do_212345409736458240151d"},"responseCode":"RESOURCE_NOT_FOUND","result":{}};
    beforeEach(inject(function($rootScope, $controller) {
        $controller('AppCtrl', {
            $rootScope: $rootScope,
            $scope: $rootScope.$new(),
            $stateParams: stateParams
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

    describe("get content", function() {

        it('Should called get content service', function(){
            spyOn(contentService, 'getById').and.callThrough();
            contentService.getById({contentId : stateParams.contentId});
            expect(contentService.getById).toBeDefined();
        });

        it('Success', function(){
            spyOn(contentService, 'getById').and.returnValue(deferred.promise);
            deferred.resolve(getContentSuccess);
            spyOn(previewContent, 'getContent').and.callThrough();
            previewContent.getContent(stateParams.contentId);
            scope.$apply();
            var response = contentService.getById().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('Failed due to invalid content id', function(){
            spyOn(contentService, 'getById').and.returnValue(deferred.promise);
            deferred.resolve(getContentFailed);
            spyOn(previewContent, 'getContent').and.callThrough();
            previewContent.getContent(stateParams.contentId);
            scope.$apply();
            var response = contentService.getById().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('Failed due to external error', function(){
            spyOn(contentService, 'getById').and.returnValue(deferred.promise);
            deferred.reject({});
            spyOn(previewContent, 'getContent').and.callThrough();
            previewContent.getContent(stateParams.contentId);
            scope.$apply();
            var response = contentService.getById().$$state.value;
            expect(response).not.toBe(undefined);
        });
    });

    describe("Published content", function() {

        it('Success', function(){
            spyOn(contentService, 'publish').and.returnValue(deferred.promise);
            deferred.resolve(publishSuccessResp);
            spyOn(previewContent, 'publishContent').and.callThrough();
            previewContent.publishContent();
            scope.$apply();
            var response = contentService.publish().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('Failed due to invalid content id', function(){
            spyOn(contentService, 'publish').and.returnValue(deferred.promise);
            deferred.resolve(publishFailedResp);
            spyOn(previewContent, 'publishContent').and.callThrough();
            previewContent.publishContent();
            scope.$apply();
            var response = contentService.publish().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('Failed due to external error', function(){
            spyOn(contentService, 'publish').and.returnValue(deferred.promise);
            deferred.reject({});
            spyOn(previewContent, 'publishContent').and.callThrough();
            previewContent.publishContent();
            scope.$apply();
            var response = contentService.publish().$$state.value;
            expect(response).not.toBe(undefined);
        });
    });

    describe("Reject content", function() {

        it('Success', function(){
            spyOn(contentService, 'reject').and.returnValue(deferred.promise);
            deferred.resolve(rejectSuccessResp);
            spyOn(previewContent, 'rejectContent').and.callThrough();
            previewContent.rejectContent();
            scope.$apply();
            var response = contentService.reject().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('Failed due to invalid content id', function(){
            spyOn(contentService, 'reject').and.returnValue(deferred.promise);
            deferred.resolve(rejectFailedResp);
            spyOn(previewContent, 'rejectContent').and.callThrough();
            previewContent.rejectContent();
            scope.$apply();
            var response = contentService.reject().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('Failed due to external error', function(){
            spyOn(contentService, 'reject').and.returnValue(deferred.promise);
            deferred.reject({});
            spyOn(previewContent, 'rejectContent').and.callThrough();
            previewContent.rejectContent();
            scope.$apply();
            var response = contentService.reject().$$state.value;
            expect(response).not.toBe(undefined);
        });
    });

    describe("Delete content", function() {

        it('Success', function(){
            spyOn(contentService, 'retire').and.returnValue(deferred.promise);
            deferred.resolve(deleteSuccessResp);
            spyOn(previewContent, 'deleteContent').and.callThrough();
            previewContent.deleteContent();
            timeout.flush(2000);
            scope.$apply();
            var response = contentService.retire().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('Failed due to invalid content id', function(){
            spyOn(contentService, 'retire').and.returnValue(deferred.promise);
            deferred.resolve(deleteFailedResp);
            spyOn(previewContent, 'deleteContent').and.callThrough();
            previewContent.deleteContent();
            scope.$apply();
            var response = contentService.retire().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('Failed due to external error', function(){
            spyOn(contentService, 'retire').and.returnValue(deferred.promise);
            deferred.reject({});
            spyOn(previewContent, 'deleteContent').and.callThrough();
            previewContent.deleteContent();
            scope.$apply();
            var response = contentService.retire().$$state.value;
            expect(response).not.toBe(undefined);
        });
    });

    describe("Accept content flag", function() {
        var request = {
                "versionKey": "150167687998"
        };

        it('Success', function(){
            spyOn(contentService, 'acceptContentFlag').and.returnValue(deferred.promise);
            deferred.resolve(acceptFlagSuccessResp);
            spyOn(previewContent, 'acceptContentFlag').and.callThrough();
            previewContent.acceptContentFlag(request);
            scope.$apply();
            var response = contentService.acceptContentFlag().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('Failed due to invalid content id', function(){
            spyOn(contentService, 'acceptContentFlag').and.returnValue(deferred.promise);
            deferred.resolve(acceptFlagFailedResp);
            spyOn(previewContent, 'acceptContentFlag').and.callThrough();
            previewContent.acceptContentFlag(request);
            scope.$apply();
            var response = contentService.acceptContentFlag().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('Failed due to external error', function(){
            spyOn(contentService, 'acceptContentFlag').and.returnValue(deferred.promise);
            deferred.reject({});
            spyOn(previewContent, 'acceptContentFlag').and.callThrough();
            previewContent.acceptContentFlag(request);
            scope.$apply();
            var response = contentService.acceptContentFlag().$$state.value;
            expect(response).not.toBe(undefined);
        });
    });

    describe("Discard content flag", function() {
        var request = {
                    "versionKey": "150167687998"
            };

        it('Success', function(){
            spyOn(contentService, 'discardContentFlag').and.returnValue(deferred.promise);
            deferred.resolve(discardFlagSuccessResp);
            spyOn(previewContent, 'discardContentFlag').and.callThrough();
            previewContent.discardContentFlag(request);
            scope.$apply();
            var response = contentService.discardContentFlag().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('Failed due to invalid content id', function(){
            spyOn(contentService, 'discardContentFlag').and.returnValue(deferred.promise);
            deferred.resolve(discardFlagFailedResp);
            spyOn(previewContent, 'discardContentFlag').and.callThrough();
            previewContent.discardContentFlag(request);
            scope.$apply();
            var response = contentService.discardContentFlag().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('Failed due to external error', function(){
            spyOn(contentService, 'discardContentFlag').and.returnValue(deferred.promise);
            deferred.reject({});
            spyOn(previewContent, 'discardContentFlag').and.callThrough();
            previewContent.discardContentFlag(request);
            scope.$apply();
            var response = contentService.discardContentFlag().$$state.value;
            expect(response).not.toBe(undefined);
        });
    });

    it("Should get content names", function() {
        var concepts = [
                    "LO17",
                   "LO17"
                
            ]
        spyOn(previewContent, 'getConceptsNames').and.callThrough();
        previewContent.getConceptsNames(concepts);
    });
});