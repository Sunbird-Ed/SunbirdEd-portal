'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('AppCtrl', function() {
        $('body').click(function(e) {
            if ($(e.target).closest('div.dropdown-menu-list').prop('id') == 'search-suggestions') {
                return false;
            } else {
                $('body').find('.dropdown-menu-list').removeClass('visible').addClass('hidden');
            }
        });

        // $scope.initilizwDropDown = function() {
        //     $('#dropdown-menu-list')
        //         .dropdown({
        //             action: 'combo'
        //         });
        // };
        // $('.small.modal')
        //     .modal('show')
        // ;
    });