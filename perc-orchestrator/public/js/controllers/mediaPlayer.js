
CurrentPlayer = {
    aspectRatio: 9 / 16,
    element: null,
    mediaType: '',
    mimeType: '',
    videoPlayer: null,
    scribdPlayer: null,
    scope: null,
    resizeMediaPlayer: function() {
        switch (CurrentPlayer.mediaType) {
            case 'video':
                if(!CurrentPlayer.videoPlayer) {
                    return;
                }
                if (!document.getElementById(CurrentPlayer.videoPlayer.id())) {
                    return;
                }
                if (!CurrentPlayer.videoPlayer) {
                    setTimeout(function() {
                        CurrentPlayer.resizeMediaPlayer();
                    }, 500);
                    return;
                }
                if (CurrentPlayer.scope.showInterception) {
                    return;
                }
                var width = $('#primaryContentDiv').width();
                CurrentPlayer.videoPlayer.width(width).height((width * CurrentPlayer.aspectRatio));
                resizeInterceptionDiv();
                break;
            case 'slides':
                $('#scribdDocDiv').width("100%");
                var scribeObj = parseScribdURL(CurrentPlayer.element.mediaUrl);
                var scribd_doc = scribd.Document.getDoc(scribeObj.id, scribeObj.access_key);
                scribd_doc.addParam('jsapi_version', 2);
                scribd_doc.addParam('width', '100%');
                if (!document.getElementById('scribdDocDiv')) {
                    return;
                }
                var width = $('#primaryContentDiv').width();
                scribd_doc.addParam('height', (width * CurrentPlayer.aspectRatio));
                scribd_doc.addParam('mode', 'slideshow');
                scribd_doc.write('scribdDocDiv');
                CurrentPlayer.scribdPlayer = scribd_doc;
                break;
            case 'text':
                break;
            default:
                break;
        }
        moveRightArrowIfSidebarCollapsed();
    }
}

var videoHTML = '<video id="lesson_video" class="video-js vjs-default-skin vjs-16-9" controls preload="auto" il-video-events data-status="videoPlayer"></video>';
var intVideoHTML = '<video id="int_video" class="video-js vjs-default-skin padLeft vjs-16-9" controls preload="auto"></video>';

