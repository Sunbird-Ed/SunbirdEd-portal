
var appObj;
if(typeof playerApp != 'undefined') {
    appObj = playerApp;
} else if(typeof app != 'undefined') {
    appObj = app;
}

app.filter('slice', function() {
  return function(arr, start, end) {
    return (arr || []).slice(start, end);
  };
});

appObj.controller('LoginCtrl', function($scope, $rootScope, $http, $location, $window, $timeout, $sce) {

    $scope.userName = "";
    $scope.passWord = "";
    $scope.success;
    $scope.loginFromAncmentPage = false;
    $scope.environment = 'General';

    $scope.gotoEnrollElement = function() {
        $(window).load(function() {
            if($window.location.search.indexOf('showEnroll') > -1) {
                $window.location.href = $window.location.pathname+$window.location.search+'#enrollCourse';
            }
        });
    };

    var currPath = undefined;

    $rootScope.$on( "$locationChangeStart", function(event, next, current) {
        //console.log('Received $locationChangeSuccess event...', $location.path());
        setTimeout(function() {
            $('[data-toggle="tooltip"]').tooltip();
        }, 1000);
        var path = $location.path();
        if(currPath == path) {
            //console.log('Same event received. Ignoring the event...');
        } else {
            currPath = path;
            if(path && path != '' && path.indexOf('/week') != 0 && path.indexOf('/collapse') != 0){
                if(path.indexOf('/browser') == 0 || path.indexOf('/lecture') == 0) {
                    $rootScope.lectureView = true;
                    $scope.$emit('getRecentData', {path : path});
                }else{
                    $rootScope.lectureView = false;
                    $scope.$emit('getRecentData', {path : path});
                }
            }
            setTimeout(function() {
                $(".mid-area,.RightSideBar").removeClass("leftOpen");
            }, 500);
        }
    });

    $scope.gotoEnrollElement();

    $scope.cleanUp = function() {
        $scope.userName = "";
        $scope.passWord = "";
        $scope.success = 1;
        $scope.showForgotPassword = false;
        $scope.loginFromAncmentPage = false;
        $scope.resetPasswordMailSent = false;
        console.log("cleanUp:",$scope.loginFromAncmentPage);
        $("#forgotPwdBlock").css("display","none");

        $('#loginModal').on('shown.bs.modal', function () {
            $('#loginUserName').focus();
        });
    }

    $scope.loadAnnoucementLogin = function() {
        var scope = angular.element($("#pageHeader")).scope();
        scope.cleanUp();
        $scope.loginFromAncmentPage = true;
        console.log("loadAnnoucementLogin:",$rootScope.loginFromAncmentPage);
    }

    $scope.signIn = function() {
        var request = $http({
            method: "POST", // define the type of HTTP verb we want to use (POST for our form)
            url: "/private/v1/login/", // the url where we want to POST
            data: {
                email: $scope.userName,
                password: $scope.passWord
            }
        }).
        success(function(data) {
            if (data.status == 'success') {
                $scope.success = 1;
                // log data to the console so we can see
                if($scope.loginFromAncmentPage) {
                    var url = $window.location.pathname + '?showEnroll'
                    $window.location.href = url;
                } else {
                    $http.get('/private/v1/player/currentCourse').success(function(data) {
                        console.log(data);
                        if (data.error) {
                            $window.location.href = '/private/player/dashboard';
                        } else if(data.hasOwnProperty('courseId')){
                            document.location.href = '/private/player/course/' + encodeURIComponent(data.courseId) + '#/myCourses';
                        } else {
                            var url = "/player/termsandconditions"
                            $window.location.href = url;
                        }
                    });
                }
            } else {
                $scope.success = 0;
            }
        }).
        error(function(err) {
            $scope.success = 0;
        });
    }


    $scope.resetPassword = {};

    $scope.openForgotPassworBlock = function() {
        $scope.showForgotPassword = true;
        $scope.resetPassword = {};
        $('#forgotPwdBlock').show();
        $("#forgotPwdAlert").html("").removeClass("alert-danger alert-success").addClass("hide");
    }

    $scope.forgotPasswordEmail = function() {
        var errorHandler = function(msg, timeout) {
            if(!timeout) timeout = 5000;
            $("#forgotPwdAlert").html(msg).addClass("alert-danger").removeClass("hide");
            setTimeout(function() {
                $("#forgotPwdAlert").html("").removeClass("alert-danger").addClass("hide");
            }, timeout);
        };
        if($scope.resetPassword.email) {
            var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(regex.test($scope.resetPassword.email)) {
                $http.post("/public/v1/user/forgotPassword", {"email": $scope.resetPassword.email}).success(function(data) {
                    if(data && data.STATUS) {
                        if(data.STATUS == "ERROR") {
                            errorHandler(data.errorMessage);
                        } else if(data.STATUS == "SUCCESS") {
                            $("#forgotPwdAlert").html("The password reset link has been sent to <b>"+$scope.resetPassword.email+"</b>. The link is valid for 24 hours. Please check your email and follow the instructions to reset your password. You can click on forgot password again to resend the email.").addClass("alert-success").removeClass("hide");
                            $scope.resetPassword = {};
                            $scope.resetPasswordMailSent = true;
                        }
                    } else {
                        errorHandler("Error while processing. Please contact Admin.");
                    }
                });
            } else {
                errorHandler("Please enter valid Email.");
            }
        } else {
            errorHandler("Please enter Email.");
        }
    }

    $scope.myCourses = function() {
        $http.get('/private/v1/player/currentCourse').success(function(data) {
            if (data && !data.error) {
                document.location.href = '/private/player/course/' + encodeURIComponent(data.courseId) + '#/myCourses';
            }
        });
    }

});

