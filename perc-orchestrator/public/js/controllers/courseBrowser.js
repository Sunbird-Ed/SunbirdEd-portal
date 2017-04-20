var assessmentsConfig = undefined;

var app = angular.module('courseBrowserApp', ['ui.router', 'ui.ace', 'ui.bootstrap', 'ngGrid', 'readableTime', 'fullscreen.radial', 'angularFileUpload', 'angularjs-dropdown-multiselect', 'truncate', 'ngSanitize']);

app.config(function($stateProvider) {
    $stateProvider
        .state('myCourses', {
            url: "/myCourses",
            views: {
                "contentSection": {
                    templateUrl: "/myCourses.html",
                    controller: 'MyCoursesCtrl'
                },
            }
        })
        .state('peopleProfile', {
            url: "/community/peopleProfile/:userId",
            views: {
                "contentSection": {
                    templateUrl: "/player/myProfile.html",
                    controller: 'peopleProfileController'
                },
            }
        })
        .state('cb', {
            url: "/browser/:lobId",
            views: {
                "contentSection": {
                    templateUrl: "/player/contentPlayer.html",
                    controller: 'PlayElementCtrl'
                }
            }
        })
        .state('cbLecture', {
            url: "/lecture/:lobId/:elementId",
            views: {
                "contentSection": {
                    templateUrl: "/player/contentPlayer.html",
                    controller: 'PlayElementCtrl'
                }
            }
        })
        .state('explore', {
            url: "/explore/:category/:concept",
            views: {
                "contentSection": {
                    templateUrl: "/templates/player/repositoryBrowser.html",
                    controller: 'DiscoverContentCtrl'
                }
            },
            onEnter: function() {
                $(".sideicon3").addClass("hide");
                $(".RightSideBar").addClass('Effectsidebar').css('display','none');
                $(".mid-area").addClass('Effectside');
                $(".right-search-btn").show();
                setTimeout(function() {
                    resizeDashboardGrid();
                    resizeStudentSummaryGrid();
                    resizeStudentGradebookGrid();
                    CurrentPlayer.resizeMediaPlayer();
                    IntroVideoPlayer.resize();
                }, 500);
            },
            onExit: function() {
                $(".sideicon3").removeClass("hide");
                $(".RightSideBar").removeClass('Effectsidebar').css('display','inline');;
                $(".mid-area").removeClass('Effectside');
                $(".right-search-btn").hide();
                setTimeout(function() {
                    resizeDashboardGrid();
                    resizeStudentSummaryGrid();
                    resizeStudentGradebookGrid();
                    CurrentPlayer.resizeMediaPlayer();
                    IntroVideoPlayer.resize();
                }, 500);
            }
        })
        .state('explore.play', {
            url: "/:contentId",
            views: {
                "contentSection@": {
                    templateUrl: "/player/discoverContentPlayer.html",
                    controller: 'DiscoverContentCtrl'
                }
            }
        })
        .state('cbInstructor', {
            url: "/instructor/:instructorId",
            views: {
                "contentSection": {
                    templateUrl: "/templates/web/instructor.html",
                    controller: 'InstructorCtrl'
                }
            }
        })
        .state('courseqa', {
            url: "/courseqa",
            views: {
                "contentSection": {
                    templateUrl: "/templates/interactions/listInteractions.html",
                    controller: 'CourseQAController'
                }
            }
        })
        .state('courseqa.interaction', {
            url: "/:interactionId",
            views: {
                "contentSection@": {
                    templateUrl: "/templates/interactions/viewInteraction.html",
                    controller: 'CourseQAController'
                }
            }
        })
        .state('adminqa', {
            //TODO - I didn't like this url but added this since it is creating ambiguity with admininteraction
            url: "/adminqa",
            views: {
                "contentSection": {
                    templateUrl: "/templates/interactions/listadminInteractions.html",
                    controller: 'AdminQAController'
                }
            }
        })
        .state('adminqa.interaction', {
            url: "/:interactionId",
            views: {
                "contentSection@": {
                    templateUrl: "/templates/interactions/viewInteraction.html",
                    controller: 'AdminQAController'
                }
            }
        })
        .state('coachqa', {
            //TODO - I didn't like this url but added this since it is creating ambiguity with admininteraction
            url: "/coachqa",
            views: {
                "contentSection": {
                    templateUrl: "/templates/interactions/coachInteractions.html",
                    controller: 'CoachQAController'
                }
            }
        })
        .state('coachqa.interaction', {
            url: "/:interactionId",
            views: {
                "contentSection@": {
                    templateUrl: "/templates/interactions/viewInteraction.html",
                    controller: 'CoachQAController'
                }
            }
        })
        .state('getInteractionSets', {
            url: "/interactionSets",
            views: {
                "contentSection@": {
                    templateUrl: "/templates/interactions/sets.html",
                    controller: 'ForumsListController'
                }
            }
        })
        .state('selectInteractionSet', {
            url: "/interactionSet/:setId",
            views: {
                "contentSection@": {
                    templateUrl: "/templates/interactions/setInteractions.html",
                    controller: 'ForumsListController'
                }
            }
        })
        .state('learnerSearch', {
            url: "/searchLearner/:lobId",
            views: {
                "contentSection": {
                    templateUrl: "/tutor/searchLearnerList.html",
                    controller: 'searchLearnerListCtrl'
                }
            }
        })
        .state('questionSet', {
            url: "/questionset",
            views: {
                "contentSection": {
                    templateUrl: "/assessments/listQuestionsSet.html",
                    controller: 'listQuestionSetsCtrl'
                }
            }
        })
        .state('questionSet.create', {
            url: "/create",
            views: {
                "contentSection@": {
                    templateUrl: "/assessments/createQuestionSet.html",
                    controller: 'createQuestionSetCtrl'
                }
            }
        })
        .state('questionSet.edit', {
            url: "/edit/:questionSetId",
            views: {
                "contentSection@": {
                    templateUrl: "/assessments/createQuestionSet.html",
                    controller: 'createQuestionSetCtrl'
                }
            }
        })
        .state('question', {
            url: "/question",
            views: {
                "contentSection": {
                    templateUrl: "/assessments/listQuestions.html",
                    controller: 'listQuestionCtrl'
                }
            }
        })
        .state('question.create', {
            url: "/create",
            views: {
                "contentSection@": {
                    templateUrl: "/assessments/createQuestion.html",
                    controller: 'createQuestionCtrl'
                }
            }
        })
        .state('question.edit', {
            url: "/edit/:questionId",
            views: {
                "contentSection@": {
                    templateUrl: "/assessments/createQuestion.html",
                    controller: 'createQuestionCtrl'
                }
            }
        })
        .state('questionPaper', {
            url: "/questionPaper",
            views: {
                "contentSection": {
                    templateUrl: "/assessments/listQuestionPaper.html",
                    controller: 'listQuestionPaperCtrl'
                }
            }
        })
        .state('questionPaper.create', {
            url: "/create",
            views: {
                "contentSection@": {
                    templateUrl: "/assessments/createQuestionPaper.html",
                    controller: 'createQuestionPaperCtrl'
                }
            }
        })
        .state('questionPaper.edit', {
            url: "/edit/:questionPaperId",
            views: {
                "contentSection@": {
                    templateUrl: "/assessments/createQuestionPaper.html",
                    controller: 'createQuestionPaperCtrl'
                }
            }
        })
        .state('createExam', {
            url: "/exam/create/:questionPaperId",
            views: {
                "contentSection": {
                    templateUrl: "/tutor/createExam.html",
                    controller: 'createExamCtrl'
                }
            }
        })
        .state('createExamByType', {
            url: "/exam/createbytype/:questionPaperType",
            views: {
                "contentSection": {
                    templateUrl: "/tutor/createExam.html",
                    controller: 'createExamCtrl'
                }
            }
        })
        .state('releaseExam', {
            url: "/exam/release/:laId/:parentNodeId",
            views: {
                "contentSection": {
                    templateUrl: "/tutor/createExam.html",
                    controller: 'createExamCtrl'
                }
            }
        })
        .state('tests', {
            url: "/learningactivity/:testType",
            views: {
                "contentSection": {
                    templateUrl: "/tutor/listExams.html",
                    controller: 'listExamsCtrl'
                }
            }
        })
        .state('contentSearch', {
            url: "/searchContent/:lobId",
            views: {
                "contentSection": {
                    templateUrl: "/tutor/contentSearch.html",
                    controller: 'contentSearchCtrl'
                }
            }
        })
        .state('binder', {
            url: "/binder/:binderId",
            views: {
                "contentSection": {
                    templateUrl: "/tutor/binder.html",
                    controller: 'contentSearchCtrl'
                }
            }
        })
        .state('classRoom', {
            url: "/classRooms",
            views: {
                "contentSection@": {
                    templateUrl: "/player/listClassRoom.html",
                    controller: 'listClassRoomCtrl'
                }
            }
        })
        .state('toc', {
            url: "/toc",
            views: {
                "contentSection@": {
                    templateUrl: "/player/toc.html",
                    controller: 'tocCtrl'
                }
            }
        })
        .state('myWall', {
            url: "/wall",
            views: {
                "contentSection@": {
                    templateUrl: "/templates/community/wallactivity.html",
                    controller: 'wallController'
                },
            },
            onExit: function() {
                clearInterval(communityIntervalId);
            }
        })
        .state('postActivity', {
            url: "/wall/:type/:id/:locId",
            views: {
                "contentSection@": {
                    templateUrl: "/templates/community/wallactivity.html",
                    controller: 'wallController'
                },
            },
            onExit: function() {
                clearInterval(communityIntervalId);
            }
        })
        .state('courseWall', {
            url: "/courseWall",
            views: {
                "contentSection@": {
                    templateUrl: "/templates/community/courseWall.html",
                    controller: 'courseWallController'
                }
            },
            onExit: function() {
                clearInterval(communityIntervalId);
            }
        })
        .state('communityLists', {
            url: "/myLists",
            views: {
                "contentSection@": {
                    templateUrl: "/templates/community/lists.html",
                    controller: 'communityListController'
                },
            }
        })
        .state('communityFollows', {
            url: "/community/user/:followType",
            views: {
                "contentSection@": {
                    templateUrl: "/templates/community/follow.html",
                    controller: 'communityFollowController'
                },
            }
        })
        .state('people', {
            url: "/community/people",
            views: {
                "contentSection@": {
                    templateUrl: "/templates/community/people.html",
                    controller: 'communityPeopleController'
                }
            }
        })
        .state('companyWall', {
            url: "/companyWall",
            views: {
                "contentSection@": {
                    templateUrl: "/templates/community/companyWall.html",
                    controller: 'myCompanyController'
                }
            },
            onExit: function($rootScope) {
                clearInterval(communityIntervalId);
                $rootScope.isComapanyPage = false;
            }
        })
        .state('people.profile', {
            url: "/:userId",
            views: {
                "contentSection@": {
                    templateUrl: "/templates/community/profile.html",
                    controller: 'communityPeopleController'
                },
            }
        })
        .state('notes', {
            url: "/notes",
            views: {
                "contentSection@": {
                    templateUrl: "/student/notes.html",
                    controller: 'NotesCtrl'
                }
            }
        })
        .state('note', {
            url: "/note/:noteId",
            views: {
                "contentSection@": {
                    templateUrl: "/templates/player/editNote.html",
                    controller: 'NotesCtrl'
                }
            }
        })
        .state('manageCoaching', {
            url: "/manageCoaching/:lobId",
            views: {
                "contentSection": {
                    templateUrl: "/tutor/manageCoaching.html",
                    controller: 'manageCoachingCtrl'
                }
            }
        })
        .state('coachingSession', {
            url: "/coachingSession/:sessionId",
            views: {
                "contentSection": {
                    templateUrl: "/tutor/coachingSession.html",
                    controller: 'manageCoachingCtrl'
                }
            }
        })
        .state('manageInterceptionPoints', {
            url: "/manageInterceptionPoints",
            views: {
                "contentSection": {
                    templateUrl: "/tutor/manageInterceptionPoints.html",
                    controller: 'manageInterceptionPointCtrl'
                }
            }
        })
        .state('courseIntroduction', {
            url: "/courseIntroduction",
            views: {
                "contentSection": {
                    templateUrl: "/web/courseIntroduction.html",
                    controller: 'courseIntroductionCtrl'
                }
            }
        })
        .state('coachDashboard', {
            url: "/coachDashboard",
            views: {
                "contentSection": {
                    templateUrl: "/tutor/dashboard.html",
                    controller: 'coachDashboardCtrl'
                }
            }
        })
        .state('courseGradebook', {
            url: "/courseGradebook",
            views: {
                "contentSection": {
                    templateUrl: "/tutor/gradebook.html",
                    controller: 'courseGradebookCtrl'
                }
            }
        })
        .state('studentSummary', {
            url: "/studentSummary",
            views: {
                "contentSection": {
                    templateUrl: "/student/studentSummary.html",
                    controller: 'studentSummaryCtrl'
                }
            }
        })
        .state('leaderboard', {
            url: "/leaderboard",
            views: {
                "contentSection": {
                    templateUrl: "/student/leaderboard.html",
                    controller: 'leaderboardCtrl'
                }
            }
        })
        .state('topColleges', {
            url: "/topColleges",
            views: {
                "contentSection": {
                    templateUrl: "/student/topColleges.html",
                    controller: 'topCollegesCtrl'
                }
            }
        })
        .state('topStreams', {
            url: "/topStreams",
            views: {
                "contentSection": {
                    templateUrl: "/student/topColleges.html",
                    controller: 'topStreamsCtrl'
                }
            }
        })
        .state('gradebook', {
            url: "/gradebook",
            views: {
                "contentSection": {
                    templateUrl: "/student/gradebook.html",
                    controller: 'gradebookCtrl'
                }
            }
        })
});

