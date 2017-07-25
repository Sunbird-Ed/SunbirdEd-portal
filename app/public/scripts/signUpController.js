'use strict';

angular.module('loginApp')
    .controller('SignUpCtrl',
        function(signUpService, $timeout, $filter, $location, labels,
            $rootScope, errorMessages) {
            var newUser = this;
            var today = new Date();
            newUser.languages = labels.languages;
            newUser.formValidation = function() {
                $('.ui.form').form({
                    fields: {
                        userName: {
                            rules: [{
                                type: 'regExp[^[-\\w\.\\$@\*\\!]{5,256}$]',
                                prompt: errorMessages.FORM_VALIDATION.userName
                            }]
                        },
                        password: {
                            rules: [{
                                type: 'empty',
                                prompt: errorMessages.FORM_VALIDATION.password
                            }]
                        },
                        firstName: {
                            rules: [{
                                type: 'regExp[^[a-zA-Z -]+$]',
                                prompt: errorMessages.FORM_VALIDATION.name
                            }]
                        },
                        phone: {
                            rules: [{
                                type: 'regExp[^(?:(?:\\+|0{0,2})91(\\s*[\\-]\\s*)?|[0]?)?[789]\\d{9}$]',
                                prompt: errorMessages.FORM_VALIDATION.phone
                            }]
                        },
                        email: {
                            rules: [{
                                type: 'email',
                                prompt: errorMessages.FORM_VALIDATION.email
                            }]
                        },
                        language: {
                            rules: [{
                                type: 'empty',
                                prompt: errorMessages.FORM_VALIDATION.language
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
                newUser.language = [];

                $timeout(function() {
                    //Resets form input fields from data values
                    $('.ui.form').trigger('reset');
                    //Resets form error messages and field styles
                    $('.ui.form .field.error')
                        .removeClass(errorMessages.COMMON.ERROR);
                    $('.ui.form.error').removeClass(errorMessages.COMMON.ERROR);
                    $('.dropdown').dropdown('clear');
                    $('ui.fluid.dropdown.signupMultiple')
                        .dropdown({ placeholder: 'Languages' });
                    $('.ui .modal').modal('show');
                    $('#signupModal').modal({
                        closable: false
                    });
                });

                $timeout(function() {
                    $('#dobCalendar').calendar({
                        type: 'date',
                        maxDate: today,
                        formatter: {
                            date: function(date) {
                                if (!date) return '';
                                var day = date.getDate();
                                var month = date.getMonth() + 1;
                                var year = date.getFullYear();
                                var selectedDate =
                                    day + '/' + month + '/' + year;
                                return selectedDate;
                            }
                        }
                    });
                }, 1500);
            };

            newUser.formInit = function() {
                $timeout(function() {
                    $('.signupMultiple')
                        .dropdown();
                    $('#dobCalendar').calendar({
                        type: 'date',
                        maxDate: today,
                        formatter: {
                            date: function(date) {
                                if (!date) return '';
                                var day = date.getDate();
                                var month = date.getMonth() + 1;
                                var year = date.getFullYear();
                                var selectedDate =
                                    day + '/' + month + '/' + year;
                                return selectedDate;
                            }
                        }
                    });
                }, 1500);
            };

            /**
             * This function called when api failed, 
             * and its show failed response for 2 sec.
             * @param {String} message
             */
            function showErrorMessage(isClose, message, messageType) {
                var error = {};
                error.showError = true;
                error.isClose = isClose;
                error.message = message;
                error.messageType = messageType;
                $timeout(function() { error.showError = false; }, 4000);
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
                var dob = $('#dobCalendar').calendar('get date');
                newUser.dob = $filter('date')(dob, 'yyyy-MM-dd');
                newUser.formValidation();
                var isValid = $('.ui.form').form('validate form');
                if (isValid === true) { newUser.signUp(); } else {
                    $('.ui .modal').modal('refresh');
                    return false;
                }
            };
            newUser.getErrorMsg = function(errorKey) {
                var errorMessage = '';
                if (errorKey === 'USER_ALREADY_EXIST') {
                    errorMessage = errorMessages.SIGNUP.userExist;
                } else if (errorKey === 'USERNAME_EMAIL_IN_USE') {
                    errorMessage = errorMessages.SIGNUP.emailExist;
                } else errorMessage = errorMessages.SIGNUP.apiError;
                return errorMessage;
            };
            newUser.signUp = function() {
                newUser.request = {
                    'params': {},
                    'request': {
                        'firstName': newUser.firstName,
                        'lastName': newUser.lastName,
                        'password': newUser.password,
                        'email': newUser.email,
                        'userName': newUser.userName.trim(),
                        'phone': newUser.phone,
                        'language': [newUser.language]
                    }
                };
                newUser.loader = showLoaderWithMessage(
                    '',
                    errorMessages.SIGNUP.loading);
                var req = newUser.request;
                $('.ui .modal').modal('show');
                $('#signupModal').modal({
                    closable: false
                });

                signUpService.signUp(req).then(function(successResponse) {
                    if (successResponse &&
                        successResponse.responseCode === 'OK') {
                        newUser.loader.showLoader = false;

                        $location.path('/private/index');
                        newUser.loader.showLoader = false;
                        newUser.error = showErrorMessage(
                            true,
                            errorMessages.SIGNUP.success,
                            errorMessages.COMMON.SUCCESS);
                        $timeout(function() {
                            $('.ui .modal').modal('hide');
                        }, 2000);
                    } else {
                        newUser.loader.showLoader = false;
                        var errorMessage = newUser
                            .getErrorMsg(successResponse.params.err);
                        newUser.error = showErrorMessage(
                            true,
                            errorMessage,
                            errorMessages.COMMON.ERROR);
                    }
                }).catch(function() {
                    newUser.loader.showLoader = false;
                    newUser.error = showErrorMessage(
                        true,
                        errorMessages.SIGNUP.apiError,
                        errorMessages.COMMON.ERROR);
                });
            };
        });