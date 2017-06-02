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

        function handleFailedResponse(errorResponse) {
            var error = {};
            error.isError = true;
            error.message = errorResponse.responseCode === 'CLIENT_ERROR' ? 'invalid username or password' : '';
            error.responseCode = errorResponse.responseCode;
            auth.error = error;

            $timeout(function() {
                $scope.error = {};
            }, 2000);
        }

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
                    if (successResponse && successResponse.responseCode === 'OK') {
                        var loginResponse = successResponse.result.response;
                        auth.closeAuthModal();
                        $rootScope.isLoggedIn = true;
                        $scope.token = loginResponse.token;
                        $scope.userId = loginResponse.userId;
                        $sessionStorage.firstName = loginResponse.firstName;
                        $sessionStorage.isLoggedIn = $rootScope.isLoggedIn;
                        $sessionStorage.token = $scope.token;
                        $sessionStorage.userId = $scope.userId;
                        $state.go('Search');
                    } else {
                        handleFailedResponse(successResponse);
                    }
                })
                .catch(function(error) {
                    handleFailedResponse(error);
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
                        $scope.userId = '';
                        $sessionStorage.firstName = '';
                        $sessionStorage.isLoggedIn = $rootScope.isLoggedIn;
                        $sessionStorage.token = $scope.token;
                        $sessionStorage.userId = '';
                        $state.go('Home');
                        auth.resetForm();
                    } else {
                        handleFailedResponse(successResponse);
                    }
                })
                .catch(function(error) {
                    handleFailedResponse(error);
                });
        };
    });