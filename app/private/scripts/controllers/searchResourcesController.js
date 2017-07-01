'use strict';

angular.module('playerApp')
    .controller('SearchResourcesCtrl', function(config, sessionService, searchService, $scope, $timeout, $rootScope, $stateParams, $state, $location) {
        var search = this;
        search.searchResult = [];
        search.initSearch = function() {
            search.searchRequest = JSON.parse($stateParams.query);
            search.searchType = $stateParams.searchType;
            search.searchQuery = search.searchRequest.query;
            console.log('search req', search.searchQuery);
        };
        /**
         * This function called when api failed, and its show failed response for 2 sec.
         * @param {String} message
         */
        function showErrorMessage(isClose, message, messageType) {
            var error = {};
            error.showError = true;
            error.isClose = isClose;
            error.message = message;
            error.messageType = messageType;
            return error;
        }

        /**
         * This function helps to show loader with message.
         * @param {String} headerMessage
         * @param {String} loaderMessage
         */
        function showLoaderWithMessage(headerMessage, loaderMessage) {
            var loader = {};
            loader.showLoader = true;
            loader.headerMessage = headerMessage;
            loader.loaderMessage = loaderMessage;
            return loader;
        }

        // play resource
        search.playContent = function(item) {
            var params = { content: item };
            $state.go('Player', params);
        };
        // resourceSearch
        search.handleContentSearch = function(contents) {
            if (contents.result.count > 0) {
                search.searchResult = contents.result.content;
                console.log('search.searchResult', search.searchResult);
            } else {
                search.error = showErrorMessage(true, config.MESSAGES.SEARCH.RESOURCE.NO_RESULT, config.MESSAGES.COMMON.INFO);
            }
        };
        // corseSearch

        // mainSearch
        search.search = function() {
            search.initSearch();
            var req = search.searchRequest;
            search.loader = showLoaderWithMessage('', config.MESSAGES.SEARCH.RESOURCE.START);
            searchService.contentSearch(req).then(function(res) {
                search.loader.showLoader = false;
                if (res != null && res.responseCode === 'OK') {
                    search.handleContentSearch(res);
                } else search.loader.showLoader = false;
            }).catch(function() {
                search.loader.showLoader = false;
                search.error = showErrorMessage(true, config.MESSAGES.SEARCH.RESOURCE.FAILED, config.MESSAGES.COMMON.ERROR);
            });
        };
        // /close
        search.close = function() {
            $state.go('Resources');
        };
        search.search();
    });