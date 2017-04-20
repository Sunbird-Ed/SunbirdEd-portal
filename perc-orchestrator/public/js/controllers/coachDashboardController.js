var minColumnDefs = [
    { field: "studentName", displayName: "Student", sortable: true, headerCellTemplate: 'grid_custom_header_template.html', width: '15%', pinned: true, cellTemplate: 'student_cell_template.html', cellClass: 'cellToolTip', headerClass: 'cellToolTip' },
    { field: "completedLectures", displayName: "Lectures Completed", sortable: true, headerCellTemplate: 'grid_custom_header_template.html', width: '18%', cellTemplate: 'lectures_cell_template.html', cellClass: 'cellToolTip' },
    { field: "lastActivity", displayName: "Last Activity", width: '14%', sortable: true, headerCellTemplate: 'grid_custom_header_template.html', cellTemplate: 'lastLogin_cell_template.html' },
    { field: "offsetIndex", displayName: "Week", sortable: true, headerCellTemplate: 'grid_custom_header_template.html', width: '9%', cellTemplate: 'week_cell_template.html', headerClass: 'midHeader' },
    { field: "exams", displayName: "Assessments", sortable: false, width: '12%', cellTemplate: 'exams_cell_template.html', cellClass: 'cellToolTip', headerClass: 'cellToolTip' },
    { field: "grade", displayName: "Grade", sortable: true, headerCellTemplate: 'grid_custom_header_template.html', width: '8%', cellTemplate: 'grade_cell_template.html' },
    { field: "tickets", displayName: "Tickets", sortable: false, width: '11%', cellTemplate: 'tickets_cell_template.html', cellClass: 'cellToolTip' },
    { field: "status", displayName: "Status", sortable: false, width: '13%', pinned: true, cellTemplate: 'status_cell_template.html', headerClass: 'midHeader' },
    { field: "Course", displayName: "C", sortable: false, headerCellTemplate: 'engg_cols_header_template.html', width: '6%', cellTemplate: 'env_cell_template.html', headerClass: 'midHeader' },
    { field: "Assessments", displayName: "A", sortable: false, headerCellTemplate: 'engg_cols_header_template.html', width: '6%', cellTemplate: 'env_cell_template.html', headerClass: 'midHeader'  },
    { field: "Explore", displayName: "E", sortable: false, headerCellTemplate: 'engg_cols_header_template.html', width: '6%', cellTemplate: 'env_cell_template.html', headerClass: 'midHeader'  },
    { field: "Forums", displayName: "F", sortable: false, headerCellTemplate: 'engg_cols_header_template.html', width: '6%', cellTemplate: 'env_cell_template.html', headerClass: 'midHeader'  },
    { field: "Notes", displayName: "N", sortable: false, headerCellTemplate: 'engg_cols_header_template.html', width: '6%', cellTemplate: 'env_cell_template.html', headerClass: 'midHeader'  },
    { field: "Coaching", displayName: "T", sortable: false, headerCellTemplate: 'engg_cols_header_template.html', width: '6%', cellTemplate: 'env_cell_template.html', headerClass: 'midHeader'  }];

var minStudentColumnDefs = [
    { field: "studentName", displayName: "Student", sortable: true, headerCellTemplate: 'grid_custom_header_template.html', width: '15%', pinned: true, cellTemplate: 'student_cell_template.html', cellClass: 'cellToolTip', headerClass: 'cellToolTip' },
    { field: "registrationNumber", displayName: "Regn. Number", sortable: true, headerCellTemplate: 'grid_custom_header_template.html', width: '12%', cellTemplate: 'student_details_cell_template.html', cellClass: 'cellToolTip'},
    { field: "stream", displayName: "Branch", sortable: true, headerCellTemplate: 'grid_custom_header_template.html', width: '12%', cellTemplate: 'student_details_cell_template.html', cellClass: 'cellToolTip'},
    { field: "college", displayName: "College", sortable: true, headerCellTemplate: 'grid_custom_header_template.html', width: '12%', cellTemplate: 'student_details_cell_template.html', cellClass: 'cellToolTip'},
    { field: "batch", displayName: "Batch", sortable: true, headerCellTemplate: 'grid_custom_header_template.html', width: '7%', cellTemplate: 'text_cell_template.html' },
    { field: "completedLectures", displayName: "Lectures Completed", sortable: true, headerCellTemplate: 'grid_custom_header_template.html', width: '15%', cellTemplate: 'lectures_cell_template.html', cellClass: 'cellToolTip' },
    { field: "offsetIndex", displayName: "Week", sortable: true, headerCellTemplate: 'grid_custom_header_template.html', width: '8%', cellTemplate: 'week_cell_template.html', headerClass: 'midHeader' },
    { field: "grade", displayName: "Grade", sortable: true, headerCellTemplate: 'grid_custom_header_template.html', width: '6%', cellTemplate: 'grade_cell_template.html' },
    { field: "status", displayName: "Status", sortable: false, width: '13%', pinned: true, cellTemplate: 'status_cell_template.html', headerClass: 'midHeader'  }];

