var app = angular.module('importApp', ['ngSanitize', 'angularFileUpload', 'ngGrid']);

app.factory('RBACService', function($http) {
    return {
        getActions: function() {
            return $http.get('/private/v1/getcurrentuseractions');
        }
    }
});

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, url, courseId, folderPath, courseName){
        var fd = new FormData();
        fd.append('importFile', file);
        fd.append('courseId', courseId);
        fd.append('folderPath', folderPath);
        if(courseName) {
            fd.append('courseName', courseName);
        }
    	return $http.post(url, fd, {
        	transformRequest: angular.identity,
        	headers: {'Content-Type': undefined}
    	});
    }

}]);


app.controller('UserImportCtrl', ['$scope', '$rootScope', '$http', '$location', '$window', '$upload', '$sce', 'RBACService', 'fileUpload', function($scope, $rootScope, $http, $location, $window, $upload, $sce, RBACService, fileUpload) {

	$scope.csvfile = null;
	$scope.uploadArray = [
        {name : 'Content Import', url : '/private/v1/course/import/', title : 'CONTENT IMPORT PROCESS', method : 'post', type: 'import'},
        {name : 'Content Delete', url : '/private/v1/service/delete/csv', cleanupurl :'/private/v1/service/cleanup/csv', title : 'CONTENT DELETE PROCESS', method : 'delete', type: 'delete'},
        {name : 'Concept Import', url : '/private/v1/course/importConcepts/', title : 'CONCEPT IMPORT PROCESS', method : 'post', type: 'import'},
        {name : 'User Import', url : '/private/v1/user/import', title : 'USER IMPORT PROCESS', method : 'post', type: 'import'},
        //{name : 'User Delete', url : '/private/v1/user/delete', cleanupurl :'/private/v1/user/cleanup', title : 'USER DELETE PROCESS', method : 'delete', type: 'delete'},
        {name : 'Images', url : '/private/v1/course/upload/coursecontent/', title : 'UPLOAD IMAGES PROCESS', method : 'post', type: 'import'},
        {name : 'Enrollment', url : '/private/v1/enrollment/import', title : 'USER ENROLLMENT PROCESS', method : 'post', type: 'import'},
        {name : 'Questions Import', url : '/private/v1/assessments/import/', title : 'QUESTIONS IMPORT PROCESS', method : 'post', type: 'import'}
	];
	$scope.uploadModel =	$scope.uploadArray[0];

	$scope.getRecord = function(record) {
		$http.get('/private/admin/importrecord/'+encodeURIComponent(record.identifier)).success(function(data) {
			for(k in data) {
				record[k] = data[k];
			}
		})
	}

	$scope.downloadCSV = function(record) {
		var filePath = record.filepath;
		filePath = filePath.replace('public/csv-import', '/csv-import');
		console.log("FilePath: ",filePath);
		$http.get(filePath).success(function(data, status, headers, config) {
            var element = angular.element('<a/>');
            element.attr({
                href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
                target: '_blank',
                download: 'filename.csv'
            })[0].click();
		}).error(function(data, status, headers, config) {});
	}

	$scope.onSelectFile = function($files){
		var file = $files[0];
		var fileName = file.name;
        if($scope.uploadModel.name == 'Questions Import') {
            if (fileName.indexOf('.zip') != -1 || fileName.indexOf('.csv') != -1) {
               $scope.csvfilenotvalid = false;
            }
        } else if ($scope.uploadModel.name != 'Images') {
            if (fileName.indexOf('.csv') != -1) {
               $scope.csvfilenotvalid = false;
            }
        }
        if($scope.uploadModel.name == 'Images'){
            if($scope.folderPathModel == '')
                $scope.uploadProcessing = true;
        }
	}

    $scope.updateUploadUI = function(){
        $scope.deleteSelection = 1;
    }

	$scope.uploadFile =  function(){
        $scope.uploadProcessing = true;
        $scope.selectCourse = false;
        var file = $scope.csvFile;
        var fileName = file.name;
        // var csvvalid = fileName.indexOf('.csv');
        // if(csvvalid == -1 && $scope.uploadModel.name != 'Images'){
        // 	$scope.csvfilenotvalid = true;
        //     $scope.uploadProcessing = false;
        // 	return;
        // }
        if($scope.uploadModel.name == 'Questions Import') {
            if (fileName.indexOf('.zip') == -1 && fileName.indexOf('.csv') == -1) {
                $scope.csvfilenotvalid = true;
                $scope.uploadProcessing = false;
                return;
            }
        } else if ($scope.uploadModel.name == 'Enrollment') {
            if(!$scope.courseUploadModel) {
                $scope.uploadProcessing = false;
                $scope.selectCourse = true;
                return;
            }
        } else if ($scope.uploadModel.name != 'Images') {
            if (fileName.indexOf('.csv') == -1) {
                $scope.csvfilenotvalid = true;
                $scope.uploadProcessing = false;
                return;
            }
        }

        if($scope.deleteSelection == '2'){
            $scope.url = $scope.uploadModel.cleanupurl;
        }

        var courseId = undefined, courseName = undefined;
        if($scope.uploadModel.name == 'Images' || $scope.uploadModel.name == 'Questions Import'){
            courseId = $scope.courseUploadModel.metadata.nodeId;
        } else if($scope.courseUploadModel) {
            courseId = $scope.courseUploadModel.identifier;
            courseName = $scope.courseUploadModel.name;
        }

       	fileUpload.uploadFileToUrl(file, $scope.url, courseId, $scope.folderPathModel, courseName).success(function(response){
            $('#userImportModal').modal('hide');
       		window.location.reload();
       	}).error(function(data, status, headers, config) {
            $scope.errorinupload = true;
            setTimeout(function(){
                $('#userImportModal').modal('hide');
                window.location.reload();
            },5000);
        });
    };

    $scope.getAllExportCourses	=	function(){
    	$scope.downloadModel = '';
    	$http.post('/private/v1/allCourses').success(function(data){
    		$scope.allExportCourses = data;
    	}).error(function(data, status, headers, config) {
		    console.log("Status:",status);
		});
    }
    $scope.getAllExportCourses();
    $scope.courseDownloadPath = function(){
    	if($scope.downloadModel != null){
    		$scope.courseDownloadURL = '/private/v1/course/export/'+encodeURIComponent($scope.downloadModel.identifier);
    	}
    }

    $scope.assessmentsDownloadPath = function(){
        if($scope.downloadModel != null){
            $scope.assessmentsDownloadURL = '/private/v1/assessments/export/'+encodeURIComponent($scope.downloadModel.identifier);
        }
    }

    $scope.toSec = function(exeTime) {
    	if(exeTime) {
    		return exeTime/1000;
    	} else {
    		return "--";
    	}
    }

    $scope.setErrorDetails = function(errorDetails) {
        console.log("errorDetails:",errorDetails);
        $scope.errorDetails = errorDetails;
    }

    //ng-grid funtions start
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };

    $scope.totalQueueSize = 0;
    $scope.pagingOptions = {
        pageSizes: [10, 25, 50, 100],
        pageSize: 10,
        currentPage: 1
    };

    $scope.setPagingData = function(data, page, pageSize){
        var pagedQueue = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.pagedQueueData = pagedQueue;
        $scope.totalQueueSize = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('/private/admin/importqueue').success(function (queue) {
                    $scope.contentLoaded = true;
                    data = queue.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data,page,pageSize);
                });
            } else {
                $http.get('/private/admin/importqueue').success(function (queue) {
                    $scope.contentLoaded = true;
                    $scope.setPagingData(queue,page,pageSize);
                });
            }
        }, 100);
    };

    $scope.$on('ngGridEventData', function(event, autoGenClass) {
        $('.'+autoGenClass).resize();
        $('#customNgGridHeader').addClass(autoGenClass);
        $('#customNgGridHeader').css("width",$('.'+autoGenClass).width());
    });

    $scope.$on('ngGridEventColumns', function(event, newColumns) {
        $('#custHeaderCell1').css("width",newColumns[2].width+newColumns[3].width);
        $('#custHeaderCell2').css("width",newColumns[4].width+newColumns[5].width+newColumns[6].width+newColumns[7].width+newColumns[8].width);
    });

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    var actionsCellTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text><button class="btn btn-default btn-xs" ng-show="row.entity.status == \'processing\' || row.entity.status == \'pending\'" ng-click="getRecord(row.entity)">Refresh</button>'+
                                         '<a class="btn btn-default btn-xs" ng-show="row.entity.status == \'complete\' || row.entity.status == \'fail\'" href="/private/admin/downloadcsv/{{row.entity.identifier}}">Download</a>' +
                                         '<a class="btn btn-default btn-xs" ng-if="row.entity.importFilename" href="/private/admin/download/{{row.entity.identifier}}/originalFile"style="margin-top: 5px; margin-right: 5px"><i class="fa fa-download"></i> Original File</a></span></div>';
    var warningsCellTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text><a data-toggle="modal" data-target="#errorDetailsModal" ng-click="setErrorDetails(row.entity.errorDetails)" ng-show="row.entity.warning > 0">{{row.entity.warning}}</a><span ng-show="row.entity.warning==0">{{row.entity.warning}}</span></span></div>';

    var customHeaderRowTemplate = '<div id="customNgGridHeader" style="text-align:center;height: 32.5px;">'
                                    +'<div class="pull-left ngHeaderText colt0" style="border-right: 1px solid #d4d4d4;height:32.5px;"></div>'
                                    +'<div class="pull-left ngHeaderText colt1" style="border-right: 1px solid #d4d4d4;height:32.5px;"></div>'
                                    +'<div id="custHeaderCell1" class="pull-left ngHeaderText" style="border-right: 1px solid #d4d4d4;border-bottom: 1px solid #d4d4d4;height:32.5px;">Records from CSV</div>'
                                    +'<div id="custHeaderCell2" class="pull-left ngHeaderText" style="border-right: 1px solid #d4d4d4;border-bottom: 1px solid #d4d4d4;height:32.5px;">Executed Records in Server</div>'
                                    +'<div class="pull-left ngHeaderText colt9" style="border-right: 1px solid #d4d4d4;height:32.5px;"></div>'
                                    +'<div class="pull-left ngHeaderText colt10" style="border-right: 1px solid #d4d4d4;height:32.5px;"></div>'
                                    +'</div>'
                                    +'<div ng-style="{ height: col.headerRowHeight / 2, top: col.headerRowHeight / 2 }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngHeaderCell"><div class="ngVerticalBar" ng-style="{height: col.headerRowHeight / 2}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div><div ng-header-cell></div></div>';

    $scope.gridOptions = {
        data: 'pagedQueueData',
        enablePaging: true,
        enableColumnResize: true,
        showFooter: true,
        enableSorting: false,
        totalServerItems: 'totalQueueSize',
        pagingOptions: $scope.pagingOptions,
        enableRowSelection: false,
        headerRowTemplate: customHeaderRowTemplate,
        headerRowHeight: 65,
        rowHeight: 70,
        aggregateTemplate: '<div ng-click="row.toggleExpand()" ng-style="rowStyle(row)" class="ngAggregate"> <span class="ngAggregateText">{{row.label CUSTOM_FILTERS}} (count: {{row.totalChildren()}} {{AggItemsLabel}} Remaining: {{aggFC(row)}})</span> <div class="{{row.aggClass()}}"></div> </div>',
        columnDefs: [{field:'type', displayName:'Job Type'},
                     {field:'uploadedBy', displayName:'Description', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text>Uploaded at {{row.entity.uploadTime | date:"MMM d, y h:mm:ss a"}} by {{row.entity.uploadedBy}} for <b>{{row.entity.courseName}}</b></span></div>', width: "17%"},
                     {field:'total', displayName:'Total Records'},
                     {field:'duplicate', displayName:'Duplicate Records',},
                     {field:'updated', displayName:'Updated Records'},
                     {field:'inserted', displayName:'Inserted Records'},
                     {field:'deleted', displayName:'Deleted Records'},
                     {field:'failed', displayName:'Failed Records'},
                     {field:'warning', displayName:'Warnings', cellTemplate: warningsCellTemplate},
                     {field:'exeTime', displayName:'Execution Time (sec)', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text>{{toSec(row.entity.exeTime)}}</span></div>'},
                     {field:'status', displayName:'Status'},
                     {field:'status', displayName:'Actions', cellTemplate: actionsCellTemplate},
                    ],
    };
    //ng-grid functions end

}]);

