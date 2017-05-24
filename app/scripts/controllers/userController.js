'use strict';

angular.module('playerApp')
    .controller('UserCtrl', function(userService, $log, moment) {
        var user = this;
        user.userName = '';
        user.password = '';
        user.signIn = function(userName, password) {

        };
        user.openLoginModal = function() {
            $('.ui.small.modal')
                .modal('show');
        };
        console.log('moment', moment());
        user.openSignUpModal = function() {
            $('.ui .signUp.modal')
                .modal('show');
            $('.signUpForm').form({
                firstName: {
                    identifier: 'firstName',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter your first name'
                    }]
                },
                email: {
                    identifier: 'Email',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter your email'
                    }, {
                        type: 'email',
                        prompt: 'Please enter a valid email'
                    }]
                },
                password: {
                    identifier: 'Password',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter a password'
                    }, {
                        type: 'length[6]',
                        prompt: 'Password needs to be atleast 6 characters long'
                    }]
                },
            }, {
                on: 'blur',
                inline: 'true'
            });
        };
        user.register = function() {
            user.firstName = '';
            var newUser = {

                'id ': 'web-portal',
                'ts ': '2013 / 10 / 15 16: 16: 39 ',
                'params ': {
                    'did ': 'device UUID from which API is called ',
                    ' key ': ' API key(dynamic)',
                    'cid ': 'consumer id '
                },
                'request ': {
                    ' email ': 'user email id test @test.com ',
                    'firstName ': 'firstName of the user ',
                    'lastName ': 'user last name optional ',
                    'phone ': 'user phone number optional ',
                    'password ': 'password ',
                    'gender ': 'user gender optional ',
                    'language ': 'user preferred language ',
                    'state ': 'state name optional ',
                    'city ': 'city name optional ',
                    'zipCode ': 'zip code value optional '
                }
            };
            userService.register(newUser).then(function(successResponse) {

                }),
                function(error) {
                    $log.console(error);
                };
        };
    });