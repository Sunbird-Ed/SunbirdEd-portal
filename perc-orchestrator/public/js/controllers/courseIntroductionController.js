app.controller('courseIntroductionCtrl',['$scope', '$http', '$timeout', '$rootScope', 'InteractionService', '$stateParams', '$location', 'CourseBrowserService', '$window', '$compile', '$sce', '$state', function($scope, $http, $timeout, $rootScope, service, $routeParams, $location, cbService, $window, $compile, $sce, $state) {
//app.controller('courseIntroductionCtrl', function($scope, $rootScope, $http, $location, $window, $timeout, $sce) {
    
    $scope.environment = 'Course';
    $scope.objectId = $rootScope.courseId;
    $scope.course = {};
    $scope.autoGenClss;
    $rootScope.leftMenu = 'ci';
    $rootScope.showConceptMap = false;

    $scope.getCourse = function() {
        // console.log("step 1 : ", $rootScope.courseId);
        $scope.courseId = $rootScope.courseId;
        $scope.userId = $('#userId').val();
        var courseId = cbService.addFedoraPrefix($scope.courseId);
        $scope.course = {};
        $http.get('/v1/player/getAnnouncementCourse/' + encodeURIComponent(courseId)).success(function(data) {
           // console.log("step source : ", data);
            $scope.course = data;
            $scope.coursePackages = [];
            $scope.courseOutcome = [];
            var courseOutcome = [];
            var coursePackages = [];
            if(data.packages) {
                data.packages.forEach(function(_package) {
                    var pkgOutcome = [];
                    if(_package.outcome.trim().length > 0) {
                        pkgOutcome = _package.outcome.split(",");
                    }
                    _package.outcome = [];
                    pkgOutcome.forEach(function(outcome) {
                        _package.outcome.push(outcome.trim());
                    });
                    
                    coursePackages[_package.identifier] = _package;
                });

                setTimeout(function() {
                    if(data.outcomeSequence.length > 0) {
                       $http.get('/v1/content/getAllLearningObjectives').success(function(learningObjectives) {
                          learningObjectives.forEach(function(learningObjective) {
                            if(data.outcomeSequence.indexOf(learningObjective.identifier) != -1) {
                                courseOutcome[learningObjective.identifier] = learningObjective;
                            }
                          });
                          data.outcomeSequence.forEach(function(outcomeId) {
                            $scope.courseOutcome.push(courseOutcome[outcomeId]);
                          });  
                       });
                       setTimeout(function() {
                            for (var i = 0; i < $scope.courseOutcome.length; i++) {
                                $("#OutCome_"+i).popover({html: true, placement: 'auto', trigger: 'hover', title: ''});
                            };
                        },500);
                    }
                },500);

                data.packageSequence.forEach(function(pkgId) {
                    $scope.coursePackages.push(coursePackages[pkgId]);
                });

                if($scope.userId) {
                    $http.get('/private/v1/player/getStudentCoursePackage/' + encodeURIComponent(courseId)).success(function(enrolledPackage) {
                        $scope.enrolledPackage = enrolledPackage;
                    });
                }
            }

            playVideo(data, 0, $http, $scope);
            $scope.loadingIntro = false;
        });
    }

    $scope.addCommas = function(nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }

    $scope.loadingIntro = true;
    $scope.getCourse();
    setTimeout(function(){adjustLSMenuHeight();}, 100);
}]);

function playVideo(course, index, $http, $scope) {
    var width = $('#videoDiv_' + index).width();
    var aspectRatio = 9 / 16;
    var height = width * aspectRatio;

    var videoInfo = course.introduction;
    var videoHTML = '<video id="introVideo_' + index + '" class="video-js vjs-default-skin" controls preload="auto"></video>';
    
    setTimeout(function() {
        var videoId = 'introVideo_' + index;
        var url = videoInfo.videoURL;
        var mimeType = videoInfo.videoMimeType;
        try {
            var player = videojs(videoId);
            player.dispose();
        } catch (e) {}
        if(mimeType.indexOf('image') >= 0) {
            var imageHTML = '<img id="introVideo_' + index + '" src="'+url+'" width="100%" height="' + height + '"></img>';
            $("#videoDiv_" + index).html(imageHTML);
        } else {
            $("#videoDiv_" + index).html(videoHTML);
            if (mimeType.indexOf('youtube') >= 0) {
                videojs(videoId, {
                    "techOrder": ["youtube"],
                    "sources": [{"type": "video/youtube", "src": url, "youtube": false}]
                }).ready(function() {
                    IntroVideoPlayer.videoPlayer = this;
                    IntroVideoPlayer.index = index;
                    IntroVideoPlayer.resize();
                }).on('play', function() {
                    $("#videoDiv_" + index).addClass('marginBottom25');
                });
            } else {
                videojs(videoId).src({
                    type: mimeType,
                    src: url
                });
            }
        }
        
    }, 500);
}

IntroVideoPlayer = {
    aspectRatio: 9 / 16,
    videoPlayer: null,
    index: 0,
    scope: null,
    resize: function() {
        if(!document.getElementById(IntroVideoPlayer.videoPlayer.id())) {
            return;
        }
        if(!IntroVideoPlayer.videoPlayer) {
            setTimeout(function() { IntroVideoPlayer.resize(); }, 500);
            return;
        }
        var width = $('#videoDiv_' + IntroVideoPlayer.index).width();
        IntroVideoPlayer.videoPlayer.width(width).height((width * IntroVideoPlayer.aspectRatio));
    }
}


