describe('Video Renderer Plugin', function() {
    var manifest, videoRendererInstance;
    var globalConfigObj = EkstepRendererAPI.getGlobalConfig();
    beforeAll(function(callback) {
        window.videojs = {data: 'mock', object: {}};
        org.ekstep.contentrenderer.loadPlugins([{"id":"org.ekstep.videorenderer","ver":1,"type":"plugin"}], [], function() {
   			console.log("Video plugin is loaded");
			videoRendererInstance = org.ekstep.pluginframework.pluginManager.pluginObjs['org.ekstep.videorenderer'];
			manifest = org.ekstep.pluginframework.pluginManager.pluginManifests['org.ekstep.videorenderer'];
            callback();
		});
    });
    describe("When Video plugin is initialized", function() {
    	it("It should invoke initLauncher", function() {
            spyOn(videoRendererInstance, "initLauncher").and.callThrough();
            videoRendererInstance.initLauncher(manifest);
            expect(videoRendererInstance.initLauncher).toHaveBeenCalled();
        });
        it("It should invoke start", function() {
            spyOn(videoRendererInstance, "start").and.callThrough();
            videoRendererInstance.start();
            expect(videoRendererInstance.start).toHaveBeenCalled();
        });

        xit("It should invoke loadYoutube", function() {
            var data = _.clone(content);
            var prefix_url = globalConfigObj.basepath || '';
            path = prefix_url + "/" + data.artifactUrl;
            spyOn(videoRendererInstance, "_loadYoutube").and.callThrough();
            videoRendererInstance._loadYoutube(path);
            // expect(videoRendererInstance._loadYoutube).not.toBeUndefined();
            expect(videoRendererInstance._loadYoutube).toHaveBeenCalled();
        });

        it("It should invoke setYoutubeStyles method", function() {
            spyOn(videoRendererInstance, "setYoutubeStyles").and.callThrough();
            videoRendererInstance.setYoutubeStyles();
            expect(videoRendererInstance.setYoutubeStyles).toHaveBeenCalled();
        });


        it("It should invoke play method", function() {
            spyOn(videoRendererInstance, "play").and.callThrough();
            videoRendererInstance.play();
            expect(videoRendererInstance.play).not.toBeUndefined();
            expect(videoRendererInstance.play).toHaveBeenCalled();
        });

        it("It should invoke pause method", function() {
            spyOn(videoRendererInstance, "pause").and.callThrough();
            videoRendererInstance.pause();
            expect(videoRendererInstance.pause).not.toBeUndefined();
            expect(videoRendererInstance.pause).toHaveBeenCalled();
        });

        it("It should invoke ended method", function() {
            spyOn(videoRendererInstance, "ended").and.callThrough();
            videoRendererInstance.ended();
            expect(videoRendererInstance.ended).not.toBeUndefined();
            expect(videoRendererInstance.ended).toHaveBeenCalled();
        });

        it("It should invoke seeked method", function() {
            spyOn(videoRendererInstance, "seeked").and.callThrough();
            videoRendererInstance.seeked();
            expect(videoRendererInstance.seeked).not.toBeUndefined();
            expect(videoRendererInstance.seeked).toHaveBeenCalled();
        });

        it("It should invoke addvideoListeners method", function() {
            var videoPlayer = {"techOrder":["youtube"],"html5":{},"flash":{},"defaultVolume":0,"inactivityTimeout":2000,"playbackRates":[],"children":["mediaLoader","posterImage","textTrackDisplay","loadingSpinner","bigPlayButton","controlBar","errorDisplay","textTrackSettings"],"language":"en-US","languages":{},"notSupportedMessage":"No compatible source was found for this media.","sources":[],"tracks":[],"style":"width: 100%; height: 100%; position: absolute; display: block;","id":"org.ekstep.videorenderer","class":"video-js vjs-default-skin","preload":"auto","autoplay":true,"controls":true,"src":"https://www.youtube.com/watch?v=z_IvoZQkcgs&t=2s","initChildren":false,"createEl":false,"reportTouchActivity":false,"playerOptions":{"techOrder":["youtube"],"html5":{},"flash":{},"defaultVolume":0,"inactivityTimeout":2000,"playbackRates":[],"children":["mediaLoader","posterImage","textTrackDisplay","loadingSpinner","bigPlayButton","controlBar","errorDisplay","textTrackSettings"],"language":"en-US","languages":{},"notSupportedMessage":"No compatible source was found for this media.","sources":[],"tracks":[],"style":"width: 100%; height: 100%; position: absolute; display: block;","id":"org.ekstep.videorenderer","class":"video-js vjs-default-skin","preload":"auto","autoplay":true,"controls":true,"src":"https://www.youtube.com/watch?v=z_IvoZQkcgs&t=2s","initChildren":false,"createEl":false,"reportTouchActivity":false}};
            spyOn(videoRendererInstance, "addvideoListeners").and.callThrough();
            videoRendererInstance.addvideoListeners(videoPlayer);
            expect(videoRendererInstance.addvideoListeners).not.toBeUndefined();
            expect(videoRendererInstance.addvideoListeners).toHaveBeenCalledWith(videoPlayer);
        });

        xit("It should invoke addYOUTUBEListeners method", function() {
            var videoPlayer = {"techOrder":["youtube"],"html5":{},"flash":{},"defaultVolume":0,"inactivityTimeout":2000,"playbackRates":[],"children":["mediaLoader","posterImage","textTrackDisplay","loadingSpinner","bigPlayButton","controlBar","errorDisplay","textTrackSettings"],"language":"en-US","languages":{},"notSupportedMessage":"No compatible source was found for this media.","sources":[],"tracks":[],"style":"width: 100%; height: 100%; position: absolute; display: block;","id":"org.ekstep.videorenderer","class":"video-js vjs-default-skin","preload":"auto","autoplay":true,"controls":true,"src":"https://www.youtube.com/watch?v=z_IvoZQkcgs&t=2s","initChildren":false,"createEl":false,"reportTouchActivity":false,"playerOptions":{"techOrder":["youtube"],"html5":{},"flash":{},"defaultVolume":0,"inactivityTimeout":2000,"playbackRates":[],"children":["mediaLoader","posterImage","textTrackDisplay","loadingSpinner","bigPlayButton","controlBar","errorDisplay","textTrackSettings"],"language":"en-US","languages":{},"notSupportedMessage":"No compatible source was found for this media.","sources":[],"tracks":[],"style":"width: 100%; height: 100%; position: absolute; display: block;","id":"org.ekstep.videorenderer","class":"video-js vjs-default-skin","preload":"auto","autoplay":true,"controls":true,"src":"https://www.youtube.com/watch?v=z_IvoZQkcgs&t=2s","initChildren":false,"createEl":false,"reportTouchActivity":false}};
            spyOn(videoRendererInstance, "addYOUTUBEListeners").and.callThrough();
            videoRendererInstance.addYOUTUBEListeners(videoPlayer);
            expect(videoRendererInstance.addYOUTUBEListeners).not.toBeUndefined();
            expect(videoRendererInstance.addYOUTUBEListeners).toHaveBeenCalledWith(videoPlayer);
        });

        it("It should invoke replay method", function() {
            spyOn(videoRendererInstance, "replay").and.callThrough();
            EkstepRendererAPI.dispatchEvent('renderer:overlay:unmute');
            videoRendererInstance.replay();
            expect(videoRendererInstance.replay).toHaveBeenCalled();
        });

        it("It should invoke configOverlay method", function() {
            spyOn(videoRendererInstance, "configOverlay").and.callThrough();
            videoRendererInstance.configOverlay();
            expect(videoRendererInstance.configOverlay).not.toBeUndefined();
            expect(videoRendererInstance.configOverlay).toHaveBeenCalled();
        });

        it("It should invoke progressTimer method and pass flag value false", function() {
            var flag = false;
            spyOn(videoRendererInstance, "progressTimer").and.callThrough();
            videoRendererInstance.progressTimer(flag);
            expect(videoRendererInstance.progressTimer).not.toBeUndefined();
            expect(videoRendererInstance.progressTimer).toHaveBeenCalled();
        });

        it("It should invoke progressTimer method and pass flag value true", function() {
            var flag = true;
            spyOn(videoRendererInstance, "progressTimer").and.callThrough();
            videoRendererInstance.progressTimer(flag);
            expect(videoRendererInstance.progressTimer).not.toBeUndefined();
            expect(videoRendererInstance.progressTimer).toHaveBeenCalled();
        });

        it("It should invoke contentProgress method", function() {
            spyOn(videoRendererInstance, "contentProgress").and.callThrough();
            videoRendererInstance.contentProgress();
            expect(videoRendererInstance.contentProgress).not.toBeUndefined();
            expect(videoRendererInstance.contentProgress).toHaveBeenCalled();
        });

        it("It should invoke onOverlayAudioUnmute method and video player value false", function() {
            videoRendererInstance.videoPlayer = false;
            spyOn(videoRendererInstance, "onOverlayAudioUnmute").and.callThrough();
            videoRendererInstance.onOverlayAudioUnmute();
            expect(videoRendererInstance.onOverlayAudioUnmute).not.toBeUndefined();
            expect(videoRendererInstance.onOverlayAudioUnmute).toHaveBeenCalled();
        });

        it("It should invoke onOverlayAudioUnmute method and videoPlayer value exist ", function() {
            videoRendererInstance.videoPlayer = {currentType_ : 'video/youtube'};
            spyOn(videoRendererInstance, "onOverlayAudioUnmute").and.callThrough();
            var element = "<div class='videoElement'></div>";
            videojs = {'videoElement':element};
            videoRendererInstance.onOverlayAudioUnmute();
            expect(videoRendererInstance.onOverlayAudioUnmute).not.toBeUndefined();
            expect(videoRendererInstance.onOverlayAudioUnmute).toHaveBeenCalled();
        });

        it("It should invoke onOverlayAudioMute method and videoplayer values is false", function() {
            videoRendererInstance.videoPlayer = {currentType_ : 'video/youtube1'};
            spyOn(videoRendererInstance, "onOverlayAudioMute").and.callThrough();
            videoRendererInstance.onOverlayAudioMute();
            expect(videoRendererInstance.onOverlayAudioMute).not.toBeUndefined();
            expect(videoRendererInstance.onOverlayAudioMute).toHaveBeenCalled();
        });

        xit("It should invoke onOverlayAudioMute method and videoplayer value is true", function() {
            videoRendererInstance.videoPlayer = {currentType_ : 'video/youtube'};
            spyOn(videoRendererInstance, "onOverlayAudioMute").and.callThrough();
            videoRendererInstance.onOverlayAudioMute();
            expect(videoRendererInstance.onOverlayAudioMute).not.toBeUndefined();
            expect(videoRendererInstance.onOverlayAudioMute).toHaveBeenCalled();
        });
        it("It should invoke loadYoutube", function() {
            var data = _.clone(content);
            data.mimeType = 'video/x-youtube';
            var prefix_url = globalConfigObj.basepath || '';
            path = prefix_url + "/" + data.artifactUrl;
            spyOn(videoRendererInstance, "createVideo").and.callThrough();
            spyOn(videoRendererInstance, "_loadYoutube").and.callThrough();
            videoRendererInstance.createVideo(path, data);
            videoRendererInstance._loadYoutube(path);
            expect(videoRendererInstance._loadYoutube).not.toBeUndefined();
            expect(videoRendererInstance.createVideo).toHaveBeenCalled();
            expect(videoRendererInstance._loadYoutube).toHaveBeenCalled();
        });
        it("It should invoke for loadStream video", function() {
            videoRendererInstance.isStreaming = true;
            var data = _.clone(content);
            data.mimeType = 'application/x-mpegURL';
            var prefix_url = globalConfigObj.basepath || '';
            path = prefix_url + "/" + data.artifactUrl;
            spyOn(videoRendererInstance, "createVideo").and.callThrough();
            spyOn(videoRendererInstance, "_loadVideo").and.callThrough();
            videoRendererInstance.createVideo(path, data);
            expect(videoRendererInstance._loadVideo).not.toBeUndefined();
            expect(videoRendererInstance._loadVideo).toHaveBeenCalled();
        });
        it("if streaming video download button should not be enabled", function() {
            videoRendererInstance.isStreaming = true;
            var data = _.clone(content);
            data.mimeType = 'application/x-mpegURL';
            var prefix_url = globalConfigObj.basepath || '';
            path = prefix_url + "/" + data.artifactUrl;
            videoRendererInstance.createVideo(path, data);
            expect($('.vjs-vjsdownload').length).toEqual(0);
        });
        xit("if youtube video download button should not be enabled", function() {
            videoRendererInstance.isStreaming = false;
            var data = _.clone(content);
            data.mimeType = 'video/x-youtube';
            var prefix_url = globalConfigObj.basepath || '';
            path = prefix_url + "/" + data.artifactUrl;
            videoRendererInstance.createVideo(path, data);
            expect($('.vjs-vjsdownload').length).toEqual(0);
        });
        it("It should not invoke for loadStream video", function() {
            videoRendererInstance.isStreaming = false;
            var data = _.clone(content);
            data.mimeType = 'video/mp4';
            var prefix_url = globalConfigObj.basepath || '';
            path = prefix_url + "/" + data.artifactUrl;
            spyOn(videoRendererInstance, "createVideo").and.callThrough();
            spyOn(videoRendererInstance, "_loadVideo").and.callThrough();
            videoRendererInstance.createVideo(path, data);
            expect(videoRendererInstance._loadVideo).not.toBeUndefined();
            expect(videoRendererInstance._loadVideo).toHaveBeenCalled();
            expect(videoRendererInstance._loadVideo).toHaveBeenCalled();
        });
        it("if not youtube and streaming video download button should be enabled", function() {
            videoRendererInstance.isStreaming = false;
            var data = _.clone(content);
            data.mimeType = 'video/mp4';
            var prefix_url = globalConfigObj.basepath || '';
            path = prefix_url + "/" + data.artifactUrl;
            videoRendererInstance.createVideo(path, data);
            // expect($('.vjs-vjsdownload').length).not.toEqual(0);
        });
    });
});