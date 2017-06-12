'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:ContentCtrl
 * @description
 * # ContentCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('ContentCtrl', function(contentService, $scope, $timeout, $rootScope) {
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
        content.selectedLanguage = '';
        content.selectedContentType = '';
        content.selectedStatus = '';

        content.autosuggest_data = { content: [] };
        content.listView = false;
        //Object for content player directive
        $scope.contentPlayer = {
            isContentPlayerEnabled: false
        };
        $rootScope.showIFrameContent = false;
        $rootScope.searchKey = content.searchKey;
        console.log('$rootScope.searchKey', $rootScope.searchKey);
        content.searchContent = function($event) {
            content.enableLoader(true);
            var req = {
                'query': content.keyword,
                'filters': content.filters,
                'params': {
                    'cid': '12'
                }
            };
            //             if (content.searchKey === 'Courses') {
            // getCourseSearchResult()
            //             }

            content.handleSucessResponse = function(sucessResponse, $event) {
                if (sucessResponse.result.count > 0) {
                    //if $event is passed then search is to get only autosuggest else to get the content
                    if ($event !== undefined && content.keyword !== '') {
                        content.autosuggest_data = sucessResponse.result;
                    } else {
                        content.isError = false;
                        console.log('content.searchKey', content.searchKey);
                        $rootScope.searchResult = sucessResponse.result;
                        $rootScope.searchKeyword = content.keyword;
                        $rootScope.searchKey = content.searchKey;
                        // $scope.data = sucessResponse.result;
                        content.autosuggest_data = { content: [] };
                        // $scope.$apply();
                    }
                } else if ($event === undefined) {
                    content.isError = true;
                    sucessResponse.responseCode = 'RESOURCE_NOT_FOUND';
                    content.data = sucessResponse;
                }
            };

            contentService.search(req).then(function(res) {
                    content.enableLoader(false);

                    if (res != null && res.responseCode === 'OK') {
                        content.handleSucessResponse(res, $event);
                    } else {
                        content.isError = true;
                        content.data = res;
                    }
                }),
                function(error) {
                    content.data = error;
                };
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
        content.searchContent();

        $(document).on('ready', function() {
            $('.regular').slick({
                dots: true,
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 3
            });
        });
    });