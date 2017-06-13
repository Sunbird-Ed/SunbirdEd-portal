'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:ContentCtrl
 * @description
 * # ContentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ContentCtrl', function(contentService, courseService, $scope, $timeout, $rootScope, $state, $location) {
        var content = this;
        content.keyword = '';
        content.filters = {};
        content.searchKey = '';
        content.languages = [
            'Bengali', 'English', 'Gujarati', 'Hindi', 'Kannada', 'Marathi', 'Punjabi', 'Tamil', 'Telugu'
        ];
        content.contentTypes = [
            'Story', 'Worksheet', 'Collections', 'Game', 'Plugin', 'Template'
        ];
        content.statuses = [
            'Draft', 'Live', 'Review', 'Flagged', 'Flag Draft', 'Flag Review'
        ];
        content.searchSelectionKeys = [{ id: 'Course', name: 'Course' }, { id: 'Resources', name: 'Resources' }];
        content.selectedLanguage = '';
        content.selectedContentType = '';
        content.selectedStatus = '';
        $scope.$on('$locationChangeSuccess', function() {
            $scope.currentPath = $location.path();
        });
        $scope.currentPath = $location.path();
        if ($scope.currentPath === '/learn') {
            content.searchKey = 'Course';
        } else if ($scope.currentPath === '/resources') {
            content.searchKey = 'Resources';
        }

        content.autosuggest_data = { content: [] };
        content.listView = false;

        $scope.contentPlayer = {
            isContentPlayerEnabled: false
        };
        $rootScope.showIFrameContent = false;

        content.searchContent = function($event) {
            content.enableLoader(true);

            var req = {
                'query': content.keyword,
                'filters': content.filters,
                'params': {
                    'cid': '12'
                }
            };

            content.handleSucessResponse = function(sucessResponse, $event) {
                if (sucessResponse.result.count > 0) {
                    //if $event is passed then search is to get only autosuggest else to get the content
                    if ($event !== undefined && content.keyword !== '') {
                        content.autosuggest_data = content.searchKey === 'Course' ?
                            sucessResponse.result.course :
                            sucessResponse.result.content;
                    } else {
                        content.isError = false;
                        if (content.searchKey === 'Course') {
                            $rootScope.searchResult = sucessResponse.result.course;
                        } else if (content.searchKey === 'Resources') {
                            $rootScope.searchResult = sucessResponse.result.content;
                        }
                        console.log('$rootScope.searchResult ', $rootScope.searchResult);

                        $rootScope.searchKeyword = content.keyword;
                        $rootScope.searchKey = content.searchKey;
                        content.autosuggest_data = [];
                        // content.autosuggest_data = { content: [] };
                    }
                } else if ($event === undefined) {
                    content.isError = true;
                    sucessResponse.responseCode = 'RESOURCE_NOT_FOUND';
                    content.data = sucessResponse;
                }
            };

            if (content.searchKey === 'Resources') {
                contentService.search(req).then(function(res) {
                    content.enableLoader(false);

                    if (res != null && res.responseCode === 'OK') {
                        content.handleSucessResponse(res, $event);
                    } else {
                        content.isError = true;
                        content.data = res;
                    }
                }).catch(function(error) {
                    content.data = error;
                });
            } else if (content.searchKey === 'Course') {
                courseService.search(req).then(function(res) {
                    content.enableLoader(false);
                    if (res != null && res.responseCode === 'OK') {
                        content.handleSucessResponse(res, $event);
                    } else {
                        content.isError = true;
                        content.data = res;
                    }
                }).catch(function(error) {
                    content.data = error;
                });
            }
        };

        content.applyFilter = function() {
            if (content.selectedLanguage) {
                content.filters['language'] = content.selectedLanguage;
            }
            if (content.selectedContentType) {
                content.filters['contentType'] = content.selectedContentType;
            }
            if (content.selectedStatus) {
                content.filters['status'] = content.selectedStatus;
            }
            content.searchContent();
        };
        content.resetFilter = function() {
            content.filters = {};
            content.searchContent();

            $('.dropdown').dropdown('clear');
        };
        //to show/hide in-search loading bar
        content.enableLoader = function(isEnabled) {
            if (isEnabled) {
                $('#search-input-container').addClass('loading');
                content.autosuggest_data = { content: [] };
            } else {
                $('#search-input-container').removeClass('loading');
            }
        };
        //toggle between grid and listview
        content.toggleView = function(isList) {
            content.listView = isList;
        };
        // to apply star rating and more.. popup once content is ready
        content.loadRating = function() {
            $('.ui.rating')
                .rating({
                    maxRating: 5
                }).rating('disable', true);
            $('.popup-button').popup();
        };
        //if any item is selected from autosuggest search then set that as keyword
        content.setSearchText = function(text) {
            content.keyword = text;
            content.searchContent();
        };

        $(document).on('ready', function() {
            $('.regular').slick({
                dots: true,
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 3
            });
        });
    });