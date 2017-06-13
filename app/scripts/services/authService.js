'use strict';
angular.module('playerApp')
    .service('authService', function(httpServiceJava, config, $q, $sessionStorage, $rootScope, $state, $cookies, $window) {
        function login(req) {
            var url = config.URL.USER_BASE + config.URL.AUTH.LOGIN;
            // return httpServiceJava.post(url, req);
            var deferred = $q.defer();
            deferred.resolve({
                'id': null,
                'ver': 'v1',
                'ts': '2017-06-02 04:24:38:939+0530',
                'params': {
                    'resmsgid': null,
                    'msgid': null,
                    'err': null,
                    'status': 'success',
                    'errmsg': null
                },
                'responseCode': 'OK',
                'result': {
                    'response': {
                        'source': 'android',
                        'firstName': 'user1',
                        'token': '4eb30018-d781-3b82-b87a-7fc09cb86b1f',
                        'userId': 'user1'
                    }
                }
            });
            return deferred.promise;
        }

        function logout(req) {
            var url = config.URL.USER_BASE + config.URL.AUTH.LOGOUT;
            // return httpServiceJava.post(url, req);
            var deferred = $q.defer();
            deferred.resolve({
                'id': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
                'ver': 'v1',
                'ts': '2017-06-02 04:24:57:956+0530',
                'params': {
                    'resmsgid': null,
                    'msgid': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
                    'err': null,
                    'status': 'success',
                    'errmsg': null
                },
                'responseCode': 'OK',
                'result': {
                    'response': 'SUCCESS'
                }
            });
            return deferred.promise;
        }

        function getUserProfile(uId) {

            var url = config.URL.USER_BASE + config.URL.AUTH.PROFILE + '/:' + uId;
            // return httpServiceJava.post(url, req);
            var res = {
                'id': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
                'ver': 'v1',
                'ts': '2017-06-07 03:18:08:239+0530',
                'params': {
                    'resmsgid': null,
                    'msgid': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
                    'err': null,
                    'status': 'success',
                    'errmsg': null
                },
                'responseCode': 'OK',
                'result': {
                    'response': {
                        'lastName': null,
                        'aadhaarNo': null,
                        'gender': null,
                        'city': null,
                        'language': 'English',
                        'avatar': null,
                        'updatedDate': null,
                        'userName': 'amit.kumar@tarento.com',
                        'userId': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2',
                        'zipcode': null,
                        'firstName': 'Amit',
                        'lastLoginTime': null,
                        'createdDate': '2017-06-07 10:35:50:558+0530',
                        'phone': null,
                        'state': null,
                        'email': 'amit.kumar@tarento.com',
                        'status': 1
                    }
                }
            };
            var deferred = $q.defer();
            deferred.resolve(res);
            return deferred.promise;
        }

        function validUser() {
            var isLoggedIn = $window.localStorage.getItem('isLoggedIn') || $rootScope.isLoggedIn;

            if (!isLoggedIn) {
                $state.go('Home');
                $rootScope.isLoggedIn = false;
                return false;
            } else {
                $rootScope.isLoggedIn = true;
            }
        }

        return {
            login: login,
            logout: logout,
            getUserProfile: getUserProfile,
            validUser: validUser
        };
    });