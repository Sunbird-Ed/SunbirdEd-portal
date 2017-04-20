var communityIntervalId;

app.service('PumpUtil', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {

    this.FEED_URL = "api/user/:userName/feed";
    this.COLLECTION_MEMBERS = "api/collection/:collectionUID/members";
    this.POST_MAJOR = "api/user/:userName/feed/major";
    this.POST_MINOR = "api/user/:userName/feed/minor";
    this.INBOX_MAJOR_URL = "api/user/:userName/inbox/major";
    this.INBOX_MINOR_URL = "api/user/:userName/inbox/minor";
    this.PUMP_USER_ID = "api/user/:userName/profile";
    this.GET_USER = "api/user/:userName";
    this.PUMP_COLLECTION = "api/collection/:collectionUID";
    this.GET_LISTS = "api/user/:userName/lists/person";
    this.GET_FOLLOWERS = "api/user/:userName/followers";
    this.GET_FOLLOWING = "api/user/:userName/following";

    this.getBaseUrl = function() {
        return $rootScope.appConfig.pumpBaseUrl;
    }

    this.getPreAuthHeaders = function(userName) {
        var headers = {
            "Content-Type": "application/json",
            "Ilimi-Api-Call": "true",
            "Consumer-Key": $rootScope.appConfig.pumpClientKey,
            "Authorization": "OAuth"
        };
        if (userName) {
            headers['User-Name'] = userName;
        }
        return headers;
    }

    this.call = function(url, method, userName, args) {
        method = method || 'POST';
        if(url.indexOf($rootScope.appConfig.pumpBaseUrl) == -1) {
            url = $rootScope.appConfig.pumpBaseUrl + url;
        }
        var req = {
            method: method,
            url: url,
            headers: this.getPreAuthHeaders(userName)
        }
        if (method == 'GET') {
            req.params = args;
        } else {
            req.data = args;
        }
        var deferred = $q.defer();
        $http(req).success(function(data) {
            deferred.resolve(data);
        }).error(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    }
}]);

app.service('CommunityService', ['PumpUtil', '$http', '$q', function(pumpUtil, $http, $q) {

    var LIST_RESULT_SIZE = 200;
    this.userName = undefined;

    this.getId = function(id, index) {
        var path = id.replace(pumpUtil.getBaseUrl(), '');
        var params = path.split('/');
        if (params[index]) {
            return params[2];
        } else {
            return '';
        }
    }

    this.getMajorInbox = function(args, userId) {
        userId = userId || this.userName;
        var url = pumpUtil.INBOX_MAJOR_URL.replace(':userName', userId);
        return pumpUtil.call(url, 'GET', userId, args);
    }

    this.getMinorInbox = function(args) {
        var url = pumpUtil.INBOX_MINOR_URL.replace(':userName', this.userName);
        return pumpUtil.call(url, 'GET', this.userName, args);
    }

    this.like = function(object, value) {
        var url = pumpUtil.POST_MINOR.replace(':userName', this.userName);
        var data = {
            "verb": (value ? "favorite" : "unfavorite"),
            "object": {
                "objectType": object.objectType,
                "id": object.id
            }
        }
        return pumpUtil.call(url, 'POST', this.userName, data);
    }

    this.comment = function(object, content) {
        var url = pumpUtil.POST_MINOR.replace(':userName', this.userName);
        var data = {
            "verb": "post",
            "object": {
                "objectType": "comment",
                "content": content,
                "inReplyTo": {
                    "objectType": object.objectType,
                    "id": object.id
                }
            }
        }
        return pumpUtil.call(url, 'POST', this.userName, data);
    }

    this.getLists = function(courseId) {
        var url = pumpUtil.GET_LISTS.replace(':userName', this.userName);
        var deferred = $q.defer();
        pumpUtil.call(url, 'GET', this.userName, {count: 200}).then(function(data) {
            if(!courseId) {
                deferred.resolve(data);
            } else {
                var list = angular.copy(data);
                list.items = [];
                data.items.forEach(function(item) {
                    if(item.context.courseId == courseId) {
                        list.items.push(item);
                    }
                });
                deferred.resolve(list);
            }
        }).catch(function(err) {
            deferred.resolve(err);
        });
        return deferred.promise;
    }

    this.getListMembers = function(listId, userId) {
        if(listId.indexOf(pumpUtil.getBaseUrl()) == -1) {
            listId = pumpUtil.PUMP_COLLECTION.replace(':collectionUID', listId);
        }
        userId = userId || this.userName;
        var url = listId + '/members';
        return pumpUtil.call(url, 'GET', userId, {count: 200});
    }

    this.getAllListMembers = function(listId, userId) {
        var defer = $q.defer();
        if(listId.indexOf(pumpUtil.getBaseUrl()) == -1) {
            listId = pumpUtil.PUMP_COLLECTION.replace(':collectionUID', listId);
        }
        userId = userId || this.userName;
        var url = listId + '/members';
        pumpUtil.call(url, 'GET', userId, {count: LIST_RESULT_SIZE}).then(function(data) {
            var count = data.totalItems;
            var loop = Math.ceil(data.totalItems/LIST_RESULT_SIZE);
            if(loop > 1) {
                loop--;
                var promises = [];
                for(var i=1; i <= loop; i++) {
                    promises.push(getListMembers(userId, listId, i*LIST_RESULT_SIZE, LIST_RESULT_SIZE));
                }
                $q.all(promises).then(function(itemsArray) {
                    itemsArray.forEach(function(items) {
                        data.items.push.apply(data.items, items);
                    });
                    defer.resolve(data);
                });
            } else {
                defer.resolve(data);
            }
        }).catch(function(err) {console.log('error', err);});
        return defer.promise;
    }

    function getListMembers(userId, listId, offset, count) {
        var defer = $q.defer();
        var url = listId + '/members';
        pumpUtil.call(url, 'GET', userId, {offset: offset, count: count}).then(function(data) {
            defer.resolve(data.items);
        }).catch(function(err) {console.log('error', err);});
        return defer.promise;
    }

    this.getFollowers = function(args, userId) {
        userId = userId || this.userName;
        var url = pumpUtil.GET_FOLLOWERS.replace(':userName', userId);
        return pumpUtil.call(url, 'GET', this.userName, args);
    }

    this.getFollowing = function(args, userId) {
        userId = userId || this.userName;
        var url = pumpUtil.GET_FOLLOWING.replace(':userName', userId);
        return pumpUtil.call(url, 'GET', this.userName, args);
    }

    this.getUser = function(userId) {
        var url = pumpUtil.GET_USER.replace(':userName', userId);
        return pumpUtil.call(url, 'GET', this.userName, {});
    }

    this.getUserMajorFeed = function(userId) {
        var url = pumpUtil.POST_MAJOR.replace(':userName', userId);
        return pumpUtil.call(url, 'GET', this.userName, {});
    }

    this.getUserMinorFeed = function(userId) {
        var url = pumpUtil.POST_MINOR.replace(':userName', userId);
        return pumpUtil.call(url, 'GET', this.userName, {});
    }

    this.getUserProfile = function(userId) {
        return this.getFromService('/private/v1/user/' + userId + '/profile');
    }

    this.changePassword = function(userPassword) {
        return this.postToService('/private/v1/user/changePassword', userPassword);
    }

    this.saveUserProfile = function(data) {
        return this.postToService('/private/v1/user/profile', data);
    }

    this.follow = function(memberId) {
        if(memberId.indexOf(pumpUtil.getBaseUrl()) == -1) {
            memberId = pumpUtil.PUMP_USER_ID.replace(':userName', memberId);
        }
        var args = {
            "verb":"follow",
            "object": {
                "objectType": "person",
                "id": memberId
            }
        }
        var url = pumpUtil.POST_MINOR.replace(':userName', this.userName);
        return pumpUtil.call(url, 'POST', this.userName, args);
    }

    this.unfollow = function(memberId) {
        if(memberId.indexOf(pumpUtil.getBaseUrl()) == -1) {
            memberId = pumpUtil.PUMP_USER_ID.replace(':userName', memberId);
        }
        var args = {
            "verb":"stop-following",
            "object": {
                "objectType": "person",
                "id": memberId
            }
        }
        var url = pumpUtil.POST_MINOR.replace(':userName', this.userName);
        return pumpUtil.call(url, 'POST', this.userName, args);
    }

    this.createList = function(data) {
        return this.postToService('/private/v1/coaching/list/create', data);
    }

    this.deleteList = function(listId) {
        return this.deleteFromService('/private/v1/coaching/list/' + listId);
    }

    this.addMemberToList = function(data) {
        return this.postToService('/private/v1/coaching/list/add', data);
    }

    this.removeMemberFromList = function(data) {
        return this.postToService('/private/v1/coaching/list/remove', data);
    }

    this.postActivity = function(data) {
    	return this.postToService('/private/v1/coaching/post', data);
    }

    this.getEventStatus = function(data) {
    	return this.postToService('/private/v1/coaching/event/get', data);
    }

    this.acceptEvent = function(data) {
    	return this.postToService('/private/v1/coaching/event/accept', data);
    }

    this.rejectEvent = function(data) {
    	return this.postToService('/private/v1/coaching/event/decline', data);
    }

    this.getObjects = function(data) {
    	return this.postToService('/private/v1/coaching/objects', data);
    }

    this.getObject = function(data) {
        return this.postToService('/private/v1/coaching/object', data);
    }

    this.getSenders = function(courseId) {
    	return this.getFromService('/private/v1/coaching/senderList/' + encodeURIComponent(courseId));
    }

    this.searchLearners = function(data) {
        return this.postToService('/private/v1/player/learner/search', data);
    }

    this.getLearnerSearchFields = function(courseId) {
        return this.getFromService('/private/v1/player/learner/search/' + encodeURIComponent(courseId));
    }

    this.postToService = function(url, data) {
        var deferred = $q.defer();
        $http.post(url, data).success(function(resp) {
            if (!resp.error)
                deferred.resolve(resp);
            else
                deferred.reject(resp.error);
        });
        return deferred.promise;
    }

    this.getFromService = function(url, data) {
        var deferred = $q.defer();
        $http.get(url, data).success(function(resp) {
            if (!resp.error)
                deferred.resolve(resp);
            else
                deferred.reject(resp.error);
        });
        return deferred.promise;
    }

    this.deleteFromService = function(url, data) {
        var deferred = $q.defer();
        $http.delete(url, data).success(function(resp) {
            if (!resp.error)
                deferred.resolve(resp);
            else
                deferred.reject(resp.error);
        });
        return deferred.promise;
    }

    this.getUserRole = function(data) {
        return this.postToService('/private/v1/interactions/checkRole', data);
    }

    this.getOrganization = function(orgId) {
        return this.getFromService('/private/v1/organization/get/' + encodeURIComponent(orgId));
    }
}]);