function playMedia(element, $http, $scope, $compile) {
    $('#interceptionDiv').hide();
    $scope.interception = {};
    $scope.showInterception = false;
    $scope.mediaType = element.mediaType;
    var mediaType = element.mediaType;
    var mimeType = element.mimeType;
    if (!mediaType) {
        mediaType = '';
    }
    CurrentPlayer.mediaType = mediaType;
    CurrentPlayer.mimeType = mimeType;
    CurrentPlayer.element = element;
    CurrentPlayer.scope = $scope;
    setScopeValues($scope, mediaType);
    $('#collapseTxt').removeClass('scribdCollapseClass');
    setTimeout(function() {
        setLeftRightArrowIcon();
        if (element.contentSubType == 'exercise') {
            $('#uploadExerciseSolution').bootstrapFileInput();
            $('#uploadExerciseSolution').show();
            $('#exerciseDemoNoteId').show();
        }
        $('#collapseTxt').removeClass('scribdCollapseClass');
        if (mediaType == 'video') {
            var videoId = 'lesson_video';
            var url = element.mediaUrl;
            try {
                var player = videojs(videoId);
                player.dispose();
            } catch (e) {}
            var interceptions = element.interceptions;
            if (mimeType.indexOf('youtube') >= 0) {
                var el = angular.element(videoHTML);
                compiled = $compile(el);
                angular.element('#primaryContentDiv').html(el);
                compiled($scope);
                videojs(videoId, {
                  "techOrder": ["youtube"],
                  "sources": [{"type": "video/youtube", "src": url, "youtube": false}]
                }).ready(function() {
                    lectureViewPlayerReady($scope, $http, this, element, interceptions);
                });
            } else {
                var posterUrl = element.posterUrl;
                var el = angular.element(videoHTML);
                compiled = $compile(el);
                angular.element('#primaryContentDiv').html(el);
                compiled($scope);
                $('#' + videoId).attr('poster', posterUrl);
                var myPlayer = videojs(videoId);
                myPlayer.src({type: mimeType, src: url});
                myPlayer.ready(function() {
                    lectureViewPlayerReady($scope, $http, this, element, interceptions);
                });
            }
        } else if (mediaType == 'ecml') {
                document.getElementById('ecmlContentIFrame').src = element.mediaUrl;
                document.getElementById('ecmlContentIFrame').onload = function (e){
                    var c = document.getElementById('ecmlContentIFrame').contentWindow.document.body.scrollHeight;
                    document.getElementById('ecmlContentIFrame').style.height = c + 'px';
                }
        } else if (mimeType == 'application/pdf' && mediaType == 'document') {
                var iframe = document.createElement('iframe');
                iframe.setAttribute('allowFullScreen', '');
                iframe.setAttribute('width', "100%");
                iframe.setAttribute('height', "1000px");
                iframe.src = element.mediaUrl;
                $('#PDFDocDiv').empty();
                $('#PDFDocDiv').append(iframe);
                securePDFFromRightClick();
                $scope.setElementComplete();
        } else if (mediaType == 'slides' || mediaType == 'document') {
            $('#scribdDocDiv').width("100%");
            var scribd_doc;
            var scribeObj = parseScribdURL(element.mediaUrl);
            if (mimeType == 'scribd/id' || mimeType == 'scribd/doc') {
                scribd_doc = scribd.Document.getDoc(scribeObj.id, scribeObj.access_key);
            } else {
                scribd_doc = scribd.Document.getDocFromUrl(element.mediaUrl, "pub-24401885562355703438");
            }
            scribd_doc.addParam('jsapi_version', 2);
            scribd_doc.addParam('width', '100%');
            if (mediaType == 'slides') {
                $('#scribdDocDiv').height(400);
                scribd_doc.addParam('height', 400);
                scribd_doc.addParam('mode', 'slideshow');
            } else if (mediaType == 'document') {
                $('#scribdDocDiv').height(1050);
                scribd_doc.addParam('height', 1050);
                scribd_doc.addParam('mode', 'list');
            }
            scribd_doc.write('scribdDocDiv');
            CurrentPlayer.scribdPlayer = scribd_doc;
            var interceptions = element.interceptions;
            if (element.contentType == 'lecture' && interceptions && interceptions.length > 0) {
                addScribdInterception(interceptions, scribd_doc, $scope, $http)
            }
            $scope.$apply(function() {
                $scope.scribdPlayerObj = scribd_doc;
                $scope.scribdPlayerStatus = 'ready';
            });
            $('#collapseTxt').addClass('scribdCollapseClass');
            $scope.setElementComplete();
        } else if (mediaType == 'mcq') {
            playAssessment($scope, element.mediaUrl);
            // playAssessment($scope, element.mediaUrl);
            // $http.get('/private/v1/player/quiz/get/' + encodeURIComponent(element.mediaUrl)).success(function(data) {
            //     $scope.quiz = data;
            //     $scope.quizIndex = 0;
            // });
        } else if (mediaType == 'test') {
            var test = eval("(" + element.mediaUrl + ")");
            playAssessment($scope, test.usageId);
        } else if (mediaType == 'text') {
            if (element.mediaUrl.toLowerCase() != 'description') {
                $http.get('/private/v1/content/streamURL/' + encodeURIComponent(element.mediaUrl)).success(function(data) {
                    $('#textContentDiv').html(data);
                    $scope.setElementComplete();
                });
            }
        } else if (mediaType == 'url') {
            $('#url_frame').html('<div class="common_content">Loading... <img src="/img/loading.gif"></div>');
            $scope.$apply(function() {
                $scope.loadStatus = false;
            });
            $http.get('/private/v1/content/getForURL?url=' + element.mediaUrl).success(function(data) {
                if (data && data != 'error' && data.word_count && data.word_count > 0) {
                    if (typeof element.owner == 'undefined' || !element.owner) {
                        if (data.domain && data.domain != '' && data.domain != null) {
                            element.owner = data.domain;
                            if ($scope.response) {
                                if (!$scope.response.infoData) {
                                    $scope.response.infoData = {};
                                }
                                $scope.response.infoData['owner'] = data.domain;
                            }
                        }
                    }
                    if (typeof element.author == 'undefined' || !element.author) {
                        if (data.author && data.author != '' && data.author != null) {
                            element.author = data.author;
                            if ($scope.response) {
                                if (!$scope.response.infoData) {
                                    $scope.response.infoData = {};
                                }
                                $scope.response.infoData['author'] = data.author;
                            }
                        }
                    }
                    if (data.title && data.title != '' && data.title != null) {
                        element.pageTitle = data.title;
                    }
                    $('#url_frame').html(data.content);
                    $('#url_frame').find('a').prop('target', '_blank');
                    $scope.loadStatus = true;
                    $('pre code').each(function(i, block) {
                        hljs.highlightBlock(block);
                    });
                } else {
                    var errorContent = '<h4><a href="' + element.mediaUrl + '" target="_blank">Click here to access</a></h4>';
                    $('#url_frame').html(errorContent);
                }
            });
            /*$('#url_frame').attr('src', element.mediaUrl);*/
            $scope.setElementComplete();
        } else if (mediaType == 'richtext') {
            $http.get('/private/v1/content/streamURL/' + encodeURIComponent(element.mediaUrl)).success(function(data) {
                var result = data.substring(1, data.length - 1);
                result = result.replace(/\\n/g, '').replace(/\\t/g, '');
                $scope.richText = result;
                $scope.setElementComplete();
            });
        } else if (mediaType == 'image') {
            $scope.setElementComplete();
        } else if (mediaType == 'slideshare') {
            var slideshareWidth = '100%';
            var slideshareHeight = '500px';
            if (mimeType == 'slideshare/pdf') {
                slideshareHeight = '1050px';
            }
            var slideshareEmbedContent = '<iframe src="' + element.mediaUrl + '" width="' + slideshareWidth + '" height="' + slideshareHeight + '" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>';
            $('#slideshareContentDiv').html(slideshareEmbedContent);
            $scope.setElementComplete();
        } else if (mediaType == 'event') {
            var state = element.state;
            if (state == 'inprogress' || state == 'complete') {
                if (element.objectType == 'Exam' || element.objectType == 'practiceTest') {
                    var test = eval("(" + element.mediaUrl + ")");
                    playAssessment($scope, test.usageId, state);
                }
            }
        } else if (mediaType == 'package') {
            document.getElementById('mediaPackageIFrame').src = element.mediaUrl;
            document.getElementById('mediaPackageIFrame').onload = function (e){
                var c = 670;
                if (element.height && element.height != '' && !isNaN(element.height) && parseInt(element.height) > 0) {
                    c = parseInt(element.height);
                }
                document.getElementById('mediaPackageIFrame').style.height = c + 'px';
                $('#packageMediaDiv').css( "height", c + "px" );
                $scope.setElementComplete();
            }
        }
        if (mediaType == 'package') {
            $('#mainContentArea').removeClass('paddingRL');
        }
    }, 500);

    moveRightArrowIfSidebarCollapsed();
    
}