var maxColumnDefs = [
    { field: "studentName", displayName: "Student", sortable: true, headerCellTemplate: 'grid_custom_header_template.html', width: '11%', pinned: true, cellTemplate: 'student_cell_template.html', cellClass: 'cellToolTip', headerClass: 'cellToolTip' },
    { field: "completedLectures", displayName: "Lectures Completed", sortable: true, headerCellTemplate: 'grid_custom_header_template.html', width: '15%', cellTemplate: 'lectures_cell_template.html', cellClass: 'cellToolTip' },
    { field: "lastActivity", displayName: "Last Activity", sortable: true, headerCellTemplate: 'grid_custom_header_template.html', width: '10%', cellTemplate: 'lastLogin_cell_template.html' },
    { field: "offsetIndex", displayName: "Week", width: '6%', sortable: true, headerCellTemplate: 'grid_custom_header_template.html', cellTemplate: 'week_cell_template.html', headerClass: 'midHeader' },
    { field: "exams", displayName: "Assessments", width: '10%', sortable: false, cellTemplate: 'exams_cell_template.html', cellClass: 'cellToolTip', headerClass: 'cellToolTip' },
    { field: "grade", displayName: "Grade", width: '6%', sortable: true, headerCellTemplate: 'grid_custom_header_template.html', cellTemplate: 'grade_cell_template.html' },
    { field: "tickets", displayName: "Tickets", width: '8%', sortable: false, cellTemplate: 'tickets_cell_template.html', cellClass: 'cellToolTip' },
    { field: "status", displayName: "Status", sortable: false, width: '10%', pinned: true, cellTemplate: 'status_cell_template.html', headerClass: 'midHeader'  },
    { field: "Course", displayName: "C", width: '4%', sortable: false, headerCellTemplate: 'engg_cols_header_template.html', cellTemplate: 'env_cell_template.html', headerClass: 'midHeader' },
    { field: "Assessments", displayName: "A", width: '4%', sortable: false, headerCellTemplate: 'engg_cols_header_template.html', cellTemplate: 'env_cell_template.html', headerClass: 'midHeader'  },
    { field: "Explore", displayName: "E", width: '4%', sortable: false, headerCellTemplate: 'engg_cols_header_template.html', cellTemplate: 'env_cell_template.html', headerClass: 'midHeader'  },
    { field: "Forums", displayName: "F", width: '4%', sortable: false, headerCellTemplate: 'engg_cols_header_template.html', cellTemplate: 'env_cell_template.html', headerClass: 'midHeader'  },
    { field: "Notes", displayName: "N", width: '4%', sortable: false, headerCellTemplate: 'engg_cols_header_template.html', cellTemplate: 'env_cell_template.html', headerClass: 'midHeader'  },
    { field: "Coaching", displayName: "T", width: '4%', sortable: false, headerCellTemplate: 'engg_cols_header_template.html', cellTemplate: 'env_cell_template.html', headerClass: 'midHeader'  }];