app.controller('BaseCommunityController', ['$scope', '$http', '$timeout', '$rootScope', 'CommunityService', 'CourseBrowserService', '$state', '$q', function($scope, $http, $timeout, $rootScope, service, cbService, $state, $q) {

    service.userName = $('#loggedUserId').val();
    $scope.model = {
        lists:[],
        following:[],
        activities: [],
        activityReverseMap: {},
        latestMajorActivity: undefined, // Used to refresh major activites
        latestMinorActivity: undefined, // Used to refresh minor activities
        lastActivity: undefined, // Used for scrolling for more activites
        scrollWall: false,
        activitiesLimit: 1000, // Maximum activites to fetch
        commentObject: undefined,
        loggedUserId: $('#loggedUserId').val(),
        loggedUserRole: undefined,
        nameFieldPlaceHolder: 'SEARCH BY NAME',
        searchBtnText: 'Search',
        post: {
            type: undefined,
            objectId: '-1',
            title: undefined,
            to: undefined,
            content: undefined,
            scheduledDate: new Date(),
            minDate: new Date(),
            startTime: undefined,
            endTime: undefined,
            location: undefined,
            opened: false,
            dateOptions: {
                formatYear: 'yy',
                startingDay: 1,
                showWeeks: false
            },
            courseId: $rootScope.courseId,
            courseAdminId: $rootScope.courseAdminId
        },
        postTypes: [{
            value: "note",
            label: "Message"
        }],
        senders: [],
        checkForObjects: false,
        objects: [],
        binders: [{id: '-1', name: 'Select study material', description: ''}],
        coachingSessions: [{id: '-1', name: 'Select a coaching session', description: ''}],
        exams: [{id: '-1', name: 'Select an examination', description: ''}],
        practiceTests: [{id: '-1', name: 'Select a practice test', description: ''}],
        errors: [],
        showMoreLoading: false
    }
    $scope.model.post.type = $scope.model.postTypes[0];
    $scope.model.post.scheduledDate.setHours(0,0,0,0);
    $scope.model.post.minDate.setHours(0,0,0,0);

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.model.post.opened = true;
    };

    $scope.disableKeyDown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
    }

    $scope.getObjects = function() {
        $scope.model.checkForObjects = false;
        $scope.model.errors = [];
    	$scope.model.objects = [];
    	if(['note','notification'].indexOf($scope.model.post.type.value) == -1) {
    		if($scope.model.post.type.value == 'binder') {
				$scope.model.objects.push.apply($scope.model.objects, $scope.model.binders);
			} else if($scope.model.post.type.value == 'coachingSession') {
				$scope.model.objects.push.apply($scope.model.objects, $scope.model.coachingSessions);
			} else if($scope.model.post.type.value == 'exam') {
				$scope.model.objects.push.apply($scope.model.objects, $scope.model.exams);
			} else if($scope.model.post.type.value == 'practiceTest') {
                $scope.model.objects.push.apply($scope.model.objects, $scope.model.practiceTests);
            }
            $scope.model.post.objectId = $scope.model.objects[0];
			if($scope.model.objects.length > 1) {
				return;
			}
    		var data = {
    			courseId: $rootScope.courseId,
    			type: $scope.model.post.type.value
    		}
    		service.getObjects(data).then(function(data) {
    			$scope.model.objects.push.apply($scope.model.objects, data);
    			if($scope.model.post.type.value == 'binder') {
                    $scope.model.binders.push.apply($scope.model.binders, data);
    			} else if($scope.model.post.type.value == 'coachingSession') {
                    $scope.model.coachingSessions.push.apply($scope.model.coachingSessions, data);
    			} else if($scope.model.post.type.value == 'exam') {
                    $scope.model.exams.push.apply($scope.model.exams, data);
    			} else if($scope.model.post.type.value == 'practiceTest') {
                    $scope.model.practiceTests.push.apply($scope.model.practiceTests, data);
                }
                $scope.model.checkForObjects = true;
    		}).catch(function(err) {
                $scope.model.checkForObjects = true;
            });
    	}
    }

    $scope.getSenders = function() {
        var uniqueStudents = [];
        service.getLists($rootScope.courseId).then(function(lists) {
            var promises = [];
            lists.items.forEach(function(group) {
                $scope.model.senders.unshift({
                    id: service.getId(group.id, 2),
                    name: group.displayName + ' (' + group.members.totalItems + ')',
                    type: 'list',
                    group: 'Groups'
                });
                if(group.context.listType == 'system') {
                    promises.push($scope.getPeopleInList(group));
                }
            });
            return $q.all(promises);
        }).then(function() {
            return service.getFollowers({count: 200});
        }).then(function(followers) {
            $scope.model.senders.push({
                id: 'followers',
                name: 'Followers' + ' (' + followers.totalItems + ')',
                type: 'followers',
                group: 'Groups'
            });
            followers.items.forEach(function(member) {
                if(uniqueStudents.indexOf(member.preferredUsername) == -1) {
                    $scope.model.senders.push({
                        id: member.preferredUsername,
                        name: member.displayName,
                        type: 'learner',
                        group: 'Followers'
                    });
                }
            });
        })
        .then(function() {
            if($rootScope.community && $rootScope.community.coachGroup && $rootScope.community.coachGroup.groupId) {
                return service.getListMembers($rootScope.community.coachGroup.groupId, $rootScope.community.userId);
            }
            return [];
        })
        .then(function(coaches) {
            if(coaches && coaches.totalItems > 0) {
                $scope.model.senders.unshift({
                    id: $rootScope.community.coachGroup.groupId,
                    name: 'Coaches' + ' (' + coaches.totalItems + ')',
                    type: 'coaches',
                    group: 'Groups'
                });
                coaches.items.forEach(function(member) {
                    $scope.model.senders.unshift({
                        id: member.preferredUsername,
                        name: member.displayName,
                        type: 'learner',
                        group: 'Coaches'
                    });
                })
            }
            if($rootScope.community && $rootScope.community.facultyGroup && $rootScope.community.facultyGroup.groupId) {
                return service.getListMembers($rootScope.community.facultyGroup.groupId, $rootScope.community.userId);
            }
            return [];
        })
        .then(function(faculties) {
            if(faculties && faculties.totalItems > 0) {
                $scope.model.senders.push({
                    id: $rootScope.community.facultyGroup.groupId,
                    name: 'Faculty' + ' (' + faculties.totalItems + ')',
                    type: 'faculty',
                    group: 'Groups'
                });
                faculties.items.forEach(function(member) {
                    $scope.model.senders.unshift({
                        id: member.preferredUsername,
                        name: member.displayName,
                        type: 'learner',
                        group: 'Faculty'
                    });
                })
            }
        })
        .catch(function(err) {
            console.log('Error in getting senders - ', err);
        }).finally(function() {
            //console.log('Initializing select box - finally', $scope.model.senders);
            $("#senderMultiSelect").select2({placeholder: "Select List/Students..."});
        });
    }

    $scope.getPeopleInList = function(list) {
        var defer = $q.defer();
        service.getAllListMembers(list.id).then(function(data) {
            data.items.forEach(function(member) {
                $scope.model.senders.unshift({
                    id: member.preferredUsername,
                    name: member.displayName,
                    type: 'learner',
                    group: list.displayName
                });
            })
        });
    }

    $scope.selectObject = function() {
        if(!$('#postActivityBox').data("wysihtml5")) {
            $('#postActivityBox').wysihtml5();
        }
        $('#postActivityBox').data("wysihtml5").editor.setValue($scope.model.post.objectId.description);
        $scope.model.post.title = $scope.model.post.objectId.name;
    }

    $scope.wallResponse = function(data) {
        if (data.items.length > 0) {
            data.items.forEach(function(item) {
                if(["coachingSession", "exam", "practiceTest"].indexOf(item.object.objectType) != -1) {
                    $scope.getEventStatus(item.context);
                }
                $timeout(function() {
                    updateVideoPostWH();
                }, 100);
            });
            $scope.model.activities.push.apply($scope.model.activities, data.items);
            $scope.model.latestMajorActivity = data.items[0].id;
            $scope.model.lastActivity = data.items[data.items.length - 1].id;
        }
        if (data.totalItems > $scope.model.activities.length) {
            $scope.model.scrollWall = true;
        } else {
            $scope.model.scrollWall = false;
        }
        $scope.model.showMoreLoading = false;
    }

    $scope.getWall = function() {
        service.getMajorInbox({
            count: 20
        }).then($scope.wallResponse).catch($scope.error);
        /*service.getMinorInbox({}).then(function(data) {
			if(data.items.length > 0) {
				$scope.model.latestMinorActivity = data.items[0].id;
			}
		}).catch($scope.error);*/
    }

    $scope.scrollWall = function() {
        $scope.model.showMoreLoading = true;
        service.getMajorInbox({
            before: $scope.model.lastActivity,
            count: 20
        }).then($scope.wallResponse).catch($scope.error);
    }

    $scope.refreshWall = function() {
        service.getMajorInbox({
            since: $scope.model.latestMajorActivity,
            count: 20
        }).then(function(data) {
            if (data.items.length > 0) {
                data.items.forEach(function(item) {
                    if(["coachingSession", "exam", "practiceTest"].indexOf(item.object.objectType) != -1) {
                        $scope.getEventStatus(item.context);
                    }
                });
                $scope.model.activities.unshift.apply($scope.model.activities, data.items);
                $scope.model.latestMajorActivity = data.items[0].id;
                $timeout(function() {
                    updateVideoPostWH();
                }, 100);
            }
        }).catch($scope.error);
        /*service.getMinorInbox({since: $scope.model.latestMinorActivity}).then(function(data) {
			if(data.items.length > 0) {
				$scope.model.latestMinorActivity = data.items[0].id;
				// TODO: add logic to refresh likes/comments of existing posts
			}
		}).catch($scope.error);*/
    }

    $scope.like = function(object, value) {
        service.like(object, value).then(function(data) {
            object.liked = value;
            if (!object.likes.items) object.likes.items = [];
            object.likes.items.push(data);
            if (value)
                ++object.likes.totalItems;
            else
                --object.likes.totalItems;
        }).catch($scope.error);
    }

    $scope.cancelComment = function(index) {
        $scope.model.commentObject = undefined;
        $('#communityTextArea' + index).data("wysihtml5").editor.clear();
        $scope.model.commentObjectIndex = undefined;
    }

    $scope.activateComment = function(object, index) {
        $scope.model.commentObject = object;
        var textArea = $('#communityTextArea' + index).data("wysihtml5");
        if(!textArea) {
            $('#communityTextArea' + index).wysihtml5();
        }
        $scope.model.commentObjectIndex = index;
    }

    $scope.comment = function() {
        var comment = $('#communityTextArea' + $scope.model.commentObjectIndex).val();
        service.comment($scope.model.commentObject, comment).then(function(data) {
            if (!$scope.model.commentObject.replies.items) $scope.model.commentObject.replies.items = [];
            data.object.author = data.actor;
            $scope.model.commentObject.replies.items.unshift(data.object);
            ++$scope.model.commentObject.replies.totalItems;
            $scope.model.commentObject = undefined;
            $('#communityTextArea' + $scope.model.commentObjectIndex).data("wysihtml5").editor.clear();
            $scope.model.commentObjectIndex = undefined;
        }).catch($scope.error);
    }

    $scope.error = function(err) {
        console.log('Error:', err);
    }

    $scope.getFollowing = function() {
        service.getFollowing({count: 200}).then(function(data) {
            $scope.model.following = data;
            $scope.model.following.members = [];
            data.items.forEach(function(member) {
                $scope.model.following.members.push(member.preferredUsername);
            });
        }).catch($scope.error);
    }

    $scope.follow = function(memberId) {
        service.follow(memberId).then(function(data) {
            $scope.getFollowing();
        }).catch($scope.error);
    }

    $scope.unfollow = function(memberId) {
        service.unfollow(memberId).then(function(data) {
            $scope.getFollowing();
        }).catch($scope.error);
    }

    $scope.following = function(memberId) {
        if($scope.model.following && $scope.model.following.members) {
            return ($scope.model.following.members.indexOf(memberId) > -1);
        }
        return false;
    }

    selectLeftMenuTab('communityTab');
}]);

