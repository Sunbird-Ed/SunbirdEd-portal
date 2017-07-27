'use strict';

angular.module('playerApp')
    .controller('SearchCtrl', function (config, sessionService, searchService,
        $scope, $timeout, $rootScope) {
        var search = this;
        search.initSearch = function () {
            if ($rootScope.search) {
                $rootScope.search.searchResult = {};
                $rootScope.search.autosuggest_data = [];
            }
            $timeout(function () {
                $rootScope.$broadcast('initSearch', {});
            }, 500);
        };
    });
