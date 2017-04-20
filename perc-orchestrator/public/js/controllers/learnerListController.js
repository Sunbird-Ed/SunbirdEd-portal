app.filter('selectedContext', function () {
  return function (tasks, tags) {
    if(tasks != undefined) {
        return tasks.filter(function(task){
            for(var i in task.applicable_to) {
                if (tags.indexOf(task.applicable_to[i]) != -1) {
                return true;
                }
            }
        return false;
        });
    }
  };
});

app.controller('searchLearnerListCtrl',['$scope', '$http', '$timeout', '$rootScope', 'InteractionService', '$stateParams', '$location', 'CourseBrowserService', '$window', function($scope, $http, $timeout, $rootScope, service, $routeParams, $location, cbService, $window) {
    $scope.autoGenClss;
    $rootScope.leftMenu = 'ls';
    $rootScope.showConceptMap = false;
    $scope.showSearchGrid = false;
    $scope.myData = [];

    // pagination
    $scope.pagingOptions = {
        pageSizes: [10, 50, 100, 200],
        pageSize: 10,
        currentPage: 0
    };

    $scope.showSearchGrid = true;
    if($scope.myData.length == 0) {
        $scope.showSearchGrid = false;
        $scope.showMessage = "Please select a search filter to get the learners.";
    }

    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        $scope.myData = "";
        $scope.showSearchGrid = true;
        $scope.showNextLink = false;
        $scope.totalLearnerText = "";
        var reqParams = {"SEARCH_CRITERIA": {"filters" : $scope.filters, "pageSize" : pageSize, "page" : page}};
        $http.post('/private/v1/player/searchLearners/', {params:reqParams}).success(function(data) {
            console.log("data from view helper: " + JSON.stringify(data));
            $('#searchLearnerBtn').html('Search').attr('disabled', false);
            $scope.myData = data.learner;
            $scope.totalLearner = data.learnerCount;
            if($scope.totalLearner != undefined) {
                $scope.totalLearnerText = "Total Learners : " + $scope.totalLearner;
                if(($scope.totalLearner/pageSize) > 1) {
                    $scope.showNextLink = true;
                }
            }
            
            if($scope.myData.length == 0) {
                $scope.showSearchGrid = false;
                $scope.showMessage = "No Learners found";
            }
        }).
        error(function(data, status, headers, config) {
            console.log("Status : " + status);
            $('#searchLearnerBtn').html('Search').attr('disabled', false);
        });
    };

    $rootScope.learnerSearchQueries = [{"name":"-- Choose Filter --","default_params":[],"custom_params":[],"applicable_to":["course","module","lesson","learningresource"]}];
    $scope.getPreDefinedSearches = function () {
        setTimeout(function () {
                $http.get('/private/v1/player/preDefinedSearches/').success(function(searchesObj) {
                    angular.forEach(searchesObj, function(value , key) {
                        $rootScope.learnerSearchQueries.push(value);
                    });
                $rootScope.searchQuery = $rootScope.learnerSearchQueries[0];
                });
        }, 100);
    };

    $scope.getPreDefinedSearches();

    $rootScope.searchQueryParams = function(selectedFilter) {
        $rootScope.resource = selectedFilter;
        setTimeout(function(){adjustLSMenuHeight();}, 100);
    }

    $rootScope.getLearners = function(){
        $rootScope.selectedBadge = "";
        $rootScope.selectedTicket = "";
        var courseId = $scope.courseId;
        var searchParms = $rootScope.resource.custom_params;
        $scope.filters = [];
        var reqFlag = 0;
        
        // default parameters
        $.each($rootScope.resource.default_params, function(index, defaultParams) {
            var value = defaultParams.value;
            if(defaultParams.name == 'learning_element_id') {
                value = $scope.learnerSearchFilter.learningElementId;
            }
            $scope.filters.push({'name' : defaultParams.fieldName, 'operator': defaultParams.operator, 'value': value});
        });

        // custom parameters
        $.each(searchParms, function(index, param){
            var optVal = "";
            optVal = param._value;
            if(param.type == 'select') {
                optVal = param._value.value;
            }
            // required fields validation
            if(param.required == true && $.trim(optVal) == "") {
                reqFlag = 1;
                $('#'+param.name).addClass('ls-error');
                return false;
            }
            // if value is empty then no need to add into the filter array
            if($.trim(optVal) != "") {
                $scope.filters.push({'name' : param.fieldName, 'operator': param.operator, 'value': optVal});
            } 
        });
        // send request to server
        if(reqFlag == 0) {
            $('#searchLearnerBtn').html('Searching...').attr('disabled', true);
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }
    };

    $rootScope.clearLSContextInput = function() {
        $rootScope.$broadcast('updateInput', { name: ''});
    };

    $rootScope.setLSContext = function(context) {
        $rootScope.showConceptMap = false;
        $rootScope.$broadcast('updateInput', { name: context.name});
        $scope.learnerSearchFilter = {};
        if(context.id) {
            $scope.learnerSearchFilter.selectedId = context.id;
            $scope.learnerSearchFilter.learningElementId = cbService.addFedoraPrefix(context.id);
        }

        $rootScope.contextType = [];
        $rootScope.contextType.push(context.type);
        if(context.type == undefined) {
            $rootScope.contextType = [];
            $rootScope.contextType.push("course");
            $scope.learnerSearchFilter.learningElementId = $scope.courseId;
        }
        $rootScope.searchQuery = $rootScope.learnerSearchQueries[0];
    };

    $rootScope.setLSContext(cbService.currentItem);

    $scope.selectedList = [];
    $scope.selectedLearners = function(id, learnerObj) {
        $('#' + id).addClass('selected');
        var index = $scope.selectedList.indexOf(id);
        if (index > -1) {
            $('#' + id).removeClass('selected');
            $scope.selectedList.splice(index, 1);
        } else {
            $scope.selectedList.push(id);
        }
    };

    $rootScope.badges = [{"name":"Listener"},{"name":"Reader"},{"name":"Explorer"},{"name":"Miner"},{"name":"Discuss"},{"name":"Challenger"},{"name":"Tutor"},{"name":"Collaborator"},{"name":"Mentor"},{"name":"Good"},{"name":"Samaritan"}];
    $rootScope.tickets = [{"name":"Spammer"},{"name":"Trouble Maker"}];
    $rootScope.selectedBadge = "";
    $rootScope.getAllBadgesStudents = function(badgeType) {
        $rootScope.selectedTicket = "";
        $rootScope.selectedBadge = badgeType;
        $scope.filters = [];
        $scope.filters.push({"name" : "badge.badge_id", "operator": "eq", "value": badgeType.toLowerCase()});
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    };

    $rootScope.selectedTicket = "";
    $rootScope.getAllTicketsStudents = function(ticketType) {
        $rootScope.selectedBadge = "";
        $rootScope.selectedTicket = ticketType;
        $scope.filters = [];
        $scope.filters.push({"name" : "ticket.ticket_id", "operator": "eq", "value": ticketType.toLowerCase()});
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    };

    $rootScope.$watch('menuSlided', function (newVal, oldVal) {
        $('.'+$scope.autoGenClss).resize();
    }, true);

    $scope.triggerAjaxCall = function() {
        if($scope.myData.length > 0 && $scope.myData != undefined) {
            $scope.lastElementLenght = ($scope.myData.length) -1;
            $scope.lastElement = $scope.myData[$scope.lastElementLenght];
            $scope.lastElementId = $scope.lastElement.username;
            // Is this element visible onscreen?
            var visible = $("#" + $scope.lastElementId).visible();
            // Trigger Ajax Call
            if(visible) {
                var pageSize = $scope.pagingOptions.pageSize;
                var dataSize = $scope.myData.length;
                var pageNum  =  parseInt(dataSize/pageSize) - 1;
                if(((dataSize / pageSize) % ($scope.pagingOptions.pageSize)) != 0) {
                    pageNum = pageNum + 1;
                }
                console.log("data size : " + dataSize);
                var reqParams = {"SEARCH_CRITERIA": {"filters" : $scope.filters, "pageSize" : pageSize, "page" : pageNum}};
                $http.post('/private/v1/player/searchLearners/', {params:reqParams}).success(function(data) {
                    console.log("data from view helper: " + JSON.stringify(data));
                    if(data.learner.length > 0) {
                        angular.forEach(data.learner, function(val, key){
                                $scope.myData.push(val);
                        });                
                    }

                    if($scope.totalLearner <= $scope.myData.length) {
                        $scope.showNextLink = false;
                    }
                }).
                error(function(data, status, headers, config) {
                    console.log("Status : " + status);
                });
            }
        }
    };

// start auto load data while scroll
    $scope.autoLoadFun = function() {
        setTimeout(function () {  
            $('#mainContentColumn').bind('inview', function(event, visible) {
                if (visible) {
                    $scope.triggerAjaxCall();
                }
            });
        }, 100);
    };
    // end auto load data while scroll

    $scope.autoLoadFun();
    setTimeout(function(){adjustLSMenuHeight();}, 100);
}]);    
