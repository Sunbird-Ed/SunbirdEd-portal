var app = angular.module('homePageApp', ['sunburst.services', 'sunburst.directives', 'd3']);

app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

app.run(function($rootScope, $sce) {
    $rootScope.fedoraPrefix = "info:fedora/";
    $rootScope.removeFedoraPrefix = function(identifier) {
        if (identifier.indexOf($rootScope.fedoraPrefix) == 0) {
            return identifier.substring($rootScope.fedoraPrefix.length);
        } else {
            return identifier;
        }
    };

    $rootScope.addFedoraPrefix = function(identifier) {
        if (identifier.indexOf($rootScope.fedoraPrefix) == -1) {
            return $rootScope.fedoraPrefix + identifier;
        }
        return identifier;
    };

    $rootScope.renderHtml = function(htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
});

app.controller('HomePageCtrl', function($scope, $http, $location, $window, $timeout, $sce, $anchorScroll) {

    $scope.renderHtml = function(htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.loadHomePageCourses = function() {
        $http.get('/v1/player/getHomePageCourses').success(function(courses) {
            //console.log("featured:",courses.featured);
            //console.log("popular:",courses.popular);
            $scope.courses = courses;
            for (var i = 0; i < courses.popular.length; i++) {
                playVideo(courses.popular[i], i, 320, $http, $scope);
            }
            if (courses.featured) {
                loadSunburst($scope, $http, courses.featured.identifier);
            }
        });
    };
    $scope.loadHomePageCourses();

    $scope.moveToLocation = function(id){
        $location.hash(id);
        $anchorScroll();
    }

    $scope.peopleProfile = function(userId) {
        $http.get('/private/v1/player/currentCourse').success(function(data) {
            if (data && !data.error) {
                document.location.href = '/private/player/course/' + encodeURIComponent(data.courseId) + '#/community/peopleProfile/' + userId;
            }
        });
    }
    $scope.showModelBox = function (data) {
        $scope.modalData = data;
        $("#commonModal").modal();
    } 
    // $scope.articleData = articleData;
    // $scope.announcementData = announcementData;
    // $scope.ourCourses = ourCourses;
});

app.controller('HowItWorksCtrl', function($scope, $http, $location, $window, $timeout, $sce) {
    $scope.showHowItWorks = true;
});

app.controller('TermsAndConditionsCtrl', function($scope, $http, $location, $window, $timeout, $sce, $anchorScroll) {
    $scope.accept = function() {
        
        $scope.tandcsubmitted = true;
        if($scope.termsofuse && $scope.honorcode) {
            $http.post('/private/v1/termsandconditions',{}).success(function(data) {
                console.log("data:",data);
                $http.get('/private/v1/player/currentCourse').success(function(data) {
                    if (data.error) {
                        $window.location.href = '/private/player/dashboard';
                    } else {
                        document.location.href = '/private/player/course/' + encodeURIComponent(data.courseId) + '#/myCourses';
                    }
                });
            });
        }
    }

    $scope.isReady = function(){
        $scope.amIReady = false;
        if($("#notAnsweredAllQuestions").length == 0) {
            $scope.amIReady = true;
        }
        
    }

    $scope.moveToLocation = function(id){
        $location.hash(id);
        $anchorScroll();
        $('.headerAsk').css('margin-top', 50);
        // windowHeight();
    }
});

app.controller('HomePageRegisterCtrl', function($scope, $http, $location, $window, $timeout, $sce) {
    $scope.contact = {};
    $scope.sendMail = function() {
        $("#sendMailBtn").html("Sending...").attr("disabled", true);
        $("#contactUsAlert").html("").addClass("hide").removeClass("alert-success").removeClass("alert-danger");
        if($scope.contact.name && $scope.contact.email) {
            $http.post('/public/v1/sendRegisterMail', $scope.contact).success(function(data) {
                console.log("Response:", data);
                if(data.status == "SUCCESS") {
                    $scope.contact = {};
                    $("#contactUsAlert").html("Thank you for registering. We will get back to you shortly.").removeClass("hide").addClass("alert-success");
                } else {
                    $("#contactUsAlert").html(data.errorMessage).removeClass("hide").addClass("alert-danger");
                }
                $("#sendMailBtn").html("REACH OUT").attr("disabled", false);
            });
        } else {
            $("#contactUsAlert").html("Please fill all required fields.").removeClass("hide").addClass("alert-danger");
            $("#sendMailBtn").html("REACH OUT").attr("disabled", false);
        }
    }
});


app.controller('RegisterCtrl', function($scope, $http, $location, $window, $timeout, $sce) {
    $scope.metadata = {};
    $scope.userId = $('#userId').val();
    $scope.getUserProfile = function() {
        $http.get('/private/v1/user/' + $scope.userId + '/profile').success(function(resp) {
            $scope.metadata = resp.metadata;
            $scope.metadata.givenName = resp.name.givenName;
            $scope.metadata.middleName = resp.name.middleName;
            $scope.metadata.familyName = resp.name.familyName;
        });
    }
    $scope.completeRegistration = function() {
        $("#contactUsAlert").html("").addClass("hide").removeClass("alert-success").removeClass("alert-danger");
        if($scope.metadata.givenName == "" || $scope.metadata.givenName == null || !$scope.metadata.givenName) {
            $("#contactUsAlert").html("First Name is required.").removeClass("hide").addClass("alert-danger");
            return;
        }
        $("#sendMailBtn").html("Completing registration...").attr("disabled", true);
        $http.post('/user/registration/complete', $scope.metadata).success(function(data) {
            if(data.registered) {
                $http.get('/private/v1/player/currentCourse').success(function(data) {
                    if (data.error) {
                        $window.location.href = '/private/player/dashboard';
                    } else {
                        document.location.href = '/private/player/course/' + encodeURIComponent(data.courseId) + '#/myCourses';
                    }
                });
            } else {
                $("#contactUsAlert").html("Sorry. Unable to register at this momemt. Please try again later.").removeClass("hide").addClass("alert-danger");
            }
            $("#sendMailBtn").html("Complete Registration").attr("disabled", false);
        });
    }
    $scope.getUserProfile();
});


app.controller('CourseAnnouncementCtrl' , function($scope, $rootScope, $http, $location, $window, $timeout, $sce) {

    $scope.environment = 'Course';
    $scope.objectId = $('#courseId').val();

    $scope.getCourse = function() {
        $scope.courseId = $('#courseId').val();
        $scope.userId = $('#userId').val();
        var courseId = $rootScope.removeFedoraPrefix($scope.courseId);
        $scope.course = {};
        $http.get('/v1/player/getAnnouncementCourse/' + encodeURIComponent(courseId)).success(function(data) {
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

            playVideo(data, 0, 330, $http, $scope);
            if($scope.course.conceptMapImage) {
                $scope.showSunburst = false;
            } else {
                $scope.showSunburst = true;
                loadSunburst($scope, $http, data.identifier);
            }
            
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


    $scope.enrollPackage = function(packageId) {
        $http.get('/private/v1/player/enrollCourse/' + encodeURIComponent($scope.course.identifier) + '/' + encodeURIComponent(packageId)).success(function(resp) {
            $window.location.href = '/private/player/dashboard';
        });

    }
    $scope.getCourse();
});

app.controller('InstructorCtrl', function($scope, $rootScope, $http, $location, $window, $timeout, $sce) {
    $scope.getInstructor = function() {
        $scope.instructorId = $('#instructorId').val();
        var instructorId = $scope.addFedoraPrefix($scope.instructorId);
        $scope.instructor = {};
        $http.get('/v1/instructor/get/' + encodeURIComponent(instructorId)).success(function(data) {
            //var interests = data.interests.split(",");
            $scope.instructor = data;
            //$scope.instructor.interests = interests;
        });
    };

    $scope.getInstructor();
});

function playVideo(course, index, height, $http, $scope) {
    var videoInfo = course.introduction;
    var videoHTML = '<video id="introVideo_' + index + '" class="video-js vjs-default-skin" controls preload="auto" width="100%" height="' + height + '"></video>';
    
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
                    "src": url,
                    "ytcontrols": true
                }).ready(function() {

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

function loadSunburst($scope, $http, courseId) {
    // Sunburst Code
    $scope.data;
    $scope.displayVis = false;
    $scope.currentnode;
    $scope.color;
    $scope.contentList = [];
    // Browser onresize event
    window.onresize = function() {
        $scope.$apply();
    };

    // Traverses the data tree assigning a color to each node. This is important so colors are the
    // same in all visualizations
    $scope.assignColors = function(node) {
        $scope.getColor(node);
        _.each(node.children, function(c) {
            $scope.assignColors(c);
        });
    };
    // Calculates the color via alphabetical bins on the first letter. This will become more advanced.
    $scope.getColor = function(d) {
        /*
        if(!d.contentCount) d.contentCount = 0;
        if(d.depth == 0) {
        } else if(d.contentCount <= 10) {
            d.color = $scope.color[0];
        } else if(d.contentCount > 10 && d.contentCount <= 20) {
            d.color = $scope.color[1];
        } else if(d.contentCount > 20 && d.contentCount <= 30) {
            d.color = $scope.color[2];
        } else if(d.contentCount > 30 && d.contentCount <= 40) {
            d.color = $scope.color[3];
        } else if(d.contentCount > 40 && d.contentCount <= 50) {
            d.color = $scope.color[4];
        } else if(d.contentCount > 50) {
            d.color = $scope.color[5];
        }*/
        d.color = $scope.color(d.name);
    };
    //$scope.color = ["#87CEEB", "#007FFF", "#72A0C1", "#318CE7", "#0000FF", "#0073CF"];
    $scope.color = d3.scale.ordinal().range(["#33a02c", "#1f78b4", "#b2df8a", "#a6cee3", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#6a3d9a", "#cab2d6", "#ffff99"]);

    $http.post('/v1/course/fetchSunburstConceptMap/', {
        "courseId": courseId
    })
        .success(function(data, status, headers, config) {
            if (data && data.length > 0) {
                var root = data[0];
                /*root['categoryCounts'] = data[1];
            root['words'] = [];
            root['words'].push(data[0].name);*/
                $scope.assignColors(root);
                $scope.data = data;
            }
        })
        .error(function(data, status, headers, config) {
            console.log("Error loading data!" + status);
        });


}


