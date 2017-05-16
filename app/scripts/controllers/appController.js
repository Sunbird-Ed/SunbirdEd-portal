'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('AppCtrl', function($rootScope) {

        $rootScope.initilizwDropDown = function() {
            alert('init');
            $('#userDropdown')
                .dropdown({
                    action: 'combo'
                });
        };
       
    });
