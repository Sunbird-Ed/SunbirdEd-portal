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
        searchQuery.sortingOptions = [{ field: 'lastUpdatedOn', name: 'Updated On' }, { field: 'createdOn', name: 'Created On' }];
        searchQuery.searchSelectionKeys = [{ id: 'Courses', name: 'Courses' }, { id: 'Resources', name: 'Resources' }, { id: 'All', name: 'All' }];
        searchQuery.sortIcon = true;
        var timoutPromise = null;

        // search select dropdown changes
        $scope.$watch('$root.searchKey', function() {
            searchQuery.keyword = '';
            searchQuery.selectedSearchKey = $rootScope.searchKey;
            searchQuery.isSearchTypeKey = searchQuery.searchTypeKeys.includes(searchQuery.selectedSearchKey);
            $('#headerSearch').dropdown('set selected', searchQuery.isSearchTypeKey === true ? searchQuery.selectedSearchKey : 'All');
            $('.content-search-filter').dropdown('clear');
            searchQuery.currentLocationParams = $location.path();
            searchQuery.currentResourceLocation = searchQuery.currentLocationParams.includes('/resources');
            searchQuery.currentCourseLocation = searchQuery.currentLocationParams.includes('/courses');
        });

        searchQuery.selectedSearchKey = $rootScope.searchKey;
        searchQuery.isSearchTypeKey = searchQuery.searchTypeKeys.includes(searchQuery.selectedSearchKey);
        $timeout(function() {
            $('#headerSearch').dropdown('set selected', searchQuery.isSearchTypeKey === true ? searchQuery.selectedSearchKey : 'All');
        });
        searchQuery.currentStateInit = function() {
            searchQuery.currentState = $state.current.name;
            searchQuery.currentLocationParams = $location.path();
            searchQuery.currentResourceLocation = searchQuery.currentLocationParams.includes('/resources');
            searchQuery.currentCourseLocation = searchQuery.currentLocationParams.includes('/courses');
        };

        searchQuery.checkTyping = function() {
            if (timoutPromise) {
                $timeout.cancel(timoutPromise);
            }
        };

        searchQuery.stoppedTyping = function() {
            timoutPromise = $timeout(function() {
                $scope.searchRequest = $stateParams.query ? JSON.parse($stateParams.query).query : null;
                if ($scope.searchRequest !== searchQuery.keyword) {
                    searchQuery.searchRequest('$event');
                }
            }, 2000);
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

        searchQuery.setSearchText = function(text) {
            searchQuery.keyword = text;
            searchQuery.searchRequest();
        };
        searchQuery.resourceSearch = function($event) {
            if ($event && searchQuery.keyword.length) {
                var req = searchQuery.req();

                console.error('i am a error reqreqreqreqreqreqreqreqreqreqreqreqreq', req);
                searchService.contentSearch(req).then(function(res) {
                    if (res != null && res.responseCode === 'OK') {
                        searchQuery.autosuggest_data =
                            res.result.content;
                    }
                });
            } else if (searchQuery.keyword.length) {
                searchQuery.autosuggest_data = [];
                var searchReq = searchQuery.req();
                var params = { query: JSON.stringify(searchReq), searchType: 'resources' };
                $state.go('SearchResource', params);
                searchQuery.keyword = '';
            }
        };
        searchQuery.courseSearch = function($event) {
            var courseReq = searchQuery.req();
            if ($event && searchQuery.keyword.length) {
                var autoSuggestReq = { 'request': courseReq };
                searchService.courseSearch(autoSuggestReq).then(function(autoSuggest) {
                    if (autoSuggest != null && autoSuggest.responseCode === 'OK') {
                        searchQuery.autosuggest_data =
                            searchQuery.autosuggest_data = autoSuggest.result.response;
                    }
                });
            } else if (searchQuery.keyword.length) {
                searchQuery.autosuggest_data = [];
                var searchReq = searchQuery.req();
                var params = { query: JSON.stringify(searchReq), searchType: 'courses' };

                $state.go('SearchCourse', params);
                searchQuery.keyword = '';
            }
        };

        searchQuery.searchRequest = function($event) {
            searchQuery.currentStateInit();
            if (searchQuery.selectedSearchKey === 'Resources' || searchQuery.currentResourceLocation) {
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
        searchQuery.applySorting = function() {
            var query = $stateParams.query ? JSON.parse($stateParams.query) : '';
            searchQuery.keyword = query ? query.query : '';
            searchQuery.filters = query ? query.filters : {};

            var sortByField = searchQuery.sortByOption.field;

            searchQuery.sortBy[sortByField] = (searchQuery.sortIcon === true) ? 'asc' : 'desc';
            console.log('sort option', searchQuery.sortBy[sortByField]);
            searchQuery.searchRequest();
        };
    });