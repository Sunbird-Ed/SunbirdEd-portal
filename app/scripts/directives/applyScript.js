'use strict';

/**
 * @ngdoc directive
 * @name playerApp.directive:applyScript
 * @description
 * # applyScript
 */
angular.module('playerApp')
        .directive('applyScript', function () {
            return {
                restrict: 'A',
                link: function (scope, element) {                   
                    $('#content-search-filter-accordion').accordion();
                    $('.dropdown.content-search-filter').dropdown({
                        useLabels: false,
                        forceSelection: false,
                        label: {
                            duration: 0,
                        },
                        debug: false,
                        performance: true,
                    });

                }
            };
        });