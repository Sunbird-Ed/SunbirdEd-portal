'use strict';

/**
 * @ngdoc filter
 * @name studioApp.filter:dateFilter
 * @function
 * @description
 * # dateFilter
 * Filter in the studioApp.
 */
angular.module('playerApp')
        .filter('noteListFilter', function () {
            return function (noteList, searchText) {
                if (searchText) {
                    var lowerCaseQuery = angular.lowercase(searchText);
                    return noteList.filter(function (list) {
                        return list.title.includes(lowerCaseQuery) || list.note.includes(lowerCaseQuery);
                    });
                } else {
                    return noteList;
                }

            };
        });