app.controller('wallController', ['$scope', '$http', '$timeout', '$rootScope', 'CommunityService', 'CourseBrowserService', '$state', '$stateParams', '$controller', function($scope, $http, $timeout, $rootScope, service, cbService, $state, $stateParams, $controller) {

    // Instantiate the base community controller
    $controller('BaseCommunityController', { $scope: $scope });
    service.userName = $('#loggedUserId').val();
    $scope.model.post.type = $scope.model.postTypes[0];

    $scope.getUserRole = function() {
        service.getUserRole({}).then(function(response) {
            $scope.model.loggedUserRole = response.role;
            if ($scope.model.loggedUserRole == 'tutor' || $scope.model.loggedUserRole == 'faculty') {
                $scope.model.postTypes.push.apply($scope.model.postTypes, [{
                    value: "binder",
                    label: "Study Material"
                }, {
                    value: "coachingSession",
                    label: "Coaching Session"
                }, {
                    value: "notification",
                    label: "Notification"
                }, {
                    value: "exam",
                    label: "Examination"
                }, {
                    value: "practiceTest",
                    label: "Practice Test"
                }]);
            }
        });
    }

    $scope.initiatePostActivity = function() {
        $scope.model.post.content = $('#postActivityBox').val();
        var type = $scope.model.post.type.value;
        if(type == 'note' || type == 'notification' || type == 'binder') {
            $scope.postActivity();
        } else {
            if($scope.validatePostActivity()) {
                $('#postActivityConfModal').modal('show');
            }
        }
    }

    $scope.postActivity = function() {
        $('#postActivityCnfBtn').button('loading');
        $('#postActivityConfModal').modal('hide');
        if($scope.validatePostActivity()) {
            $('#postActivityBtn').button('loading');
            var schDate = $('#scheduledDate').val();
            $scope.model.post.startDate = (schDate + ' ' + $scope.model.post.startTime).date();
            $scope.model.post.endDate = (schDate + ' ' + $scope.model.post.endTime).date();
            $scope.model.post.scheduledDate = $scope.model.post.startDate.format('DDDD, MMMM DD');

            service.postActivity($scope.model.post).then(function(data) {
                $('#postActivityBtn').button('reset');
                $('#postActivityCnfBtn').button('reset');
                if(data.err) {
                    $scope.model.errors = [data.errorMsg];
                } else {
                    if($scope.model.showCancel) {
                        $scope.cancelPost();
                    } else {
                        $scope.clearPost();
                    }
                    $timeout(function() {
                        $('#writeIcon').trigger('click');
                    }, 100);
                    $scope.refreshWall();
                }
            }).catch(function(err, errMsg) {
                $('#postActivityBtn').button('reset');
                $('#postActivityCnfBtn').button('reset');
            });
        }
    }

    $scope.clearPost = function() {
        $('#postActivityBox').data("wysihtml5").editor.clear();
        $scope.model.post.type = $scope.model.postTypes[0];
        $scope.model.post.title = undefined;
        $scope.model.post.to = undefined;
        $scope.model.post.content = undefined;
        $scope.model.post.location = undefined;
        $scope.model.post.objectId = undefined,
        $scope.model.post.scheduledDate = undefined;
        $scope.model.post.startTime = undefined;
        $scope.model.post.endTime = undefined;
        $scope.model.post.location = undefined;
        $scope.model.errors = [];
        $("#senderMultiSelect").select2('val', '');
        $scope.model.checkForObjects = false;
    }

    $scope.cancelPost = function() {
        $scope.clearPost();
        $scope.model.showCancel = false;
        $scope.model.post.typeReadonly = false;
        $scope.model.post.objectReadonly = false;
        $scope.model.post.locationReadonly = false;
        $scope.model.objects = [];
        $scope.model.binders = [{id: '-1', name: 'Select one study material', description: ''}];
        $scope.model.coachingSessions = [{id: '-1', name: 'Select a coaching session', description: ''}];
        $scope.model.exams = [{id: '-1', name: 'Select an examination', description: ''}];
        $scope.model.practiceTests = [{id: '-1', name: 'Select a practice test', description: ''}];
    }

    $scope.validatePostActivity = function() {
        var type = $scope.model.post.type.value;
        var label = $scope.model.post.type.label;
        var isValid = true;
        var errorMessages = [];
        if(!$scope.model.post.title || $scope.model.post.title.trim().length == 0) {
            isValid = false;
            errorMessages.push('Activity title is required.')
        }
        if(!$scope.model.post.content || $scope.model.post.content.trim().length == 0) {
            isValid = false;
            errorMessages.push('Activity message is required.')
        }
        if(["binder", "coachingSession", "exam", "practiceTest", "notification"].indexOf(type) != -1) {
            if(!$scope.model.post.to || $scope.model.post.to.length == 0) {
                isValid = false;
                errorMessages.push('Senders list cannot be empty.')
            }
        }
        if(["binder", "coachingSession", "exam", "practiceTest"].indexOf(type) != -1) {
            if(!$scope.model.post.objectId || $scope.model.post.objectId.id == '-1') {
                isValid = false;
                errorMessages.push($scope.model.post.type.label + ' is required.')
            }
            if($scope.model.post.to && $scope.model.post.to.length > 0) {
                var postContainsFollowers = false;
                $scope.model.post.to.forEach(function(item) {
                    if(item.type == 'followers' || item.group == 'Followers') {
                        postContainsFollowers = true;
                    }
                });
                if(postContainsFollowers) {
                    isValid = false;
                    errorMessages.push('Cannot post a ' + label + ' to followers.');
                }
            }
        }
        if(["coachingSession", "exam", "practiceTest"].indexOf(type) != -1) {
            if(!$scope.model.post.scheduledDate) {
                isValid = false;
                errorMessages.push('Scheduled date is required.')
            }
            var startTime = $('#startTime').val();
            var endTime = $('#endTime').val();
            if(!$scope.model.post.startTime && startTime.length > 0) {
                $scope.model.post.startTime = startTime;
            }
            if(!$scope.model.post.endTime && endTime.length > 0) {
                $scope.model.post.endTime = endTime;
            }
            if(!$scope.model.post.startTime || $scope.model.post.startTime.trim().length == 0) {
                isValid = false;
                errorMessages.push('Start time is required.')
            }
            if(!$scope.model.post.endTime || $scope.model.post.endTime.trim().length == 0) {
                isValid = false;
                errorMessages.push('End time is required.')
            }
            if(["coachingSession", "exam"].indexOf(type) != -1) {
                if(!$scope.model.post.location || $scope.model.post.location.trim().length == 0) {
                    isValid = false;
                    errorMessages.push('Location is required.')
                }
            }
        }
        $scope.model.errors = errorMessages;
        return isValid;
    }

    $scope.error = function(err) {
        console.log('Error:', err);
        $('#communityModal').modal('hide');
        $('#postActivityConfModal').modal('hide');
    }

    $scope.getWall();
    $scope.getUserRole();
    $scope.getSenders();
    communityIntervalId = setInterval(function() {
        $scope.refreshWall();
    }, 30000);
    $timeout(function() {
        $('.timePicker').timepicker({ 'timeFormat': 'H:i', 'scrollDefault': 'now' });
        $('.tool-tip').tooltip();
    }, 1000);

    $scope.goToObject = function(type, objectId, createdUser) {
        var element = cbService.getElementFromMap(cbService.removeFedoraPrefix(objectId));
        if(createdUser == $scope.model.loggedUserId) {
            if(type == 'coachingSession') {
                $state.go('coachingSession', {sessionId: encodeURIComponent(objectId)});
            } else if(type == 'binder'){
                $state.go('binder', {binderId: encodeURIComponent(objectId)});
            } else if(type == 'practiceTest' || type == 'Exam') {
                $state.go('releaseExam', {laId: cbService.removeFedoraPrefix(objectId)});
            }
        } else {
            if(type == 'binder' || type == 'practiceTest' || type == 'Exam' || !element || null == element) {
                $state.go('cb', {lobId: cbService.removeFedoraPrefix(objectId)});
            } else {
                $state.go('cbLecture', {elementId: element.id, lobId: element.parentId});
            }
        }
    }

    $scope.getEventStatus = function(context) {
        var args = {
            eventId: context.eventId,
            courseId: $rootScope.courseId
        }
        service.getEventStatus(args).then(function(data) {
            context.event = data;
            if(context.event && context.event.invited) {
                context.event.pending = context.event.invited - context.event.accepted - context.event.declined;
            }
        }).catch($scope.error);
        $scope.eventActive(context);
    }

    $scope.eventActive = function(context) {
        var now = new Date();
        if(context.eventActiveTime.date().getTime() < now.getTime()) {
            context.eventActive = false;
        } else {
            context.eventActive = true;
        }
    }

    $scope.setEventStatus = function(context, value) {
        var args = {
            objectId: context.objectId,
            courseId: $rootScope.courseId
        }
        if (value) {
            service.acceptEvent(args).then(function(data) {
                context.event = data;
            }).catch($scope.error);
        } else {
            service.rejectEvent(args).then(function(data) {
                context.event = data;
            }).catch($scope.error);
        }
    }

    $scope.populatePostForm = function(data) {
        switch($stateParams.type) {
            case 'binder':
                $scope.model.post.type = $scope.model.postTypes[1];
                $scope.model.binders.push(data);
                $scope.model.objects.push.apply($scope.model.objects, $scope.model.binders);
                break;
            case 'coachingSession':
                $scope.model.post.type = $scope.model.postTypes[2];
                $scope.model.coachingSessions.push(data);
                $scope.model.objects.push.apply($scope.model.objects, $scope.model.coachingSessions);
                break;
            case 'practiceTest':
                $scope.model.post.type = $scope.model.postTypes[5];
                $scope.model.practiceTests.push(data);
                $scope.model.objects.push.apply($scope.model.objects, $scope.model.practiceTests);
                break;
            case 'exam':
                $scope.model.post.type = $scope.model.postTypes[4];
                $scope.model.post.location = $stateParams.locId;
                $scope.model.post.locationReadonly = true;
                $scope.model.exams.push(data);
                $scope.model.objects.push.apply($scope.model.objects, $scope.model.exams);
                break;
        }
        $scope.model.post.typeReadonly = true;
        $scope.model.post.objectReadonly = true;
        $scope.model.post.objectId = $scope.model.objects[1];
        $timeout(function() {
            $('#writeIcon').trigger('click');
        }, 100);
        $scope.selectObject();
        $scope.model.showCancel = true;
    }

    if($stateParams.type && typeof $stateParams.type != 'undefined') {
        var args = {
            type: $stateParams.type,
            courseId: $rootScope.courseId,
            objectId: $stateParams.id
        }
        service.getObject(args).then(function(data) {
            $scope.populatePostForm(data);
        }).catch($scope.error);
    } else {
        $timeout(function() {
            $('#postActivityBox').wysihtml5();
        }, 1000);
    }
}]);

