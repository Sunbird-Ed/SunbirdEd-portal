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
    var livecontentData = {"id":"api.content.read","ver":"1.0","ts":"2017-10-10T05:47:41.854Z","params":{"resmsgid":"88134be0-ad7e-11e7-97ff-63ff90b37d16","msgid":"880f5440-ad7e-11e7-a07d-f5f6725f0c43","status":"successful","err":null,"errmsg":null},"responseCode":"OK","result":{"content":{"code":"3c64887b-8724-4042-87d6-a6aa32bce4d9","downloadUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_212347659881684992122/untitled-content_1507550428041_do_212347659881684992122_1.0.ecar","channel":"505c7c48ac6dc1edc9b08f21db5a571d","language":["English"],"mimeType":"video/webm","variants":{"spine":{"ecarUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_212347659881684992122/untitled-content_1507550428980_do_212347659881684992122_1.0_spine.ecar","size":1009}},"idealScreenSize":"normal","createdOn":"2017-10-06T09:38:20.401+0000","contentDisposition":"inline","artifactUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/do_212347659881684992122/learn-colors-surprise-eggs-3d-cartoons-for-children-video-for-kids.webm","contentEncoding":"identity","lastUpdatedOn":"2017-10-09T11:58:10.736+0000","sYS_INTERNAL_LAST_UPDATED_ON":"2017-10-09T12:00:29.168+0000","contentType":"Resource","lastUpdatedBy":"14928bd8-4565-466c-9e21-42f86c09a3a4","identifier":"do_212347659881684992122","audience":["Learner"],"createdFor":["ORG_001"],"os":["All"],"visibility":"Default","consumerId":"fa271a76-c15a-4aa1-adff-31dd04682a1f","mediaType":"content","osId":"org.ekstep.quiz.app","lastPublishedBy":"14928bd8-4565-466c-9e21-42f86c09a3a4","languageCode":"en","pkgVersion":1,"versionKey":"1507550429168","idealScreenDensity":"hdpi","s3Key":"ecar_files/do_212347659881684992122/untitled-content_1507550428041_do_212347659881684992122_1.0.ecar","size":9183680,"lastSubmittedOn":"2017-10-06T09:39:04.803+0000","lastPublishedOn":"2017-10-09T12:00:28.041+0000","createdBy":"d5efd1ab-3cad-4034-8143-32c480f5cc9e","compatibilityLevel":1,"name":"Untitled Content","status":"Live","resourceType":"Story"}}};
    var reviewcontentData = {"id":"api.content.read","ver":"1.0","ts":"2017-10-10T05:47:41.854Z","params":{"resmsgid":"88134be0-ad7e-11e7-97ff-63ff90b37d16","msgid":"880f5440-ad7e-11e7-a07d-f5f6725f0c43","status":"successful","err":null,"errmsg":null},"responseCode":"OK","result":{"content":{"code":"3c64887b-8724-4042-87d6-a6aa32bce4d9","downloadUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_212347659881684992122/untitled-content_1507550428041_do_212347659881684992122_1.0.ecar","channel":"505c7c48ac6dc1edc9b08f21db5a571d","language":["English"],"mimeType":"video/webm","variants":{"spine":{"ecarUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_212347659881684992122/untitled-content_1507550428980_do_212347659881684992122_1.0_spine.ecar","size":1009}},"idealScreenSize":"normal","createdOn":"2017-10-06T09:38:20.401+0000","contentDisposition":"inline","artifactUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/do_212347659881684992122/learn-colors-surprise-eggs-3d-cartoons-for-children-video-for-kids.webm","contentEncoding":"identity","lastUpdatedOn":"2017-10-09T11:58:10.736+0000","sYS_INTERNAL_LAST_UPDATED_ON":"2017-10-09T12:00:29.168+0000","contentType":"Resource","lastUpdatedBy":"14928bd8-4565-466c-9e21-42f86c09a3a4","identifier":"do_212347659881684992122","audience":["Learner"],"createdFor":["ORG_001"],"os":["All"],"visibility":"Default","consumerId":"fa271a76-c15a-4aa1-adff-31dd04682a1f","mediaType":"content","osId":"org.ekstep.quiz.app","lastPublishedBy":"14928bd8-4565-466c-9e21-42f86c09a3a4","languageCode":"en","pkgVersion":1,"versionKey":"1507550429168","idealScreenDensity":"hdpi","s3Key":"ecar_files/do_212347659881684992122/untitled-content_1507550428041_do_212347659881684992122_1.0.ecar","size":9183680,"lastSubmittedOn":"2017-10-06T09:39:04.803+0000","lastPublishedOn":"2017-10-09T12:00:28.041+0000","createdBy":"d5efd1ab-3cad-4034-8143-32c480f5cc9e","compatibilityLevel":1,"name":"Untitled Content","status":"Review","resourceType":"Story"}}};
    var courseContentData = {"id":"api.content.read","ver":"1.0","ts":"2017-10-10T06:09:23.264Z","params":{"resmsgid":"8fc6b400-ad81-11e7-97ff-63ff90b37d16","msgid":"8fc26e40-ad81-11e7-a07d-f5f6725f0c43","status":"successful","err":null,"errmsg":null},"responseCode":"OK","result":{"content":{"code":"org.sunbird.XBEa9i","downloadUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123163336542617601352/23082017-course-1_1503459447262_do_2123163336542617601352_1.0.ecar","channel":"in.ekstep","description":"Test content uploaded by Creator user","language":["English"],"mimeType":"application/vnd.ekstep.content-collection","variants":{"spine":{"ecarUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123163336542617601352/23082017-course-1_1503459447352_do_2123163336542617601352_1.0_spine.ecar","size":937}},"idealScreenSize":"normal","createdOn":"2017-08-23T03:24:58.030+0000","c_null_private_batch_count":8,"contentDisposition":"inline","contentEncoding":"gzip","lastUpdatedOn":"2017-08-23T03:37:55.662+0000","mimeTypesCount":"{}","sYS_INTERNAL_LAST_UPDATED_ON":"2017-09-12T23:58:59.340+0000","contentType":"Course","lastUpdatedBy":"be9e7184-dffd-45af-9e3c-147fdf2c771d","identifier":"do_2123163336542617601352","createdFor":["01231515334617497640"],"audience":["Learner"],"creator":"Qa mentor 1","toc_url":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123163336542617601352/artifact/do_2123163336542617601352toc.json","visibility":"Default","os":["All"],"contentTypesCount":"{}","consumerId":"fa271a76-c15a-4aa1-adff-31dd04682a1f","mediaType":"content","osId":"org.ekstep.quiz.app","lastPublishedBy":"be9e7184-dffd-45af-9e3c-147fdf2c771d","languageCode":"en","pkgVersion":1,"versionKey":"1505260739340","prevState":"Review","idealScreenDensity":"hdpi","s3Key":"ecar_files/do_2123163336542617601352/23082017-course-1_1503459447262_do_2123163336542617601352_1.0.ecar","size":936,"lastSubmittedOn":"0003-09-11T03:36:55.241+0000","lastPublishedOn":"2017-08-23T03:37:27.261+0000","createdBy":"ebec55da-7bd5-4e48-b895-34630e16975f","leafNodesCount":1,"compatibilityLevel":4,"name":"23082017 Course 1","status":"Live"}}};
    
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

        it('Success', function(done){
            spyOn(contentService, 'getById').and.returnValue(deferred.promise);
            deferred.resolve(getContentSuccess);
            spyOn(previewContent, 'getContent').and.callThrough();
            previewContent.getContent(stateParams.contentId);
            scope.$apply();
            var response = contentService.getById().$$state.value;
            expect(response).not.toBe(undefined);
            done();
        });

        it('Success live content', function(){
            stateParams.backState = 'WorkSpace.PublishedContent';
            rootScope.userId = 'd5efd1ab-3cad-4034-8143-32c480f5cc9e';
            spyOn(contentService, 'getById').and.returnValue(deferred.promise);
            deferred.resolve(livecontentData);
            spyOn(previewContent, 'getContent').and.callThrough();
            previewContent.getContent(stateParams.contentId);
            scope.$apply();
            var response = contentService.getById().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('Success review content', function(){
            stateParams.backState = '';
            rootScope.userId = 'd5efd1ab-3cad-4034-8143-32c480f5cc9e';
            spyOn(contentService, 'getById').and.returnValue(deferred.promise);
            deferred.resolve(reviewcontentData);
            spyOn(previewContent, 'getContent').and.callThrough();
            previewContent.getContent(stateParams.contentId);
            scope.$apply();
            var response = contentService.getById().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('Content access error', function(){
            stateParams.backState = '';
            rootScope.userId = '';
            spyOn(contentService, 'getById').and.returnValue(deferred.promise);
            deferred.resolve(reviewcontentData);
            spyOn(previewContent, 'getContent').and.callThrough();
            previewContent.getContent(stateParams.contentId);
            scope.$apply();
            var response = contentService.getById().$$state.value;
            expect(response).not.toBe(undefined);
        });

        it('Content access error due to invalid mime type', function(){
            stateParams.backState = '';
            rootScope.userId = '';
            spyOn(contentService, 'getById').and.returnValue(deferred.promise);
            deferred.resolve(courseContentData);
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

        it('Should called publish content service', function(){
            spyOn(contentService, 'publish').and.callThrough();
            contentService.publish({}, stateParams.contentId);
            expect(contentService.publish).toBeDefined();
        });

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

        it('Should called reject content service', function(){
            spyOn(contentService, 'reject').and.callThrough();
            contentService.reject({}, stateParams.contentId);
            expect(contentService.reject).toBeDefined();
        });

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

        it('Should called accept content flag service', function(){
            spyOn(contentService, 'acceptContentFlag').and.callThrough();
            contentService.acceptContentFlag(request, stateParams.contentId);
            expect(contentService.acceptContentFlag).toBeDefined();
        });

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

        it('Should called accept content flag service', function(){
            spyOn(contentService, 'discardContentFlag').and.callThrough();
            contentService.discardContentFlag(request, stateParams.contentId);
            expect(contentService.discardContentFlag).toBeDefined();
        });

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