function moveRightArrowIfSidebarCollapsed(){
    if ($('.RightSideBar').hasClass('Effectsidebar')) {
            $('.arrowIcn-right').css("right", "25px");
        } else {
            $('.arrowIcn-right').css("right", "250px");
        }
}

function securePDFFromRightClick(){
	$('#PDFDocDiv').bind("contextmenu",function(e){
        return false;
    });
}

function lectureViewPlayerReady($scope, $http, player, element, interceptions) {
    $scope.$apply(function() {
        $scope.videoPlayer = 'ready';
    });
    var isVideoComplete = false;
    var startTimestamp = (new Date()).getTime();
    CurrentPlayer.videoPlayer = player;
    CurrentPlayer.resizeMediaPlayer();
    // var markerTimes = [];
    // var markerTexts = [];
    var markers = [];
    if (element.contentType == 'lecture' && interceptions && interceptions.length > 0) {
        player.cuepoints();
        for (var i = 0; i < interceptions.length; i++) {
            var interception = interceptions[i];
            var marker = {
                time: parseInt(interception.interceptionPoint),
                text: interception.name
            };
            markers.push(marker);
            addVideoInterception(interception, player, $scope, $http);
        }
    }
    //markerTimes.push(360);
    //markerTexts.push("Quiz on Google App Engine");
    if (markers.length > 0) {
        player.markers({
            markerStyle: {
                'width': '2px',
                'background-color': 'red'
            },
            //set break time
            // marker_breaks: markerTimes,
            // marker_text: markerTexts
            markers: markers
        });
    }
    player.on('ended', function() {
        if (!isVideoComplete) {
            isVideoComplete = true;
            var endTimestamp = (new Date()).getTime();
            var timeSpent = endTimestamp - startTimestamp;
            $scope.setElementComplete(timeSpent);
        }
    });
    player.on('play', function() {
        /*$('html,body').animate({
            scrollTop: $("#primaryDiv").offset().top - 165
        }, 'slow');*/
        $('#primaryContentDiv').addClass('marginBottom25');
    });
    player.on('fullscreenchange', function() {
        if (player.isFullScreen()) {
            $('.vjs-control-bar').css('bottom', '0px');
        } else {
            $('.vjs-control-bar').css('bottom', '-33px');
        }
    });
}

