'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:LogincontrollerCtrl
 * @description
 * # LogincontrollerCtrl
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('LoginCtrl', function() {
        var login = this;
        login.userName = '';
        login.password = '';
        login.signIn = function(userName, password) {

        };
        login.openLoginModal = function() {
            $('.ui.small.modal')
                .modal('show');
        };
    });
