app.controller('contentSearchCtrl',['$scope', '$http', '$timeout', '$rootScope', 'InteractionService', '$stateParams', '$location', 'CourseBrowserService', '$window', '$compile', '$sce', '$state', function($scope, $http, $timeout, $rootScope, service, $routeParams, $location, cbService, $window, $compile, $sce, $state) {
    $scope.allLectures = cbService.allLobs;
    $scope.allLectures.splice(0, 1);
    $scope.autoGenClss;
    $rootScope.leftMenu = 'cs';
    $rootScope.showConceptMap = false;
    $rootScope.contentSearchOpen = false;
    $rootScope.courseTitle = cbService.toc.name;
    $rootScope.learningElementTitle = cbService.toc.name;
    $rootScope.contentSearchFilters = {addedToSelectedConcepts:[]};
    $rootScope.contentSearchFilters.addedToSelectedConcepts = [];
    $scope.showSaveBinder = false;
    $scope.contentItems = [];
    $scope.showNoneMsg = false;
    $scope.setNoContentFoundMsg = false;

    $scope.diffLevelModel = []; 
    $scope.diffLevelData  = [ {id: "easy", label: "Easy"}
                            , {id: "medium", label: "Medium"}
                            , {id: "difficult", label: "Difficult"}];

    $scope.bloomsTaxonomyModel = []; 
    $scope.bloomsTaxonomyData  = [ {id: "remember", label: "Remember"}
                            , {id: "understand", label: "Understand"}
                            , {id: "apply", label: "Apply"}
                            , {id: "analyze", label: "Analyze"}
                            , {id: "evaluate", label: "Evaluate"}
                            , {id: "create", label: "Create"}];

    $scope.mediaTypeModel = []; 
    $scope.mediaTypeData  = [ {id: "video", label: "Video"}
                            , {id: "slides", label: "Slides"}
                            , {id: "image", label: "Image"}
                            , {id: "url", label: "URL"}
                            , {id: "text", label: "Text"}
                            , {id: "richText", label: "Rich Text"}
                            , {id: "document", label: "Document"}];

    $scope.reqParams = {
        keyword : "", 
        concepts : [], 
        diffLevels : [], 
        mediaTypes : [], 
        bloomsTaxonomyLevels : []
        };
    $scope.showAddBinder = false;
    $scope.setSearchParams = function() {
        var conceptsIds = [];
        var diffLevelModel = [];
        var mediaTypeModel = [];
        var bloomsTaxonomyModel = [];

        $rootScope.contentSearchFilters.addedToSelectedConcepts.forEach(function(concept){
            conceptsIds.push(concept.id);
        });

        $scope.diffLevelModel.forEach(function(diff){
            diffLevelModel.push(diff.id);
        });

        $scope.mediaTypeModel.forEach(function(media){
            mediaTypeModel.push(media.id);
        });

        $scope.bloomsTaxonomyModel.forEach(function(blooms){
            bloomsTaxonomyModel.push(blooms.id);
        });

        var searchFilters = {"conceptsIds" : conceptsIds, "diffLevelModel" : diffLevelModel, "mediaTypeModel" : mediaTypeModel, "bloomsTaxonomyModel" : bloomsTaxonomyModel}
        return searchFilters;
    }

    $scope.showMoreLoading = false;
    skipSearchIndex = 0;
    $scope.hasMore = false;

    $rootScope.getSearchContent = function(showMore) {
        $scope.checkFilters();
        $scope.showNextLink = false;
        $scope.mySearchData = "";
        $scope.pageSize = 30;
        $scope.page = 0;

        if(showMore != undefined) {
            skipSearchIndex += 1;
            $scope.showMoreLoading = true;
        }
        
        var searchParams = $scope.setSearchParams();
        $('#searchContentBtn').html('Searching...').attr('disabled', true);
        $scope.reqParams = {"skipSearchIndex" : skipSearchIndex, "pageSize" : $scope.pageSize, "page" : $scope.page, "keyword" : $scope.searchtext, "concepts" : searchParams.conceptsIds, "diffLevels" : searchParams.diffLevelModel, "mediaTypes" : searchParams.mediaTypeModel, "bloomsTaxonomyLevels" : searchParams.bloomsTaxonomyModel};
        //console.log("params : ", reqParams);
        $http.post('/private/v1/player/searchContent/', {params:$scope.reqParams}).success(function(data) {
            //console.log("data from view helper: " + JSON.stringify(data));
            $('#searchContentBtn').html('Search').attr('disabled', false);
            $scope.showMoreLoading = false;
            if(data.showMore == true) $scope.hasMore = true;
            else $scope.hasMore = false;
            /*$scope.contentItems = "";
            $scope.contentItems = data.mediaContent;*/
            $scope.contentItems.unshift.apply($scope.contentItems, data.mediaContent);
            $scope.totalContentItems = data.totalContentItems;
            $scope.showNextLink = true;
            if($scope.totalContentItems == 0) $scope.setNoContentFoundMsg = true;
            /*if($scope.totalContentItems <= $scope.contentItems.length) {
                    $scope.showNextLink = false;
                }*/
        }).
        error(function(data, status, headers, config) {
            console.log("Status : " + status);
            $('#searchContentBtn').html('Search').attr('disabled', false);
        });
    };

    $scope.showErrorMsg = false;

    $rootScope.createBinder = function() {
        var conceptsArray = [];
        angular.forEach($rootScope.contentSearchFilters.addedToSelectedConcepts, function(conceptVal, conceptKey) {
            var selectedConcept = {conceptTitle : conceptVal.concept, conceptIdentifier : conceptVal.id};
            conceptsArray.push(selectedConcept);
        });

        $scope.showErrorMsg = false;
        if($scope.binder.title == "" || $scope.binder.parentId == "" || conceptsArray.length == 0) {
            $scope.showErrorMsg = true;            
            return false;
        }

        var reqParams = {"name" : $scope.binder.title, "description" : $scope.binder.description, "concepts" : conceptsArray, "courseId" : $rootScope.courseId, 'parentId' : cbService.addFedoraPrefix($scope.binder.parentId)};
        $('#createBinderBtn').html('Saving...').attr('disabled', true);
        $http.post('/private/v1/player/createBinder/', {params:reqParams}).success(function(data) {
            //console.log("data from view helper: " + JSON.stringify(data));
            $('#createBinderBtn').html('Create').attr('disabled', false);
            if($rootScope.binderContentList.length == 0) $rootScope.binderContentList = [];

            $rootScope.binderContentList.splice(0,0,data);
            $scope.createNewBinderMsg = false;
            $scope.showAddBinder = false;
            $("#binderForm").slideUp('slow');
            $('.createBinderBtn').removeClass('fa-close');
            $('.createBinderBtn').addClass('fa-edit');
            $rootScope.showConformationMessage('alert-success','New Study Material has been created successfully.');
        }).
        error(function(data, status, headers, config) {
            console.log("Status : " + status);
            $('#createBinderBtn').html('Save').attr('disabled', false);
        });
    };
    
    $rootScope.selectedBinder = {"binder":[], "binderContents" : {"sequence":[]} };
    $rootScope.addContentItemToBinder = function(item) {
        var reqParams = {"lobId" : $rootScope.selectedBinder.binder.identifier, "elements": {"name" : item.name, "elementId" : item.identifier, "elementType" : "content"}};
        $http.post('/private/v1/player/addContentIntoBinder/', {params:reqParams}).success(function(data) {
            //console.log("Add data from view helper: " + JSON.stringify(data));
            $scope.showReleaseBinderBtn = true;
            $rootScope.binderContentList.forEach(function(content){
                if(content.binderContents.lobId == $rootScope.selectedBinder.binder.identifier) {
                    $rootScope.selectedBinder.binderContents.sequence.push(item.identifier);
                    $rootScope.selectedBinder.binderContents.elements.push(reqParams.elements); 
                    $rootScope.showConformationMessage('alert-success','Content Added to Study Material.');
                    return;
                }
            });
        }).
        error(function(data, status, headers, config) {
            console.log("Status : " + status);
            $rootScope.showConformationMessage('alert-danger','Content is not Added to Study Material.');
        });
    };

    $rootScope.removeContentItemToBinder = function(item) {
        $rootScope.binderContentList.forEach(function(content){
            if(content.binderContents.lobId == $rootScope.selectedBinder.binder.identifier) {
                var seqIndex = $rootScope.selectedBinder.binderContents.sequence.indexOf(item.identifier);
                if (seqIndex > -1) {
                    $rootScope.selectedBinder.binderContents.sequence.splice(seqIndex, 1);
                }
                var binderSeq = $rootScope.selectedBinder.binderContents.sequence;
                if (!binderSeq || binderSeq.length <= 0) {
                    $scope.showReleaseBinderBtn = false;   
                }
                return;
            }
        });
        var reqParams = {"lobId" : $rootScope.selectedBinder.binder.identifier, "elementId": item.identifier};
       // console.log("params : ", reqParams);
        $http.post('/private/v1/player/removeContentIntoBinder/', {params:reqParams}).success(function(data) {
            //console.log("Removed data from view helper: " + JSON.stringify(data));
            $rootScope.showConformationMessage('alert-success','Content removed from Study Material.');
        }).
        error(function(data, status, headers, config) {
            console.log("Status : " + status);
            $rootScope.showConformationMessage('alert-danger','Content is not removed from Study Material.');
        });
    };

    $rootScope.getAllBinders = function() {
        setTimeout(function () {
            $http.get('/private/v1/player/getBinders/' + encodeURIComponent($rootScope.courseId)).success(function(data) {
               // console.log(JSON.stringify(data));
                $rootScope.binderContentList = data;
                $scope.createNewBinderMsg = false;
                if(!$rootScope.binderContentList || $rootScope.binderContentList.length == 0) {
                    $scope.createNewBinderMsg = true;
                }

                $('#searchContentBtn').html('Search').attr('disabled', false);
            });
        }, 100);
    };

    $rootScope.getBinderById = function(binderId) {
        $http.get('/private/v1/player/getBinder/' + encodeURIComponent(binderId)).success(function(data) {
            $scope.showBinderFilters = true;
            $scope.showCreateBinder = false;
            $scope.showAddRemoveBtn = true;
            $rootScope.selectedBinder = data;
            $scope.getBinderContentItems(data);
            $scope.showBinderDetail = true;
        });  
    };

    $rootScope.getCSConceptTitleList = function(object) {
        var conceptArray = [];
        for(var key in object) {
            if(object[key])
                conceptArray.push({id: key, concept: object[key]});
        }
        /*if($rootScope.contentSearchFilters.addedToSelectedConcepts.length > 0){
            $rootScope.contentSearchFilters.addedToSelectedConcepts.forEach(function(element){
                var index = conceptArray.map(function(el) {
                              return el.id;
                            }).indexOf(element.id);
                conceptArray.splice(index,1);
            });
        }*/
        return conceptArray;
    };

    $rootScope.removeCSSelectedConcepts = function(concept) {
         if($rootScope.contentSearchFilters.addedToSelectedConcepts.length > 0){
             var SCIndex = $rootScope.contentSearchFilters.addedToSelectedConcepts.indexOf(concept);
            if(SCIndex > -1)
                $rootScope.contentSearchFilters.addedToSelectedConcepts.splice(SCIndex, 1);
         }
    };

    $rootScope.addCSToSelectedConcepts = function($item, $model, $label) {
        if(!$rootScope.contentSearchFilters.addedToSelectedConcepts) $rootScope.contentSearchFilters.addedToSelectedConcepts = [];
        $rootScope.contentSearchFilters.addedToSelectedConcepts.push($item);
    };

    $rootScope.createBinderQuery = function(binderType) {
        $scope.binderQueryType = binderType;
        $("#saveBinderModal").modal('toggle');
        $scope.showSaveBinder = true;
    };

    $rootScope.clearBinder = function() {
        $rootScope.selectedBinder = undefined;
    };

    $scope.getBinderContentItems = function(binderObj) {
       // console.log("getContentItems : ", binderObj);
        $rootScope.contentSearchFilters.addedToSelectedConcepts = [];
        $scope.concepts = binderObj.binder.concepts;
        angular.forEach($scope.concepts, function(conceptVal, conceptKey) {
            var conceptObj = {"id":conceptVal.conceptIdentifier, "concept":conceptVal.conceptTitle};
            $rootScope.addCSToSelectedConcepts(conceptObj);
        });

        $scope.showListMsg = false;
        $scope.showNextLink = false;
        if((binderObj.binderContents.sequence.length) > 0) {
            $scope.showReleaseBinderBtn = true;
            var reqParams = {"elements" : binderObj.binderContents.sequence};
            $http.post('/private/v1/player/getBinderContentItems/', {params:reqParams}).success(function(data) {
               // console.log("binder content iten data from view helper : " + JSON.stringify(data));
                $('#searchContentBtn').html('Search').attr('disabled', false);
                $scope.contentItems = "";
                $scope.contentItems = data;
            }).
            error(function(data, status, headers, config) {
                console.log("Status : " + status);
                $('#searchContentBtn').html('Search').attr('disabled', false);
            });
        } else {
            $scope.showListMsg = true;
            $scope.showReleaseBinderBtn = false;
        }
    }

    $scope.showBinderDetail = false;
    $rootScope.getSetBinder = function(binder) {        
        
    };

    $rootScope.clearCSAllFilters = function() {
        $scope.searchtext = "";
        $rootScope.contentSearchFilters.addedToSelectedConcepts = []; 
        $scope.diffLevelModel = []; 
        $scope.mediaTypeModel = []; 
        $scope.bloomsTaxonomyModel = [];
        $scope.checkFilters();
    };

    $scope.getDefaultContentItems = function() {
        $scope.showAddRemoveBtn = false;
        if($rootScope.selectedBinder.binder.identifier) {
            $scope.showAddRemoveBtn = true;
        }
        $scope.showNextLink = false;
        $scope.showListMsg = false;
        $scope.mySearchData = "";
        $scope.pageSize = 30;
        $scope.page = 0;
        $('#searchContentBtn').html('Searching...').attr('disabled', true);
        $scope.searchtext = "";
       // $rootScope.contentSearchFilters.addedToSelectedConcepts = [];
       // console.log("default : ", $rootScope.contentSearchFilters.addedToSelectedConcepts);
        $scope.diffLevelModel = [];
        $scope.mediaTypeModel = [];
        $scope.bloomsTaxonomyModel = [];

        var searchParams = $scope.setSearchParams();
        $scope.reqParams = {"skipSearchIndex" : skipSearchIndex,"pageSize" : $scope.pageSize, "page" : $scope.page, "keyword" : $scope.searchtext, "concepts" : searchParams.conceptsIds, "diffLevels" : searchParams.diffLevelModel, "mediaTypes" : searchParams.mediaTypeModel, "bloomsTaxonomyLevels" : searchParams.bloomsTaxonomyModel};
        //console.log("default search : ", reqParams);
        $http.post('/private/v1/player/searchContent/', {params:$scope.reqParams}).success(function(data) {
            $('#searchContentBtn').html('Search').attr('disabled', false);
            $scope.showMoreLoading = false;
            if(data.showMore == true) $scope.hasMore = true;
            else $scope.hasMore = false;
            /*$scope.contentItems = "";
            $scope.contentItems = data.mediaContent;*/
            $scope.contentItems.unshift.apply($scope.contentItems, data.mediaContent);
            $scope.totalContentItems = data.totalContentItems;
            $scope.showNextLink = true;
            $scope.checkFilters();
            if($scope.totalContentItems <= $scope.contentItems.length) {
                    $scope.showNextLink = false;
                }
            if($scope.totalContentItems == 0) {
                $scope.setNoContentFoundMsg = true;
            }
        }).
        error(function(data, status, headers, config) {
            console.log("Status : " + status);
            $('#searchContentBtn').html('Search').attr('disabled', false);
        });
    };

    $scope.contentItemExistsInBinder = function(itemId) {
        if($rootScope.selectedBinder) {
            if($rootScope.selectedBinder.binderContents.sequence){
                if($rootScope.selectedBinder.binderContents.sequence.indexOf(itemId) != -1 ){
                    return true;
                }
            }
        }
        return false;
    };

    $scope.showBinderFilters = true;
    $scope.showBinderSearchTab = function(){
        $scope.showBinderFilters = false;
        $scope.contentSearchOpen = false;
        // get the content items
        $scope.getDefaultContentItems();
    };

    $scope.showCreateBinder = false;
    $rootScope.showCreateBinderForm = function(){
        $scope.createNewBinderMsg = false;
        $scope.showCreateBinder = true;
        $scope.showErrorMsg = false;
        $scope.binder = {   title : '',
                            description : '',
                            parent : '',
                            parentId : ''
                        };
        $rootScope.contentSearchFilters.addedToSelectedConcepts = [];
        $('.createBinderBtn').toggleClass('fa-close');
        $('.createBinderBtn').toggleClass('fa-edit');
        if($scope.showAddBinder){
            $scope.showAddBinder = false;
            $("#binderForm").slideUp('slow');
        }
        else{
            $scope.showAddBinder = true;
            $("#binderForm").slideDown('slow');
        }
    };

    $scope.showMediaType = function(mediaObj) {
        if(mediaObj.length > 0) {
            return true;
        }
        return false;
    };

    $scope.showDiffLevel = function(diffVal) {
        if(diffVal && diffVal != null && diffVal != "") {
            return true;
        }
        return false;
    };


    $scope.triggerAjaxCall = function() {
        if($scope.contentItems.length > 0 && $scope.contentItems != undefined) {
            $scope.lastElementLenght = ($scope.contentItems.length) -1;
            var pageSize = $scope.pageSize;
            var dataSize = $scope.contentItems.length;
            var pageNum  =  parseInt(dataSize/pageSize) - 1;
            if(((dataSize / pageSize) % ($scope.pageSize)) != 0) {
                pageNum = pageNum + 1;
            }

            var reqParams = {"pageSize" : pageSize, "page" : pageNum, "keyword" : $scope.reqParams.keyword, "concepts" : $scope.reqParams.concepts, "diffLevels" : $scope.reqParams.diffLevels, "mediaTypes" : $scope.reqParams.mediaTypes, "bloomsTaxonomyLevels" : $scope.reqParams.bloomsTaxonomyLevels};
            $http.post('/private/v1/player/searchContent/', {params: reqParams}).success(function(data) {
                //console.log("data from view helper: " + JSON.stringify(data));
                if(data.mediaContent.length > 0) {
                    angular.forEach(data.mediaContent, function(val, key){
                            $scope.contentItems.push(val);
                    });                
                }
            
                if($scope.totalContentItems <= $scope.contentItems.length) {
                    $scope.showNextLink = false;
                }
            }).
            error(function(data, status, headers, config) {
                console.log("Status : " + status);
            });
        }
    };

    $scope.getFilterSeacrchContent = function(concept) {
        $scope.showNoneMsg = true;
        $rootScope.contentSearchFilters.addedToSelectedConcepts = [];
        var conceptObj = {"id":concept.conceptIdentifier, "concept":concept.conceptTitle};
        $rootScope.addCSToSelectedConcepts(conceptObj);
        $scope.showAddRemoveBtn = false;
        if($rootScope.selectedBinder.binder.identifier) {
            $scope.showAddRemoveBtn = true;
        }
        $scope.showNextLink = false;
        $scope.showListMsg = false;
        $scope.showBinderFilters = false;
        $scope.contentSearchOpen = true;
        $scope.mySearchData = "";
        $scope.pageSize = 30;
        $scope.page = 0;
        $('#searchContentBtn').html('Searching...').attr('disabled', true);
        $scope.searchtext = "";
        $scope.diffLevelModel = [];
        $scope.mediaTypeModel = [];
        $scope.bloomsTaxonomyModel = [];
        var concept = [concept.conceptIdentifier];
        $scope.reqParams = {"pageSize" : $scope.pageSize, "page" : $scope.page, "keyword" : $scope.searchtext, "concepts" : concept, "diffLevels" : $scope.diffLevelModel, "mediaTypes" : $scope.mediaTypeModel, "bloomsTaxonomyLevels" : $scope.bloomsTaxonomyModel};
        $http.post('/private/v1/player/searchContent/', {params:$scope.reqParams}).success(function(data) {
            //console.log("data from view helper: " + JSON.stringify(data));
            $('#searchContentBtn').html('Search').attr('disabled', false);
            $scope.contentItems = "";
            $scope.contentItems = data.mediaContent;
            $scope.totalContentItems = data.totalContentItems;
            $scope.showNextLink = true;

            if($scope.totalContentItems <= $scope.contentItems.length) {
                    $scope.showNextLink = false;
                }
        }).
        error(function(data, status, headers, config) {
            console.log("Status : " + status);
            $('#searchContentBtn').html('Search').attr('disabled', false);
        });
    };

    $scope.checkFilters = function() {
        if($rootScope.contentSearchFilters.addedToSelectedConcepts.length > 0 || $scope.diffLevelModel.length > 0 || $scope.mediaTypeModel.length > 0 || $scope.bloomsTaxonomyModel.length > 0){
           $scope.showNoneMsg = true; 
        } else {
            $scope.showNoneMsg = false; 
        }
    }

    $scope.getUpdateModel = function(data, oldModel) {
        var newDataModel = [];
        oldModel.forEach(function(item) {
            if(data.id != item.id){
                newDataModel.push(item);
            }
        });
        $scope.checkFilters();
        return newDataModel;
    }

    $rootScope.removeAppliedFilters = function(type, data){
        switch(type){
            case 'concept':
                $rootScope.removeCSSelectedConcepts(data);
                $rootScope.getSearchContent();
                break;

            case 'difficulty':
                $scope.diffLevelModel = $scope.getUpdateModel(data, $scope.diffLevelModel);
                $rootScope.getSearchContent();
                break;

            case 'media':
                $scope.mediaTypeModel = $scope.getUpdateModel(data, $scope.mediaTypeModel);
                $rootScope.getSearchContent();
                break;
                
            case 'blooms':
                $scope.bloomsTaxonomyModel = $scope.getUpdateModel(data, $scope.bloomsTaxonomyModel);
                $rootScope.getSearchContent();
                break;
            }
    };

    $scope.previewContent = true;
    $scope.showContentPreview = function(item) {
        $scope.previewContent = false;
        //console.log(item);
        $scope.selectedContent = item;
        // playMedia(item.media, $http, $scope, $compile);
        $scope.playMedia($scope.selectedContent.media[0].mediaId);
    };

    $scope.backToBinders = function() {
        $scope.showBinderDetail = false;
        $scope.setNoContentFoundMsg = false;
        $scope.showNoneMsg = false;
        selectLeftMenuTab('coachingTab');
        $state.go('contentSearch', {lobId: cbService.currentItem.id});
    };

    $scope.currentMedia = null;
    $scope.$on('playMedia', function() {
        $scope.playMedia($scope.selectedContent.media[0].mediaId);
    });

    $scope.playMedia = function(pMediaId) {
        $scope.selectedContent.media.forEach(function(media) {
            if(media.mediaId == pMediaId) {
                $scope.currentMedia = media;
            }
        });
        playMedia($scope.currentMedia, $http, $scope, $compile);
    }

    $scope.showDetailedView = function(binderId) {
        //$scope.showBinderDetail = true;
        $state.go('binder', {binderId: encodeURIComponent(binderId)});
    }

    $scope.backToList = function(){
        $scope.previewContent = true;
    }
     
    $scope.clearContextInput = function() {
        contextSearchPrevValue = '';
        $(document).ready(function() {
            $('.bindercontextselect').click(function(evt) {
                evt.stopPropagation();
                $(".qa-context-container").toggleClass("qa-context-container-hover");
                $('.bindercontextselect').val('');
            });
            $(document).click(function() {
                $('.qa-context-container').removeClass('qa-context-container-hover'); //make all inactive
                if($('.bindercontextselect').val() == '') {
                    $('.bindercontextselect').val(contextSearchPrevValue);
                }
            });
        });

        contextSearchPrevValue = $('.bindercontextselect').val();
        $scope.binder.parent = '';
    }

    $scope.setBinderParent = function(context){
        $scope.binder.parent = context;
        $scope.binder.parentId = context.id;
    }

    $scope.createBinderEvent = function(binderId) {
        $state.go('postActivity', {type: "binder", id: cbService.removeFedoraPrefix(binderId), locId: ""});
    }; 

    var binderId = $routeParams.binderId;
    if (binderId && binderId != '') {
        $rootScope.getBinderById(binderId);
    } else {
        $rootScope.getAllBinders()
    }
    setTimeout(function(){adjustLSMenuHeight();}, 100);

    $scope.initializeSelect2 = function() {
        setTimeout(function() {
            $("#binderLOSelect").select2({
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

    $scope.initializeSelect2();
}]);    
