/**
 * @description Launcher to render the Video or youtube URL's
 * @extends {class} org.ekstep.contentrenderer.baseLauncher
 * @author Gourav More <gouav_m@tekditechnologies.com>
 */

org.ekstep.contentrenderer.baseLauncher.extend({
    _time: undefined,
    supportedStreamingMimeType: "application/x-mpegURL",
    messages: {
        noInternetConnection: "Internet not available. Please connect and try again.",
        unsupportedVideo: "Video URL not accessible"
    },
    currentTime: 1,
    bufferToAchieveProgress:10, //  percentage
    videoPlayer: undefined,
    stageId: undefined,
    heartBeatData: {},
    enableHeartBeatEvent: false,
    _constants: {
        mimeType: ["video/mp4", "video/webm", "audio/mp3"],
        events: {
            launchEvent: "renderer:launch:video"
        }
    },
    initLauncher: function () {
        EkstepRendererAPI.addEventListener(this._constants.events.launchEvent, this.start, this);
        EkstepRendererAPI.addEventListener("renderer:overlay:mute", this.onOverlayAudioMute, this);
        EkstepRendererAPI.addEventListener("renderer:overlay:unmute", this.onOverlayAudioUnmute, this);
    },
    validateUrlPath : function(path) {
        return jQuery.ajax({
            url : path,
            type: "GET",
            async: false,
            success: function()
            {
                return true;
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
               return jqXHR
            }
        }).responseText;
    },
    start: function () {
        let skipValidation = false;
        this._super();
        var data = _.clone(content);
        this.heartBeatData.stageId = content.mimeType === 'video/x-youtube' ? 'youtubestage' : 'videostage';
        var globalConfigObj = EkstepRendererAPI.getGlobalConfig();
        if(content.mimeType === "audio/mp3") {
            skipValidation = true;
            data.streamingUrl = false;
            var regex = new RegExp("^(http|https)://", "i");
            if (!regex.test(globalConfigObj.basepath)) {
                var prefix_url = globalConfigObj.basepath || '';
                path = prefix_url ? prefix_url + "/" + data.artifactUrl : data.artifactUrl;
            } else {
                path = data.artifactUrl;
            }
        } else if (window.cordova || !isbrowserpreview) {
            var regex = new RegExp("^(http|https)://", "i");
            if (!regex.test(globalConfigObj.basepath)) {
                var prefix_url = globalConfigObj.basepath || '';
                path = prefix_url ? prefix_url + "/" + data.artifactUrl : data.artifactUrl;
                data.streamingUrl = false;
                skipValidation = true;
            } else
                path = data.streamingUrl;
        } else {
            skipValidation = true;
            path = data.artifactUrl;
        }
        path = this.checkForValidStreamingUrl(path,data,skipValidation);
        this.createVideo(path, data);
        this.configOverlay();
    },
    checkForValidStreamingUrl(path,data,skipValidation) {
        if(!skipValidation) {
            if(this.validateUrlPath(path)) {
            } else {
                EkstepRendererAPI.logErrorEvent('Streaming Url Not Supported', {
                    'type': 'content',
                    'action': 'play',
                    'severity': 'error'
                });
                var globalConfigObj = EkstepRendererAPI.getGlobalConfig();
                var prefix_url = globalConfigObj.basepath || '';
                data.streamingUrl = false;
                var regex = new RegExp("^(http|https)://", "i");
                if ((window.cordova || !isbrowserpreview) && !regex.test(globalConfigObj.basepath)) {
                    path = prefix_url ? prefix_url + "/" + data.artifactUrl : data.artifactUrl;
                } else {
                    path = data.artifactUrl;
                }
            }
        }
        return path;
    },
    createVideo: function (path, data) {
        // User has to long press to play/pause or mute/unmute the video in mobile view.
        // TO fix this problem we are removing the tap events of the videoJs library.
        // link:- https://github.com/videojs/video.js/issues/6222
        videojs.getComponent('Component').prototype.emitTapEvents = function () {};
        video = document.createElement('video-js');
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.position = 'absolute';
        video.id = "videoElement";
        video.autoplay = true;
        video.className = 'vjs-default-skin vjs-big-play-centered';
        document.body.appendChild(video);

        EkstepRendererAPI.dispatchEvent("renderer:content:start");

        if (data.mimeType === "video/x-youtube") {
        $('.vjs-default-skin').css('opacity', '0');
            this._loadYoutube(data.artifactUrl);
        } else if (data.streamingUrl && (data.mimeType != "video/x-youtube")) {
            data.mimeType = this.supportedStreamingMimeType;
            this._loadVideo(data.streamingUrl, data);
        } else {
            this._loadVideo(path, data);
        }
        $("video-js").bind("contextmenu", function () {
            return false;
        });
    },
    _loadVideo: function (path, data) {
        var instance = this;
        if (data.streamingUrl && !navigator.onLine) {
            instance.throwError({ message: instance.messages.noInternetConnection });
            if (typeof cordova !== "undefined") exitApp();
            return false;
        }
        var source = document.createElement("source");
        source.src = path;
        source.type = data.mimeType;
        video.appendChild(source);

        if (window.cordova) {
            var videoPlayer = videojs('videoElement', {
                "controls": true, "autoplay": true, "preload": "auto",
                "nativeControlsForTouch": true,
                html5: {
                    hls: {
                        overrideNative: true,
                    }
                }
            }, function () {
                this.on('downloadvideo', function () {
                    EkstepRendererAPI.dispatchEvent("renderer:splash:hide");
                    console.log("downloadvideo");
                })
            });
        } else {
            var videoPlayer = videojs('videoElement', {
                "controls": true, "autoplay": true, "preload": "auto",
                plugins: {
                    vjsdownload: {
                        beforeElement: 'playbackRateMenuButton',
                        textControl: 'Download video',
                        name: 'downloadButton',
                        downloadURL: data.artifactUrl
                    }
                }
            }, function () {
                this.on('downloadvideo', function () {
                    EkstepRendererAPI.dispatchEvent("renderer:splash:hide");
                    console.log("downloadvideo");
                    EkstepRendererAPI.getTelemetryService().interact("TOUCH", "Download", "TOUCH", {
                        stageId: 'videostage',
                        subtype: ''
                    });
                });
            });
        }
        instance.addVideoListeners(videoPlayer, path, data);
        instance.videoPlayer = videoPlayer;
        instance.applyResolutionSwitcher();
    },
    applyResolutionSwitcher: function (){
        var instance = this;
        instance.videoPlayer.hlsQualitySelector();
        var qualityLevels = instance.videoPlayer.qualityLevels();
        qualityLevels.on('change', function(event) {
            var qualityLevel = instance.videoPlayer.qualityLevels()[event.selectedIndex];
            var currentResolution = (qualityLevel.height) ? qualityLevel.height : "Auto";
            instance.logResolution(currentResolution);

        });
    },
    logResolution: function(currentResolution){
        var instance = this;
        instance.logTelemetry('TOUCH', {
            stageId: 'videostage',
            subtype: "CHANGE"
        }, "", {
            context: {
                cdata: [{
                    type: 'Feature',
                    id: 'video:resolutionChange'
                }, {
                    type: 'Task',
                    id: 'SB-13358',
                }, {
                    type: 'Resolution',
                    id: String(currentResolution)
                },{
                    type: 'ResolutionChange',
                    id: "Auto"
                }]
            }
        })
    },
    _loadYoutube: function (path) {
        var instance = this;
        if (!navigator.onLine) {
            EkstepRendererAPI.logErrorEvent('No internet', {
                'type': 'content',
                'action': 'play',
                'severity': 'error'
            });
            instance.throwError({ message: instance.messages.noInternetConnection });
        }
        var vid = videojs("videoElement", {
            "techOrder": ["youtube"],
            "src": path,
            "controls": true, "autoplay": true, "preload": "auto",
            "youtube": {
                "onPlayerPlaybackQualityChange" : function(e){
                    var resolution = (e && e.data) ? e.data : "Auto";
                    instance.logResolution(resolution);
                }
            }
        });
        videojs("videoElement").ready(function () {
            var youtubeInstance = this;
            $('.vjs-default-skin').css('opacity', '1');
            youtubeInstance.src({
                type: 'video/youtube',
                src: path
            });
            youtubeInstance.play();
            $('.vjs-loading-spinner').css({"display": "none"});
            instance.addYOUTUBEListeners(youtubeInstance);
            instance.setYoutubeStyles(youtubeInstance);
            instance.videoPlayer = youtubeInstance;
            instance.applyResolutionSwitcher();
            EkstepRendererAPI.dispatchEvent("renderer:splash:hide");
            console.log("downloadvideo");
        });
    },
    setYoutubeStyles: function (youtube) {
        var instance = this;
        videojs("videoElement").ready(function () {
            var video = document.getElementById("videoElement");
            video.style.width = '100%';
            video.style.height = '100%';
        });
    },
    play: function (stageid, time) {
        if (time == 0) {
            EkstepRendererAPI.getTelemetryService().navigate(stageid, stageid, {
                "duration": (Date.now() / 1000) - window.PLAYER_STAGE_START_TIME
            });
            $('.vjs-loading-spinner').css({"top": "46%","left": "49%",
            "width": "72px",
            "height": "70px",
            "border-radius": "70px",
            "border": "5px solid rgba(47, 51, 63, 0.7)"});
        }
        var instance = this;
        instance.heartBeatEvent(true);
        instance.progressTimer(true);
        instance.logTelemetry('TOUCH', {
            stageId: stageid,
            subtype: "PLAY",
            values: [{
                time: time
            }]
        })
    },
    pause: function (stageid, time) {
        var instance = this;
        instance.heartBeatEvent(false);
        instance.progressTimer(false);
        instance.logTelemetry('TOUCH', {
            stageId: stageid,
            subtype: "PAUSE",
            values: [{
                time: time
            }]
        })
    },
    ended: function (stageid) {
        var instance = this;
        instance.progressTimer(false);
        instance.logTelemetry('END', {
            stageId: stageid,
            subtype: "STOP"
        });
        $(".vjs-has-started, .vjs-poster").css("display", "none");
        EkstepRendererAPI.dispatchEvent('renderer:content:end');
    },
    seeked: function (stageid, time) {
        var instance = this;

        instance.logTelemetry('TOUCH', {
            stageId: stageid,
            subtype: "DRAG",
            values: [{
                time: time
            }]
        })
    },
    addVideoListeners: function (videoPlayer, path, data) {
        var instance = this;
        videoPlayer.on("play", function (e) {
            instance.play("videostage", Math.floor(instance.videoPlayer.currentTime()) * 1000);
        });

        videoPlayer.on("pause", function (e) {
            instance.pause("videostage", Math.floor(instance.videoPlayer.currentTime()) * 1000);
        });

        videoPlayer.on("ended", function (e) {
            if (videoPlayer.isFullscreen()) videoPlayer.exitFullscreen();
            instance.ended("videostage");
        });

        videoPlayer.on("seeked", function (e) {
            instance.seeked("videostage", Math.floor(instance.videoPlayer.currentTime()) * 1000);
        });

        if (data.streamingUrl) {
            videoPlayer.on("error", function (e) {
                EventBus.dispatch("renderer:alert:show", undefined, {
                    title: "Error",
                    text: instance.messages.unsupportedVideo,
                    type: "error",
                    data: "Video URL: " + path
                });
            });
        }
    },
    addYOUTUBEListeners: function (videoPlayer) {
        var instance = this;

        videoPlayer.on('play', function (e) {
            instance.play("youtubestage", Math.floor(videoPlayer.currentTime()) * 1000);
        });

        videoPlayer.on('pause', function (e) {
            instance.pause("youtubestage", Math.floor(videoPlayer.currentTime()) * 1000);
        });

        videoPlayer.on('ended', function () {
            if (videoPlayer.isFullscreen()) videoPlayer.exitFullscreen();
            instance.ended("youtubestage");
        });
        videoPlayer.on('seeked', function (e) {
            instance.seeked("youtubestage", Math.floor(videoPlayer.currentTime()) * 1000);
        });
    },
    logTelemetry: function (type, eksData, eid, options) {
        EkstepRendererAPI.getTelemetryService().interact(type || 'TOUCH', "", "", eksData, eid, options);
    },
    replay: function () {
        if (this.sleepMode) return;
        EkstepRendererAPI.dispatchEvent('renderer:overlay:unmute');
        this.start();
    },
    configOverlay: function () {
        setTimeout(function () {
            EkstepRendererAPI.dispatchEvent("renderer:overlay:show");
            EkstepRendererAPI.dispatchEvent("renderer:next:hide");
            EkstepRendererAPI.dispatchEvent('renderer:stagereload:hide');
            EkstepRendererAPI.dispatchEvent("renderer:previous:hide");
        }, 100);
    },
    progressTimer: function (flag) {
        var instance = this;
        if (flag) {
            instance.progressTime = setInterval(function (e) {
                instance.currentTime = instance.currentTime + 1;
            }, 1000);
        }
        if (!flag) {
            clearInterval(instance.progressTime);
        }
    },
    contentProgress: function () {
        console.log("Content progress");
        var totalDuration = 0;
        if (this.videoPlayer){
            if (_.isFunction(this.videoPlayer.duration)) {
                totalDuration = this.videoPlayer.duration();
            } else {
                totalDuration = this.videoPlayer.duration;
            }
        }
        totalDuration = (this.currentTime < totalDuration) ? Math.floor(totalDuration) : Math.ceil(totalDuration);
        var progress = this.progres(this.currentTime, totalDuration);
        return progress === 0 ? 1 : progress;  // setting default value of progress=1 when video opened
    },

    getTotalDuration: function () {
        var totalDuration = 0;
        if (this.videoPlayer){
            if (_.isFunction(this.videoPlayer.duration)) {
                totalDuration = this.videoPlayer.duration();
            } else {
                totalDuration = this.videoPlayer.duration;
            }
        }
        return totalDuration = (this.currentTime < totalDuration) ? Math.floor(totalDuration) : Math.ceil(totalDuration);
    },

    setExpectedLengthCovergae: function () {
        var totalDuration = this.getTotalDuration()
        return Number(totalDuration) - ((Number(this.bufferToAchieveProgress) / 100) * Number(totalDuration));
    },

    contentPlaySummary: function () {
        var playSummary =  [
            {
              "totallength": this.getTotalDuration()
            },
            {
              "visitedlength": this.videoPlayer.currentTime()
            },
            {
              "visitedcontentend": (this.videoPlayer.currentTime() >= this.setExpectedLengthCovergae()) ? true : false
            },
            {
              "totalseekedlength": (this.videoPlayer.currentTime() - this.currentTime)
            }
        ]
        return playSummary;
    },
    onOverlayAudioMute: function () {
        if (!this.videoPlayer) return false
        videojs('videoElement').muted(true);
    },
    onOverlayAudioUnmute: function () {
        if (!this.videoPlayer) return false
        videojs('videoElement').muted(false);
    },
    cleanUp: function () {
        if (this.sleepMode) return;
        this.sleepMode = true;
        if (document.getElementById("videoElement")) {
            videojs("videoElement").dispose();
        }
        this.progressTimer(false);
        this.currentTime = 0;
        EkstepRendererAPI.dispatchEvent("renderer:next:show");
        EkstepRendererAPI.dispatchEvent('renderer:stagereload:show');
        EkstepRendererAPI.dispatchEvent("renderer:previous:show");
        EkstepRendererAPI.removeEventListener('renderer:launcher:clean', this.cleanUp, this);
    }
});

//# sourceURL=videoRenderer.js