app.factory('RBACService', function($http) {
    return {
        actions: [],
        getActions: function() {
            return $http.get('/private/v1/getcurrentuseractions');
        },
        can: function(actionName) {
            return (this.actions.indexOf(actionName) > -1);
        },
        getHeaderCourses: function() {
            var headerCourses = [];
            if (this.can("instructor_read")) {
                $http.get('/private/v1/tutor').success(function(data) {
                    if (data.courses && data.courses.length > 0) {
                        data.courses.forEach(function(course) {
                            headerCourses.push({name: course.courseName, nodeId: course.nodeId});
                        });
                    }
                    return headerCourses;
                });
            } else if (this.can('student_read')) {
                $http.get('/private/v1/player/student/dashboard').success(function(data) {
                    data.enrolledCourses.forEach(function(course) {
                        if(course) {
                            $scope.headerCourses.push({name: course.name, nodeId: course.nodeId || course.identifier});
                        }
                    });
                    return headerCourses;
                });
            }
        }

    }
});

app.service('CourseBrowserService', function() {
    this.moduleMap = {};
    this.lessonMap = {};
    this.lectureMap = {};
    this.courseArr = [];
    this.currentItem = {};
    this.lobsWithSequence = [];
    this.toc = {};
    this.serializedTOC = [];
    this.allLobs = [];
    this.conceptsList = [];

    this.loadSyllabus = function(level0Map, level1Map, level2Map) {
        this.moduleMap = level0Map;
        this.lessonMap = level1Map;
        this.lectureMap = level2Map;
        for (k in this.moduleMap) {
            var ele = this.moduleMap[k];
            this.lobsWithSequence.push({
                'identifier': ele.id,
                'name': ele.name,
                'sequence': ele.sequence
            });
        }
        for (k in this.lessonMap) {
            var ele = this.lessonMap[k];
            this.lobsWithSequence.push({
                identifier: ele.id,
                name: ele.name,
                sequence: ele.sequence
            });
        }
    };

    this.setCourseArr = function(arr) {
        this.courseArr = arr;
    };

    this.setCurrentItem = function(item) {
        this.currentItem = item;
    };

    this.setConcepts = function(conceptTitleMap) {
        var conceptArray = [];
        var idx = 0;
        for(var key in conceptTitleMap) {
            if(conceptTitleMap[key] && null != conceptTitleMap[key]) {
                conceptArray.push({id: key, concept: conceptTitleMap[key], index: idx++});
            }
        }
        this.conceptsList = conceptArray;
    }

    this.setToc = function(toc) {
        var lectures = [];
        var lobs = [];
        var lecIndex = 0;
        var lobIndex = 0;
        lectures.push({label: '<span class="glyph20 icon icon-course"></span>&nbsp;' + toc.name, name: toc.name, id: toc.id, type: 'course', index: lecIndex++});
        lobs.push({label: '<span class="glyph20 icon icon-course"></span>&nbsp;' + toc.name, name: toc.name, id: toc.id, type: 'course', index: lobIndex++});
        toc.modules.forEach(function(module) {
            lectures.push({label: '&nbsp;&nbsp;<span class="glyph20 icon icon-moduel"></span>&nbsp;' + module.name, name: module.name, id: module.id, type: module.type, index: lecIndex++});
            lobs.push({label: '&nbsp;&nbsp;<span class="glyph20 icon icon-moduel"></span>&nbsp;' + module.name, name: module.name, id: module.id, type: module.type, index: lobIndex++});
            module.lessons.forEach(function(lesson) {
                lectures.push({label: '&nbsp;&nbsp;&emsp;<span class="glyph20 icon icon-lessons"></span>&nbsp;' + lesson.name, name: lesson.name, id: lesson.id, type: lesson.type, index: lecIndex++});
                if(['binder'].indexOf(lesson.type) == -1) {
                    lobs.push({label: '&nbsp;&nbsp;&emsp;<span class="glyph20 icon icon-lessons"></span>&nbsp;' + lesson.name, name: lesson.name, id: lesson.id, type: lesson.type, index: lobIndex++});
                }
                lesson.lectures.forEach(function(lecture) {
                    lectures.push({label: '&nbsp;&nbsp;&emsp;&emsp;<span class="glyph20 icon icon-reference"></span>&nbsp;' + lecture.name, name: lecture.name, id: lecture.id, type: lecture.type, index: lecIndex++});
                });
            });
        });
        this.serializedTOC = lectures;
        this.allLobs = lobs;
    }

    this.getElementFromMap = function(elementId) {
        var element;
        if (this.moduleMap[elementId]) {
            element = this.moduleMap[elementId];
        } else if (this.lessonMap[elementId]) {
            element = this.lessonMap[elementId];
        } else if (this.lectureMap[elementId]) {
            element = this.lectureMap[elementId];
        }
        return element;
    };

    this.fedoraPrefix = "info:fedora/";
    this.removeFedoraPrefix = function(identifier) {
        if (identifier.indexOf(this.fedoraPrefix) == 0) {
            return identifier.substring(this.fedoraPrefix.length);
        } else {
            return identifier;
        }
    };

    this.addFedoraPrefix = function(identifier) {
        if (identifier.indexOf(this.fedoraPrefix) == -1) {
            return this.fedoraPrefix + identifier;
        }
        return identifier;
    };

});