function playAssessment($scope, assessmentId, state) {
	$scope.showNavigationLink = true;
    showAssesment(assessmentId, state);
}

function playProgram(element, $scope) {
    var program = {};
    program.programAnswer = element.programAnswer;
    program.programTemplate = element.programTemplate;
    $scope.program = program;
}


function addVideoInterception(interception, vPlayer, $scope, $http) {
    vPlayer.addCuepoint({
        namespace: "logger",
        start: parseInt(interception.interceptionPoint),
        end: parseInt(interception.interceptionPoint) + 1,
        onStart: function(params) {
            triggerInterception(interception, $scope, $http);
        },
        onEnd: function(params) {},
        params: {
            error: false
        }
    });
}

function addScribdInterception(interceptions, scribd_doc, $scope, $http) {
    var pages = [];
    var interceptionMap = {};
    if (interceptions && interceptions.length > 0) {
        for (var i = 0; i < interceptions.length; i++) {
            var interception = interceptions[i];
            var pageNo = parseInt(interception.interceptionPoint) + 1;
            pages.push(pageNo);
            interceptionMap[pageNo] = interception;
        }
        scribd_doc.addEventListener('pageChanged', function(e) {
            var page = scribd_doc.api.getPage();
            var currPage = parseInt(page);
            if (pages.indexOf(currPage) > -1) {
                triggerScribdInterception(interceptionMap[currPage], $scope, $http);
            }
        });
    }
}

function triggerScribdInterception(interception, $scope, $http) {
    $scope.interception = interception;
    $scope.interception.sourceMedia = 'slides';
    $('#interceptionDiv').width($('#scribdDocDiv').width());
    $('#interceptionDiv').height($('#scribdDocDiv').height() + 10);
    var t = $('#scribdDocDiv').offset().top;
    var h = $('header').height();
    var pos = t - h - 5;
    $('#interceptionDiv').css({
        position: 'absolute',
        top: pos,
        bottom: 'auto'
    });
    $('#interceptionMsgName').html(interception.name);
    $('#interceptionDiv').show('slow');
}

function triggerInterception(interception, $scope, $http) {
    var vPlayer = videojs('lesson_video');
    vPlayer.pause();
    vPlayer.exitFullscreen();
    $scope.interception = interception;
    $scope.interception.sourceMedia = 'video';
    setTimeout(function() {
        resizeInterceptionDiv();
        $('#interceptionMsgName').html(interception.name);
        $('#interceptionDiv').show('slow');
    }, 500);
}

function resizeInterceptionDiv() {
    $('#interceptionDiv').width($('#primaryContentDiv').width());
    $('#interceptionDiv').height($('#primaryContentDiv').height() + 30);
    $('#interceptionDiv').css({
        position: 'absolute',
        top: $('#primaryContentDiv').position().top,
        bottom: 'auto'
    });
}