app.controller('courseWallController', ['$scope', '$http', '$timeout', '$rootScope', 'CommunityService', 'CourseBrowserService', '$state', '$controller', function($scope, $http, $timeout, $rootScope, service, cbService, $state, $controller) {

    // Instantiate the base community controller
    $controller('BaseCommunityController', { $scope: $scope });
    service.userName = $rootScope.courseAdminId;
    $scope.model.post.type = {label: 'Announcement', value: 'announcement'};
    $scope.model.post.courseUser = $rootScope.courseAdminId;
    $scope.model.canPostAnnouncement = false;

    $scope.getUserRole = function() {
        service.getUserRole({}).then(function(response) {
            $scope.model.loggedUserRole = response.role;
            if ($scope.model.loggedUserRole == 'tutor' || $scope.model.loggedUserRole == 'faculty') {
                $scope.model.canPostAnnouncement = true;
            }
        });
    }

    $scope.initiatePostActivity = function() {
        $scope.model.post.content = $('#postActivityBox').val();
        $scope.postActivity();
    }

    $scope.postActivity = function() {
        if($scope.validatePostActivity()) {
            service.postActivity($scope.model.post).then(function(data) {
                $scope.clearPost();
                $('#postActivityConfModal').modal('hide');
                $('#writeIcon').trigger('click');
                $scope.refreshWall();
            }).catch($scope.error);
        }
    }

    $scope.clearPost = function() {
        $('#postActivityBox').data("wysihtml5").editor.clear();
        $scope.model.post.title = undefined;
        $scope.model.errors = [];
    }

    $scope.validatePostActivity = function() {
        var isValid = true;
        var errorMessages = [];
        if(!$scope.model.post.title || $scope.model.post.title.trim().length == 0) {
            isValid = false;
            errorMessages.push('Activity title is required.')
        }
        if(!$scope.model.post.content || $scope.model.post.content.trim().length == 0) {
            isValid = false;
            errorMessages.push('Activity message is required.')
        }
        $scope.model.errors = errorMessages;
        return isValid;
    }

    $scope.getWall();
    $scope.getUserRole();
    communityIntervalId = setInterval(function() {
        $scope.refreshWall();
    }, 30000)
    $timeout(function() {
        $('#postActivityBox').wysihtml5({video: true});
        $('.tool-tip').tooltip();
    }, 1000);
}]);

