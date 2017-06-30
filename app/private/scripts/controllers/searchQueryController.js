'use strict';

angular.module('playerApp')
    .controller('SearchQueryCtrl', function(config, sessionService, searchService, $scope, $timeout, $rootScope, $stateParams, $state, $location) {
        var searchQuery = this;
        searchQuery.keyword = '';
        searchQuery.filters = {};
        searchQuery.sortBy = {};
        searchQuery.languages = config.FILTER.RESOURCES.languages;
        searchQuery.contentTypes = config.FILTER.RESOURCES.contentTypes;
        searchQuery.subjects = config.FILTER.RESOURCES.subjects;
        searchQuery.boards = config.FILTER.RESOURCES.boards;
        searchQuery.searchTypeKeys = ['Courses', 'Resources'];
        $scope.$watch('$root.searchKey', function() {
            searchQuery.selectedSearchKey = $rootScope.searchKey;
            console.log('searchQuery.selectedSearchKey ', searchQuery.selectedSearchKey);
            searchQuery.isSearchTypeKey = searchQuery.searchTypeKeys.includes(searchQuery.selectedSearchKey);
            console.log(' searchQuery.jdhsakdjbhkdl;asdghjdskl;fjfdls;fkjg', searchQuery.isSearchTypeKey);
            $('#headerSearch').dropdown('set selected', searchQuery.isSearchTypeKey ? searchQuery.selectedSearchKey : 'All');
        });

        searchQuery.searchSelectionKeys = [{ id: 'Courses', name: 'Courses' }, { id: 'Resources', name: 'Resources' }, { id: 'All', name: 'All' }];

        searchQuery.currentStateInit = function() {
            searchQuery.currentState = $state.current.name;
            searchQuery.currentLocationParams = $location.path();
            searchQuery.currentResourceLocation = searchQuery.currentLocationParams.includes('resource/');
            searchQuery.currentCourseLocation = searchQuery.currentLocationParams.includes('course/');
        };

        searchQuery.setSearchText = function(text) {
            searchQuery.keyword = text;
            searchQuery.searchRequest();
        };
        searchQuery.resourceSearch = function($event) {
            if ($event && searchQuery.keyword.length) {
                var req = searchQuery.req();
                searchService.contentSearch(req).then(function(res) {
                    if (res != null && res.responseCode === 'OK') {
                        searchQuery.autosuggest_data =
                            res.result.content;
                    }
                });
            } else {
                searchQuery.autosuggest_data = [];
                var searchReq = searchQuery.req();
                var params = { query: JSON.stringify(searchReq), searchType: 'resource' };
                $state.go('SearchResource', params);
            }
        };
        searchQuery.courseSearch = function($event) {
            if ($event && searchQuery.keyword.length) {
                var autoSuggestReq = searchQuery.req();
                searchService.courseSearch(autoSuggestReq).then(function(autoSuggest) {
                    if (autoSuggest != null && autoSuggest.responseCode === 'OK') {
                        searchQuery.autosuggest_data =
                            searchQuery.autosuggest_data = autoSuggest.result.response;
                    }
                });
            } else {
                searchQuery.autosuggest_data = [];
                var searchReq = searchQuery.req();
                var params = { query: JSON.stringify(searchReq), searchType: 'course' };
                $state.go('SearchCourse', params);
            }
        };
        searchQuery.req = function() {
            return {
                'query': searchQuery.keyword,
                'filters': searchQuery.filters,
                'params': {
                    'cid': '12'
                },
                'limit': 20,
                'sort_by': searchQuery.sortBy
            };
        };
        searchQuery.searchRequest = function($event) {
            searchQuery.currentStateInit();
            if (searchQuery.selectedSearchKey === 'Resources' || searchQuery.currentResourceLocation) {
                console.log('inside course');
                searchQuery.resourceSearch($event);
            } else if (searchQuery.selectedSearchKey === 'Courses' || searchQuery.currentCourseLocation) {
                searchQuery.courseSearch($event);
            }
            searchQuery.currentStateInit();
            console.log('searchQuery.searchKey', searchQuery.searchTypeKey, 'searchQuery.selectedSearchKey', searchQuery.selectedSearchKey);
            console.log('$event', $event, ' searchQuery.searchKey ', searchQuery.searchTypeKey);
        };

        searchQuery.applyFilter = function() {
            searchQuery.currentStateInit();
            searchQuery.filters['language'] = searchQuery.selectedLanguage ? searchQuery.selectedLanguage : [];
            searchQuery.filters['contentType'] = searchQuery.selectedContentType ? searchQuery.selectedContentType : [];
            searchQuery.filters['subject'] = searchQuery.selectedSubject ? searchQuery.selectedSubject : [];
            searchQuery.filters['board'] = searchQuery.selectedBoard ? searchQuery.selectedBoard : [];
            var query = $stateParams.query ? JSON.parse($stateParams.query) : '';
            searchQuery.keyword = query ? query.query : '';
            searchQuery.searchRequest();
        };
        searchQuery.resetFilter = function() {
            $('.content-search-filter').dropdown('clear');
            searchQuery.filters = {};
            var query = $stateParams.query ? JSON.parse($stateParams.query) : '';
            searchQuery.keyword = query ? query.query : '';
            searchQuery.searchRequest();
        };
    });