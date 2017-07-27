'use strict';

angular.module('playerApp')
        .service('routeHelperService', function ($rootScope, $stateParams, $timeout) {
            this.loadRouteConfig = function (stateName) {
                var searchEnabledStates = ['Home', 'Courses', 'Resources', 'CourseNote', 'ContentNote', 'CourseContentNote', 'Toc', 'Player', 'Search', 'TocPlayer', 'PreviewCollection'];
                var filterEnabledStates = ['Home', 'Courses', 'Resources','Search'];
                var searchKey = {Home: 'All', Courses: 'Courses', Resources: 'Resources', CourseNote: 'Courses', ContentNote: 'Resources', CourseContentNote: 'Courses', Toc: 'Courses', Player: 'Resources', Search: $stateParams.type, TocPlayer: 'Courses', PreviewCollection: 'Resources'};
                if (searchEnabledStates.indexOf(stateName) >= 0) {
                    $rootScope.isSearchPage = true;
                    $rootScope.searchKey = searchKey[stateName];
                } else {
                    $rootScope.isSearchPage = false;
                }
                if (filterEnabledStates.indexOf(stateName) >= 0) {
                    $rootScope.showFilter = true;
                } else {
                    $rootScope.showFilter = false;
                }
                this.clearSearchSettings();
            };
            this.clearSearchSettings = function () {
                if ($rootScope.search) {
                    $rootScope.search.selectedLanguage = [];
                    $rootScope.search.selectedContentType = [];
                    $rootScope.search.selectedSubject = [];
                    $rootScope.search.selectedBoard = [];
                    $rootScope.search.filters = {};
                    $rootScope.search.sortBy = {};
                    $rootScope.search.sortByOption = '';
                    $timeout(function () {
                        $('#multi-select-sort').dropdown('clear');
                        $('#content-search-filter-accordion').accordion('close', 0);
                    }, 0);
                }
            };
        });
