'use strict'

angular.module('playerApp')
    .controller('SearchCtrl', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
      var search = this
      search.initSearch = function () {
        if ($rootScope.search) {
          $rootScope.search.searchResult = {}
          $rootScope.search.autosuggest_data = []
        }
        $timeout(function () {
          $rootScope.$broadcast('initSearch', {})
        }, 500)
      }
    }])
