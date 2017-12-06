'use strict'

angular.module('playerApp')
  .filter('noteListFilter', function () {
    return function (noteList, searchText) {
      if (searchText) {
        var lowerCaseQuery = angular.lowercase(searchText)
        return noteList.filter(function (list) {
          return angular.lowercase(list.title).includes(lowerCaseQuery) ||
                            angular.lowercase(list.note).includes(lowerCaseQuery)
        })
      }
      return noteList
    }
  })
