
app.controller('BaseLeaderboardCtrl',['$scope', '$http', '$timeout', '$rootScope', 'DashboardService', '$stateParams', '$location', 'CourseBrowserService', '$window', '$compile', '$sce', '$state', function($scope, $http, $timeout, $rootScope, service, $routeParams, $location, cbService, $window, $compile, $sce, $state) {

    $rootScope.leaderboardModel = {};
    $rootScope.leaderboardModel.options = [ "Students", "Colleges", "Streams"];

    $rootScope.selectLeaderBoard = function(board) {
        selectLeftMenuTab('courseTab');
        if (board == 'Students') {
            $state.go('leaderboard', {});
        } else if (board == 'Colleges') {
            $state.go('topColleges', {});
        } else if (board == 'Streams') {
            $state.go('topStreams', {});
        }
    };

}]);

app.controller('leaderboardCtrl',['$scope', '$http', '$timeout', '$rootScope', 'DashboardService', '$stateParams', '$location', 'CourseBrowserService', '$window', '$compile', '$sce', '$state', '$controller', function($scope, $http, $timeout, $rootScope, service, $routeParams, $location, cbService, $window, $compile, $sce, $state, $controller) {
    $controller('BaseLeaderboardCtrl', { $scope: $scope });
    $scope.currentLeaderboard = 'Students';
	$scope.model = {
        nameFieldPlaceHolder: 'FIND BY NAME',
        searchBtnText: 'Filter'
    };
    $scope.searchWindowOpen = false;
    $scope.model.topStudents = [];
    $scope.model.searchConfig = {};
    $scope.model.searchFields = {};
    $scope.model.searchLearners = {
        filters: {}
    };
    $scope.searchCriteria = {};
    $scope.sortFilter = 'grade';
    $scope.datepicker = {
        opened: false,
        dateOptions: {
            formatYear: 'yy',
            startingDay: 1,
            showWeeks: false
        }
    }
    $rootScope.leaderboardModel.currentLeaderBoard = "Students";
    
    $scope.open = function($event, type) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.datepicker.opened = true;
    };

	$scope.getTopStudents = function() {
		service.searchLeaderBoard($rootScope.courseLobId, {searchCriteria: $scope.searchCriteria}).then(function(data) {
        	$scope.setTopStudentsData(data);
        }).catch($scope.error);
	}

	$scope.getCurrentUserSummary = function() {
		var userId = $('#userId').val();
		if (userId) {
			$http.get('/private/v1/student/courseSummary/' + encodeURIComponent($rootScope.courseLobId) + '/' + encodeURIComponent(userId)).success(function(data) {
				if (data && data.totalCount) {
					$scope.totalCount = data.totalCount;
					if (data.completeCount) {
						$scope.completeCount = data.completeCount;
					}
					if (data.grade) {
						$scope.grade = data.grade;	
					}
				}
        	});
		}
	}

	$scope.setTopStudentsData = function(data) {
		if (data && data.responseValueObjects && data.responseValueObjects.STUDENT_INFO_LIST) {
			var students = data.responseValueObjects.STUDENT_INFO_LIST.valueObjectList;
        	$scope.model.topStudents = students;
        }
	}

    $scope.sortLeaderboard = function(sortFilter) {
        $scope.sortFilter = sortFilter;
        $scope.searchCriteria.sortField = sortFilter;
        if (sortFilter == 'grade' || sortFilter == 'completedLectures') {
            $scope.searchCriteria.sortOrder = 'desc';
        } else {
            $scope.searchCriteria.sortOrder = 'asc';
        }
        $scope.getTopStudents();
    }

    $scope.getTopStudents();
    $scope.getCurrentUserSummary();

    $scope.search = function() {
        var searchCriteria = getDashboardSearchCriteriaObject($scope);
        $scope.searchCriteria = searchCriteria;
        $scope.getTopStudents();
    }

    $scope.getDashboardSearchFields = function() {
        $timeout(function() {
            rightBarSearchDivClose();
        }, 100);
        $http.get('/private/v1/course/dashboard/searchFields/' + encodeURIComponent($rootScope.courseLobId)).success(function(searchFields) {
            $scope.model.searchConfig.searchFields = searchFields;
            searchFields.forEach(function(field) {
                $scope.model.searchFields[field.name] = field;
            });
            var totalFields = (searchFields || []).length;
            $scope.totalSearchFields = totalFields;
            var leftColumn = 0;
            if ($scope.totalSearchFields > 0) {
                leftColumn = parseInt($scope.totalSearchFields/2) + 1;
            }
            $scope.leftColSearchFields = leftColumn;
            $timeout(function() {
                $("select.selectBox").select2({allowClear: true, placeholder: 'Select...'});
            }, 500);
        });
    };

    $scope.showSearchForm = function() {
        $('#leaderboardSearchForm').slideToggle('slow');
        $('#advancedSearchIcon').toggleClass('fa-toggle-down');
        $('#advancedSearchIcon').toggleClass('fa-close');
    }

    $scope.getDashboardSearchFields();
	
}]);

app.controller('topCollegesCtrl',['$scope', '$http', '$timeout', '$rootScope', 'DashboardService', '$stateParams', '$location', 'CourseBrowserService', '$window', '$compile', '$sce', '$state', '$controller', function($scope, $http, $timeout, $rootScope, service, $routeParams, $location, cbService, $window, $compile, $sce, $state, $controller) {
    $controller('BaseLeaderboardCtrl', { $scope: $scope });
    $scope.currentLeaderboard = 'Colleges';
    $rootScope.leaderboardModel.currentLeaderBoard = "Colleges";
    $scope.getTopColleges = function() {
        $http.post('/private/v1/student/topColleges/' + encodeURIComponent($rootScope.courseLobId)).success(function(data) {
            if (data) {
                $scope.leaderboardItems = data;
            }
            $timeout(function() {
                $("select.selectBox").select2({allowClear: true, placeholder: 'Select...'});
            }, 100);
        });
    }

    $scope.getTopColleges();
}]);

app.controller('topStreamsCtrl',['$scope', '$http', '$timeout', '$rootScope', 'DashboardService', '$stateParams', '$location', 'CourseBrowserService', '$window', '$compile', '$sce', '$state', '$controller', function($scope, $http, $timeout, $rootScope, service, $routeParams, $location, cbService, $window, $compile, $sce, $state, $controller) {
    $controller('BaseLeaderboardCtrl', { $scope: $scope });
    $scope.currentLeaderboard = 'Streams';
    $rootScope.leaderboardModel.currentLeaderBoard = "Streams";
    $scope.getTopColleges = function() {
        $http.post('/private/v1/student/topStreams/' + encodeURIComponent($rootScope.courseLobId)).success(function(data) {
            if (data) {
                $scope.leaderboardItems = data;
            }
            $timeout(function() {
                $("select.selectBox").select2({allowClear: true, placeholder: 'Select...'});
            }, 100);
        });
    }

    $scope.getTopColleges();
}]);


