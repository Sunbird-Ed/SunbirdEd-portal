app.controller('SidebarController', ['$scope', '$http', '$timeout', '$rootScope', 'InteractionService', 'CommunityService', 'CourseBrowserService', '$state', '$window', '$q', function($scope, $http, $timeout, $rootScope, intService, commService, cbService, $state, $window, $q) {

    $rootScope.recentNotifications = [];
    $rootScope.recentDiscussions = [];
    $rootScope.recentNotes = [];
    $rootScope.upcomingEvents = [];

    $scope.error = function(err) {
        console.log('Error:', err);
    }

    $scope.getRecentNotifications = function() {

    	var notifArray = [];
        commService.getMajorInbox({count: 2}, $rootScope.loggedUserId)
        .then(function(data) {
            if(data && data.totalItems > 0) {
            	data.items.forEach(function(item) {
            		item.notificationType = 'activityStream';
            		notifArray.push(item);
            	});
            }
            if($rootScope.courseAdminId) {
            	return commService.getMajorInbox({count: 2}, $rootScope.courseAdminId);
            } else {
            	var deferred = $q.defer();
            	deferred.resolve(null);
            	return deferred.promise;
            }
        })
        .then(function(data) {
            if(data && data.totalItems > 0) {
            	data.items.forEach(function(item) {
                    if(item.object.objectType == 'announcement') {
                        item.notificationType = 'courseWall';
                        notifArray.push(item);
                    }
            	});
            }
            if($rootScope.loggedUserOrgId && $rootScope.loggedUserOrgId != 'undefined') {
            	return commService.getMajorInbox({count: 2}, $rootScope.loggedUserOrgId);
            } else {
            	var deferred = $q.defer();
            	deferred.resolve(null);
            	return deferred.promise;
            }
        }).then(function(data) {
            if(data && data.totalItems > 0) {
            	data.items.forEach(function(item) {
                    if(item.object.objectType == 'announcement') {
                        item.notificationType = 'companyWall';
                        notifArray.push(item);
                    }
            	});
            }
            if(notifArray.length > 2) {
            	notifArray.sort(function(a, b){
        			return new Date(a['published']) < new Date(b['published']);
    			});
    			$rootScope.recentNotifications = notifArray.splice(0, 2);
            } else {
            	$rootScope.recentNotifications = notifArray;
            }
        }).catch($scope.error);
    }

    $scope.getRecentDiscussions = function(currentElementId) {
        var metadata = {
            type: 'interaction',
            interactionType: 'QA'
        };
        if (currentElementId) {
            metadata['learningElementId'] = cbService.addFedoraPrefix(currentElementId);
        }
        var args = {
            courseId: $rootScope.courseId,
            metadata: metadata,
            limit: 2,
            offset: 0
        }
        intService.searchInteractions(args).then(function(response) {
            $rootScope.recentDiscussions = response;
        }).catch($scope.error);
    }

    $scope.getRecentNotes = function(currentElementId) {
        $rootScope.recentNotes = [];
        var url = '';
        if ($rootScope.lectureView && currentElementId) {
            url = '/private/v1/getNotesList/' + encodeURIComponent($rootScope.courseId) + '/' + encodeURIComponent(currentElementId) + '/0';
        } else {
            url = '/private/v1/getNotesList/' + encodeURIComponent($rootScope.courseId) + '/0';
        }
        $http.get(url).success(function(data) {
            $rootScope.recentNotes = data.noteList;
        });
    }

    $scope.getUpcomingEvents = function() {
        $http.get('/private/v1/player/student/upcomingEvents/' + encodeURIComponent($rootScope.courseId)).success(function(data) {
            $rootScope.upcomingEvents = data;
        });
    }

    $scope.getCourseSummary = function() {
        $http.get('/private/v1/player/student/courseSummary/' + encodeURIComponent($rootScope.courseId)).success(function(data) {
            $rootScope.courseSummary = data;
        });
    }

    $scope.playLecture = function(elementId) {
        selectLeftMenuTab('courseTab');
        $state.go('cb', {
            lobId: cbService.removeFedoraPrefix(elementId)
        });
    }

    $scope.notesDetailView = function(noteId) {
        selectLeftMenuTab('courseTab');
        $state.go('note', {
            noteId: noteId
        });
    }

    $scope.showLeaderboard = function() {
        selectLeftMenuTab('courseTab');
        $state.go('leaderboard', {});
    }

    $scope.showTopColleges = function() {
        selectLeftMenuTab('courseTab');
        $state.go('topColleges', {});
    }

    $scope.showTopStreams = function() {
        selectLeftMenuTab('courseTab');
        $state.go('topStreams', {});
    }

    $scope.getLeaderBoards = function() {
        $http.post('/private/v1/student/leaderboards/' + encodeURIComponent($rootScope.courseId)).success(function(resp) {
            if (resp && resp.responseValueObjects && resp.responseValueObjects.COURSE_ID) {
                $scope.leaderboard = {};
                $scope.leaderboard.courseId = resp.responseValueObjects.COURSE_ID.id;
                $scope.leaderboard.students = resp.responseValueObjects.STUDENT_INFO_LIST.valueObjectList;
                $scope.leaderboard.colleges = resp.responseValueObjects.COLLEGES.valueObjectList;
                $scope.leaderboard.streams = resp.responseValueObjects.STREAMS.valueObjectList;
                $scope.leaderboard.count = resp.responseValueObjects.COUNT.id;
            }
        });
    }

    $rootScope.$on('getRecentData', function(event, args) {
        var path = args.path;
        $rootScope.recentNotifications = [];
        $rootScope.recentDiscussions = [];
        $rootScope.recentNotes = [];
        $rootScope.upcomingEvents = [];
        $rootScope.courseSummary = [];
        $scope.leaderboard = {};

        setTimeout(function() {
            var currentElementId = undefined;
            if (path.indexOf('/myCourses') == 0 || path.indexOf('/gradebook') == 0 || path.indexOf('/studentSummary') == 0) {
                $scope.getLeaderBoards();
            } else {
                if (path.indexOf('/toc') == 0 || path.indexOf('/courseIntroduction') == 0) {
                    $scope.getCourseSummary();
                } else {
                    if (path.indexOf('/browser') == 0 || path.indexOf('/lecture') == 0) {
                        currentElementId = cbService.currentItem.id;
                    }
                    $scope.getRecentNotifications();
                    if (!path.indexOf('/notes') == 0) $scope.getRecentNotes(currentElementId);
                    if (!path.indexOf('/courseqa') == 0) $scope.getRecentDiscussions(currentElementId);
                }
                $scope.getUpcomingEvents();
            }
        }, 500);

    });

    $scope.goToObject = function(type, context, createdUser) {

        if (context.courseId == $rootScope.courseId) {
            var element = cbService.getElementFromMap(cbService.removeFedoraPrefix(context.objectId));
            if (createdUser == $('#loggedUserId').val()) {
                if (type == 'coachingSession') {
                    $state.go('coachingSession', {
                        sessionId: encodeURIComponent(context.objectId)
                    });
                } else if (type == 'binder') {
                    $state.go('binder', {
                        binderId: encodeURIComponent(context.objectId)
                    });
                } else if (type == 'practiceTest' || type == 'Exam') {
                    $state.go('releaseExam', {
                        laId: cbService.removeFedoraPrefix(context.objectId)
                    });
                }
            } else {
                if (type == 'binder' || type == 'practiceTest' || type == 'Exam' || !element || null == element) {
                    $state.go('cb', {
                        lobId: cbService.removeFedoraPrefix(context.objectId)
                    });
                } else {
                    $state.go('cbLecture', {
                        elementId: element.id,
                        lobId: element.parentId
                    });
                }
            }
        } else {
            var url = '/private/player/course/' + encodeURIComponent(context.courseId) + '#/browser/' + cbService.removeFedoraPrefix(context.objectId);
            console.log('Redirecting to different course. URL - ', url);
            $window.location.href = url;
        }
    }
}]);
