'use strict';

angular.module('loginApp')
    .controller('SignUpCtrl', function(signUpService, $timeout, $location) {
        var newUser = this;
        newUser.formValidation = function() {
            $('.ui.form').form({
                fields: {
                    userName: {
                        rules: [{
                            type: 'empty'
                        }]
                    },
                    password: {
                        rules: [{
                            type: 'empty',
                        }]
                    },
                    firstName: {
                        rules: [{
                            type: 'empty',
                        }]
                    },
                    phone: {
                        rules: [{
                            type: 'empty',
                        }]
                    },
                    email: {
                        rules: [{
                            type: 'empty',
                        }]
                    },
                    language: {
                        rules: [{
                            type: 'empty',
                        }]
                    }
                },
                onSuccess: function() {
                    return true;
                },
                onFailure: function() {
                    return false;
                }
            });
        };

        newUser.showModal = function() {
            newUser.firstName = '';
            newUser.lastName = '';
            newUser.password = '';
            newUser.email = '';
            newUser.userName = '';
            newUser.phone = '';
            newUser.gender = '';
            newUser.avatar = '';
            newUser.dob = '';
            newUser.aadhaarNo = '';
            newUser.language = '';
            $timeout(function() {
                $('.ui .modal').modal('show');
            });
            $timeout(function() {
                $('#dobCalendar').calendar({
                    type: 'date',
                    formatter: {
                        date: function(date, settings) {
                            if (!date) return '';
                            var day = date.getDate();
                            var month = date.getMonth() + 1;
                            var year = date.getFullYear();
                            var selectedDate = day + '/' + month + '/' + year;
                            newUser.dob = selectedDate;
                            return selectedDate;
                        }
                    }
                });
            }, 1500);
        };

        newUser.formInit = function() {
            $('.signupMultiple')
                .dropdown({
                    useLabels: false,
                });
            $timeout(function() {
                $('#dobCalendar').calendar({
                    type: 'date',
                    formatter: {
                        date: function(date, settings) {
                            if (!date) return '';
                            var day = date.getDate();
                            var month = date.getMonth() + 1;
                            var year = date.getFullYear();
                            var selectedDate = day + '/' + month + '/' + year;
                            newUser.dob = selectedDate;
                            return selectedDate;
                        }
                    }
                });
            }, 1500);
        };

        /**
         * This function called when api failed, and its show failed response for 2 sec.
         * @param {String} message
         */
        function showErrorMessage(isClose, message, messageType) {
            var error = {};
            error.showError = true;
            error.isClose = isClose;
            error.message = message;
            error.messageType = messageType;
            return error;
        }

        /**
         * This function helps to show loader with message.
         * @param {String} headerMessage
         * @param {String} loaderMessage
         */
        function showLoaderWithMessage(headerMessage, loaderMessage) {
            var loader = {};
            loader.showLoader = true;
            loader.headerMessage = headerMessage;
            loader.loaderMessage = loaderMessage;
            return loader;
        }
        newUser.submitForm = function() {
            newUser.formValidation();
            var isValid = $('.ui.form').form('validate form');
            console.log('isValidForm', isValid);
            if (isValid === true) { newUser.signUp(); } else return false;
        };
        newUser.signUp = function() {
            newUser.request = {
                'params': {},
                'request': {
                    'firstName': newUser.firstName,
                    'lastName': newUser.lastName,
                    'password': newUser.password,
                    'email': newUser.email,
                    'userName': newUser.userName,
                    'phone': newUser.phone,
                    'gender': newUser.gender,
                    'avatar': newUser.avatar,
                    'dob': newUser.dob,
                    'aadhaarNo': newUser.aadhaarNo,
                    'language': newUser.language

                }
            };
            newUser.loader = showLoaderWithMessage('', 'requesting sign up , please wait....');
            var req = newUser.request;
            $('.ui .modal').modal('show');

            signUpService.signUp(req).then(function(successResponse) {
                if (successResponse && successResponse.responseCode === 'OK') {
                    newUser.loader.showLoader = false;

                    $location.path('/private/index');
                    newUser.loader.showLoader = false;
                    newUser.error = showErrorMessage(true, 'Please login', 'success');
                    $timeout(function() {
                        $('.ui .modal').modal('hide');
                    }, 2000);
                } else {
                    newUser.loader.showLoader = false;
                    newUser.error = showErrorMessage(true, successResponse.params.err, 'error');
                }
            }).catch(function(error) {
                newUser.loader.showLoader = false;
                newUser.error = showErrorMessage(true, 'sign up failed ', 'error');
            });
        };
    });