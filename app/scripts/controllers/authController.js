'use strict';

angular.module('playerApp')
    .controller('AuthCtrl', function($log, $rootScope, $timeout, $state, $localStorage, $sessionStorage, $window, authService, config) {
        var auth = this;
        auth.userName = '';
        auth.password = '';
        $rootScope.isLoggedIn = $window.localStorage.getItem('isLoggedIn') === null ? false : true;
        $rootScope.userProfilePic = $window.localStorage.getItem('userPic');
        auth.resetForm = function() {
            auth.userName = '';
            auth.password = '';
        };
        auth.openAuthModal = function() {
            $('#authLogin')
                .modal('show');
        };
        auth.closeAuthModal = function() {
            auth.resetForm();
            $('#authLogin')
                .modal('hide');
            $('#authLogin')
                .modal('hide others');
            $('#authLogin')
                .modal('hide dimmer');
        };

        function handleFailedResponse(errorResponse) {
            var error = {};
            error.isError = true;
            error.message = errorResponse.message ? errorResponse.message : errorResponse.responseCode === 'CLIENT_ERROR' ? 'invalid username or password' : '';
            error.responseCode = errorResponse.responseCode;
            auth.error = error;
        }
        auth.userProfile = function(userProfile) {
            if (userProfile && userProfile.responseCode === 'OK') {
                $rootScope.userProfilePic = userProfile.result.response.avatar;
                $rootScope.preferredLanguage = userProfile.result.response.language;

                auth.user.profilePic = userProfile.result.response.avatar;
                $window.localStorage.setItem('userPic', $rootScope.userProfilePic);
                $window.localStorage.setItem('preferredLanguage', userProfile.result.response.language);
                $state.go('Home');
            } else {
                throw new Error(userProfile);
            }
        };

        auth.processUserLogin = function(loginResponse) {
            console.log('login response', JSON.stringify(loginResponse, null, 2));
            if (loginResponse && loginResponse.responseCode === 'OK') {
                var user = loginResponse.result.response;
                auth.closeAuthModal();
                $rootScope.isLoggedIn = true;
                $rootScope.token = user.token;
                $rootScope.userId = user.userId;
                auth.userId = user.userId;
                auth.user = {
                    isLoggedIn: true,
                    token: $rootScope.token,
                    userId: $rootScope.userId
                };
                $window.localStorage.setItem('user', JSON.stringify(auth.user));
                $window.localStorage.setItem('isLoggedIn', true);
            } else {
                if (loginResponse !== null && loginResponse.responseCode === 'CLIENT_ERROR') {
                    throw new Error('Invalid user name and password');
                } else {
                    throw new Error('Connection Error');
                }
            }
        };

        auth.login = function() {
            var existingUser = {
                'id': 'sunbird.login',
                'ts': new Date(),
                'request': {
                    'userName': auth.userName,
                    'password': auth.password,
                    'source': 'portal'
                }
            };

            authService.login(existingUser)
                .then(function(successResponse) {
                    auth.processUserLogin(successResponse);
                    authService.getUserProfile(auth.userId)
                        .then(function(successResponse) {
                            auth.userProfile(successResponse);
                        }).catch(function(error) {
                            handleFailedResponse(error);
                        });
                })
                .catch(function(e) {
                    var error = {
                        message: e.message,
                        responseCode: 'CLIENT_ERROR'
                    };
                    handleFailedResponse(error);
                });
        };

        auth.logout = function() {
            var logoutReq = {
                'id': 'sunbird portal',
                'ts': new Date(),
                'params': {
                    // 'did': 'device UUID from which API is called',
                    // 'key': 'API key (dynamic)',
                    // 'cid': 'consumer id',
                    'uid': $rootScope.token
                },

                'request': {}
            };
            authService.logout(logoutReq).then(function(successResponse) {
                    console.log('logoutResponse', JSON.stringify(successResponse, null, 2));
                    if (successResponse && successResponse.responseCode === 'OK') {
                        $rootScope.isLoggedIn = false;
                        $rootScope.token = '';
                        $rootScope.userId = '';
                        $window.localStorage.clear();
                        auth.resetForm();
                        $state.go('LandingPage');
                    } else {
                        handleFailedResponse(successResponse);
                    }
                })
                .catch(function(error) {
                    handleFailedResponse(error);
                });
        };
    });