appObj.directive('ilVideoEvents', function() {
    return {
        restrict: 'A',
        scope: {
            status: '=status'
        },
        link: function(scope, element, attrs) {
            var videoId = $(element).attr('id');
            scope.$watch('status', function (value) {
                if (typeof value == 'string') {
                    var player = videojs(videoId);
                    setClickStreamAttributes(scope, attrs);
                    player.on('firstplay', function() {
                        var startEvent = getUIEvent(attrs, 'started');
                        addLogStreamEvent(startEvent);
                    });
                    player.on('play', function() {
                        var playEvent = getUIEvent(attrs, 'played');
                        addLogStreamEvent(playEvent);
                    });
                    player.on('pause', function() {
                        var pauseEvent = getUIEvent(attrs, 'paused');
                        addLogStreamEvent(pauseEvent);
                    });
                    player.on('ended', function() {
                        var endEvent = getUIEvent(attrs, 'ended');
                        addLogStreamEvent(endEvent);
                    });
                    player.on('fullscreenchange', function() {
                        if (player.isFullScreen()) {
                            var endEvent = getUIEvent(attrs, 'view fullscreen');
                            addLogStreamEvent(endEvent);    
                        } else {
                            var endEvent = getUIEvent(attrs, 'exit fullscreen');
                            addLogStreamEvent(endEvent);    
                        }
                    });
                    player.on('seeked', function() {
                        var seekEvent = getUIEvent(attrs, 'jumped to');
                        addLogStreamEvent(seekEvent);    
                    });
                    player.on('volumechange', function() {
                        if (player.muted()) {
                            var muteEvent = getUIEvent(attrs, 'muted');
                            addLogStreamEvent(muteEvent);
                        } else {
                            var volChangeEvent = getUIEvent(attrs, 'changed volume');
                            addLogStreamEvent(volChangeEvent);
                        }
                    });
                }
            }, true);
        }
    };
});

appObj.directive('ilScribdEvents', function() {
    return {
        restrict: 'A',
        scope: {
            status: '=status',
            player: '=player'
        },
        link: function(scope, element, attrs) {
            scope.$watch('status', function (value) {
                if (typeof value == 'string') {
                    console.log('scribd status: ' + value);
                    var scribd_doc = scope.player;
                    setClickStreamAttributes(scope, attrs);
                    scribd_doc.addEventListener('pageChanged', function(e) {
                        console.log('player pageChanged');
                        var pageChangeEvent = getUIEvent(attrs, 'page changed');
                        addLogStreamEvent(pageChangeEvent);
                    });
                    scribd_doc.addEventListener('viewModeChanged', function(e) {
                        console.log('player viewModeChanged');
                        var viewModeEvent = getUIEvent(attrs, 'view mode changed');
                        addLogStreamEvent(viewModeEvent);
                    });
                    scribd_doc.addEventListener('zoomChanged', function(e) {
                        console.log('player zoomChanged');
                        var zoomEvent = getUIEvent(attrs, 'zoom changed');
                        addLogStreamEvent(zoomEvent);
                    });
                }
            }, true);
        }
    };
});

