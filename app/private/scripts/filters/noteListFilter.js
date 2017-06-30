'use strict';

/**
 * @ngdoc filter
 * @name playerApp.filter:noteListFilter
 * @function
 * @description
 * # noteListFilter
 * Filter in the playerApp.
 */
angular.module('playerApp')
    .filter('noteListFilter', function() {
        return function(noteList, searchText) {
            if (searchText) {
                var lowerCaseQuery = angular.lowercase(searchText);
                return noteList.filter(function(list) {
                    return list.title.includes(lowerCaseQuery) || list.note.includes(lowerCaseQuery);
                });
            } else {
                return noteList;
            }

        };
    });
