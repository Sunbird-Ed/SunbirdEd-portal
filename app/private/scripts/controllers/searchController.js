'use strict';
angular.module('playerApp')
        .controller('SearchCtrl', function (config, sessionService, searchService, $scope, $timeout, $rootScope, $stateParams, $state, $location) {
            var search = this;
            search.initSearch = function () {
                $timeout(function(){
                $rootScope.$broadcast('initSearch', {});
                },500);
            };
           
        });