function showInterception(interception, $scope, $http) {
    $http.get('/private/v1/content/getInterceptionContent/' + encodeURIComponent(interception.contentId))
        .success(function(data) {
            interception.contentType = data.contentType;
            interception.contentSubType = data.contentSubType;
            interception.metadata = data.metadata;
            interception.mediaType = data.mediaType;
            interception.mediaUrl = data.mediaUrl;
            interception.mimeType = data.mimeType;
            interception.quiz = data.quiz;
            interception.textData = data.textData;
            interception.programAnswer = data.programAnswer;
            interception.programTemplate = data.programTemplate;
            if (interception.contentType == 'learningactivity') {
                // if (interception.contentSubType == 'quiz') {
                //     $scope.quiz = JSON.parse(interception.quiz);
                //     $scope.quizIndex = 0;
                // } else 
                if (interception.contentSubType == 'program') {
                    playProgram(interception, $scope);
                }
            }
            setTimeout(function() {
                if (interception.mediaType == 'video') {
                    var videoObj = $('#int_video');
                    if (!videoObj || !videoObj.attr('id')) {
                        videoId = 'int_video';
                        var url = interception.mediaUrl;
                        try {
                            var player = videojs(videoId);
                            player.dispose();
                        } catch (e) {}
                        var intEl = angular.element(intVideoHTML);
                        compiled = $compile(intEl);
                        angular.element('#int_video_div').html(intEl + $('#int_video_div').html());
                        compiled($scope);
                        CurrentPlayer.videoPlayer = videojs(videoId, {
                            "techOrder": ["youtube"],
                            "sources": [{"type": "video/youtube", "src": url, "youtube": false}]
                        }).ready(function() {
                            $scope.$apply(function() {
                                $scope.intVideoPlayer = 'ready';
                            });
                        });
                    }
                } else if (interception.mediaType == 'slides' || interception.mediaType == 'document') {
                    var int_scribd_doc;
                    var intScribeObj = parseScribdURL(interception.mediaUrl);
                    var mimeType = interception.mimeType;
                    if (mimeType == 'scribd/url') {
                        int_scribd_doc = scribd.Document.getDocFromUrl(interception.mediaUrl, ""); // TODO: what is the access key in this case
                    } else {
                        int_scribd_doc = scribd.Document.getDoc(intScribeObj.id, intScribeObj.access_key);
                    }
                    int_scribd_doc.addParam('jsapi_version', 2);
                    if (interception.mediaType == 'slides') {
                        int_scribd_doc.addParam('height', 400);
                        int_scribd_doc.addParam('mode', 'slideshow');
                    } else if (interception.mediaType == 'document') {
                        int_scribd_doc.addParam('height', 1050);
                        int_scribd_doc.addParam('mode', 'list');
                    }
                    int_scribd_doc.write('intScribdDocDiv');
                } else if (interception.mediaType == 'text') {
                    $('#interceptionTextDiv').html(interception.textData);
                } else if (interception.mediaType == 'slideshare') {
                    var slideshareWidth = '100%';
                    var slideshareHeight = '500px';
                    if (interception.mimeType == 'slideshare/pdf') {
                        slideshareHeight = '1050px';
                    }
                    var slideshareEmbedContent = '<iframe src="' + interception.mediaUrl + '" width="' + slideshareWidth + '" height="' + slideshareHeight + '" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>';
                    $('#intSlideshareDiv').html(slideshareEmbedContent);
                } else if (interception.mediaType == 'mcq') {
                    playAssessment($scope, interception.mediaUrl);
                } else if (interception.mediaType == 'test') {
                    var test = eval("(" + interception.mediaUrl + ")");
                    playAssessment($scope, test.usageId);
                } else if (interception.mediaType != 'image') {
                    interception.contentType = 'unsupported';
                }
            }, 500);
        });
}

function setScopeValues($scope, currentMedia) {
    var types = ['Video', 'MCQ', 'Test', 'Image', 'Slides', 'Text', 'Url', 'RichText', 'Document', 'Slideshare', 'Ide', 'Event', 'External', 'Package', 'ecml'];
    for (var i = 0; i < types.length; i++) {
        var type = types[i];
        if (currentMedia.toLowerCase() == type.toLowerCase()) {
            $scope['show' + type] = true;
        } else {
            $scope['show' + type] = false;
        }
    }
    if (currentMedia == '') {
        $scope.showUnSupported = true;
    }
}

function setLeftRightArrowIcon() {
    (function() {
        $('.tool').tooltip();
        $('.tool-tip').tooltip();

        $(".arrowIcn-left").hover(function() {
            $(this).find(".previous-title").show();
        }, function() {
            $(this).find(".previous-title").hide();
        });

        $(".arrowIcn-right").hover(function() {
            $(this).find(".next-title").show();
        }, function() {
            $(this).find(".next-title").hide();
        });

        $(".video-container").hover(function() {
            $(this).find(".arrowIcn-left,.arrowIcn-right").show();
        }, function() {
            $(this).find(".arrowIcn-left,.arrowIcn-right").hide();
        });

        $(function() {
            $('[data-toggle="tooltip"]').tooltip();
        });

        $(".tooltip-class").tooltip();
    })();
}

function parseScribdURL(url) {
    var result = URI.parse(url);
    var object = {};
    object.id = result.path.replace('/embeds/', '').replace('/content', '');
    var query = URI.parseQuery(result.query);
    object.access_key = query.access_key;
    return object;
}
