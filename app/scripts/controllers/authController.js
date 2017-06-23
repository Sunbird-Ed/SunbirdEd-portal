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
            console.log('user profile', JSON.stringify(userProfile, null, 2));

            if (userProfile && userProfile.responseCode === 'OK') {
                // userProfile.result.response = [{
                //     'lastName': null,
                //     'aadhaarNo': null,
                //     'gender': null,
                //     'city': null,
                //     'language': 'English',
                //     'avatar': 'https://placeholdit.co//i/300x150',
                //     'updatedDate': null,
                //     'userName': 'amit.kumar@tarento.com',
                //     'userId': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2',
                //     'zipcode': null,
                //     'firstName': 'Amit',
                //     'lastLoginTime': '2017-06-23 04:32:44:782+0000',
                //     'createdDate': '2017-06-22 07:20:12:246+0000',
                //     'phone': null,
                //     'state': null,
                //     'email': 'amit.kumar@tarento.com',
                //     'status': 1
                // }];

                if (userProfile.result.response.length) {
                    var profileData = userProfile.result.response[0];
                    $rootScope.userProfilePic = profileData.avatar;
                    $rootScope.preferredLanguage = profileData.language;
                    auth.user.profilePic = profileData.avatar;
                    $window.localStorage.setItem('userPic', profileData.avatar);
                    $window.localStorage.setItem('preferredLanguage', profileData.language);
                }
                $state.go('Home');
            } else {
                throw new Error('failed to fetch user profile details');
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
                $sessionStorage.userId = $rootScope.userId;
                $sessionStorage.token = $rootScope.token;
                $window.localStorage.setItem('user', JSON.stringify(auth.user));
                $window.localStorage.setItem('isLoggedIn', true);
                $window.localStorage.setItem('userId', user.userId);
                $window.sessionStorage.setItem('isLoggedIn', true);
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
                        }).catch(function(e) {
                            throw new Error(e.message);
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