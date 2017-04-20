app.service('CommunityProfileService', ['PumpUtil', '$http', '$q', function(pumpUtil, $http, $q) {

    this.userName = undefined;

    this.getId = function(id, index) {
        var path = id.replace(pumpUtil.BASE_URL, '');
        var params = path.split('/');
        if (params[index]) {
            return params[2];
        } else {
            return '';
        }
    }

    this.getMajorInbox = function(args) {
        var url = pumpUtil.INBOX_MAJOR_URL.replace(':userName', this.userName);
        return pumpUtil.call(url, 'GET', this.userName, args);
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
        if(listId.indexOf(pumpUtil.BASE_URL) == -1) {
            listId = pumpUtil.PUMP_COLLECTION.replace(':collectionUID', listId);
        }
        userId = userId || this.userName;
        var url = listId + '/members';
        return pumpUtil.call(url, 'GET', userId, {count: 200});
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
        if(memberId.indexOf(pumpUtil.BASE_URL) == -1) {
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
        if(memberId.indexOf(pumpUtil.BASE_URL) == -1) {
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
        return this.postToService('/private/v1/player/searchLearners/', data);
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
}]);

app.controller('MyCoursesCtrl', ['$scope', '$window', '$timeout', '$rootScope', 'CommunityProfileService', '$state', '$controller', '$stateParams', '$upload', 'RBACService', '$http', '$location', '$sce', 'CourseBrowserService', function($scope, $window, $timeout, $rootScope, service, $state, $controller, $stateParams,  $upload, RBACService, $http, $location, $sce, CourseBrowserService) {
    $rootScope.showDashboardData = true;
    $scope.enrolledCourses = [];
    $scope.user = null;
    $scope.student = null;
    $scope.evernoteAccess = false;
    $scope.contentLoaded = false;
    $scope.environment = 'General';
    $scope.leaderboard = {};
    $scope.loadingMyCourses = true;
    $scope.otherCourses = [];
    $scope.courseNames = {};

    $scope.renderHtmlTrim = function(htmlCode, limitTo) {
        var subHtmlCode = htmlCode.substr(0, limitTo);
        if (htmlCode.length > limitTo) subHtmlCode = subHtmlCode + "...";
        var result = $sce.trustAsHtml(subHtmlCode);
        return result;
    };

    $scope.getUpcomingEvents = function(courseIds) {
        $http.post('/private/v1/player/student/upcomingEvents', {courseIds: courseIds}).success(function(data) {
            $scope.upcomingEvents = data;
            setTimeout(function() {
                $('[data-toggle="tooltip"]').tooltip();
            }, 500);
        });
    }

    $scope.playElement = function(courseId, eventId) {
        var fedoraPrefix = "info:fedora/";
        if (eventId.indexOf(fedoraPrefix) == 0) {
            eventId = eventId.substring(fedoraPrefix.length);
        }
        document.location.href = '/private/player/course/' + encodeURIComponent(courseId) + '#/browser/' + eventId;
    }  

    $scope.loadDashboard = function() {

        $http.get('/private/v1/player/dashboard/user').success(function(data) {
            $scope.user = data;
            if (!$scope.user.social_info) {
                $scope.user.social_info = {};
            }
            if ($scope.user.noteSettings && $scope.user.noteSettings.evernoteAccess && $scope.user.noteSettings.evernoteAccess.notebookGuid) {
                if ($scope.user.noteSettings.evernoteAccess.notebookGuid != '') {
                    $scope.evernoteAccess = true;
                }
            }
        });

        if (RBACService.can('faculty_observer_read')) {
            $http.get('/private/v1/player/student/dashboard').success(function(data) {
                $scope.loadingMyCourses = false;
                $scope.tutor = {};
                $scope.tutor.courses = [];
                data.enrolledCourses.forEach(function(course) {
                    if(course) {
                        $scope.tutor.courses.push({"courseName": course.name, "nodeId": course.nodeId, "courseId": course.course_id});
                    }
                });
            });
        } else if (RBACService.can("instructor_read")) {
            $http.get('/private/v1/tutor').success(function(data) {
                $scope.loadingMyCourses = false;
                $scope.tutor = data;
                
                if (data.courses && data.courses.length > 0) {
                    for (var i = 0; i < data.courses.length; i++) {
                        var packageId = "none";
                        $http.get('/private/v1/player/updateLearnerPath/' + encodeURIComponent(data.courses[i].courseId) + '/' + encodeURIComponent(packageId)).success(function(resp) {});
                    }
                }
            });
        } else if (RBACService.can('student_read')) {
            $http.get('/private/v1/player/student/dashboard').success(function(data) {
                $scope.loadingMyCourses = false;
                data.enrolledCourses.forEach(function(course) {
                    if(course) {
                        $scope.enrolledCourses.push(course);
                    }
                });
                $scope.suggestedCourses = data.suggestedCourses;
                $scope.student = data.student;
                var courseIds = [];
                if ($scope.enrolledCourses && $scope.enrolledCourses.length > 0) {
                    for (var i = 0; i < $scope.enrolledCourses.length; i++) {
                        $scope.setProgressPopover($scope.enrolledCourses[i]);
                        courseIds.push($scope.enrolledCourses[i].course_id);
                        $scope.setCourseSummary($scope.enrolledCourses[i]);
                        if (!$scope.enrolledCourses[i].packageId) $scope.enrolledCourses[i].packageId = "none";
                        $http.get('/private/v1/player/updateLearnerPath/' + encodeURIComponent($scope.enrolledCourses[i].course_id) + '/' + encodeURIComponent($scope.enrolledCourses[i].packageId)).success(function(resp) {});
                    }
                    $scope.getUpcomingEvents(courseIds);
                }

                setTimeout(function() {
                    $('.content-loaded').show();
                    enableFlips();
                    $('i').tooltip();
                    $('canvas').popover({
                        html: true,
                        placement: 'right',
                        trigger: 'hover',
                        title: 'Completion Details'
                    });
                }, 100);
                $scope.contentLoaded = true;
            });
        }

        setTimeout(function() {
            $('.content-loaded').show();
            enableFlips();
            $('i').tooltip();
            $('canvas').popover({
                html: true,
                placement: 'right',
                trigger: 'hover',
                title: 'Completion Details'
            });
        }, 100);
        $scope.contentLoaded = true;
    };

    $scope.setCourseSummary = function(enrolledCourse) {
        $http.get('/private/v1/student/courseSummary/' + encodeURIComponent(enrolledCourse.course_id) + '/' + encodeURIComponent(enrolledCourse.student_id)).success(function(data) {
            enrolledCourse.studentGrade = data.grade;
            enrolledCourse.currentProgress = data.complete;
            enrolledCourse.completeCount = data.completeCount;
            enrolledCourse.expectedProgress = data.expected;
            enrolledCourse.expectedCount = data.expectedCount;
            enrolledCourse.totalCount = data.totalCount;
            enrolledCourse.percentile = data.percentile;
            enrolledCourse.offset = data.offset;
            enrolledCourse.timeUnit = data.timeUnit;
            enrolledCourse.enrolledDate = data.enrolledDate;
            enrolledCourse.isStudent = true;
        });
    }

    $scope.setProgressPopover = function(enrolledCourse) {
        if (!enrolledCourse.lob) {
            return;
        }
        var progressHtml = '<dl class="dl-horizontal progress-dl">';
        enrolledCourse.lob.lobs_count.forEach(function(lobCount) {
            progressHtml += '<dt>' + lobCount.elementType + 's</dt>';
            progressHtml += '<dd>' + (lobCount.complete ? lobCount.complete : '0') + '/' + lobCount.total + '</dd>';
        });
        enrolledCourse.lob.elements_count.forEach(function(elemCount) {
            progressHtml += '<dt>' + elemCount.elementType + 's</dt>';
            progressHtml += '<dd>' + (elemCount.complete ? elemCount.complete : '0') + '/' + elemCount.total + '</dd>';
        });
        progressHtml += '</dl>';
        enrolledCourse.progressHtml = progressHtml;
    }

    $scope.showCoursePage = function(courseId) {
        if ($rootScope.courseId == courseId || $rootScope.courseLobId == courseId) {
            selectLeftMenuTab('courseTab');
            $state.go('cb', {
                lobId: CourseBrowserService.currentItem.id
            });
        } else {
            navigateTo('/private/player/course/', courseId);    
        }
    };

    $scope.showStudentSummary = function(courseId) {
        if ($rootScope.courseId == courseId || $rootScope.courseLobId == courseId) {
            selectLeftMenuTab('courseTab');
            $state.go('studentSummary', {});
        } else {
            document.location.href = '/private/player/course/' + encodeURIComponent(courseId) + '#/studentSummary';
        }
    }

    $scope.showCoursePeople = function(courseId) {
        if ($rootScope.courseId == courseId || $rootScope.courseLobId == courseId) {
            selectLeftMenuTab('communityTab');
            $state.go('people', {});
        } else {
            document.location.href = '/private/player/course/' + encodeURIComponent(courseId) + '#/community/people';
        }
    }

    $scope.showGradebook = function(courseId) {
        if ($rootScope.courseId == courseId || $rootScope.courseLobId == courseId) {
            selectLeftMenuTab('courseTab');
            $state.go('gradebook', {});
        } else {
            document.location.href = '/private/player/course/' + encodeURIComponent(courseId) + '#/gradebook';
        }
    }    

    $scope.updateProfile = function() {

        var profile = {
            studentId: $scope.user.identifier,
            givenName: $scope.user.name.givenName,
            middleName: $scope.user.name.middleName,
            familyName: $scope.user.name.familyName,
            /* educationQualification: $scope.student.educationQualification,
            jobTitle: $scope.student.jobTitle,
            companyName: $scope.student.companyName,*/
            email: $scope.user.email,
            /* contactNumber: $scope.student.contactNumber,
            website: $scope.student.website,*/
            linkedin: $scope.user.social_info.linkedin,
            facebook: $scope.user.social_info.facebook,
            googleplus: $scope.user.social_info.googleplus,
            twitter: $scope.user.social_info.twitter,
            github: $scope.user.social_info.github
        };
        $http.post('/private/v1/player/user/updateProfile', {
            'profile': profile
        }).success(function(data) {
            $('#editProfileModal').modal('hide');
        });
    }

    $scope.onUserImageSelect = function($files) {
        for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            $scope.upload = $upload.upload({
                url: '/private/v1/player/user/updateImage',
                data: {
                    studentId: $scope.user.identifier
                },
                file: file,
            }).progress(function(evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
                // file is uploaded successfully
                if (data && data.url) {
                    $scope.user.image = data.url;
                    $("#userImage").attr("src", data.url);
                }
            });
        }
    };

    // get the learner list which is enrolled in it    
    $scope.showLearnerListPage = function(courseId) {
        navigateTo('/private/player/LearnerList/course/', courseId);
    };

    $scope.userCan = function(actionName) {
        return RBACService.can(actionName);
    }
    RBACService.getActions().success(function(actions) {
        RBACService.actions = actions;
        $scope.loadDashboard();
    });

}]);

app.controller('peopleProfileController', ['$scope', '$window', '$timeout', '$rootScope', 'CommunityProfileService', '$state', '$controller', '$stateParams', '$upload', function($scope, $window, $timeout, $rootScope, service, $state, $controller, $stateParams,  $upload) {
    $rootScope.showDashboardData = false;

    $scope.model = {loggedUserId: $('#loggedUserId').val()};
    service.userName = $('#loggedUserId').val();
    console.log("service.userName:",service.userName);
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

    $scope.getFollowing = function() {
        service.getFollowing({count: 200}).then(function(data) {
            $scope.model.following = data;
            $scope.model.following.members = [];
            data.items.forEach(function(member) {
                $scope.model.following.members.push(member.preferredUsername);
            });
        }).catch($scope.error);
    }

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
            $scope.parseUserMetadata();
            $scope.parseProfile();
        }).catch($scope.error);
    }

    $scope.saveUserProfile = function() {
        var userMetadata = angular.copy($scope.model.userMetadata);
        $scope.composeUserMetadata(userMetadata);
        service.saveUserProfile(userMetadata).then(function(data) {
            $scope.getUserProfile();
            $('#writeIcon').trigger('click');
        }).catch($scope.error);
    }

    $scope.parseUserMetadata = function() {
        var metadata = $scope.model.userMetadata || {};
        if(metadata.speakingLanguages && metadata.speakingLanguages != '') {
            metadata.speakingLanguages = $scope.evalRatingValue(metadata.speakingLanguages);
        } else {
            metadata.speakingLanguages = [];
        }
        if(metadata.programmingToolsUsed && metadata.programmingToolsUsed != '') {
            metadata.programmingToolsUsed = $scope.evalRatingValue(metadata.programmingToolsUsed);
        } else {
            metadata.programmingToolsUsed = [];
        }
        if(metadata.computerScienceSpecializations && metadata.computerScienceSpecializations != '') {
            metadata.computerScienceSpecializations = $scope.evalRatingValue(metadata.computerScienceSpecializations);
        } else {
          metadata.computerScienceSpecializations = [];  
        }
        if(metadata.skills && metadata.skills != '') {
            metadata.skills = $scope.evalRatingValue(metadata.skills);
        } else {
            metadata.skills = [];
        }
        if(metadata.programmingProficiency && metadata.programmingProficiency != '') {
            metadata.programmingProficiency = parseInt(metadata.programmingProficiency);
        } else {
            metadata.programmingProficiency = [];
        }
        if(metadata.yearOfGraduation) {
            metadata.yearOfGraduation = parseInt(metadata.yearOfGraduation);
        }
        if(metadata.workExperience) {
            metadata.workExperience = parseInt(metadata.workExperience);
        }
    }

    $scope.evalRatingValue = function(property) {
        var arr = property.split(',');
        var result = [];
        arr.forEach(function(item) {
            var tmpArr = item.split(':');
            result.push({label: tmpArr[0], value: (tmpArr[1])?parseInt(tmpArr[1]):0});
        })
        return result;
    }

    $scope.removeRating = function(ratings, rating) {
        var index = ratings.indexOf(rating);
        ratings.splice(index, 1);
    }

    $scope.composeUserMetadata = function(metadata) {
        var prepareString = function(property) {
            var strValue = [];
            property.forEach(function(item) {
                if(item.label) strValue.push(item.label+":"+item.value);
            });
            return strValue.toString();
        };

        var parseURL = function(s) {
            var prefix = 'http://';
            if (s.substr(0, prefix.length) !== prefix)
            {
                s = prefix + s;
            }
            return s;
        }

        if(metadata.speakingLanguages && metadata.speakingLanguages != '') {
            metadata.speakingLanguages = prepareString(metadata.speakingLanguages);
        }
        if(metadata.programmingToolsUsed && metadata.programmingToolsUsed != '') {
            metadata.programmingToolsUsed = prepareString(metadata.programmingToolsUsed);
        }
        if(metadata.computerScienceSpecializations && metadata.computerScienceSpecializations != '') {
            metadata.computerScienceSpecializations = prepareString(metadata.computerScienceSpecializations);
        }
        if(metadata.skills && metadata.skills != '') {
            metadata.skills = prepareString(metadata.skills);
        }

        if(metadata.website && metadata.website != '') {
            metadata.website = parseURL(metadata.website);
        }
        if(metadata.facebook && metadata.facebook != '') {
            metadata.facebook = parseURL(metadata.facebook);
        }
        if(metadata.linkedin && metadata.linkedin != '') {
            metadata.linkedin = parseURL(metadata.linkedin);
        }
        if(metadata.twitter && metadata.twitter != '') {
            metadata.twitter = parseURL(metadata.twitter);
        }
        if(metadata.googleplus && metadata.googleplus != '') {
            metadata.googleplus = parseURL(metadata.googleplus);
        }
        if(metadata.github && metadata.github != '') {
            metadata.github = parseURL(metadata.github);
        }
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

    $scope.onUserImageSelect = function($files) {
        for (var i = 0; i < $files.length; i++) {
            var file = $files[i];

            if(file.type.indexOf("image") == -1) {
                $("#imageUploadAlert").html("").addClass("hide").removeClass("alert-danger").removeClass("alert-success");
                $("#imageUploadAlert").html("Please select an image file.").addClass("alert-danger").removeClass("hide");
                setTimeout(function() {
                    $("#imageUploadAlert").html("").addClass("hide").removeClass("alert-danger");
                }, 5000);
                return;
            }

            if(file.size > 2097152) {
                $("#imageUploadAlert").html("").addClass("hide").removeClass("alert-danger").removeClass("alert-success");
                $("#imageUploadAlert").html("Please select an image file of size less than 2MB.").addClass("alert-danger").removeClass("hide");
                setTimeout(function() {
                    $("#imageUploadAlert").html("").addClass("hide").removeClass("alert-danger");
                }, 5000);
                return;
            }
            
            $scope.upload = $upload.upload({
                url: '/private/v1/player/user/updateImage',
                data: {
                    studentId: $scope.model.loggedUserId
                },
                file: file,
            }).progress(function(evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
                // file is uploaded successfully
                $("#imageUploadAlert").html("").addClass("hide").removeClass("alert-danger").removeClass("alert-success");
                $("#imageUploadAlert").html("Image updated successfully.").addClass("alert-success").removeClass("hide");
                setTimeout(function() {
                    $("#imageUploadAlert").html("").addClass("hide").removeClass("alert-success");
                }, 5000);

                if (data && data.url) {
                    $scope.model.user.profile.metadata.image = data.url;
                    $scope.model.user.profile.image = data.url;
                    $("#userImage").attr("src", data.url);
                }
            });
        }
    };

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

    if($stateParams.userId && $stateParams.userId != '') {
        setTimeout(function() {
            $("#userImageUpload").filestyle({input: false, badge: false, buttonText: "&nbsp;&nbsp;Update Image&nbsp;&nbsp;&nbsp;", iconName: "glyphicon-picture"});
            $('.tool').tooltip();
            $('.tool-tip').tooltip();
        }, 1000);
        $scope.getFollowing();
        $scope.getUserProfile();
        $scope.getCommunityProfile();
        $scope.getUserMajorFeed();
    } else {
        $scope.searchPeople();
    }
}]);

function openProfileResetPassword() {
    $("#il-Rset-Pwd").slideToggle('slow');
    $("#keyIcon").toggleClass('fa-close');
    $("#keyIcon").toggleClass('fa-key');
    $("#updateUserProfile").slideUp('slow');
    $('#writeIcon').removeClass('fa-close');
    $('#writeIcon').addClass('fa-edit');
}

function openProfilePostArea(thisObj, className) {
    // $("#il-Txt-Editor").slideToggle('slow');
    $("#updateUserProfile").slideToggle('slow');
    $(thisObj).toggleClass('fa-close');
    $(thisObj).toggleClass(className);
    $("#il-Rset-Pwd").slideUp('slow');
    $('#keyIcon').removeClass('fa-close');
    $('#keyIcon').addClass('fa-key');
}