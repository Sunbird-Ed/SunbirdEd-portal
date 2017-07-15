'use strict';
angular.module('playerApp')
    .controller('SearchCtrl', function(config, sessionService, searchService, $scope, $timeout, $rootScope, $stateParams, $state, $location) {
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