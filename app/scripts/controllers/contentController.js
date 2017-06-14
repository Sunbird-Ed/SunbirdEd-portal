'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:ContentCtrl
 * @description
 * # ContentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ContentCtrl', function(contentService, courseService, $scope, $timeout, $rootScope, $stateParams) {
        var content = this;
        content.keyword = '';
        content.filters = { 'status': ['Live'], 'contentType': ['Story', 'Worksheet', 'Game', 'Collection', 'TextBook'] };
        $scope.selectedSearchKey = $stateParams.searchKey;
        $timeout(function() {
            $('#headerSearchdd').dropdown('set selected', $scope.selectedSearchKey);
        });
        $scope.$watch('searchKey', function() {
            $scope.selectedSearchKey = $rootScope.searchKey;
        });
        $scope.contentPlayer = {
            isContentPlayerEnabled: false
        };
        $scope.close = function() {
            $rootScope.searchResult = [];
        };

        console.log('$scope.selectedSearchKey', $scope.selectedSearchKey);

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
        content.autosuggest_data = { content: [] };
        content.listView = false;

        $scope.contentPlayer = {
            isContentPlayerEnabled: false
        };
        $rootScope.showIFrameContent = false;
        $rootScope.content = content;

        content.searchContent = function($event) {
            content.enableLoader(true);

            var req = {
                'query': content.keyword,
                'filters': content.filters,
                'params': {
                    'cid': '12'
                }
            };
            req.limit = 20;

            content.handleSucessResponse = function(sucessResponse, $event) {
                console.log('$scope.selectedSearchKey124215', $scope.selectedSearchKey);
                if (sucessResponse.result.count > 0) {
                    //if $event is passed then search is to get only autosuggest else to get the content
                    if ($event !== undefined && content.keyword !== '') {
                        content.autosuggest_data = $scope.selectedSearchKey === 'Course' ?
                            sucessResponse.result.course :
                            sucessResponse.result.content;
                    } else {
                        content.isError = false;
                        if ($scope.selectedSearchKey === 'Course') {
                            $rootScope.searchResult = sucessResponse.result.course;
                        } else if ($scope.selectedSearchKey === 'Resources') {
                            $rootScope.searchResult = sucessResponse.result.content;
                        }
                        $rootScope.searchKeyword = content.keyword;
                        content.keyword = '';
                        $rootScope.searchKey = $scope.selectedSearchKey;
                        content.autosuggest_data = [];
                        // content.autosuggest_data = { content: [] };
                    }
                } else if ($event === undefined) {
                    content.isError = true;
                    sucessResponse.responseCode = 'RESOURCE_NOT_FOUND';
                    content.data = sucessResponse;
                }
            };

            if ($scope.selectedSearchKey === 'Resources') {
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
            } else if ($scope.selectedSearchKey === 'Course') {
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