app.controller('CourseCtrl', function($scope, $http, $location, $compile, CourseBrowserService, $rootScope, $sce, $timeout, $window, $stateParams, $state, RBACService) {

    $rootScope.appConfig = undefined;

    $http.get('/v1/player/appConfig').success(function(config) {
        $rootScope.appConfig = config;
        assessmentsConfig = config; // This is required until quiz player is converted to angular
    });

    /* Show the html after the content is loaded */
    $scope.contentLoaded = false;
    $rootScope.learningElementTitle = false;
    $rootScope.actionsMetadata = null;
    $scope.loadingCourseBrowser = true;
    $rootScope.showMyCompanyLink = false;
    $rootScope.courseId = $('#courseId').val();
    $rootScope.courseAdminId = $('#communityUserId').val();
    $rootScope.loggedUserId = $('#loggedUserId').val();
    $rootScope.userName = $('.userNameText').text();
    $rootScope.loggedUserOrgId = $('#loggedUserOrgId').val();
    if($rootScope.loggedUserOrgId && $rootScope.loggedUserOrgId != 'undefined' && $rootScope.loggedUserOrgId != '') {
        $rootScope.showMyCompanyLink = true;
    }
    $scope.environment = 'Course';
    $scope.objectId = $rootScope.courseId;
    $rootScope.courseLobId = CourseBrowserService.removeFedoraPrefix($rootScope.courseId);

    $rootScope.showAskACoach = true;
    $rootScope.showAskAQuestion = true;
    if(RBACService.can('faculty_observer_read')) {
        $rootScope.showAskACoach = false;
        $rootScope.showAskAQuestion = false;
    }

    $rootScope.clearInteractionFilters = function() {
        $rootScope.interactionFilters = {
            contextSearchInput: '',
            searchQuery: '',
            selectedConcepts: undefined,
            fromDate: '',
            toDate: '',
            excludeNotAns: false,
            excludeNotRel: false,
            learningElementId: undefined,
            lessonId: undefined,
            moduleId: undefined,
            selectedContextId: undefined,
            selectedSet: undefined
        };
    }
    $rootScope.clearInteractionFilters();
    $rootScope.leftMenu = 'cb';
    $rootScope.ViewContext = 'cb';
    $rootScope.repositoryBrowserMap = undefined;

    $rootScope.getCategoryContent = function(category, stIndex, endIndex){
        var categoryContent = [];
        for (var i = stIndex; i<=endIndex && i< category.length; i++) {
            categoryContent.push(category[i]);
        }
        return categoryContent;
    }

    /** Load the TOC */
    $http.get('/private/v1/player/toc/' + encodeURIComponent($rootScope.courseId)).success(function(toc) {
        CourseBrowserService.setToc(toc);
        $rootScope.toc = toc;
    });

    $rootScope.menuSlided = false;

    $rootScope.userProfile = function(context, userId) {
        $rootScope.backToContextName = context;
        $state.go('people.profile', {
            userId: userId
        });
    }

    $rootScope.scrollTop = function() {
        $('html,body').scrollTop(0);
    }

    $rootScope.scrollTopAnimate = function() {
        $('html,body').animate({
            scrollTop: 0
        }, '500', 'swing', function() {});
    }

    $scope.courseBrowserView = function() {
        selectLeftMenuTab('courseTab');
        if ($rootScope.ViewContext != 'cb') {
            $scope.setTOCHref(CourseBrowserService.currentItem.id);
        }
    }

    $scope.backToCourseLecture = function() {
        $scope.setTOCHref(CourseBrowserService.currentItem.id);
    }

    $scope.interactionsView = function() {
        if ($rootScope.ViewContext != 'qa') {
            selectLeftMenuTab('forumsTab');
            $rootScope.clearInteractionFilters();
            $state.go('courseqa', {
                lobId: CourseBrowserService.currentItem.id
            });
            $scope.QAcourseTitle = CourseBrowserService.currentItem.name;
            $rootScope.InteractionsViewFromPie = false;
        }
    }

    $scope.admininteractionsView = function() {
        $state.go('adminqa', {});
    }

    $scope.coachQAView = function() {
        $rootScope.clearInteractionFilters();
        $state.go('coachqa', {});
        $rootScope.InteractionsViewFromPie = false;
    }

    $scope.interactionsViewFromPie = function(type) {
        var arr = $('#' + type + 'PageAskQuestion');
        if (arr && arr.length > 0) {
            setTimeout(function() {
                if ($('#writeIcon').hasClass('fa-edit')) {
                    $('#' + type + 'PageAskQuestion').click();
                }
            }, 300);
        } else {
            selectLeftMenuTab('forumsTab');
            $rootScope.clearInteractionFilters();
            $state.go(type, {});
            $scope.QAcourseTitle = CourseBrowserService.currentItem.name;
            $rootScope.InteractionsViewFromPie = true;
        }
    }

    $scope.askQuestion = function(redirectToState) {
        if ($rootScope.ViewContext != 'qa') {
            $rootScope.clearInteractionFilters();
            $state.go(redirectToState, {
                lobId: 'question'
            });
            $rootScope.ViewContext = 'qa';
        }
    }

    $scope.learnerSearchView = function() {
        if ($rootScope.ViewContext != 'ls') {
            $state.go('learnerSearch', {
                lobId: CourseBrowserService.currentItem.id
            });
        }
    }

    $scope.exploreView = function(category, concept) {
        selectLeftMenuTab('exploreTab');
        $state.go('explore', {category:category, concept: concept});
        $('.NavLeftContainer ul li').removeClass('open');
    }

    $scope.contentSearchView = function() {
        selectLeftMenuTab('coachingTab');
        if ($rootScope.ViewContext != 'cs') {
            $state.go('contentSearch', {
                lobId: CourseBrowserService.currentItem.id
            });
        }
    }

    $scope.manageCoachingView = function() {
        selectLeftMenuTab('coachingTab');
        if ($rootScope.ViewContext != 'mc') {
            $state.go('manageCoaching', {
                lobId: CourseBrowserService.currentItem.id
            });
        }
    }

    $scope.courseIntroduction = function() {
        selectLeftMenuTab('courseTab');
        if ($rootScope.ViewContext != 'ci') {
            $state.go('courseIntroduction', {});
        }
    }

    $scope.myCourses = function() {
        selectLeftMenuTab('courseTab');
        $state.go('myCourses', {});
    }

    $scope.peopleProfile = function(userId) {
        selectLeftMenuTab('courseTab');
        $state.go('peopleProfile', {userId: userId});
    }

    $scope.listQuestionSets = function() {
        selectLeftMenuTab('courseTab');
        $state.go('questionSet', {});
    }

    $scope.listQuestions = function() {
        selectLeftMenuTab('courseTab');
        $state.go('question', {});
    }

    $scope.listQuestionPapers = function() {
        selectLeftMenuTab('courseTab');
        $state.go('questionPaper', {});
    }

    $scope.coachDashboard = function() {
        selectLeftMenuTab('courseTab');
        $state.go('coachDashboard', {});
    }

    $scope.courseGradebook = function() {
        selectLeftMenuTab('courseTab');
        $state.go('courseGradebook', {});
    }

    $scope.studentSummary = function() {
        selectLeftMenuTab('courseTab');
        $state.go('studentSummary', {});
    }

    $scope.leaderboard = function() {
        selectLeftMenuTab('courseTab');
        $state.go('leaderboard', {});
    }

    $scope.gradebook = function() {
        selectLeftMenuTab('courseTab');
        $state.go('gradebook', {});
    }

    $scope.createQuestionPaper = function() {
        $state.go('questionPaper.create', {});
    }

    $scope.listExams = function() {
        selectLeftMenuTab('coachingTab');
        $state.go('tests', {
            testType: "Exam"
        });
    }

    $scope.listPracticeTests = function() {
        selectLeftMenuTab('coachingTab');
        $state.go('tests', {
            testType: "practice"
        });
    }

    $scope.manageInterceptionPoints = function() {
        selectLeftMenuTab('coachingTab');
        $state.go('manageInterceptionPoints', {});
    }

    $scope.classRoomView = function() {
        selectLeftMenuTab('coachingTab');
        $state.go('classRoom', {});
    }

    $scope.tocView = function() {
        selectLeftMenuTab('courseTab');
        $state.go('toc', {});
    }

    $scope.notesView = function() {
        selectLeftMenuTab('courseTab');
        $state.go('notes', {});
    }

    $scope.notesViewFromPie = function() {
        var arr = $('#notePageCreateNoteBtn');
        if (arr && arr.length > 0) {
            setTimeout(function() {
                if ($('.createNote').hasClass('fa-edit')) {
                    $('#notePageCreateNoteBtn').click();
                }
            }, 300);
        } else {
            console.log('note button not found');
            selectLeftMenuTab('courseTab');
            $state.go('notes', {});
            $rootScope.NotesViewFromPie = true;
        }
    }

    $scope.renderHtml = function(htmlCode, append) {
        if (append) {
            htmlCode = append + htmlCode;
        }
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.renderHtmlTrim = function(htmlCode, length) {
        if (htmlCode) {
            var subtxt = htmlCode.substring(0, length);
            if (htmlCode.length > length) {
                subtxt = subtxt + '...';
            }
            var txt = $sce.trustAsHtml(subtxt);
            return txt;
        }
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.$on('playElementEvent', function(event, args) {
        var currentItem = $scope.currentItem;
        if (!currentItem || currentItem.id != args.elementId) {
            $scope.selectTOCElement(args.elementId);
        }
    });

    $scope.$on('addElementEvent', function(event, args) {
        $http.get('/private/v1/player/course/' + encodeURIComponent($rootScope.courseId)).success(function(course) {
            $scope.course = course;
            CourseBrowserService.loadSyllabus(course.moduleMap, course.lessonMap, course.lectureMap);
            $scope.setLists();
            var elementId = $scope.currentItem.id;
            if (args.goLevel) {
                $scope.selectTOCElement(elementId, args.goLevel);
            } else {
                $scope.selectTOCElement(elementId, $scope.level);
            }
        });
    });

    $scope.$on('removeElementEvent', function(event, args) {
        var elementId = args.elementId;
        $http.get('/private/v1/player/course/' + encodeURIComponent($rootScope.courseId)).success(function(course) {
            $scope.course = course;
            CourseBrowserService.loadSyllabus(course.moduleMap, course.lessonMap, course.lectureMap);
            $scope.setLists();
            if (elementId == $scope.currentItem.id) {
                var element = CourseBrowserService.getElementFromMap(elementId);
                var parent = CourseBrowserService.getElementFromMap(element.parentId);
                var currentItem = {};
                currentItem.id = parent.id;
                currentItem.type = parent.type;
                currentItem.level = parent.level;
                currentItem.parentId = parent.parentId;
                CourseBrowserService.setCurrentItem(currentItem);
                $scope.currentItem = CourseBrowserService.currentItem;
                elementId = parent.id;
            }
            $scope.selectTOCElement(elementId, $scope.level);
        });
    });

    $scope.loadSyllabus = function() {
        $http.get('/private/v1/course/fetchConceptTitleMap/' + encodeURIComponent($rootScope.courseId)).success(function(data) {
            $rootScope.conceptTitleMap = data;
            CourseBrowserService.setConcepts(data);
        });
        $rootScope.showDiscover = false;
        $rootScope.selectedCategory = null;
        selectLeftMenuTab('courseTab');
        $http.get('/private/v1/player/course/' + encodeURIComponent($rootScope.courseId)).success(function(course) {
            $scope.loadingCourseBrowser = false;
            $scope.course = course;
            $scope.courseName = course.name;
            $scope.courseTitle = course.name;
            // $scope.headerCourses = [];
            $rootScope.myCoach = course.tutor;
            $rootScope.community = course.community;
            CourseBrowserService.loadSyllabus(course.moduleMap, course.lessonMap, course.lectureMap);
            $http.get('/private/v1/player/getCurrentElementId/' + encodeURIComponent($rootScope.courseId)).success(function(elementId) {
                if (elementId) {
                    currentElementId = elementId;
                } else {
                    for (var id in CourseBrowserService.lectureMap) {
                        currentElementId = id;
                        break;
                    }
                }
                var currentElement = CourseBrowserService.getElementFromMap(currentElementId);
                var currentItem = {};
                currentItem.id = currentElement.id;
                CourseBrowserService.setCurrentItem(currentItem);
                $scope.setLists();
                var reqPath = $location.path();
                $scope.checkRequestPath(reqPath);
            });
        });

        if(!$rootScope.headerCourses || $rootScope.headerCourses.length == 0) {
            $rootScope.headerCourses = [];
            if (RBACService.can("instructor_read")) {
                $http.get('/private/v1/tutor').success(function(data) {
                    if (data.courses && data.courses.length > 0) {
                        data.courses.forEach(function(course) {
                            $rootScope.headerCourses.push({name: course.courseName, nodeId: course.nodeId});
                        });
                    }
                });
            } else if (RBACService.can('student_read')) {
                $http.get('/private/v1/player/student/dashboard').success(function(data) {
                    data.enrolledCourses.forEach(function(course) {
                        if(course) {
                            $rootScope.headerCourses.push({name: course.name, nodeId: course.nodeId || course.course_id});
                        }
                    });
                });
            }
        }
    };

    $scope.showCoursePage = function(courseId) {
        navigateTo('/private/player/course/', courseId);
    };

    $scope.playCurrentElement = function() {
        var currentElementId;
        var currentElement
        if ($stateParams.elementId) {
            currentElementId = $stateParams.elementId;
        } else if ($stateParams.lobId) {
            currentElementId = $stateParams.lobId;
        }
        if (currentElementId) {
            currentElement = CourseBrowserService.getElementFromMap(currentElementId);
        }
        if (currentElementId && currentElement) {
            loadCurrentElement(currentElement, currentElementId, $scope, $state);
        } else {
            $http.get('/private/v1/player/getCurrentElementId/' + encodeURIComponent($rootScope.courseId)).success(function(elementId) {
                if (elementId) {
                    currentElementId = elementId;
                } else {
                    for (var id in CourseBrowserService.moduleMap) {
                        currentElementId = id;
                        break;
                    }
                }
                var currentElement = CourseBrowserService.getElementFromMap(currentElementId);
                loadCurrentElement(currentElement, currentElementId, $scope, $state);
                $timeout(function() {
                    $('.content-loaded').show();
                }, 100);
            });
        }
        $scope.contentLoaded = true;
    }

    $scope.showLectureView = function() {
        //navigateTo('/private/player/course/', $rootScope.courseId);
        $state.go('cb', {
            lobId: CourseBrowserService.currentItem.id
        });
    }

    $scope.setLists = function() {
        var modules = [];
        var prevId = '';
        for (var moduleId in CourseBrowserService.moduleMap) {
            modules.push(CourseBrowserService.moduleMap[moduleId]);
        }
        $scope.modules = modules;

        var lessons = [];
        for (var lessonId in CourseBrowserService.lessonMap) {
            var lesson = CourseBrowserService.lessonMap[lessonId];
            if (lesson.category && prevId) {
                CourseBrowserService.lessonMap[prevId].isLast = true;
            }
            lessons.push(lesson);
            prevId = lessonId;
        }
        $scope.lessons = lessons;

        var lectures = [];
        prevId = '';
        for (var lectureId in CourseBrowserService.lectureMap) {
            var lecture = CourseBrowserService.lectureMap[lectureId];
            if (lecture.category && !CourseBrowserService.lectureMap[prevId].category) {
                CourseBrowserService.lectureMap[prevId].isLast = true;
            }
            lectures.push(lecture);
            prevId = lectureId;
        }
        $scope.lectures = lectures;

        setTimeout(function() {
            $(".knob").knob({
                width: 35,
                height: 35,
                thickness: 0.15
            });
            $(".knob").css("margin-top", "-33px").css("margin-left", "7.5px");
        }, 500);
    }

    $scope.setTOCHref = function(lobId) {
        $scope.selectTOCElement(lobId);
        if (CourseBrowserService.currentItem.type == 'lesson' || CourseBrowserService.currentItem.type == 'module' || CourseBrowserService.currentItem.type == 'binder') {
            $state.go('cb', {
                lobId: lobId
            });
        } else {
            $state.go('cbLecture', {
                lobId: CourseBrowserService.currentItem.parentId,
                elementId: lobId
            });
        }
    }

    $rootScope.showNavigationLink = true;
    $scope.goToLecture = function(lobId, parentId) {
        if (parentId == undefined) {
            $state.go('cb', {
                lobId: CourseBrowserService.removeFedoraPrefix(lobId)
            });
        } else {
            $state.go('cbLecture', {
                lobId: CourseBrowserService.removeFedoraPrefix(parentId),
                elementId: CourseBrowserService.removeFedoraPrefix(lobId)
            });
        }

    };

    $scope.setActiveItem = function(item, currentItem) {
        var currentElement = "info:fedora/" + currentItem.identifier;
        var activeClass = "round-null";
        if (item.identifier == currentElement) {
            activeClass = "round-still";
        } else {
            if (item.state) {
                if (item.state == 1) {
                    activeClass = "round-half";
                } else if (item.state == 2) {
                    activeClass = "round-full";
                }
            }
        }
        return activeClass;
    };

    $scope.selectTOCElement = function(elementId, level) {
        var element;
        if (CourseBrowserService.moduleMap[elementId]) {
            element = CourseBrowserService.moduleMap[elementId];
        } else if (CourseBrowserService.lessonMap[elementId]) {
            element = CourseBrowserService.lessonMap[elementId];
        } else if (CourseBrowserService.lectureMap[elementId]) {
            element = CourseBrowserService.lectureMap[elementId];
        }
        if (element) {
            if (!level) {
                level = element.level;
            }
            $scope.tocParentId = '';
            var currentItem = {};
            currentItem.id = element.id;
            var categoriesArray = ['drilldown', 'explore', 'recommendedcontent', 'tutorials', '101', 'challenge', 'references'];
            $scope.selectedContentCategory = "";
            if (element.category) {
                var selectedContentCategory = element.category.toLowerCase().replace(/ /g, '');
                if (categoriesArray.indexOf(selectedContentCategory) > -1) {
                    $scope.selectedContentCategory = selectedContentCategory;
                }
            }
            currentItem.name = element.name;
            currentItem.type = element.type;
            currentItem.level = element.level;
            currentItem.parentId = element.parentId;
            currentItem.parent = CourseBrowserService.currentItem.parent;
            CourseBrowserService.setCurrentItem(currentItem);
            $scope.currentItem = CourseBrowserService.currentItem;
            $http.post('/private/v1/player/setCurrentElementId/' + encodeURIComponent($rootScope.courseId) + "/" + encodeURIComponent(elementId)).success(function() {});
        }
    };

    $scope.setParentElement = function(level) {
        if (level > 0) {
            var currentItem = CourseBrowserService.currentItem;
            if (currentItem && currentItem.id && currentItem.id != '') {
                var parentLevel = currentItem.level - 1;
                var parentId = currentItem.parentId;
                if (currentItem.level < level) {
                    parentId = currentItem.id;
                    parentLevel = currentItem.level;
                }
                var parent = $scope.getElement(parentId, parentLevel);
                if (parent && parent.level > (level - 1)) {
                    parent = $scope.getElement(parent.parentId, parent.level - 1);
                }
                CourseBrowserService.currentItem.parent = parent;
            }
        } else {
            CourseBrowserService.currentItem.parent = {};
        }
    };

    $scope.focusCurrentElement = function(level) {
        var currentItem = CourseBrowserService.currentItem;
        if (currentItem && currentItem.id && currentItem.id != '') {
            var currLevel = currentItem.level;
            if (currLevel >= level) {
                var activeElement = $('div.unitActive');
                if (activeElement && activeElement.length > 0 && activeElement[0]) {
                    activeElement[0].scrollIntoView(true);
                }
            }
        }
    };

    $scope.getTOCArray = function(level) {
        var currentItem = CourseBrowserService.currentItem;
        var module;
        var lesson;
        var lecture;
        var currId;
        var currLevel = -1;
        if (currentItem && currentItem.id && currentItem.id != '') {
            currLevel = currentItem.level;
            currId = currentItem.id;
            if (currLevel == 0) {
                module = $scope.getElement(currId, 0);
            } else if (currLevel == 1) {
                lesson = $scope.getElement(currId, 1);
                module = $scope.getElement(lesson.parentId, 0);
            } else if (currLevel == 2) {
                lecture = $scope.getElement(currId, 2);
                lesson = $scope.getElement(lecture.parentId, 1);
                module = $scope.getElement(lesson.parentId, 0);
            }
        }
        if (typeof module == 'undefined' || !module) {
            for (var id in CourseBrowserService.moduleMap) {
                module = CourseBrowserService.moduleMap[id];
                break;
            }
        }
        if (level > 0 && (typeof lesson == 'undefined' || !lesson)) {
            var lessonId = module.sequence[0];
            lesson = $scope.getElement(lessonId, 1);
        }
        if (level > 1 && (typeof lecture == 'undefined' || !lecture)) {
            var lectureId = lesson.sequence[0];
            lecture = $scope.getElement(lectureId, 2);
        }
        $scope.selectedModule = module.id;
        if (lesson) {
            $scope.selectedLesson = lesson.id;
        }
        var courseArr = [];
        if (level == 0) {
            for (var moduleId in CourseBrowserService.moduleMap) {
                var moduleEle = CourseBrowserService.moduleMap[moduleId];
                if (currLevel > 0 && moduleId == module.id) {
                    $scope.tocParentId = moduleId;
                    break;
                }
            }
        } else if (level == 1) {
            var lessons = $scope.getChildren(module.id, 0);
            if (lessons && lessons.length > 0) {
                for (var i = 0; i < lessons.length; i++) {
                    var lessonEle = lessons[i];
                    if (currLevel > 1 && lessonEle.id == lesson.id) {
                        $scope.tocParentId = lessonEle.id;
                        break;
                    }
                }
            }
        }
        return courseArr;
    };

    $scope.selectFirstElement = function(level, module, lesson, lecture) {
        var element;
        if (level == 0) {
            element = module;
        } else if (level == 1) {
            element = lesson;
        } else if (level == 2) {
            element = lecture;
        }
        if (typeof element != 'undefined' && element) {
            if (element.type == 'lesson' || element.type == 'module') {
                $location.path('/browser/' + element.id);
            } else {
                $location.path('/play/' + element.parentId + '/' + element.id);
            }
            $scope.selectTOCElement(element.id);
        }
    };

    $scope.getElement = function(id, level) {
        var element;
        if (level == 0) {
            element = CourseBrowserService.moduleMap[id];
        } else if (level == 1) {
            element = CourseBrowserService.lessonMap[id];
        } else if (level == 2) {
            element = CourseBrowserService.lectureMap[id];
        }
        return element;
    };

    $scope.getChildren = function(id, level) {
        var element = $scope.getElement(id, level);
        var children = [];
        if (element) {
            if (element.sequence && element.sequence.length > 0) {
                for (var i = 0; i < element.sequence.length; i++) {
                    var child = $scope.getElement(element.sequence[i], level + 1);
                    if (child) {
                        children.push(child);
                    }
                }
            }
        }
        return children;
    };

    $scope.tocElementMouseOver = function(event) {
        $(event.currentTarget).find('.deleteGroup').removeClass('hide');
    }

    $scope.tocElementMouseLeave = function(event) {
        $(event.currentTarget).find('.deleteGroup').addClass('hide');
    }

    $scope.checkRequestPath = function(reqPath) {
        //console.log('Redirecting to...', reqPath);
        if (reqPath && reqPath != '') {
            $location.path(reqPath);
        } else {
            $scope.playCurrentElement();
        }
    }

    $scope.goToState = function(reqPath, stateName, stateParamArr, tabName, $state) {
        var params = reqPath.split('/');
        if (params.length == (stateParamArr.length + 1)) {
            var stateParams = {};
            for (var i = 0; i < stateParamArr.length; i++) {
                stateParams[stateParamArr[i]] = params[i + 1];
            }
            selectLeftMenuTab(tabName);
            $state.go(stateName, stateParams);
        } else {
            $scope.playCurrentElement();
        }
    }

    RBACService.getActions().success(function(actions) {
        RBACService.actions = actions;
        $scope.loadSyllabus();
    });

    setTimeout(function() {
        $(window).scroll(function() {
            var st = $(window).scrollTop();
            if (st >= 100) {
                $('#cbHeaderTitle').removeClass('hide');
                $('#cbCourseTitle').addClass('hide');
            } else {
                $('#cbHeaderTitle').addClass('hide');
                $('#cbCourseTitle').removeClass('hide');
            }
        });
    }, 100);

    $scope.contextSearchInput = '';
    $scope.$on('updateInput', function(event, args) {
        $scope.contextSearchInput = args.name;
        $scope.lsContextSearchInput = args.name;
    });

    $scope.getProgrammingURL = function(mediaUrl, responseElement) {
        var reqParams = {
            "mediaUrl": mediaUrl,
            "resourceId": responseElement.identifier,
            "resourceName": responseElement.name,
            "codeName": responseElement.metadata.codeName
        };
        $http.post('/private/v1/player/getProgrammingURL/', {
            params: reqParams
        }).success(function(url) {
            $window.open(url);
        });
    }

    
    $rootScope.showConformationMessage = function(className, message){
        var closeBtm = '<button type="button" class="close" id="conformMsgCloseBtn">&times;</button>';
        $('#conformMessage').removeClass('alert-success alert-danger');
        $('#conformMessage').html(closeBtm + message).removeClass('hide').addClass(className);
        window.setTimeout(function(){
            $('#conformMessage').html('').addClass('hide').removeClass(className);
        },5000);
        $('#conformMsgCloseBtn').click(function(){
           $('#conformMessage').html('').addClass('hide').removeClass(className);
        });
    }

});

function loadCurrentElement(currentElement, currentElementId, $scope, $state) {
    $scope.selectTOCElement(currentElementId);
    if (currentElement.type == 'module' || currentElement.type == 'lesson' || currentElement.type == 'binder') {
        $state.go('cb', {
            lobId: currentElementId
        });
    } else {
        $state.go('cbLecture', {
            lobId: currentElement.parentId,
            elementId: currentElementId
        });
    }
}

app.controller('CourseBrowserCtrl', function($scope, $stateParams, $http, $location, $compile, $timeout, $rootScope, CourseBrowserService) {

    $rootScope.ViewContext = 'cb';
    $rootScope.leftMenu = 'cb';
    $rootScope.showConceptButtons = true;
    $scope.showAtAGlance = false;

    $scope.canShowAtAGlance = function() {
        if ($scope.currentObject.lobs_count && $scope.currentObject.lobs_count.length > 0) $scope.showAtAGlance = true;
        if ($scope.currentObject.elements_count && $scope.currentObject.elements_count.length > 0) $scope.showAtAGlance = true;
        if ($scope.currentObject.learningTime) $scope.showAtAGlance = true;
        if ($scope.addlMaterialCnt) $scope.showAtAGlance = true;
    }

    var lobId = $stateParams.lobId;
    $scope.environment = 'Course';
    $scope.objectId = lobId;

    $scope.getLOB = function(lobId) {
        $http.get('/private/v1/player/lob/' + encodeURIComponent($rootScope.courseLobId) + '/' + encodeURIComponent(lobId)).success(function(lob) {
            $scope.currentObject = lob;
            $rootScope.learningElementTitle = lob.name;
            if (lob.addedbyme && lob.addedbyme.length > 0) {
                $scope.currentObject.addedbymeList = [];
                lob.addedbyme.forEach(function(addedByMe) {
                    $scope.currentObject.addedbymeList.push(addedByMe.identifier);
                });
            }
            $scope.relatedMaterial = false;
            $scope.updateTOC(lobId);
            $scope.canShowAtAGlance();
            $http.get('/private/v1/player/getLOBSupplementaryContent/' + encodeURIComponent($rootScope.courseLobId) + '/' + encodeURIComponent(lobId)).success(function(data) {
                if (data && data.categories && data.categories.length > 0) {
                    $scope.canShowAtAGlance();
                    $scope.addlMaterialCnt = data.total;
                    data.categories.forEach(function(category) {
                        if (category.content && category.content.length > 0) {
                            category.content.forEach(function(content) {
                                if (content.isAdded) {
                                    content.addedIn = null;
                                    var lobName = null;
                                    CourseBrowserService.lobsWithSequence.forEach(function(ele) {
                                        if (ele.sequence && ele.sequence.indexOf(content.contentId) > -1) {
                                            lobName = {
                                                'identifier': ele.identifier,
                                                'name': ele.name
                                            };
                                        }
                                    });
                                    content.addedIn = lobName;
                                    if (content.addedIn && content.addedIn.identifier == lob.identifier) {
                                        content.parentBookmarked = false;
                                    } else {
                                        content.parentBookmarked = true;
                                    }
                                } else {
                                    content.parentBookmarked = true;
                                }
                            });
                        }
                    });

                    $scope.currentObject.categories = data.categories;
                    $scope.relatedMaterial = true;
                } else {
                    $scope.relatedMaterial = false;
                }
            });
            setTimeout(function() {
                $scope.adjustDescriptionImageWidths();
                loadElementTags();
            }, 500);
        });
        setTimeout(function() {
            $('.addmeterialpopover').popover({
                placement: 'top',
                trigger: 'hover',
                container: 'body',
                html: 'true'
            });
        }, 1000);
    };

    $scope.adjustDescriptionImageWidths = function() {
        var w = $('#lobPlayerSection').width();
        var gw = $('#glanceDiv').width();
        $('#lobDescription img').each(function(obj) {
            var iw = $(this).width();
            if (iw > (w - gw - 100)) {
                $(this).width(w - gw - 100);
            }
        });
    };

    $scope.toggleSubChildren = function(childId) {
        if ($scope.expandChild && $scope.expandChild == childId) {
            $scope.expandChild = '0';
        } else {
            $scope.expandChild = childId;
        }
    };

    $scope.updateTOC = function(elementId) {
        var args = {};
        args.elementId = elementId;
        $scope.$emit('playElementEvent', args);
    };

    if (lobId && lobId != '') {
        $scope.getLOB(lobId);
    }

    $scope.getAdditionalMaterial = function(lobId, category) {
        category.showCategory = true;
        $http.get('/private/v1/player/getAdditionalMaterial/' + encodeURIComponent($rootScope.courseLobId) + "/" + encodeURIComponent(lobId) + "/" + encodeURIComponent(category.category)).success(function(data) {
            if (data && data.length > 0) {
                category.showCategory = true;
                category.content = data;
                $scope.relatedMaterial = true;
                $scope.addlMaterialCnt = $scope.addlMaterialCnt + data.length;
            } else {
                category.showCategory = false;
            }
        });
    };

    $scope.addAdditionalMaterial = function(lobId, category, content) {
        addAdditionalMaterialCall(lobId, category, content, $scope.currentObject, $scope, $http);
    };

    $scope.removeAdditionalMaterial = function(lobId, content) {
        removeAdditionalMaterialCall(lobId, content, $scope.currentObject, $scope, $http);
    };

    $scope.addToStudentPath = function(lobId, category, content) {
        var contentId = content.identifier;
        if (contentId.indexOf('info:fedora/') == 0) {
            contentId = contentId.substring('info:fedora/'.length);
        }
        $http.get('/private/v1/player/addAdditionalMaterial/' + encodeURIComponent($rootScope.courseLobId) + '/' + encodeURIComponent(category) + "/" + encodeURIComponent(lobId) + "/" + encodeURIComponent(contentId)).success(function(data) {
            content.addedToPath = true;
            if (data) {
                if (data.status == 'error') {
                    alert(data.errorMsg);
                } else {
                    $scope.currentObject.children.push(data);
                    var args = {};
                    $scope.$emit('addElementEvent', args);
                }
            }
        });
    };

    $scope.focusDiv = function(divId) {
        $('#' + divId).attr('tabindex', -1).focus();
    };

    function setIntroVideo(course) {
        if (course.introduction) {
            var videoId = 'course_intro_video';
            var videoType = course.introduction.videoMimeType;
            var url = course.introduction.videoURL;
            if (videoType == 'youtube') {
                videojs(videoId, {
                    "techOrder": ["youtube"],
                    "src": url,
                    "ytcontrols": true
                });
            } else {
                videojs(videoId).src({
                    type: videoType,
                    src: url
                });
            }
        }
    }

    $scope.watermark = function(wmtext) {
        $("#noteTitle").Watermark(wmtext);
    }
});

function addAdditionalMaterialCall(lobId, category, content, currentObject, $scope, $http) {
    content.isAdded = true;
    if (currentObject.addedbyme_count) currentObject.addedbyme_count.total += 1;
    content.addedIn = {
        'identifier': currentObject.identifier,
        'name': currentObject.name
    };
    setTimeout(function() {
        $('.addmeterialpopover').popover({
            placement: 'top',
            trigger: 'hover',
            container: 'body',
            html: 'true'
        });
    }, 200);
    $http.get('/private/v1/player/addAdditionalMaterial/' + encodeURIComponent($scope.$root.courseLobId) + '/' + encodeURIComponent(category) + "/" + encodeURIComponent(lobId) + "/" + encodeURIComponent(content.contentId)).success(function(data) {
        content.isAdded = true;

        if (data) {
            if (data.status == 'error') {
                alert(data.errorMsg);
            } else {
                if (currentObject && currentObject.addedbyme) {
                    currentObject.addedbyme.push(data);
                }
                var args = {};
                if (currentObject.lobType == "module") {
                    args.goLevel = 1;
                } else if (currentObject.lobType == "lesson") {
                    args.goLevel = 2;
                }
                $scope.$emit('addElementEvent', args);
            }
        }
    });
};

function removeAdditionalMaterialCall(lobId, content, currentObject, $scope, $http) {
    content.isAdded = false;
    if (currentObject.addedbyme_count) currentObject.addedbyme_count.total -= 1;
    content.addedIn = null;
    $http.get('/private/v1/player/removeAdditionalMaterial/' + encodeURIComponent($scope.$root.courseLobId) + '/' + encodeURIComponent(lobId) + "/" + encodeURIComponent(content.identifier)).success(function(data) {
        if (data) {
            if (data.status == 'error') {
                alert(data.errorMsg);
            } else {
                content.isAdded = false;
                if (currentObject.addedbyme && currentObject.addedbyme.length > 0) {
                    currentObject.addedbyme.forEach(function(element) {
                        if (element.identifier == content.identifier)
                            currentObject.addedbyme.splice(currentObject.addedbyme.indexOf(element), 1);
                    });
                }
                currentObject.categories.forEach(function(category) {
                    category.content.forEach(function(categoryContent) {
                        if (content.identifier == categoryContent.contentId) {
                            categoryContent.isAdded = false;
                        }
                    });
                });
                var args = {};
                args.elementId = content.identifier;
                $scope.$emit('removeElementEvent', args);
            }
        }
    });
};

app.directive('ilStudentGradeCard', function($http) {
    return {
        restrict: 'A',
        scope: {
            studentId: '=',
            courseId: '=',
            context: '='
        },
        templateUrl: '/templates/player/studentGradeCard.html',
        link: function(scope, element, attrs) {
            console.log('get grade card: ' + scope.studentId + ' - ' + scope.courseId);
            $http.get('/private/v1/student/gradecard/' + encodeURIComponent(scope.courseId) + '/' + encodeURIComponent(scope.studentId)).success(function(response) {
                scope.totalCount = response.totalCount;
                scope.completeCount = response.completeCount;
                scope.grade = response.grade;
                scope.student = response.student;
                scope.topStudent = response.topStudent;
            });
        }
    };
});