'use strict';

angular.module('playerApp')
    .controller('SearchResourcesCtrl', function(sessionService, searchService, $scope, $timeout, $rootScope, $stateParams, $state, $location) {
        var search = this;
        search.searchResult = [];
        search.initSearch = function() {
            search.searchRequest = JSON.parse($stateParams.query);
            search.searchType = $stateParams.searchType;
            search.searchQuery = search.searchRequest.query;
            console.log('search req', search.searchQuery);
        };

        // play resource
        search.playContent = function(item) {
            var params = { content: item };
            $state.go('Player', params);
        };
        // resourceSearch
        search.handleContentSearch = function(contents) {
            if (contents.result.count > 0) {
                search.searchResult = contents.result.content;

                $rootScope.searchKey = $scope.selectedSearchKey;

                search.searchResult = contents.result.content;
                // console.log('search.searchResult ', search.searchResult);
            } else {
                search.responseCode = 'RESOURCE_NOT_FOUND';
            }
        };
        // corseSearch

        // mainSearch
        search.search = function() {
            search.initSearch();
            var req = search.searchRequest;

            searchService.contentSearch(req).then(function(res) {
                if (res != null && res.responseCode === 'OK') {
                    search.handleContentSearch(res);
                } else {}
            }).catch(function(error) {});
        };
        search.search();
    });