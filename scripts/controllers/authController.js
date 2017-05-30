'use strict';

angular.module('playerApp')
    .controller('AuthCtrl', function(authService, config, $log, $scope, $rootScope, $timeout, $state,
        $sessionStorage) {
        var auth = this;
        auth.userName = '';
        auth.password = '';
        auth.resetForm = function() {
            auth.userName = '';
            auth.password = '';
        };
        auth.openAuthModal = function() {
            $('#auth')
                .modal('show');
        };
        auth.closeAuthModal = function() {
            $('#auth')
                .modal('hide');
        };

        /**
         * This function helps to show loader or any error message at the time of api call.
         * @param {Boolean} showMetaLoader
         * @param {String} messageClass
         * @param {String} message
         */
        function showLoaderWithMessage(showMetaLoader, messageClass, message) {
            var error = {};
            error.showError = true;
            error.showMetaLoader = showMetaLoader;
            error.messageClass = messageClass;
            error.message = message;
            $scope.error = error;
        }

        /**
         * This function called when api failed, and its show failed response for 2 sec.
         * @param {String} message
         */
        function handleFailedResponse(message) {
            showLoaderWithMessage(false, 'red', message);
            $timeout(function() {
                $scope.error = {};
            }, 2000);
        }

        // this function called for register a new auth
        auth.login = function() {
            var existingUser = {
                'id': 'sunbird.login',
                'ts': new Date(),
                'params': {
                    'did': 'device UUID from which API is called',
                    'msgid': Math.random(),
                    'cid': 'consumer id'
                },
                'request': {
                    'authName': auth.userName,
                    'password': auth.password,
                    'source': 'portal'
                }
            };
            authService.login(existingUser).then(function(successResponse) {
                    if (successResponse && successResponse.responseCode === 'OK') {
                        auth.closeAuthModal();
                        $rootScope.isLoggedIn = true;
                        $scope.token = successResponse.result.authToken;
                        $sessionStorage.firstName = successResponse.result.firstName;
                        $sessionStorage.isLoggedIn = $rootScope.isLoggedIn;
                        $sessionStorage.token = $scope.token;
                        $state.go('Search');
                    } else {
                        handleFailedResponse(config.MESSAGES.AUTH.LOGIN.FAILED);
                    }
                })
                .catch(function(error) {
                    $log.error(error);
                    handleFailedResponse(config.MESSAGES.AUTH.LOGIN.FAILED);
                });
        };

        auth.logout = function() {
            var logoutReq = {
                'id': 'unique API ID',
                'ts': '2013/10/15 16:16:39',
                'params': {
                    'did': 'device UUID from which API is called',
                    'key': 'API key (dynamic)',
                    'cid': 'consumer id',
                    'uid': 'user auth token'
                },
                'request': {}
            };
            authService.logout(logoutReq).then(function(successResponse) {
                    if (successResponse && successResponse.responseCode === 'OK') {
                        $scope.error = {};
                        $rootScope.isLoggedIn = false;
                        $scope.token = '';
                        $sessionStorage.firstName = '';
                        $sessionStorage.isLoggedIn = $rootScope.isLoggedIn;
                        $sessionStorage.token = $scope.token;
                        $state.go('Home');
                        auth.resetForm();
                    } else {
                        handleFailedResponse(config.MESSAGES.AUTH.LOGOUT.FAILED);
                    }
                })
                .catch(function() {
                    handleFailedResponse(config.MESSAGES.AUTH.LOGOUT.FAILED);
                });
        };
    });

// this function called for register a new auth
// auth.register = function() {
//     auth.email = '';
//     auth.firstName = '';
//     auth.lastName = '';
//     auth.phone = '';
//     auth.password = '';
//     auth.gender = '';
//     auth.language = '';
//     auth.state = '';
//     auth.city = '';
//     auth.zipCode = '';
//     var newauth = {
//         'id ': 'web-portal',
//         'ts ': moment().toDate(),
//         'params ': {
//             'did ': 'device UUID from which API is called ',
//             ' key ': ' API key(dynamic)',
//             'cid ': 'consumer id '
//         },
//         'request ': {
//             ' email ': auth.email,
//             'firstName ': auth.firstName,
//             'lastName ': auth.lastName,
//             'phone ': auth.phone,
//             'password ': auth.password,
//             'gender ': auth.gender,
//             'language ': auth.language,
//             'state ': auth.state,
//             'city ': auth.city,
//             'zipCode ': auth.zipCode
//         }
//     };

//     showLoaderWithMessage(true, '', config.MESSAGES.auth.REGISTER.START);
//     authService.register(newauth).then(function(successResponse) {
//             if (successResponse && successResponse.responseCode === 'OK') {
//                 $log.info('successResponse', successResponse.responseCode);
//                 showLoaderWithMessage(false, 'green', config.MESSAGES.auth.REGISTER.SUCCESS);
//                 $timeout(function() {
//                     $scope.error = {};
//                     auth.currentForm = 'loginForm';
//                 }, 2000);
//             } else {
//                 handleFailedResponse(config.MESSAGES.auth.REGISTER.FAILED);
//             }
//         }),
//         function(error) {
//             $log.error(error);
//         };
// };