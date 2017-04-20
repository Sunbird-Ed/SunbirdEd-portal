app.controller('studentSummaryCtrl',['$scope', '$http', '$timeout', '$rootScope', 'InteractionService', '$stateParams', '$location', 'CourseBrowserService', '$window', '$compile', '$sce', '$state', function($scope, $http, $timeout, $rootScope, service, $routeParams, $location, cbService, $window, $compile, $sce, $state) {

    $scope.timeThreshold = 60;
    $scope.summaryColumnDefs = summaryCollapsed;
    $scope.loadingSummary = true;

    $scope.summaryGridOptions = {
        data: 'studentSummary',
        enablePinning: true,
        enablePaging: false,
        enableSorting: false,
        showFooter: false,
        enableRowSelection: false,
        columnDefs: 'summaryColumnDefs',
        plugins: [new ngGridFlexibleHeightPlugin()]
    };

    $scope.viewEngagementDetails = function() {
        if (!$('.RightSideBar').hasClass('Effectsidebar')) {
            $('.sideicon3').click();
        }
    }

    $scope.hideEngagementDetails = function() {
        if ($('.RightSideBar').hasClass('Effectsidebar')) {
            $('.sideicon3').click();
        }
    }

    $scope.resizeGrid = function(expand) {
        $('#studentSummaryGrid').resize();
        if (expand) {
            $scope.summaryColumnDefs = summaryExpanded;
            $('#stdSummaryViewEnggDetailsLink').hide();
            $('#stdSummaryHideEnggDetailsLink').show();
        } else {
            $scope.summaryColumnDefs = summaryCollapsed;
            $('#stdSummaryViewEnggDetailsLink').show();
            $('#stdSummaryHideEnggDetailsLink').hide();
        }
        setTimeout(function() {
            $('[data-toggle="tooltip"]').tooltip();
        }, 500);
    }

    $scope.showStudentSummaryData = function(studentId) {
        $scope.selectedStudentId = studentId;
        $scope.getStudentSummary();
    }

    $scope.viewGradebook = function() {
        selectLeftMenuTab('courseTab');
        $state.go('gradebook', {});
    }

    $scope.refreshSummary = function() {
        $scope.loadingSummary = true;
        $scope.getStudentSummary(); 
    }

    $scope.getStudentSummary = function() {
        $scope.selectedStudentId = $('#userId').val();
        $http.get('/private/v1/student/courseSummary/' + encodeURIComponent($rootScope.courseLobId) + '/' + encodeURIComponent($scope.selectedStudentId)).success(function(data) {
            $scope.loadingSummary = false;
            $scope.course = {};    
            if (data.name && data.name != '')
                $scope.course.studentName = data.name;
            else
                $scope.course.studentName = $scope.selectedStudentId;
            $scope.course.studentGrade = data.grade;
            $scope.course.currentProgress = data.complete;
            $scope.course.completeCount = data.completeCount;
            $scope.course.expectedProgress = data.expected;
            $scope.course.expectedCount = data.expectedCount;
            $scope.course.totalCount = data.totalCount;
            $scope.course.percentile = data.percentile;
            $scope.course.offset = data.offset;
            $scope.course.timeUnit = data.timeUnit;
            $scope.course.enrolledDate = data.enrolledDate;
            $scope.course.isStudent = true;
        });
        $http.get('/private/v1/student/dashboard/' + encodeURIComponent($rootScope.courseLobId) + '/' + encodeURIComponent($scope.selectedStudentId)).success(function(data) {
            $scope.studentSummary = data;
            $scope.loadingSummary = false;
            if (!$('.RightSideBar').hasClass('Effectsidebar')) {
                $scope.resizeGrid(false);
            } else {
                $scope.resizeGrid(true);
            }
        });
    }
    $scope.getStudentSummary();
}]);

function resizeStudentSummaryGrid() {
    var $scope = angular.element('#studentSummaryGrid').scope();
    if ($scope) {
        if (!$('.RightSideBar').hasClass('Effectsidebar')) {
            $scope.resizeGrid(false);
        } else {
            $scope.resizeGrid(true);
        }
    }
}