var summaryCollapsed = [
    { field: "period", displayName: "Period", width: '15%', pinned: true, cellTemplate: 'period_cell_template.html', cellClass: 'cellToolTip', headerClass: 'cellToolTip' },
    { field: "completedLectures", displayName: "Lectures Completed", width: '22%', cellTemplate: 'lectures_cell_template.html', cellClass: 'cellToolTip' },
    { field: "practiceTests", displayName: "Practice Tests", width: '20%', cellTemplate: 'practices_cell_template.html' },
    { field: "exams", displayName: "Exams", width: '17%', cellTemplate: 'exams_cell_template.html', cellClass: 'cellToolTip', headerClass: 'cellToolTip' },
    { field: "tickets", displayName: "Tickets", width: '13%', cellTemplate: 'tickets_cell_template.html', cellClass: 'cellToolTip' },
    { field: "status", displayName: "Status", width: '13%', pinned: true, cellTemplate: 'status_cell_template.html', headerClass: 'midHeader'  },
    { field: "Course", displayName: "C", width: '6%', headerCellTemplate: 'engg_cols_header_template.html', cellTemplate: 'week_env_cell_template.html', headerClass: 'midHeader' },
    { field: "Assessments", displayName: "A", width: '6%', headerCellTemplate: 'engg_cols_header_template.html', cellTemplate: 'week_env_cell_template.html', headerClass: 'midHeader'  },
    { field: "Explore", displayName: "E", width: '6%', headerCellTemplate: 'engg_cols_header_template.html', cellTemplate: 'week_env_cell_template.html', headerClass: 'midHeader'  },
    { field: "Forums", displayName: "F", width: '6%', headerCellTemplate: 'engg_cols_header_template.html', cellTemplate: 'week_env_cell_template.html', headerClass: 'midHeader'  },
    { field: "Notes", displayName: "N", width: '6%', headerCellTemplate: 'engg_cols_header_template.html', cellTemplate: 'week_env_cell_template.html', headerClass: 'midHeader'  },
    { field: "Coaching", displayName: "T", width: '6%', headerCellTemplate: 'engg_cols_header_template.html', cellTemplate: 'week_env_cell_template.html', headerClass: 'midHeader'  }];

var summaryExpanded = [
    { field: "period", displayName: "Period", width: '10%', pinned: true, cellTemplate: 'period_cell_template.html', cellClass: 'cellToolTip', headerClass: 'cellToolTip' },
    { field: "completedLectures", displayName: "Lectures Completed", width: '15%', cellTemplate: 'lectures_cell_template.html', cellClass: 'cellToolTip' },
    { field: "practiceTests", displayName: "Practices", width: '10%', cellTemplate: 'practices_cell_template.html' },
    { field: "exams", displayName: "Exams", width: '10%', cellTemplate: 'exams_cell_template.html', cellClass: 'cellToolTip', headerClass: 'cellToolTip' },
    { field: "tickets", displayName: "Tickets", width: '9%', cellTemplate: 'tickets_cell_template.html', cellClass: 'cellToolTip' },
    { field: "status", displayName: "Status", width: '10%', pinned: true, cellTemplate: 'status_cell_template.html', headerClass: 'midHeader'  },
    { field: "Course", displayName: "C", width: '6%', headerCellTemplate: 'engg_cols_header_template.html', cellTemplate: 'week_env_cell_template.html', headerClass: 'midHeader' },
    { field: "Assessments", displayName: "A", width: '6%', headerCellTemplate: 'engg_cols_header_template.html', cellTemplate: 'week_env_cell_template.html', headerClass: 'midHeader'  },
    { field: "Explore", displayName: "E", width: '6%', headerCellTemplate: 'engg_cols_header_template.html', cellTemplate: 'week_env_cell_template.html', headerClass: 'midHeader'  },
    { field: "Forums", displayName: "F", width: '6%', headerCellTemplate: 'engg_cols_header_template.html', cellTemplate: 'week_env_cell_template.html', headerClass: 'midHeader'  },
    { field: "Notes", displayName: "N", width: '6%', headerCellTemplate: 'engg_cols_header_template.html', cellTemplate: 'week_env_cell_template.html', headerClass: 'midHeader'  },
    { field: "Coaching", displayName: "T", width: '6%', headerCellTemplate: 'engg_cols_header_template.html', cellTemplate: 'week_env_cell_template.html', headerClass: 'midHeader'  }];

var gradebookCols = [
    { field: "activity", displayName: "Activity", width: '29%', cellTemplate: 'activity_name_template.html' },
    { field: "type", displayName: "Type", width: '15%', cellTemplate: 'text_cell_template.html'},
    { field: "score", displayName: "Marks", width: '10%', cellTemplate: 'score_cell_template.html', cellClass: 'cellToolTip' },
    { field: "grade", displayName: "Grade", width: '10%', cellTemplate: 'grade_cell_template.html' },
    { field: "proficiencyWeightage", displayName: "Weightage", width: '12%', cellTemplate: 'text_cell_template.html', cellClass: 'cellToolTip', headerClass: 'cellToolTip' },
    { field: "tickets", displayName: "Tickets", width: '23%', cellTemplate: 'text_cell_template.html', cellClass: 'cellToolTip' }];

