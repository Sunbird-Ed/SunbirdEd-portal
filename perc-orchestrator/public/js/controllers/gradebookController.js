
app.controller('gradebookCtrl',['$scope', '$http', '$timeout', '$rootScope', 'InteractionService', '$stateParams', '$location', 'CourseBrowserService', '$window', '$compile', '$sce', '$state', function($scope, $http, $timeout, $rootScope, service, $routeParams, $location, cbService, $window, $compile, $sce, $state) {

	$scope.columnDefs = gradebookCols;
    $scope.loadingGradebook = true;

    $scope.gradebookPagingOptions = {
        pageSizes: [10, 20, 50],
        pageSize: 10,
        currentPage: 1
    };

	$scope.gradebookGridOptions = {
        data: 'gradeBook',
        enablePinning: false,
        enablePaging: true,
        enableSorting: false,
        showFooter: true,
        enableRowSelection: false,
        columnDefs: 'columnDefs',
        totalServerItems:'totalServerItems',
        pagingOptions: $scope.gradebookPagingOptions,
        plugins: [new ngGridFlexibleHeightPlugin()]
    };

    $scope.resizeGrid = function() {
        $('#gradebookGrid').resize();
    };

    $scope.setPagingData = function(data){  
        $scope.loadingGradebook = false;
        $scope.gradeBook = data.elements;
        $scope.studentGrade = data.grade;
        $scope.totalServerItems = data.count;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.backToDashboard = function() {
        selectLeftMenuTab('courseTab');
        $state.go('studentSummary', {});
    };

    $scope.refreshGradebook = function() {
        $scope.loadingGradebook = true;
        $scope.getGradebookData($scope.gradebookPagingOptions.currentPage, $scope.gradebookPagingOptions.pageSize);        
    };

    $scope.getGradebookData = function(page, pageSize) {
        $scope.resizeGrid();
        $scope.selectedStudentId = $('#userId').val();
        if (page < 1)
            page = 1;
        page = page - 1;
        var gradebookSearch = {};
        gradebookSearch.offset = (page * pageSize);
        gradebookSearch.limit = pageSize;
        $http.post('/private/v1/student/gradebook/' + encodeURIComponent($rootScope.courseLobId) + '/' 
            + encodeURIComponent($scope.selectedStudentId), {searchCriteria: gradebookSearch}).success(function(data) {
                $scope.setPagingData(data);
        });
    };

    $scope.getGradebookData($scope.gradebookPagingOptions.currentPage, $scope.gradebookPagingOptions.pageSize);    

    $scope.$watch('gradebookPagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && (newVal.currentPage !== oldVal.currentPage || newVal.pageSize !== oldVal.pageSize)) {
          $scope.getGradebookData($scope.gradebookPagingOptions.currentPage, $scope.gradebookPagingOptions.pageSize);    
        }
    }, true);

    $scope.goToLecture = function(elementId) {
        $state.go('cb', {
            lobId: cbService.removeFedoraPrefix(elementId)
        });
    };

}]);

function resizeStudentGradebookGrid() {
    var $scope = angular.element('#gradebookGrid').scope();
    if ($scope) {
        $scope.resizeGrid();
    }
}