app.controller('myCompanyController', ['$scope', '$http', '$timeout', '$rootScope', 'CommunityService', 'CourseBrowserService', '$state', '$controller', '$upload', function($scope, $http, $timeout, $rootScope, service, cbService, $state, $controller, $upload) {

    // Instantiate the base community controller
    $controller('BaseCommunityController', { $scope: $scope });
    service.userName = $rootScope.loggedUserOrgId;
    $scope.model.post.type = {label: 'Announcement', value: 'announcement'};
    $scope.model.post.courseUser = $rootScope.loggedUserOrgId;
    $scope.model.canPostAnnouncement = false;
    $scope.model.canEditOrgProfile = false;
    $scope.model.organization = undefined;
    $scope.model.edit = {};
    $scope.model.edit.organization = undefined;
    $rootScope.isComapanyPage = true;


    $scope.getUserRole = function() {
        service.getUserRole({}).then(function(response) {
            $scope.model.loggedUserRole = response.role;
            if ($scope.model.loggedUserRole == 'faculty') {
                $scope.model.canPostAnnouncement = true;
                $scope.model.canEditOrgProfile = true;
            }
        });
    }

    $scope.getOrganization = function() {
        service.getOrganization($rootScope.loggedUserOrgId).then(function(data) {
            $scope.model.organization = data;
            $scope.model.edit.organization = angular.copy($scope.model.organization);
        });
    }

    $scope.initiatePostActivity = function() {
        $scope.model.post.content = $('#postActivityBox').val();
        $scope.postActivity();
    }

    $scope.postActivity = function() {
        if($scope.validatePostActivity()) {
            service.postActivity($scope.model.post).then(function(data) {
                $scope.clearPost();
                $('#postActivityConfModal').modal('hide');
                $('#writeIcon').trigger('click');
                $scope.refreshWall();
            }).catch($scope.error);
        }
    }

    $scope.clearPost = function() {
        $('#postActivityBox').data("wysihtml5").editor.clear();
        $scope.model.post.title = undefined;
        $scope.model.errors = [];
    }

    $scope.validatePostActivity = function() {
        var isValid = true;
        var errorMessages = [];
        if(!$scope.model.post.title || $scope.model.post.title.trim().length == 0) {
            isValid = false;
            errorMessages.push('Activity title is required.')
        }
        if(!$scope.model.post.content || $scope.model.post.content.trim().length == 0) {
            isValid = false;
            errorMessages.push('Activity message is required.')
        }
        $scope.model.errors = errorMessages;
        return isValid;
    }

    $scope.updateOrganizationProfile = function() {
        $scope.model.edit.organization.description = $('#orgDescriptionBox').val();
        var organization = $scope.model.edit.organization;
        organization.id = organization.identifier;

        $scope.upload = $upload.upload({
            url: '/private/v1/organization/update',
            data: organization,
            file: organization.selectedImage,
        }).progress(function(evt) {
            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        }).success(function(data, status, headers, config) {
            // file is uploaded successfully
            if(data.error == false) {
                angular.copy($scope.model.edit.organization, $scope.model.organization);
            }
            $scope.model.edit.organization.selectedImage = null;
            $('#orgUploadImg').val('');
            $('#orgEditIcon').trigger('click');
        });

    }

    $scope.getWall();
    $scope.getUserRole();
    $scope.getOrganization();
    communityIntervalId = setInterval(function() {
        $scope.refreshWall();
    }, 30000)
    $timeout(function() {
        $('#postActivityBox').wysihtml5({video: true});
        $('#orgDescriptionBox').val($scope.model.organization.description);
        $('#orgDescriptionBox').wysihtml5({});
        $('.tool-tip').tooltip();
        $('.wysihtml5-sandbox').css('height',500);
    }, 1000);
}]);