app.service('DashboardService', ['$http', '$q', function($http, $q) {

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


    this.searchLeaderBoard = function(courseId, data) {
        return this.postToService('/private/v1/student/topStudents/' + encodeURIComponent(courseId), data);
    }

    this.getCourseDashboard = function(courseId, data) {
        return this.postToService('/private/v1/course/dashboard/' + encodeURIComponent(courseId), data);
    }

    this.getGradebookDetails = function(courseId, data) {
        return this.postToService('/private/v1/course/gradebook/' + encodeURIComponent(courseId), data);
    }
    this.generateCourseGradebook = function(courseId, data) {
        return this.postToService('/private/v1/course/gradebook/create/' + encodeURIComponent(courseId), data);
    }
    
}]);

app.controller('coachDashboardCtrl',['$scope', '$http', '$timeout', '$rootScope', 'DashboardService', '$stateParams', '$location', 'CourseBrowserService', '$window', '$compile', '$sce', '$state', function($scope, $http, $timeout, $rootScope, service, $routeParams, $location, cbService, $window, $compile, $sce, $state) {

    $scope.encodedCourseId = encodeURIComponent($rootScope.courseId);
    $scope.initialLoad = false;
    $scope.loadingDashboardData = true;
    $scope.model = {
        nameFieldPlaceHolder: 'FILTER BY NAME',
        searchBtnText: 'Filter'
    };
    $scope.searchWindowOpen = false;
    $scope.model.searchConfig = {};
    $scope.model.searchFields = {};
    $scope.model.searchLearners = {
        filters: {}
    };
    $scope.searchCriteria = {};
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

    $scope.timeThreshold = 60;
    $scope.columnDefs = minColumnDefs;
    $scope.summaryColumnDefs = summaryCollapsed;
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [25, 50, 100],
        pageSize: 50,
        currentPage: 1
    };  
    $scope.sortInfo = {columns:[], fields: ['studentName'], directions: ['asc']};

    $scope.gradebookPagingOptions = {
        pageSizes: [10, 20, 50],
        pageSize: 10,
        currentPage: 1
    };

    $scope.gridOptions = {
        data: 'myData',
        enablePinning: false,
        enablePaging: true,
        enableSorting: true,
        useExternalSorting: true,
        sortInfo: $scope.sortInfo,
        showFooter: true,
        enableRowSelection: false,
        columnDefs: 'columnDefs',
        totalServerItems:'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        plugins: [new ngGridFlexibleHeightPlugin()]
    };

    $scope.summaryGridOptions = {
        data: 'studentSummary',
        enablePinning: false,
        enablePaging: false,
        enableSorting: false,
        showFooter: false,
        enableRowSelection: false,
        columnDefs: 'summaryColumnDefs',
        plugins: [new ngGridFlexibleHeightPlugin()]
    };

    $scope.gradebookColumnDefs = gradebookCols;

    $scope.gradebookGridOptions = {
        data: 'gradeBook',
        enablePinning: false,
        enablePaging: true,
        enableSorting: false,
        showFooter: true,
        enableRowSelection: false,
        columnDefs: 'gradebookColumnDefs',
        totalServerItems:'totalGradebookItems',
        pagingOptions: $scope.gradebookPagingOptions,
        plugins: [new ngGridFlexibleHeightPlugin()]
    };

    $scope.setPagingData = function(data, page, pageSize){  
        $scope.loadingDashboardData = false;
        $scope.myData = data.list;
        $scope.totalServerItems = data.count;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
        if (!$('.RightSideBar').hasClass('Effectsidebar')) {
            $scope.resizeGrid(false);
        } else {
            $scope.resizeGrid(true);
        }
    };

    $scope.refreshDashboard = function() {
        $scope.loadingDashboardData = true;
        $scope.getDashboardData($scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
        $scope.getCourseSummaryGraphs($scope.searchCriteria);
    };

    $scope.getDashboardData = function(page, pageSize) {
        if (page < 1)
            page = 1;
        page = page - 1;
        $scope.searchCriteria.offset = (page * pageSize);
        $scope.searchCriteria.limit = pageSize;
        service.getCourseDashboard($rootScope.courseLobId, {searchCriteria: $scope.searchCriteria}).then(function(data) {
            $scope.setPagingData(data, page, pageSize);
        }).catch($scope.error);
    };

    $scope.getCourseSummaryGraphs = function(searchCriteria) {
        if (!searchCriteria) {
            searchCriteria = {};
        }
        setTimeout(function() {
            drawChart($http, $rootScope.courseLobId, searchCriteria);
        }, 500);
    }

    $scope.viewEngagementDetails = function() {
        if (!$('.RightSideBar').hasClass('Effectsidebar')) {
            $('.sideicon3').click();
        }
    }

    $scope.toggleStudentDetails = function() {
        if (!$scope.studentDetailsView) {
            $scope.studentDetailsView = true;
            if (!$('.RightSideBar').hasClass('Effectsidebar')) {
                $('.sideicon3').click();
            } else {
                $scope.resizeGrid(true);    
            }
        } else {
            $scope.studentDetailsView = false;
            if ($('.RightSideBar').hasClass('Effectsidebar')) {
                $scope.resizeGrid(true);    
            } else {
                $scope.resizeGrid(false);    
            }
        }
    }

    $scope.hideEngagementDetails = function() {
        if ($('.RightSideBar').hasClass('Effectsidebar')) {
            $('.sideicon3').click();
        }
    }

    $scope.resizeGrid = function(expand) {
        $('#dashboardGrid').resize();
        $('#summaryGrid').resize();
        $('#stdGradebookGrid').resize();
        if (expand) {
            $('#dashboardViewEnggDetailsLink').hide();
            $('#summaryViewEnggDetailsLink').hide();
            $('#dashboardHideEnggDetailsLink').show();
            $('#summaryHideEnggDetailsLink').show();
            if ($scope.studentDetailsView) {
                $scope.columnDefs = minStudentColumnDefs;
            } else {
                $scope.columnDefs = maxColumnDefs;
            }
            $scope.summaryColumnDefs = summaryExpanded;
        } else {
            $('#dashboardViewEnggDetailsLink').show();
            $('#summaryViewEnggDetailsLink').show();
            $('#dashboardHideEnggDetailsLink').hide();
            $('#summaryHideEnggDetailsLink').hide();
            if ($scope.studentDetailsView) {
                $scope.columnDefs = minStudentColumnDefs;
            } else {
                $scope.columnDefs = minColumnDefs;
            }
            $scope.summaryColumnDefs = summaryCollapsed;
        }
        setTimeout(function() {
            $('[data-toggle="tooltip"]').tooltip();
        }, 500);
    }

    $scope.showStudentSummaryData = function(studentId) {
        $scope.loadingDashboardData = true;
        if (studentId) {
            $scope.selectedStudentId = studentId;    
        }
        $scope.showStudentSummary = true;
        $scope.showStudentGradebook = false;
        $scope.getStudentSummary();
    }

    $scope.backToSummary = function() {
        $scope.loadingDashboardData = true;
        $scope.showStudentSummary = false;   
        $scope.showStudentGradebook = false;
        $scope.refreshDashboard();
    }

    $scope.refreshSummary = function() {
        $scope.loadingDashboardData = true;
        $scope.getStudentSummary();
    }

    $scope.getStudentSummary = function() {
        $http.get('/private/v1/student/dashboard/' + encodeURIComponent($rootScope.courseLobId) + '/' + encodeURIComponent($scope.selectedStudentId)).success(function(data) {
            $scope.studentSummary = data;
            if (!$('.RightSideBar').hasClass('Effectsidebar')) {
                $scope.resizeGrid(false);
            } else {
                $scope.resizeGrid(true);
            }
        });
        $http.get('/private/v1/student/courseSummary/' + encodeURIComponent($rootScope.courseLobId) + '/' + encodeURIComponent($scope.selectedStudentId)).success(function(data) {
            $scope.loadingDashboardData = false;
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
        });
    }

    $scope.showStudentGradebookData = function() {
        $scope.loadingDashboardData = true;
        $scope.showStudentGradebook = true;
        $scope.showStudentSummary = false;
        $scope.getStudentGradebook($scope.gradebookPagingOptions.currentPage, $scope.gradebookPagingOptions.pageSize);
    }

    $scope.refreshGradebook = function() {
        $scope.loadingDashboardData = true;
        $scope.getStudentGradebook($scope.gradebookPagingOptions.currentPage, $scope.gradebookPagingOptions.pageSize);
    }

    $scope.setGradebookPagingData = function(data){  
        $scope.loadingDashboardData = false;
        $scope.gradeBook = data.elements;
        $scope.totalGradebookItems = data.count;
        $scope.studentGrade = data.grade;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
        if (!$('.RightSideBar').hasClass('Effectsidebar')) {
            $scope.resizeGrid(false);
        } else {
            $scope.resizeGrid(true);
        }
    };

    $scope.getStudentGradebook = function(page, pageSize) {
        if (page < 1)
            page = 1;
        page = page - 1;
        var gradebookSearch = {};
        gradebookSearch.offset = (page * pageSize);
        gradebookSearch.limit = pageSize;
        $http.post('/private/v1/student/gradebook/' + encodeURIComponent($rootScope.courseLobId) + '/' 
            + encodeURIComponent($scope.selectedStudentId), {searchCriteria: gradebookSearch}).success(function(data) {
                $scope.setGradebookPagingData(data);
        });
    };

    $scope.goToLecture = function(elementId) {
        $state.go('cb', {
            lobId: cbService.removeFedoraPrefix(elementId)
        });
    };

    $rootScope.$on('filterDashboardData', function(event, args) {
        $scope.searchCriteria = args.searchCriteria;
        $scope.pagingOptions.currentPage = 1;
        $scope.setPagingData(args.result, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
    });

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && (newVal.currentPage !== oldVal.currentPage || newVal.pageSize !== oldVal.pageSize)) {
          $scope.getDashboardData($scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
        }
    }, true);

    $scope.$watch('gradebookPagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && (newVal.currentPage !== oldVal.currentPage || newVal.pageSize !== oldVal.pageSize)) {
          $scope.getStudentGradebook($scope.gradebookPagingOptions.currentPage, $scope.gradebookPagingOptions.pageSize);
        }
    }, true);

    $scope.$watch('sortInfo', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.searchCriteria.sortField = $scope.sortInfo.fields[0];
            $scope.searchCriteria.sortOrder = $scope.sortInfo.directions[0];
            $scope.getDashboardData($scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
        }
    }, true);

    $scope.showStudentSummary = false;
    $scope.showStudentGradebook = false;
    $scope.getCourseSummaryGraphs($scope.searchCriteria);

    $scope.search = function() {
        var searchCriteria = getDashboardSearchCriteriaObject($scope);
        var page = 0;
        $scope.pagingOptions.currentPage = page + 1;
        var pageSize = $scope.pagingOptions.pageSize;
        searchCriteria.offset = (page * pageSize);
        searchCriteria.limit = pageSize;
        service.getCourseDashboard($rootScope.courseLobId, {searchCriteria: searchCriteria}).then(function(data) {
            $scope.$emit('filterDashboardData', {searchCriteria: searchCriteria, result: data});
        }).catch($scope.error);
    };

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
        $('#dashboardSearchForm').slideToggle('slow');
        $('#advancedSearchIcon').toggleClass('fa-toggle-down');
        $('#advancedSearchIcon').toggleClass('fa-close');
    };

    $scope.getDashboardSearchFields();

}]);