appObj.directive('ilExternalUrlEvents', function() {
    return {
        restrict: 'A',
        scope: {
            status: '=status'
        },
        link: function(scope, element, attrs) {
            var elementId = $(element).attr('id');
            scope.$watch('status', function (value) {
                if (value) {
                    setClickStreamAttributes(scope, attrs);
                    $(element).find('a').click(function() {
                        attrs.external = 'true';
                        var clickEvent = getUIEvent(attrs, 'external link');
                        addLogStreamEvent(clickEvent);
                    });
                }
            }, true);
        }
    };
});

appObj.directive('ilCaptureClick', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).click(function() {
                setClickStreamAttributes(scope, attrs);
                var clickEvent = getUIEvent(attrs, 'clicked');
                var flush = (attrs.action.toLowerCase() == 'logout');
                addLogStreamEvent(clickEvent, flush);
            });
        }
    };
});

appObj.directive('ilCaptureChange', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).change(function() {
                var changeEvent = getUIEvent(attrs, 'change');
                addLogStreamEvent(changeEvent);
            });
        }
    };
});

appObj.directive('ilCaptureFocus', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).focus(function() {
                var focusEvent = getUIEvent(attrs, 'focus');
                addLogStreamEvent(focusEvent);
            });
        }
    };
});

appObj.directive('ilCaptureBlur', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).blur(function() {
                var blurEvent = getUIEvent(attrs, 'blur');
                addLogStreamEvent(blurEvent);
            });
        }
    };
});

function setClickStreamAttributes(scope, attrs) {
    if (scope.$parent) {
        if (typeof attrs.environment == 'undefined') {
            attrs.environment = scope.$parent.environment;
        }
        if (typeof attrs.objectId == 'undefined') {
            attrs.objectId = scope.$parent.objectId;
        }
    }
}

$(window).unload(function() {
    flushEvents();
});

function getUIEvent(attrs, defaultAction) {
    var action = defaultAction;
    if (typeof attrs.action == 'string') {
        action = attrs.action;
    }
    var external = true;
    if (typeof attrs.external != 'undefined') {
        external = (attrs.external.toLowerCase() == 'true') ? true : false;
    } else if (typeof attrs.environment != 'undefined') {
        external = false;
    }
    var uiEvent = {};
    uiEvent.timestamp = (new Date()).getTime();
    uiEvent.environment = attrs.environment;;
    uiEvent.objectId = attrs.objectId;
    uiEvent.action = action;
    uiEvent.external = external;
    uiEvent.uiEvent = true;
    if ($('#courseId')) {
        var courseId = $('#courseId').val();    
        if (courseId) {
            uiEvent.courseId = courseId;
        }
    }
    return uiEvent;
}


function endsWith(str, suffix) {
    if (!str || str == null) {
        return false;
    }
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function getSessionStorageArray(key) {
    var arr = sessionStorage.getItem(key);
    if (!arr || arr == null) {
        arr = [];
    } else if (typeof arr == 'string') {
        arr = JSON.parse(arr);
    }
    return arr;
}

function flushEvents() {
    var events = getSessionStorageArray('events');
    if (events.length > 0) {
        var arr = [];
        sessionStorage.setItem('events', JSON.stringify(arr));
        var timestamp = (new Date()).getTime();
        $.ajax({
            type: "POST",
            url: "/private/logstream/?timestamp=" + timestamp,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(events),
            success: function(data) {
                console.log('log stream sent');
            }
        });
    }
}

function addLogStreamEvent(logEvent, flush) {
    var events = getSessionStorageArray('events');
    events.push(logEvent);
    sessionStorage.setItem('events', JSON.stringify(events));
    if (flush) {
        flushEvents();
    } else {
        if (events.length > 10) {
            flushEvents();
        }
    }
}