app.controller('communityListController', ['$scope', '$http', '$timeout', '$rootScope', 'CommunityService', 'CourseBrowserService', '$state', '$controller', function($scope, $http, $timeout, $rootScope, service, cbService, $state, $controller) {

    // Instantiate the base community controller
    $controller('BaseCommunityController', { $scope: $scope });
    $scope.allLectures = angular.copy(cbService.serializedTOC);
    $scope.allLectures.splice(0,1);
    service.userName = $('#loggedUserId').val();
    $scope.model.searchConfig = undefined;
    $scope.model.selectedList = undefined;
    $scope.model.listMembers = undefined;
    $scope.model.listMemberIds = undefined;
    $scope.model.listNames = [];
    $scope.model.newList = {
        courseId: $rootScope.courseId,
        name: undefined,
        description: undefined
    }

    $scope.model.searchLearners = {
        filters: {}
    }
    $scope.model.learnersList = [];
    $scope.model.showMore = false;
    $scope.model.showMoreLoading = false;
    $scope.model.showLearnerSearch = false;
    $scope.datepicker = {
        opened: false,
        dateOptions: {
            formatYear: 'yy',
            startingDay: 1,
            showWeeks: false
        }
    }
    $scope.open = function($event, type) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.datepicker.opened = true;
    };

    $scope.disableKeyDown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
    }

    $scope.getUserRole = function() {
        service.getUserRole({}).then(function(response) {
            $scope.model.loggedUserRole = response.role;
            if ($scope.model.loggedUserRole == 'tutor' || $scope.model.loggedUserRole == 'faculty') {
            }
        });
    }

    $scope.getLists = function() {
        service.getLists($rootScope.courseId).then(function(data) {
            $scope.model.listNames = [];
            $scope.model.lists = data.items;
            if(data && data.items && data.items.length > 0) {
                data.items.forEach(function(item) {
                    $scope.model.listNames.push(item.displayName.toLowerCase());
                });
            }
        }).catch($scope.error);
    }

    $scope.selectList = function(list) {
        $scope.model.selectedList = list;
        $scope.getListMembers(list.id);
        $scope.initializeSelect2();
    }

    $scope.getListMembers = function(id) {
        service.getAllListMembers(id).then(function(data) {
            $scope.model.selectedList.members.totalItems = data.totalItems;
            $scope.model.listMembers = data.items;
            $scope.model.listMemberIds = [];
            data.items.forEach(function(member) {
                $scope.model.listMemberIds.push(member.preferredUsername);
            })
            $timeout(function() {
                $(".delgrp").hover(function() {
                    $(this).find(".canuseadd.fa.fa-close, .canuseadd.fa.fa-minus").toggle();
                    $(this).find("span.usergroupdetails").toggleClass("groupBlue");
                });
            }, 100);
        }).catch($scope.error);
    }

    $scope.createList = function() {
        $scope.model.newList.description = $('#listDescription').val();
        if($scope.validateCreateList()) {
            service.createList($scope.model.newList).then(function(data) {
                $scope.getLists();
                $('#groupFolder').trigger('click');
            }).catch($scope.error);
        }
    }

    $scope.validateCreateList = function() {
        var isValid = true;
        var errorMessages = [];
        if(!$scope.model.newList.name || $scope.model.newList.name.trim().length == 0) {
            isValid = false;
            errorMessages.push('List name is required.')
        } else if($scope.model.listNames.indexOf($scope.model.newList.name.trim().toLowerCase()) != -1) {
            isValid = false;
            errorMessages.push('List name should be unique.')
        }
        if(!$scope.model.newList.description || $scope.model.newList.description.trim().length == 0) {
            isValid = false;
            errorMessages.push('List description is required.')
        }
        $scope.model.errors = errorMessages;
        return isValid;
    }

    $scope.clearList = function() {
        $('#listDescription').data("wysihtml5").editor.clear();
        $scope.model.newList.description = undefined;
        $scope.model.newList.name = undefined;
        $scope.model.errors = [];
    }

    $scope.confirmDeleteGroup = function() {
        $('#deleteGroupConfModal').modal('show');
    }

    $scope.deleteGroup = function() {
        service.deleteList(service.getId($scope.model.selectedList.id, 2)).then(function(data) {
            $scope.model.showDeleteGroupAlert = true;
            $scope.model.deletedGroup = $scope.model.selectedList.displayName;
            $scope.backToList();
            $('#deleteGroupConfModal').modal('hide');
        }).catch($scope.error);
    }

    $scope.addMemberToList = function(memberId) {
        var args = {
            listId: service.getId($scope.model.selectedList.id, 2),
            memberId: memberId
        }
        service.addMemberToList(args).then(function(data) {
            $scope.getListMembers($scope.model.selectedList.id);
        }).catch($scope.error);
    }

    $scope.removeMemberFromList = function(memberId) {
        var args = {
            listId: service.getId($scope.model.selectedList.id, 2),
            memberId: memberId
        }
        service.removeMemberFromList(args).then(function(data) {
            $scope.getListMembers($scope.model.selectedList.id);
        }).catch($scope.error);
    }

    $scope.searchLearners = function() {
        var searchData = $scope.getSearchData('learnerSearch');
        $('#commSearchButton').button('loading');
        service.searchLearners(searchData).then(function(data) {
            $scope.model.learnersList = data.learners;
            $scope.model.learnerCount = data.learnerCount;
            $scope.model.searchData = searchData;
            $('#commSearchButton').button('reset');
            $scope.evalShowMoreLearners();
        }).catch($scope.error);
    }

    $scope.showMoreLearners = function() {
        $scope.model.showMoreLoading = true;
        $scope.model.searchData.offset = $scope.model.learnersList.length;
        service.searchLearners($scope.model.searchData).then(function(data) {
            $scope.model.learnersList.push.apply($scope.model.learnersList, data.learners);
            $scope.model.learnerCount = data.learnerCount;
            $scope.model.showMoreLoading = false;
            $scope.evalShowMoreLearners();
        }).catch($scope.error);
    }

    $scope.evalShowMoreLearners = function() {
        if($scope.model.learnerCount > $scope.model.learnersList.length) {
            $scope.model.showMore = true;
        } else {
            $scope.model.showMore = false;
        }
    }

    $scope.getSearchData = function(type) {
        var data = {
            courseId: $rootScope.courseId,
            type: type,
            filters: []
        }
        for(k in $scope.model.searchLearners.filters) {
            var val = $scope.model.searchLearners.filters[k];
            var field = $scope.model.searchFields[k];
            if(!val || typeof val == 'undefined') {
                continue;
            }
            if((field.type == 'text' || field.type == 'date' ) && val.length == 0) {
                continue;
            }
            if(field.type == 'multiselect' && val.length == 0) {
                continue;
            }
            var value = val;
            if(field.type == 'multiselect') {
                value = [];
                val.forEach(function(valObj) {
                    value.push(valObj.value);
                });
            } else if(field.type == 'select') {
                value = val.value;
            }
            data.filters.push({name: field.name, operator: field.operator, value: value, type: field.type});
        }
        if($scope.model.searchLearners.lecture) {
            data.filters.push({name:'enrollment.learning_element_id', operator:'eq', value: cbService.addFedoraPrefix($scope.model.searchLearners.lecture.id)});
            if($scope.model.searchLearners.complete == 'true') {
                data.filters.push({name:'enrollment.is_complete', operator:'eq', value: true});
            } else {
                data.filters.push({name:'enrollment.is_complete', operator:'eq', value: false, optional: true});
            }
        }
        if($scope.model.searchLearners.event) {
            data.filters.push({name:'enrollment.learning_element_id', operator:'eq', value: $scope.model.searchLearners.event.identifier});
            if($scope.model.searchLearners.eventValue == 'true') {
                data.filters.push({name:'enrollment.is_complete', operator:'eq', value: true});
            } else {
                data.filters.push({name:'enrollment.is_complete', operator:'eq', value: false, optional: true});
            }
        }
        if($scope.model.searchLearners.la) {
            data.filters.push({name:'enrollment.learning_element_id', operator:'eq', value: $scope.model.searchLearners.la.identifier});
            if($scope.model.searchLearners.laMinScore && $scope.model.searchLearners.laMinScore != '') {
                data.filters.push({name:'enrollment.score', operator:'ge', value: $scope.model.searchLearners.laMinScore});
            }
            if($scope.model.searchLearners.laMaxScore && $scope.model.searchLearners.laMaxScore != '') {
                data.filters.push({name:'enrollment.is_complete', operator:'le', value: $scope.model.searchLearners.laMaxScore});
            }
        }
        return data;
    }

    $scope.clearSearch = function() {
        $scope.model.searchLearners.complete = undefined;
        $scope.model.searchLearners.lecture = undefined;
        $scope.model.searchLearners.filters = {};
        $scope.model.searchLearners.la = undefined;
        $scope.model.searchLearners.event = undefined;
        $scope.model.searchLearners.eventValue = undefined;
        $scope.model.searchLearners.laMinScore = undefined;
        $scope.model.searchLearners.laMaxScore = undefined;
        $scope.initializeSelect2();
        $timeout(function() {
            $("select.selectBox").select2({allowClear: true, placeholder: 'Select One...'});
        }, 100);
        $scope.searchLearners();
    }

    $scope.showLearnerSearch = function(value) {
        $scope.model.showLearnerSearch = value;
        if(value) {
            $scope.searchLearners();
        }
    }

    $scope.getLearnerSearchFields = function() {
        service.getLearnerSearchFields($rootScope.courseId).then(function(data) {
            $scope.model.searchConfig = data;
            $scope.model.searchFields = {};
            data.searchFields.forEach(function(field) {
                $scope.model.searchFields[field.name] = field;
            });

            var totalFields = (data.searchFields || []).length;
            $scope.totalSearchFields = totalFields;
            var leftColumn = 0;
            if ($scope.totalSearchFields > 0) {
                leftColumn = parseInt($scope.totalSearchFields/2) + 1;
            }
            $scope.leftColSearchFields = leftColumn;

            $timeout(function() {
                $("select.selectBox").select2({allowClear: true, placeholder: 'Select One...'});
            }, 500);
        }).catch($scope.error);
    }

    $scope.addedToGroup = function(memberId) {
        return ($scope.model.listMemberIds.indexOf(memberId) > -1)
    }

    $scope.backToList = function() {
        $scope.model.listMembers = undefined;
        $scope.model.selectedList = undefined;
        $scope.model.selectedGroup = undefined;
        $scope.getLists();
        $scope.initializeToolTips();
    }

    $scope.initializeToolTips = function() {
        $timeout(function() {
            $('.tool-tip').tooltip({html: true});
        }, 100);
    }

    $scope.initializeSelect2 = function() {
        $timeout(function() {
            $("#lectureSelect").select2({
                formatResult: function(state) {
                    return state.text;
                },
                placeholder: "Select Lectures...",
                formatSelection: function(state) {
                    return state.text.replace(/&emsp;/g, '');
                },
                allowClear: true,
                escapeMarkup: function(m) { return m; }
            });
        }, 100);
    }

    $scope.getFollowing();
    $scope.getLists();
    $scope.getUserRole();
    $scope.getLearnerSearchFields();
    $timeout(function() {
        $('#listDescription').wysihtml5();
        $('.tool-tip').tooltip({html: true});
    }, 1000);
}]);

