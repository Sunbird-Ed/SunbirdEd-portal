app.controller('PlayElementCtrl', ['$scope', '$stateParams', '$http', '$location', '$compile', '$sce', 'CourseBrowserService', '$rootScope', '$state',
    function($scope, $routeParams, $http, $location, $compile, $sce, CourseBrowserService, $rootScope, $state) {

        $rootScope.ViewContext = 'cb';
        $rootScope.leftMenu = 'cb';
        var lobId = $routeParams.lobId;
        var elementId = $routeParams.elementId;
        $scope.environment = 'Course';
        $scope.objectId = elementId;
        $scope.quizIndex = -1;
        $scope.showUnSupported = false;
        $scope.showNavigationLink = true;
        $scope.newNote = {
            title: '',
            description: ''
        };
        $scope.notesToUpdate = false;

        $scope.playLob = function() {
            $scope.loadingLecture = true;
            selectLeftMenuTab('courseTab');
            $http.get('/private/v1/player/playLob/' + encodeURIComponent($rootScope.courseLobId) + "/" + encodeURIComponent(lobId)).success(function(element) {
                $scope.objectId = element.identifier;
                $scope.setPlayerResponse(element);
            });
        };

        $scope.playElement = function() {
            $scope.loadingLecture = true;
            selectLeftMenuTab('courseTab');
            $http.get('/private/v1/player/playElement/' + encodeURIComponent($rootScope.courseLobId) + "/" + encodeURIComponent(lobId) + "/" + encodeURIComponent(elementId)).success(function(element) {
                $scope.objectId = element.identifier;
                $scope.setPlayerResponse(element);
            });
        };

        $scope.goToLecture = function(elementId) {
            $state.go('cb', {
                lobId: CourseBrowserService.removeFedoraPrefix(elementId)
            });
        }

        $scope.setEventStatus = function(accepted) {
            var data = {
                objectId: $scope.response.element.media.objectId,
                courseId: $rootScope.courseId
            };
            if (accepted) {
                $http.post('/private/v1/coaching/event/accept', data).success(function(resp) {
                    if (resp.status) {
                        $scope.response.element.media.action = resp.status;
                        $scope.response.element.media.lastUpdated = resp.lastUpdated;
                    }
                });
            } else {
                $http.post('/private/v1/coaching/event/decline', data).success(function(resp) {
                    if (resp.status) {
                        $scope.response.element.media.action = resp.status;
                        $scope.response.element.media.lastUpdated = resp.lastUpdated;
                    }
                });
            }
        };

        $scope.setPlayerResponse = function(element) {
            $scope.response = element;
            $rootScope.learningElementTitle = element.element.name;
            $scope.coveredConcpets = element.element.concepts;
            $scope.relatedMaterial = false;
            if (element.latestNote != null) {
                $scope.notesToUpdate = true;
                $scope.newNote.title = element.latestNote.title;
                $scope.newNote.description = element.latestNote.content;
                $scope.latestNote = element.latestNote;
            }
            $scope.updateTOC(element.identifier, element.parent.identifier);
            setTimeout(function() {
                playMedia($scope.response.element.media, $http, $scope, $compile);
                if ($scope.response.element.contentSubType == 'program') {
                    playProgram($scope.response.element, $scope);
                }
                $http.get('/private/v1/player/getElementSupplementaryContent/' + encodeURIComponent($rootScope.courseLobId) + '/' + encodeURIComponent(element.element.identifier)).success(function(data) {
                    $scope.loadingLecture = false;
                    if (data && data.categories && data.categories.length > 0) {
                        $scope.response.element.categories = data.categories;
                        $scope.relatedMaterial = true;
                        setTimeout(function() {
                            $(".tooltip-class").tooltip();
                        }, 500);
                    } else {
                        $scope.relatedMaterial = false;
                    }
                });
            }, 500);
        };

        $scope.backToLecture = function() {
            $('#interceptionDiv').hide();
            var mediaType = $scope.response.element.media.mediaType;
            if (mediaType == 'video') {
                var vPlayer = videojs('lesson_video');
                vPlayer.play();
            }
        };

        $scope.exploreConcept = function(concept) {
            selectLeftMenuTab('exploreTab');
            $state.go(
                'explore',
                {
                    "category": "",
                    "concept": (CourseBrowserService.removeFedoraPrefix(concept.identifier) || "")
                }
            );
        }

        $scope.playExploreContent = function(content) {
            $state.go(
                'explore.play',
                {
                    "category": (content.contentGroup || ""),
                    "concept": (CourseBrowserService.removeFedoraPrefix(content.mainConceptId) || ""),
                    "contentId": CourseBrowserService.removeFedoraPrefix(content.identifier)
                }
            );
        }

        $scope.playInterception = function() {
            $scope.showNavigationLink = false;
            $scope.showInterception = true;
            // $scope.size = {
            //     height: $('#lesson_video').height(),
            //     width: $('#lesson_video').width()
            // };
            $("#lesson_video").toggleClass('vjs-16-9');
            var mediaType = $scope.response.element.media.mediaType;
            if (mediaType == 'video') {
                $('#lesson_video').hide(1000);
                $('#lesson_video').block({
                    message: null,
                    baseZ: 10
                });
                $('.vjs-control-bar').css('visibility', 'hidden');
            } else {
                $('#scribdDocDiv .scribd_iframe_embed').animate({
                    width: "100px",
                    height: "80px"
                }, 1000);
                $('#scribdDocDiv').animate({
                    width: "100px"
                }, 1000);
                $('#scribdDocDiv').block({
                    message: null,
                    baseZ: 10
                });
            }
            $('#interceptionDiv').hide();
            showInterception($scope.interception, $scope, $http);
        };

        $scope.showNotesPopup = function() {
            // called before loading the notes popup
            if (!$scope.currentContext) {
                var currentContext = {};
                currentContext.course = $scope.course.name;
                currentContext.courseId = $scope.course.identifier;
                currentContext.parent = $scope.response.parent.name;
                currentContext.element = $scope.response.element.name;
                currentContext.elementId = $scope.response.identifier;
                $scope.currentContext = currentContext;
            }
            var tpl = $compile(notesHTML)($scope);
            $('#sliderContentDiv').html(tpl);
        }


        $scope.setNoteTitle = function() {
            setNoteTitle($scope);
        }

        $scope.setNoteText = function() {
            setNoteText($scope);
        }

        $scope.saveNotes = function() {
            saveNotes($scope, $http);
        }

        $scope.newNote = function() {
            newNote($scope, $http);
        }

        $scope.watermark = function(wmtext) {
            $("#noteTitle").Watermark(wmtext);
        }

        $scope.updateTOC = function(elementId, parentId) {
            var args = {};
            args.elementId = elementId;
            args.parentId = parentId;
            $scope.$emit('playElementEvent', args);
        };

        $scope.getAdditionalMaterial = function(elementType, elementId, category) {
            category.showCategory = true;
            var reqURL = '/private/v1/player/getLRAdditionalMaterial/';
            if (elementType == 'learningactivity') {
                reqURL = '/private/v1/player/getLAAdditionalMaterial/';
            } else if (elementType == 'content') {
                reqURL = '/private/v1/player/getContentAdditionalMaterial/';
            }
            $http.get(reqURL + encodeURIComponent($rootScope.courseLobId) + "/" + encodeURIComponent(elementId) + "/" + encodeURIComponent(category.category)).success(function(data) {
                if (data && data.length > 0) {
                    category.showCategory = true;
                    category.content = data;
                    $scope.relatedMaterial = true;
                } else {
                    category.showCategory = false;
                }
            });
        };

        $scope.setElementComplete = function(timeSpent) {
            if (!$scope.response.currentStatus || ($scope.response.currentStatus != 'content not available' && $scope.response.currentStatus != 'not ready')) {
                var elementId = $scope.response.element.identifier;
                if (!timeSpent) {
                    timeSpent = 0;
                }
                $http.get('/private/v1/player/completeElement/' + encodeURIComponent($rootScope.courseLobId) + "/" + encodeURIComponent(elementId) + "/" + timeSpent).success(function(element) {
                    if (element && element.status) {}
                });
            }
        };

        $scope.playAlternateContent = function(mediaId) {
            playAlternateContentCall(mediaId, $scope, $http, $compile, $rootScope);
        };

        $scope.renderHtml = function(htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };

        $scope.addAdditionalMaterial = function(lobId, category, content) {
            $http.get('/private/v1/player/addAdditionalMaterial/' + encodeURIComponent($scope.courseLobId) + '/' + encodeURIComponent(category) + "/" + encodeURIComponent(lobId) + "/" + encodeURIComponent(content.contentId)).success(function(data) {
                content.isAdded = true;
                if (data) {
                    if (data.status == 'error') {
                        alert(data.errorMsg);
                    } else {
                        $scope.response.path.push(data.element);
                        setTimeout(function() {
                            $(".tooltip-class").tooltip();
                        }, 500);
                    }
                }
            });
        };

        $scope.removeAdditionalMaterial = function(lobId, content) {
            $http.get('/private/v1/player/removeAdditionalMaterial/' + encodeURIComponent($scope.courseLobId) + '/' + encodeURIComponent(lobId) + "/" + encodeURIComponent(content.contentId)).success(function(data) {
                if (data) {
                    if (data.status == 'error') {
                        alert(data.errorMsg);
                    } else {
                        content.isAdded = false;
                        if ($scope.response.path) {
                            var pathArr = $scope.response.path;
                            var index = -1;
                            for (var i = 0; i < pathArr.length; i++) {
                                if (pathArr[i].identifier == content.identifier) {
                                    index = i;
                                    break;
                                }
                            }
                            if (index > -1) {
                                $scope.response.path.splice(index, 1);
                            }
                        }
                        setTimeout(function() {
                            $(".tooltip-class").tooltip();
                        }, 500);
                    }
                }
            });
        };

        // deprecated
        $scope.incrementQuizIndex = function() {
            $scope.quizIndex++;
        };

        // deprecated
        $scope.decrementQuizIndex = function() {
            $scope.quizIndex--;
        };

        // deprecated
        $scope.submitQuiz = function() {
            $http.post('/private/v1/player/quiz/getResult', {
                quiz: $scope.quiz,
                courseId: $rootScope.courseId
            }).success(function(data) {
                $scope.quiz.result = data;
                if (!$scope.showInterception) {
                    $scope.setElementComplete();
                }
            });
            $scope.quizIndex++
        };

        $scope.closeInterception = function() {
            $scope.showNavigationLink = true;
            $scope.interception = {};
            $scope.showInterception = false;
            var mediaType = $scope.response.element.media.mediaType;
            if (mediaType == 'video') {
                $('#lesson_video').unblock();

//                $("#lesson_video").toggleClass("vjs-16-9");
                // $('#lesson_video').animate({ width: $scope.size.width, height: $scope.size.height }, 1000 );

                $('#lesson_video').show(1000);
                CurrentPlayer.resizeMediaPlayer();
                var vPlayer = videojs('lesson_video');
                $('.vjs-control-bar').css('visibility', 'visible');
                vPlayer.play();
            } else {
                var height = '400px';
                if (mediaType == 'document') {
                    height = '1050px';
                }
                $('#scribdDocDiv').unblock();
                $('#scribdDocDiv').animate({
                    width: "100%"
                }, 1000);
                $('#scribdDocDiv .scribd_iframe_embed').animate({
                    width: "100%",
                    height: height
                }, 1000);
            }
        };

        $scope.aceLoaded = function(_editor) {
            var _session = _editor.getSession();
            var _renderer = _editor.renderer;
            _session.setMode("ace/mode/java");
        };

        $scope.submitProgram = function() {
            var userProgram = $scope.program.programTemplate;
            userProgram = userProgram.replace(/ /g, '').replace(/\n/g, '');
            var expectedProgram = $scope.program.programAnswer;
            expectedProgram = expectedProgram.replace(/ /g, '').replace(/\n/g, '');
            if (userProgram == expectedProgram) {
                $scope.programError = false;
                $scope.programSuccess = true;
            } else {
                $scope.programError = true;
                $scope.programSuccess = false;
            }
        }

        if (lobId && lobId != '' && elementId && elementId != '') {
            $scope.playElement();
        }
        if (lobId && lobId != '' && (!elementId || elementId == '')) {
            $scope.playLob();
        }
        $(window).resize(function() {
            CurrentPlayer.resizeMediaPlayer();
        });

        $scope.showNote = function() {
            $("#il-Txt-Editor").slideToggle(function() {
                if ($(this).is(":hidden")) {
                    $scope.createNote();
                }
            });
        }

        $scope.clearNewNote = function() {
            $scope.newNote = {
                title: '',
                description: ''
            };
        }

        $scope.clearForNewNote = function() {
            $scope.newNote = {
                title: '',
                description: ''
            };
            $scope.notesToUpdate = false;
        }


        $scope.createNote = function() {
            if (($scope.newNote.title != null && $scope.newNote.title != "" && $scope.newNote.title != undefined) && ($scope.newNote.description != null && $scope.newNote.description != "" && $scope.newNote.description != undefined)) {
                if ($scope.notesToUpdate) {
                    $scope.latestNote.title = $scope.newNote.title;
                    $scope.latestNote.content = $scope.newNote.description;
                    $http.post('/private/v1/note/', $scope.latestNote).success(function(data) {
                        $scope.latestNote = data;
                        $scope.newNote.title = data.title;
                        $scope.newNote.description = data.content;
                        $scope.notesToUpdate = true;
                        $("#il-Txt-Editor").slideUp();
                    });

                } else {
                    var strLocation = '';
                    var href = '';
                    var urlToBeSaved = '';

                    $http.post('/private/v1/note/', {
                        title: $scope.newNote.title,
                        content: $scope.newNote.description,
                        url: urlToBeSaved,
                        location: {
                            course: $scope.courseName,
                            lecture: $scope.response.element.name
                        },
                        tags: ['Course: ' + $scope.courseName],
                        courseId: CourseBrowserService.removeFedoraPrefix($rootScope.courseId),
                        elementId: CourseBrowserService.removeFedoraPrefix($scope.response.element.identifier)
                    }).success(function(data) {
                        $scope.latestNote = data;
                        $scope.newNote.title = data.title;
                        $scope.newNote.description = data.content;
                        $scope.notesToUpdate = true;
                        $("#il-Txt-Editor").slideUp();
                    }).error(function(err) {
                        console.log(err);
                    });
                }
            }
        };
    }
]);

function playAlternateContentCall(mediaId, $scope, $http, $compile, $rootScope) {
    var mediaObj;
    var mediaList = [];
    for (var i = 0; i < $scope.response.element.mediaList.length; i++) {
        var obj = $scope.response.element.mediaList[i];
        if (obj.mediaId == mediaId) {
            mediaObj = obj;
        } else {
            mediaList.push(obj);
        }
    }
    if (mediaObj) {
        if (mediaObj.isMain) {
            $scope.showNavigationLink = true;
        } else {
            $scope.showNavigationLink = false;
        }
        mediaList.push($scope.response.element.media);
        $scope.response.element.media = mediaObj;
        $scope.response.element.mediaList = mediaList;
        $scope.response.element.name = mediaObj.title;
        playMedia(mediaObj, $http, $scope, $compile);
    }
}
