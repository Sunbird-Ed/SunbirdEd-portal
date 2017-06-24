'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
        .controller('SearchCtrl', function (sessionService, searchService, $scope, $timeout, $rootScope, $stateParams, $state, $location) {
            var search = this;
            search.keyword = '';
            search.filters = {};
            search.sortBy = {};
            $scope.selectedSearchKey = $stateParams.searchKey;
            $timeout(function () {
                $('#headerSearchdd').dropdown('set selected', $scope.selectedSearchKey);
            });
            search.playContent = function (item) {
                var params = {content: item};
                $state.go('Player', params);
            }

            $scope.$watch('searchKey', function () {
                $scope.selectedSearchKey = $rootScope.searchKey;
                search.keyword = '';
                search.filters = {};
            });
            search.contentPlayer = {
                isContentPlayerEnabled: false
            }
            
            function handleFailedResponse(errorResponse) {
                var isSearchError = {};
                isSearchError.isError = true;
                isSearchError.message = '';
                isSearchError.responseCode = errorResponse.responseCode;
                $rootScope.isSearchError = isSearchError;
                // $scope.$apply();
                $timeout(function () {
                    $rootScope.isSearchError = {};
                    isSearchError.isError = false;
                }, 2000);
            }
            search.handleContentSearch = function (contents, $event) {
                console.log('contents', contents);
                if (contents.result.count > 0) {
                    //if $event is passed then search is to get only autosuggest else to get the content
                    if ($event !== undefined && search.keyword !== '') {
                        search.autosuggest_data =
                                contents.result.content;
                    } else {
                        $rootScope.searchKey = $scope.selectedSearchKey;
                        search.autosuggest_data = [];
                        $rootScope.searchResult = contents.result.content;
                    }
                    console.log('$rootScope.searchResult', $rootScope.searchResult);
                } else {
                    $rootScope.searchResult = [];

                    contents.responseCode = 'RESOURCE_NOT_FOUND';
                    handleFailedResponse(contents);
                }
            };
            search.handleCourseSearch = function (courses, $event) {
                console.log('inside success handler', courses.result.response.length);
                if (courses.result.response.length) {
                    console.log('successResponse.result.response', courses.result.response);
                    //if $event is passed then search is to get only autosuggest else to get the content
                    if ($event !== undefined && search.keyword !== '') {
                        search.autosuggest_data = courses.result.response;
                    } else {
                        $rootScope.searchKey = $scope.selectedSearchKey;
                        search.autosuggest_data = [];
                        $rootScope.searchResult = courses.result.response;
                    }
                } else {
                    $rootScope.searchResult = [];

                    courses.responseCode = 'RESOURCE_NOT_FOUND';
                    handleFailedResponse(courses);
                }
            };

            search.searchContent = function ($event) {
                search.enableLoader(true);
                var req = {
                    'query': search.keyword,
                    'filters': search.filters,
                    'params': {
                        'cid': '12'
                    },
                    'limit': 20,
                    'sort_by': search.sortBy
                };
                // req.limit = 20;
                console.log('req in search', req);
                console.log('$scope.selectedSearchKey', $scope.selectedSearchKey);
                $rootScope.searchKeyword = search.keyword;
                $rootScope.searchFilters = search.filters;
                if ($scope.selectedSearchKey === 'Resources') {
                    searchService.contentSearch(req).then(function (res) {
                        search.enableLoader(false);
                        if (res != null && res.responseCode === 'OK') {
                            search.handleContentSearch(res, $event);
                        } else {
                            handleFailedResponse(res);
                        }
                    }).catch(function (error) {
                        handleFailedResponse(error);
                    });
                } else if ($scope.selectedSearchKey === 'Courses') {
                    searchService.courseSearch(req).then(function (res) {
                        search.enableLoader(false);
                        if (res != null && res.responseCode === 'OK') {
                            search.handleCourseSearch(res, $event);
                        } else {
                            handleFailedResponse(res);
                        }
                    }).catch(function (error) {
                        handleFailedResponse(error);
                    });
                }
            };

            search.applyFilter = function () {
                if (search.selectedLanguage) {
                    search.filters['language'] = search.selectedLanguage;
                }
                if (search.selectedContentType) {
                    search.filters['contentType'] = search.selectedContentType;
                }
                if (search.selectedSubject) {
                    search.filters['subject'] = search.selectedSubject;
                }
                if (search.selectedBoard) {
                    search.filters['board'] = search.selectedBoard;
                }

                search.keyword = $rootScope.searchKeyword;
                search.searchContent();
            };

            search.applySorting = function () {
                search.keyword = $rootScope.searchKeyword ? $rootScope.searchKeyword : '';
                search.filters = $rootScope.searchFilters ? $rootScope.searchFilters : {};
                var sortByField = search.sortByOption.field;

                search.sortBy[sortByField] = (search.sortIcon === true) ? 'asc' : 'desc';
                search.searchContent();
            };
            search.resetFilter = function () {
                $('.content-search-filter').dropdown('clear');
                search.filters = {};
                search.selectedLanguage = '';
                search.selectedContentType = '';
                search.selectedSubject = '';
                search.selectedBoard = '';
                search.keyword = $rootScope.searchKeyword;
                search.searchContent();
            };
            //to show/hide in-search loading bar
            search.enableLoader = function (isEnabled) {
                if (isEnabled) {
                    $('#search-input-container').addClass('loading');
                    search.autosuggest_data = [];
                } else {
                    $('#search-input-container').removeClass('loading');
                }
            };
            // to apply star rating and more.. popup once content is ready
            search.loadRating = function () {
                $('.ui.rating')
                        .rating({
                            maxRating: 5
                        }).rating('disable', true);
                $('.popup-button').popup();
            };
            //if any item is selected from autosuggest search then set that as keyword
            search.setSearchText = function (text) {
                search.keyword = text;
                search.searchContent();
            };
            $('.search-dropdown').dropdown();

            search.ngInit = function () {

                search.keyword = $('#keyword').val();
                search.searchContent();

            }

        });