app.controller('communityFollowController', ['$scope', '$window', '$timeout', '$rootScope', 'CommunityService', 'InteractionService', '$state', '$controller', '$stateParams', function($scope, $window, $timeout, $rootScope, service, intService, $state, $controller, $stateParams) {

    $controller('BaseCommunityController', { $scope: $scope });
    $scope.model.followers = undefined;
    $scope.getFollowers = function() {
        service.getFollowers({count: 200}).then(function(data) {
            $scope.model.followers = data;
            $scope.model.followers.members = [];
            data.items.forEach(function(member) {
                $scope.model.followers.members.push(member.preferredUsername);
            });
        }).catch($scope.error);
    }

    $scope.model.followType = $stateParams.followType;
    $scope.getFollowing();
    if($scope.model.followType == 'followers') {
        $scope.getFollowers();
    }
}]);

app.controller('communityPeopleController', ['$scope', '$window', '$timeout', '$rootScope', 'CommunityService', 'InteractionService', '$state', '$controller', '$stateParams', function($scope, $window, $timeout, $rootScope, service, intService, $state, $controller, $stateParams) {

    $controller('communityListController', { $scope: $scope });
    service.userName = $('#loggedUserId').val();
    $scope.model.profileUser = $stateParams.userId;
    $scope.model.people = {
        search: {
            courseId: $rootScope.courseId,
            query: undefined,
            type: 'peopleSearch'
        },
        items: [],
        totalItemsCount: undefined,
        showMore: false,
        showMoreLoading: false
    };
    $scope.model.user = {
        profile: undefined,
        communityProfile: undefined,
        majorFeed: undefined,
        minorFeed: undefined,
        activeMenu: 'activities',
        following: undefined,
        followers: undefined,
        discussions: undefined
    }
    $scope.model.userMetadata = undefined;

    $scope.model.userPassword = undefined;

    $scope.changePassword = function() {
        $("#changePwd").html("Changing...").attr("disabled", true);
        var errorMessage = "Please fill all fields.";
        var errorFunc = function(msg,timeout) {
            $("#changePwd").html("Change Password").attr("disabled", false);
            if(!timeout) timeout = 5000;
            $("#changePwdAlert").html(msg).addClass("alert-danger").removeClass("hide");
            setTimeout(function() {
                $("#changePwdAlert").html("").removeClass("alert-danger").addClass("hide");
            }, timeout);
        };

        if($scope.model.userPassword && $scope.model.userPassword.currentPassword && $scope.model.userPassword.newPassword && $scope.model.userPassword.confirmNewPassword) {
            if($scope.model.userPassword.newPassword === $scope.model.userPassword.confirmNewPassword) {
                if($scope.model.userPassword.newPassword != $scope.model.userPassword.currentPassword) {
                    if($scope.model.userPassword.newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@#$!%*?&])[A-Za-z\d$@#$!%*?&]{6,}$/)) {
                        service.changePassword($scope.model.userPassword).then(function(data) {
                            if(data && data.STATUS) {
                                if(data.STATUS == "SUCCESS" && data.isValidPassword) {
                                    $("#changePwd").html("Change Password").attr("disabled", false);
                                    $scope.model.userPassword = {};
                                    openResetPassword();
                                    $rootScope.showConformationMessage('alert-success',"Password changed successfully.");
                                } else {
                                    $scope.model.userPassword.currentPassword = "";
                                    errorFunc(data.errorMessage, 10000);
                                }    
                            } else {
                                errorFunc("Error while saving new password.", 10000);
                            }
                        }).catch(function(err) {
                            errorFunc("Error while saving new password.", 10000);
                        });
                    } else {
                        $scope.model.userPassword.newPassword = $scope.model.userPassword.confirmNewPassword = "";
                        errorMessage = "Password should contain at least 6 characters, 1 number, 1 lowercase character (a-z), 1 uppercase character (A-Z) and 1 special character.";
                        errorFunc(errorMessage, 10000);
                    }
                } else {
                    $scope.model.userPassword = {};
                    errorMessage = "New and Current Passwords should not be same.";
                    errorFunc(errorMessage, 10000);
                }
            } else {
                $scope.model.userPassword.newPassword = $scope.model.userPassword.confirmNewPassword = "";
                errorMessage = "Password does not match the confirm password. Please re-enter the passwords.";
                errorFunc(errorMessage);
            }            
        } else {
            errorFunc(errorMessage);        
        }
    }

    $scope.goBack = function() {
        $window.history.back();
    }

    $scope.getUserProfile = function() {
        service.getUserProfile($scope.model.profileUser).then(function(data) {
            $scope.model.user.profile = data;
            $scope.model.userMetadata = angular.copy(data.metadata);
            $scope.parseProfile();
        }).catch($scope.error);
    }

    $scope.saveUserProfile = function() {
        service.saveUserProfile($scope.model.userMetadata).then(function(data) {
            $scope.getUserProfile();
            $('#writeIcon').trigger('click');
        }).catch($scope.error);
    }

    $scope.parseProfile = function() {
        var metadata = $scope.model.user.profile.metadata || {};
        if(metadata.speakingLanguages && metadata.speakingLanguages != '') {
            metadata.speakingLanguages = $scope.evalValue(metadata.speakingLanguages);
        }
        if(metadata.programmingToolsUsed && metadata.programmingToolsUsed != '') {
            metadata.programmingToolsUsed = $scope.evalValue(metadata.programmingToolsUsed);
        }
        if(metadata.programmingProficiency && metadata.programmingProficiency != '') {
            metadata.programmingProficiency = $scope.getRating(metadata.programmingProficiency);
        }
        if(metadata.computerScienceSpecializations && metadata.computerScienceSpecializations != '') {
            metadata.computerScienceSpecializations = $scope.evalValue(metadata.computerScienceSpecializations);
        }
        if(metadata.skills && metadata.skills != '') {
            metadata.skills = $scope.evalValue(metadata.skills);
        }
    }

    $scope.evalValue = function(property) {
        var arr = property.split(',');
        var result = [];
        arr.forEach(function(item) {
            var tmpArr = item.split(':');
            result.push({label: tmpArr[0], value: $scope.getRating(tmpArr[1])});
        })
        return result;
    }

    $scope.getRating = function(value) {
        if(!value) return 'average';
        var intVal = parseInt(value);
        if(intVal == 'NaN') return 'average';
        if(intVal < 4) return 'poor';
        if(intVal < 7) return 'average';
        return 'good';
    }

    $scope.getCommunityProfile = function() {
        service.getUser($scope.model.profileUser).then(function(data) {
            $scope.model.user.communityProfile = data;
        }).catch($scope.error);
    }

    $scope.getUserMajorFeed = function() {
        $scope.model.user.activeMenu = 'activities';
        service.getUserMajorFeed($scope.model.profileUser).then(function(data) {
            $scope.model.user.majorFeed = data;
        }).catch($scope.error);
    }

    $scope.getUserMinorFeed = function() {
        service.getUserMinorFeed($scope.model.profileUser).then(function(data) {
            $scope.model.user.minorFeed = data;
        }).catch($scope.error);
    }

    $scope.getUserFollowing = function() {
        $scope.model.user.activeMenu = 'following';
        service.getFollowing({count: 20}, $scope.model.profileUser).then(function(data) {
            $scope.model.user.following = data;
        }).catch($scope.error);
    }

    $scope.getUserFollowers = function() {
        $scope.model.user.activeMenu = 'followers';
        service.getFollowers({count: 20}, $scope.model.profileUser).then(function(data) {
            $scope.model.user.followers = data;
        }).catch($scope.error);
    }

    $scope.getUserDiscussions = function() {
        $scope.model.user.activeMenu = 'discussions';
        var args = {
            courseId: $rootScope.courseId,
            metadata: {
                interactionType: 'QA',
                from: $scope.model.profileUser
            },
            limit: 20,
            offset: 0
        }
        intService.searchInteractions(args).then(function(response) {
            $scope.model.user.discussions = response;
        }).catch($scope.error);
    }

    $scope.searchPeople = function() {
        $scope.model.people.showMoreLoading = true;
        $scope.model.people.search.offset = $scope.model.people.items.length;
        service.searchLearners($scope.model.people.search).then(function(data) {
            $scope.model.people.items.push.apply($scope.model.people.items, data.learners);
            $scope.model.people.totalItemsCount = data.learnerCount;
            $scope.model.people.showMoreLoading = false;
            $scope.evalShowMorePeople();
        }).catch($scope.error);
    }

    $rootScope.$on('peopleSearchData', function(event, args) {
        $scope.model.people.search = args.search;
        $scope.model.people.items = args.result.learners;
        $scope.model.people.totalItemsCount = args.result.learnerCount;
        $scope.evalShowMorePeople();
    });

    $scope.evalShowMorePeople = function() {
        if($scope.model.people.totalItemsCount > $scope.model.people.items.length) {
            $scope.model.people.showMore = true;
        } else {
            $scope.model.people.showMore = false;
        }
    }

    if($stateParams.userId && $stateParams.userId != '') {
        $scope.getUserProfile();
        $scope.getCommunityProfile();
        $scope.getUserMajorFeed();
    } else {
        $scope.searchPeople();
    }

    $scope.search = function() {
        var searchData = $scope.getSearchData('peopleSearch');
        service.searchLearners(searchData).then(function(data) {
            $scope.$emit('peopleSearchData', {result: data, search: searchData});
        }).catch($scope.error);
    }

    $scope.showSearchForm = function() {
        $('#peopleSearchForm').slideToggle('slow');
        $('#advancedSearchIcon').toggleClass('fa-toggle-down');
        $('#advancedSearchIcon').toggleClass('fa-close');
    };

    //$scope.getUserMinorFeed();
}]);

