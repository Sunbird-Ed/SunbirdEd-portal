'use strict';

angular.module('playerApp')
    .controller('AuthCtrl', function(authService, config, $log, $scope, $rootScope, $timeout, $state, $localStorage, $sessionStorage, $window) {
        var auth = this;
        auth.userName = '';
        auth.password = '';
        $rootScope.isUserProfilePic = $window.localStorage.getItem('userPic') === 'null' ? false : true;
        $rootScope.isLoggedIn = $window.localStorage.getItem('isLoggedIn') === null ? false : true;
        $rootScope.getUserProfileImage = function() {
            $rootScope.userProfilePic = $window.localStorage.getItem('userPic');
        };
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
            error.message = errorResponse.responseCode === 'CLIENT_ERROR' ? 'invalid username or password' : '';
            error.responseCode = errorResponse.responseCode;
            auth.error = error;

            $timeout(function() {
                $scope.error = {};
            }, 2000);
        }
        auth.userProfile = function(userProfile) {
            if (userProfile && userProfile.responseCode === 'OK') {
                $rootScope.userProfilePic = userProfile.result.response.avatar;
                auth.user.profilePic = userProfile.result.response.avatar;
                $window.localStorage.setItem('userPic', $rootScope.userProfilePic);
                $state.go('Search');
            } else {
                throw new Error(userProfile);
            }
        };

        auth.processUserLogin = function(loginResponse) {
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
                $window.localStorage.setItem('user', auth.user);
                $window.localStorage.setItem('isLoggedIn', true);
            } else {
                throw new Error(loginResponse);
            }
        };

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
                        $rootScope.token = '';
                        $rootScope.userId = '';
                        $window.localStorage.clear();
                        auth.resetForm();
                        $state.go('Home');
                    } else {
                        handleFailedResponse(successResponse);
                    }
                })
                .catch(function(error) {
                    handleFailedResponse(error);
                });
        };
    });