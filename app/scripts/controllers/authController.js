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


        function handleFail(errorResponse) {
            var error = {};
            error.isError = true;
            error.message = errorResponse.responseCode === 'CLIENT_ERROR' ? 'invalid username or password' : '';
            error.responseCode = errorResponse.responseCode;
            auth.error = error;

            $timeout(function() {
                $scope.error = {};
            }, 2000);
        }

        // this function called for register a new auth
        auth.login = function() {
            var existingUser = {
                'id': 'sunbird.login',
                'ts': new Date(),
                // 'params': {
                //     // 'did': 'device UUID from which API is called',
                //     // 'msgid': Math.random(),
                //     // 'cid': 'consumer id'
                // },
                // 'params': {

                // },
                'request': {
                    'userName': auth.userName,
                    'password': auth.password,
                    'source': 'portal'
                }
            };

            authService.login(existingUser).then(function(successResponse) {
                    console.log('successResponse', successResponse);
                    if (successResponse && successResponse.responseCode === 'OK') {
                        auth.closeAuthModal();
                        $rootScope.isLoggedIn = true;
                        $scope.token = successResponse.result.authToken;
                        $sessionStorage.firstName = successResponse.result.firstName;
                        $sessionStorage.isLoggedIn = $rootScope.isLoggedIn;
                        $sessionStorage.token = $scope.token;
                        $state.go('Search');
                    } else {
                        handleFail(successResponse);
                    }
                })
                .catch(function(error) {
                    handleFail(error);
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