app.controller('peopleSearchController', ['$scope', '$window', '$timeout', '$rootScope', 'CommunityService', 'InteractionService', '$state', '$controller', '$stateParams', function($scope, $window, $timeout, $rootScope, service, intService, $state, $controller, $stateParams) {

    $controller('communityListController', { $scope: $scope });
    $scope.searchWindowOpen = false;
    

    $scope.showSearchWindow = function() {
        $scope.searchWindowOpen = !$scope.searchWindowOpen;
        if($scope.searchWindowOpen) {
            $timeout(function() {
                rightBarSearchDivOpen();
            }, 10);
        } else {
            $timeout(function() {
                rightBarSearchDivClose();
            }, 10);
        }
    }
    $timeout(function() {
        rightBarSearchDivClose();
    }, 100);

}]);

app.directive('ngCommunityEvent', function() {
    return {
        restrict: 'A',
        scope: {
            activity: '=',
            index: '='
        },
        templateUrl: '/templates/community/coachingEvent.html',
        link: function(scope, element, attrs) {
            scope.like = scope.$parent.like;
            scope.activateComment = scope.$parent.activateComment;
            scope.renderHtml = scope.$parent.renderHtml;
            scope.setEventStatus = scope.$parent.setEventStatus;
            scope.getEventStatus = scope.$parent.getEventStatus;
            scope.goToObject = scope.$parent.goToObject;
        }
    };
});
app.directive('ngCommunityNotification', function() {
    return {
        restrict: 'A',
        scope: {
            activity: '=',
            index: '='
        },
        templateUrl: '/templates/community/notification.html',
        link: function(scope, element, attrs) {
            scope.renderHtml = scope.$parent.renderHtml;
        }
    };
});
app.directive('ngCommunityBinder', function() {
    return {
        restrict: 'A',
        scope: {
            activity: '=',
            index: '='
        },
        templateUrl: '/templates/community/binder.html',
        link: function(scope, element, attrs) {
            scope.like = scope.$parent.like;
            scope.activateComment = scope.$parent.activateComment;
            scope.renderHtml = scope.$parent.renderHtml;
            scope.goToObject = scope.$parent.goToObject;
        }
    };
});
app.directive('ngCommunityDefault', function() {
    return {
        restrict: 'A',
        scope: {
            activity: '=',
            index: '='
        },
        templateUrl: '/templates/community/defaultNote.html',
        link: function(scope, element, attrs) {
            scope.like = scope.$parent.like;
            scope.activateComment = scope.$parent.activateComment;
            scope.renderHtml = scope.$parent.renderHtml;
        }
    };
});

app.directive('ngCommunityUser', function() {
    return {
        restrict: 'A',
        scope: {
            cssClass: '=',
            context: '=',
            userId: '=',
            userName: '='
        },
        template: '<a class="{{cssClass}}" href="javascript:void(0)" ng-click="userProfile(context, userId)">{{name}}</a>',
        link: function(scope, element, attrs) {
            scope.userProfile = scope.$root.userProfile;
            scope.name = (scope.userId == scope.$root.loggedUserId ? 'You' : scope.userName);
            scope.$watch('userName', function (value) {
                scope.userName = value;
                scope.name = (scope.userId == scope.$root.loggedUserId ? 'You' : scope.userName);
            }, true);
        }
    };
});

function openPostArea(thisObj, className) {
    $("#il-Txt-Editor").slideToggle('slow');
    $(thisObj).toggleClass('fa-close');
    $(thisObj).toggleClass(className);
}

function openOrgEditArea(thisObj, className) {
    $("#il-Org-Edit").slideToggle('slow');
    $('.wysihtml5-sandbox').css('height',500);
    $(thisObj).toggleClass('fa-close');
    $(thisObj).toggleClass(className);
}



function openResetPassword() {
    $("#il-Rset-Pwd").slideToggle('slow');
}