app.controller('courseGradebookCtrl',['$scope', '$http', '$timeout', '$rootScope', 'DashboardService', '$stateParams', '$location', 'CourseBrowserService', '$window', '$compile', '$sce', '$state', function($scope, $http, $timeout, $rootScope, service, $routeParams, $location, cbService, $window, $compile, $sce, $state) {

    $scope.encodedCourseId = encodeURIComponent($rootScope.courseId);
    $scope.loadingDashboardData = true;
    $scope.gradebook = {};

    $scope.getGradebookDetails = function() {
        $scope.loadingDashboardData = true;
        service.getGradebookDetails($rootScope.courseLobId, {}).then(function(result) {
            console.log("GetGradebookDetails:",result);
            if(result && result.status == "SUCCESS") {
                $scope.gradebook = result.data;
                $scope.showGenerateNow = ($scope.gradebook.filter(function(report) {
                    return report.status == "PROCESSING";
                }).length == 0); 
            }
            
            $scope.loadingDashboardData = false;
        });
    }

    $scope.generateCourseGradebook = function() {
        service.generateCourseGradebook($rootScope.courseLobId, {}).then(function(result) {
            console.log("Reports:", result);
            if(result && result.status == "SUCCESS") {
                $scope.gradebook = result.data;
                $scope.showGenerateNow = ($scope.gradebook.filter(function(report) {
                    return report.status == "PROCESSING";
                }).length == 0); 
            }
        });
    }

    $timeout(function() {
        $scope.getGradebookDetails();
    },100)
    

}]);

