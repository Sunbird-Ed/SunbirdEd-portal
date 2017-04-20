studioApp.controller('CreateCourseCtrl', function($scope, $http) {

    $scope.signOut = function() {
        $window.location.href = '/private/v1/logout';       
    }

    $scope.loadPedagogies = function() {
        $http.get('/private/v1/pedagogy/').success(function(data) {
            $scope.pedagogies = data;
        });
    }

    $scope.loadPedagogies();
    $scope.selectPedagogy = function(pedId, taxonomyId) {
        $scope.pedagogyId = pedId;
        $scope.taxonomyId = taxonomyId;
    };

    $scope.createCourse = function() {
        var course = new Object();
        course.name = $scope.name;
        course.description = $scope.description;
        course.learningObjectives = [$scope.learningObjectives];
        course.pedagogyId = $scope.pedagogyId;
        course.taxonomyId = $scope.taxonomyId;
        $http.post("/private/v1/course/create", course).success(function(data) {
            document.location.href = '/studio/course/view/' + encodeURIComponent(data.courseId);
        });
    }
});

studioApp.directive('bindOnce', function() {
    return {
        scope: true,
        link: function( $scope ) {
            setTimeout(function() {
                $scope.$destroy();
            }, 0);
        }
    }
});

studioApp.controller('CourseStructureCtrl', function($scope, $http, page, $location, $window) {

    $scope.currentView = 'CourseStructure';
    $scope.treeIconClick = function($event) {
        collapseTree($event.target.id);
    };

    $scope.setTaxonomy = function(taxonomyId) {
        $http.get('/private/v1/taxonomy/metadata/' + encodeURIComponent(taxonomyId)).success(function(taxonomy) {
            $scope.taxonomy = taxonomy;
        });
    };

    $scope.setMetadata = function(metadata) {
        $scope.currentMetadata = metadata;
        if (typeof metadata === 'undefined') {
            $scope.currentMetadata = {};
        }
    }

    $scope.selectLOB = function(taxonomyId, lobId, name) {
        $scope.setTaxonomy(taxonomyId);
        $scope.currentSelected = name;
        $http.get('/private/v1/lob/' + encodeURIComponent(lobId)).success(function(lob) {
            $scope.setMetadata(lob.metadata);
        });
        $scope.selectedIdentifier = lobId;
        $scope.selectedType = 'LOB';
    };

    $scope.selectCourse = function(data) {
        $scope.setTaxonomy($scope.rootNodeSet.taxonomyId);
        $http.get('/private/v1/course/courseStructure/' + encodeURIComponent($scope.courseId)).success(function(data) {
            $scope.setMetadata(data.metadata);
        });
        $scope.setMetadata(data.metadata);
        $scope.currentSelected = data.name;
        $scope.selectedIdentifier = data.identifier;
        $scope.selectedType = 'Course';
    };

    $scope.pageLoad = function() {
        $scope.courseId = $('#courseId').val();
        $http.get('/private/v1/course/courseStructure/' + encodeURIComponent($scope.courseId)).success(function(data) {
            $scope.courseStructure = data;
            $scope.currentSelected = data.name;
            page.setCourseTitle(data.name);
            page.setEditor(true);
            $scope.setMetadata(data.metadata);
            $scope.selectedIdentifier = data.identifier;
            $scope.selectedType = 'Course';
            $scope.setTaxonomy(data.taxonomyId);

            setTimeout(function() {
                initializeLayout();
            }, 100);
        });
    }
    $scope.pageLoad();

    $scope.addMetadata = function() {
        var metaObj = new Object();
        metaObj.id = $scope.selectedIdentifier;
        metaObj.metadata = $scope.currentMetadata;
        if ($scope.selectedType == 'Course') {
            $http.post("/private/v1/course/metadata/update", metaObj).success(function(data) {});
        } else {
            $http.post("/private/v1/lob/metadata/update", metaObj).success(function(data) {});
        }
    }

    $scope.showAddLOB = function(data, nodeSet, nodeSetId, relationName, lobType) {
        $scope.workingData = data;
        $scope.lobNodeSet = nodeSet;
        $scope.lobNodeSetId = nodeSetId;
        $scope.lobRelationName = relationName;
        $scope.parentLobType = lobType;
        $('#addLOB').modal({
            keyboard: false
        });
    }

    $scope.addLOB = function() {
        var lob = new Object();
        lob.name = $scope.lobName;
        lob.nodeSet = $scope.lobNodeSet;
        lob.nodeSetId = $scope.lobNodeSetId;
        lob.relationName = $scope.lobRelationName;
        lob.courseId = $scope.courseId;
        lob.parentId = $scope.workingData.identifier;
        $http.post("/private/v1/lob/create", lob).success(function(data) {
            $('#addLOB').modal('hide');
            $scope.lobName = '';
            if (typeof $scope.workingData.children === 'undefined') {
                $scope.workingData.children = [];
            }
            $scope.workingData.children.push(data);
            var sequence = [];
            $.each($scope.workingData.children, function(idx, child) {
                sequence[sequence.length] = child.identifier;
            });
            var seqObject = new Object();
            seqObject.id = $scope.workingData.identifier;
            seqObject.sequence = sequence;

            var url = '/private/v1/lob/sequence/update';
            if ($scope.parentLobType == 'Course') {
                url = '/private/v1/course/sequence/update';
            }

            $http.post(url, seqObject).success(function(data) {
                //console.log(data);
            });
            setTimeout(function() {
                initializeTree();
            }, 500);
        });

        $scope.deleteLOB = function(lobId) {
            $http.get('/private/v1/lob/delete/' + encodeURIComponent(lobId)).success(function(data) {
                if (data.error) {
                    $scope.errorText = data.errorstack;
                    $('#errorDiv').removeClass('hide');
                } else {
                    $scope.pageLoad();
                }
            });
        }
    }

    $scope.save = function() {
        $http.get('/private/v1/course/save/' + encodeURIComponent($scope.courseId)).success(function(data) {
            console.log(data);
        });
    }
});

studioApp.controller('ViewCourseCtrl', function($scope, $http) {
    $scope.pageLoad = function() {
        $scope.courseId = $('#courseId').val();
        $http.get('/private/v1/course/getById/' + encodeURIComponent($scope.courseId)).success(function(data) {
            $scope.courseDescription = data.description;
            $scope.courseTitle = data.name;

            $http.get('/private/v1/pedagogy/' + encodeURIComponent(data.pedagogyId)).success(function(pedagogy) {
                $scope.pedagogyName = pedagogy.name;
            });
        });
    }

    $scope.pageLoad();
});
