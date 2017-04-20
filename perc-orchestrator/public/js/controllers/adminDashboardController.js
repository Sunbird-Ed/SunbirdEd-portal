var app = angular.module('adminDashboard', ['ngSanitize']);

app.controller('DashboardCtrl', function($scope, $rootScope, $http, $location, $window, $sce) {

    $scope.contentLoaded = false;
    $scope.allCourses = [];
    $scope.selectedCourse = undefined;

    $scope.renderHtmlTrim = function(htmlCode, limitTo) {
        var subHtmlCode = htmlCode.substr(0, limitTo);
        if (htmlCode.length > limitTo) subHtmlCode = subHtmlCode + "...";
        var result = $sce.trustAsHtml(subHtmlCode);
        return result;
    };

    $scope.loadDashboard = function() {
        $http.get('/private/v1/player/dashboard/admin').success(function(data) {
            $scope.allCourses = data;
            var urlParams = $location.search();
            console.log('urlParams', urlParams);
            if(urlParams.tab == 'courseSettings') {
                $scope.allCourses.forEach(function(course) {
                    if(course.inboxEmailId == urlParams.inboxId) {
                        $scope.courseSettings(course);
                    }
                });
                if(urlParams.err == "1") {
                    console.log('setting alertmessages');
                    $scope.alertClass = 'alert-danger';
                    $scope.alertMsg = 'Unable to authorize course inbox';
                } else {
                    $scope.alertClass = 'alert-success';
                    $scope.alertMsg = 'Authorization successful';
                }
            }
            $scope.contentLoaded = true;
        });
    };

    $scope.selectCourse = function(course) {
        $scope.errorMsg = undefined;
        $scope.selectedCourse = course;
        $http.get('/v1/instructor/course/' + encodeURIComponent(course.identifier)).success(function(data) {
            $scope.selectedCourse.instructors = data;
        });
        $scope.showCourse = true;
    }

    $scope.checkTokens = function() {
        $scope.checkingTokens = true;
        var args = {
            inboxEmailId: $scope.selectedCourse.inboxEmailId
        }
        $http.post('/private/v1/course/inbox/checkTokens', args).success(function(data) {
            $scope.selectedCourse.tokensResp = data;
            $scope.checkingTokens = false;
        });
    }

    $scope.courseSettings = function(course) {
        $scope.alertMsg = undefined;
        $scope.selectedCourse = course;
        $scope.showCourseSettings = true;
        $scope.checkTokens();
    }

    $scope.setCourseInbox = function() {
        $scope.alertMsg = undefined;
        var args = {
            courseId: $scope.selectedCourse.identifier,
            inboxEmailId: $scope.selectedCourse.inboxEmailId
        }
        $http.post('/private/v1/course/setInbox', args).success(function(data) {
            $('#courseSettingsModal').modal('hide');
            $scope.checkTokens();
        });
    }

    $scope.setCommunity = function() {
        $scope.alertMsg = undefined;
        var args = {
            courseId: $scope.selectedCourse.identifier
        }
        $scope.progressMsg = 'Setting up course community';
        $http.post('/private/v1/course/community', args).success(function(data) {
            $scope.selectedCourse.community = data;
            $scope.progressMsg = undefined;
        }).catch(function(err) {
            $scope.progressMsg = undefined;
        });
    }

    $scope.resetCommunity = function() {
        $scope.alertMsg = undefined;
        var args = {
            courseId: $scope.selectedCourse.identifier
        }
        $http.post('/private/v1/course/community/reset', args).success(function(data) {
            $scope.selectedCourse.community = data;
        });
    }

    $scope.rebalance = function() {
        $scope.errorMsg = undefined;
        var totalCapacity = 0;
        var args = {
            courseId: $scope.selectedCourse.identifier,
            coaches: []
        }
        var isValid = true;
        $scope.selectedCourse.instructors.forEach(function(instructor) {
            if(instructor.role != 'faculty') {
                instructor.maxCapacityNum = !$.isNumeric(instructor.maxCapacity);
                if(instructor.maxCapacityNum) {
                    isValid = false;
                }
                totalCapacity += parseInt(instructor.maxCapacity || 0);
                args.coaches.push({identifier: instructor.identifier, maxCapacity: parseInt(instructor.maxCapacity)});
            }
        });
        if(!isValid) {
            return;
        }
        if(totalCapacity >= $scope.selectedCourse.studentCount) {
            $('#rebalanceBtn').button('loading');
            $http.post('/private/v1/coaching/rebalanceCoaches', args).success(function(data) {
                $scope.selectedCourse.instructors = data;
                $('#rebalanceBtn').button('reset');
            }).error(function(err) {
                $('#rebalanceBtn').button('reset');
                $scope.errorMsg = err;
            });
        } else {
            $scope.errorMsg = 'The combined capacity of all coaches should more or equal to the students count';
        }
    }

    $scope.loadDashboard();

});

