
app.controller('DiscoverContentCtrl', function($scope, $state, $stateParams, $http, $location, $anchorScroll, $compile, $timeout, $rootScope, CourseBrowserService) {

    $scope.concept = undefined;
    $scope.selectedConcept = undefined;
    $scope.selectedConceptId = undefined;
    $scope.selectedCategory = undefined;
    $scope.showContent = false;
    $scope.showPlayer = false;
    $scope.limit = 20;
    $scope.hasMore = false;

    if($stateParams.concept && $stateParams.concept != '') {
        $scope.selectedConceptId = CourseBrowserService.addFedoraPrefix($stateParams.concept);
    }
    if($stateParams.category && $stateParams.category != '') {
        $scope.selectedCategory = $stateParams.category;
    }

    // $rootScope.contentCounts = null;
    $scope.environment = 'Explore';
    /* Repository browser visualization code starts here.. */
    $scope.repositoryBrowserContents = [];

    $scope.loadConceptMap = function() {
        if (typeof $rootScope.repositoryBrowserMap == 'undefined') {
            $http.get('/private/v1/course/fetchConceptMap/' + encodeURIComponent($rootScope.courseId))
            .success(function(data, status, headers, config) {
                if(data && data.length > 0) {
                    $rootScope.repositoryBrowserMap = data[0];
                    if(data.length > 1) {
                        $rootScope.contentCounts = data[1];
                    }
                    $scope.buildConceptTree();
                }
            })
            .error(function(data, status, headers, config) {
                console.log("Error loading data!" + status);
            });
        } else {
            $scope.buildConceptTree();
        }
    }

    $scope.buildConceptTree = function() {
        $timeout(function() {
            var map = $rootScope.repositoryBrowserMap;
            if (map && map.children) {
                $scope.updateConceptName(map.children);
            }
            console.log(map);
            showDNDTree(map, 'treeLayout', {}, $scope, $scope.selectedConceptId);
        }, 1000);
    }

    $scope.updateConceptName = function(children) {
        if (children) {
            children.forEach(function(child) {
                if (child.name && child.name.length > 75) {
                    child.name = child.name.substring(0, 75) + "...";    
                }
                $scope.updateConceptName(child.children);
            });
        }
    }

    $scope.fetchRelatedConcepts = function(content) {
        var conceptIds = [];
        content.concepts.forEach(function(concept) {
            conceptIds.push(concept.conceptIdentifier);
        });
        $http.post('/private/v1/content/relatedConcepts/', {
            "conceptIds": conceptIds,
            "category": $rootScope.selectedCategory
        })
        .success(function(data, status, headers, config) {
            content['relatedConcepts'] = data;
        })
        .error(function(data, status, headers, config) {
            console.log("Error loading data!" + status);
        });
    }

    $scope.fetchContent = function(offset, limit) {
        return $http.post('/private/v1/concept/content/', {
            conceptId: $scope.selectedConcept.conceptId,
            category: $scope.selectedCategory,
            courseId: $rootScope.courseId,
            offset: offset,
            limit: limit
        });
    }

    $scope.selectConcept = function(d) {
        $('#repositoryBrowserContentsDiv').css({
            opacity: 0.4
        });
        $scope.selectedConcept = d;
        $scope.showLoadingImage = true;
        $scope.fetchContent($rootScope.offset, $scope.limit).success(function(data) {
            $scope.repositoryBrowserContents = data;
            if(data.length < $scope.limit) { $scope.hasMore = false; } else { $scope.hasMore = true; }
            $('#repositoryBrowserContentsDiv').css({
                opacity: 1
            });
            $scope.showLoadingImage = false;
            if($scope.selectedContentId) {
                var contentArray = $scope.repositoryBrowserContents.filter(function(item) {
                    return item.identifier == $scope.selectedContentId;
                });
                if(contentArray.length > 0) {
                    $scope.showPlayer = true;
                    var selectedContent = contentArray[0];
                    $scope.selectedContentMedia = selectedContent.media[0];
                    playMedia($scope.selectedContentMedia, $http, $scope, $compile);
                }
            }
        });
    };

    $scope.showMore = function() {
        $scope.showMoreLoading = true;
        $rootScope.offset++;
        $scope.fetchContent($rootScope.offset, $scope.limit).success(function(data) {
            if(data.length < $scope.limit) { $scope.hasMore = false; } else { $scope.hasMore = true; }
            $scope.repositoryBrowserContents.push.apply($scope.repositoryBrowserContents, data);
            $('#repositoryBrowserContentsDiv').css({
                opacity: 1
            });
            $scope.showMoreLoading = false;
        });
    }

    $scope.playContent = function(content) {
        /*$state.go(
            'explore.play',
            {
                "category": ($stateParams.category || ""),
                "concept": (CourseBrowserService.removeFedoraPrefix($scope.selectedConcept.conceptId) || ""),
                "contentId": CourseBrowserService.removeFedoraPrefix(content.identifier)
            }
        );*/

        $scope.selectedContentId = content.identifier;
        $http.get('/private/v1/content/getContent/' + encodeURIComponent($scope.selectedContentId))
        .success(function(data) {
            $scope.showContent = true;
            $scope.showPlayer = true;
            $scope.selectedContentMedia = data.media[0];
            playMedia($scope.selectedContentMedia, $http, $scope, $compile);
            $location.hash("mediaPlayerId");
            $anchorScroll();
        });

    }

    $scope.contentMouseOver = function(event) {
        $(event.currentTarget).find('.playButton').removeClass('hide');
    }

    $scope.contentMouseLeave = function(event) {
        $(event.currentTarget).find('.playButton').addClass('hide');
    }

    $scope.recursiveMap = function(concept, conceptId, parents) {
        if(concept.conceptId == conceptId) {
            $rootScope.conceptPath = parents;
            $rootScope.conceptPath.push(conceptId);
        } else if(concept.name == 'more') {
            parents.push(concept.conceptId);
            concept.pages.forEach(function(page) {
                page.nodes.forEach(function(child) {
                    $scope.recursiveMap(child, conceptId, JSON.parse(JSON.stringify(parents)));
                });
            });
        } else if(concept.children) {
            parents.push(concept.conceptId);
            concept.children.forEach(function(child) {
                $scope.recursiveMap(child, conceptId, JSON.parse(JSON.stringify(parents)));
            });
        }
    }

    $scope.conceptComparator = function(a, b) {
        if (a.conceptTitle < b.conceptTitle)
            return -1;
        if (a.conceptTitle > b.conceptTitle)
            return 1;
        return 0;
    }

    $scope.setElementComplete = function() {
    }

    $scope.backToList = function() {
        $state.go('explore', {"category": ($stateParams.category || ""), "concept": ($stateParams.concept || "")});
    }

    $scope.getConceptList = function(object) {
        if($scope.conceptsList && $scope.conceptsList.length > 0) {
            return $scope.conceptsList;
        } else {
           var conceptList = [];
            for(var key in object) {
                if(object[key])
                    conceptList.push({id: key, name: object[key]});
            }
            $scope.conceptsList = conceptList;
            return conceptList; 
        }
    }

    $scope.showSearchForm = function() {
        $('#contentSearchForm').slideToggle();
        $('#contentSearchBtn').toggleClass('fa-close');
        $('#contentSearchBtn').toggleClass('fa-search');
    }

    $scope.searchContent = function() {
        expandANode($scope.concept.id, $scope.concept.name);
    }

    if($stateParams.contentId && $stateParams.contentId != '') {
        if(!$rootScope.offset) $rootScope.offset = 0;
        $scope.selectedContentId = CourseBrowserService.addFedoraPrefix($stateParams.contentId);
        $http.get('/private/v1/content/getContent/' + encodeURIComponent($scope.selectedContentId))
        .success(function(data) {
            $scope.showPlayer = true;
            $scope.selectedContentMedia = data.media[0];
            playMedia($scope.selectedContentMedia, $http, $scope, $compile);
        });
    } else {
        $rootScope.offset = 0;
        $scope.loadConceptMap();
    }

});