function getDashboardSearchCriteriaObject($scope) {
    var searchCriteria = {};
    for(var k in $scope.model.searchLearners.filters) {
        var val = $scope.model.searchLearners.filters[k];
        if (!val) {
            continue;
        }
        var field = $scope.model.searchFields[k];
        if((field.type == 'text' || field.type == 'date' ) && val.length == 0) {
            continue;
        }
        if(field.type == 'multiselect' && val.length == 0) {
            continue;
        }
        var value;
        if(field.type == 'multiselect') {
            value = [];
            val.forEach(function(valObj) {
                value.push(valObj.value);
            });
        } else if(field.type == 'date' || field.type == 'text') {
            value = val;
        } else {
            value = val.value;
        }
        searchCriteria[field.name] = value;
    } 
    return searchCriteria;
}

function resizeDashboardGrid() {
    var $scope = angular.element('#dashboardGrid').scope();
    if (!$scope) {
        $scope = angular.element('#summaryGrid').scope();
    }
    if ($scope) {
        if (!$('.RightSideBar').hasClass('Effectsidebar')) {
            $scope.resizeGrid(false);
        } else {
            $scope.resizeGrid(true);
        }
    }
}


function drawChart($http, courseId, searchCriteria) {

    var attOptions = {
        title : 'Class Attendance',
        vAxis: {title: "Students", format: "##'%'", textStyle: {color: '#999'}, titleTextStyle: {fontName: 'FrutigerNeueLTW01-CnRg', italic: false, fontSize: 12}},
        hAxis: {title: "Attendance", textStyle: {color: '#999'}, titleTextStyle: {fontName: 'FrutigerNeueLTW01-CnRg', italic: false, fontSize: 12},
            slantedText: true, showTextEvery: 1},
        bar: {groupWidth: 5},
        tooltip: {isHtml: true},
        seriesType: "bars",
        titleTextStyle: {color: '#0099cc', fontName: 'FrutigerNeueLTW01-CnRg', fontSize: 16, bold: false},
        legend: { position: "none" }
      };
      
      var perfOptions = {
        title : 'Class Performance',
        vAxis: {title: "Students", format: "##'%'", textStyle: {color: '#999'}, titleTextStyle: {fontName: 'FrutigerNeueLTW01-CnRg', italic: false, fontSize: 12}},
        hAxis: {title: "Grade", textStyle: {color: '#999'}, titleTextStyle: {fontName: 'FrutigerNeueLTW01-CnRg', italic: false, fontSize: 12}},
        bar: {groupWidth: 5},
        tooltip: {isHtml: true},
        seriesType: "bars",
        titleTextStyle: {color: '#0099cc', fontName: 'FrutigerNeueLTW01-CnRg', fontSize: 16, bold: false},
        legend: { position: "none" }
      };
      
      var enggOptions = {
        title : 'Class Engagement',
        vAxis: {title: "Students", format: "##'%'", textStyle: {color: '#999'}, titleTextStyle: {fontName: 'FrutigerNeueLTW01-CnRg', italic: false, fontSize: 12}},
        hAxis: {title: "Engagement Index", textStyle: {color: '#999'}, titleTextStyle: {fontName: 'FrutigerNeueLTW01-CnRg', italic: false, fontSize: 12}, 
            slantedText: true, showTextEvery: 1},
        bar: {groupWidth: 5},
        tooltip: {isHtml: true},
        seriesType: "bars",
        titleTextStyle: {color: '#0099cc', fontName: 'FrutigerNeueLTW01-CnRg', fontSize: 16, bold: false},
        legend: { position: "none" }
      };

    $http.post('/private/v1/course/summaryGraphs/' + encodeURIComponent(courseId), {searchCriteria: searchCriteria}).success(function(data) {
        if (data.Attendance) {
            var attendanceData = google.visualization.arrayToDataTable(data.Attendance);
            var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
            chart.draw(attendanceData, attOptions);
        }

        if (data.Performance) {
            var perfData = google.visualization.arrayToDataTable(data.Performance);
            var chart2 = new google.visualization.ComboChart(document.getElementById('chart_div2'));
            chart2.draw(perfData, perfOptions);
        }

        if (data.Engagement) {
            var engagementData = google.visualization.arrayToDataTable(data.Engagement);
            var chart3 = new google.visualization.ComboChart(document.getElementById('chart_div3'));
            chart3.draw(engagementData, enggOptions);
        }
    });

}
