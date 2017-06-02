'use strict';
angular.module('playerApp')
    .service('authService', function(httpServiceJava, config, $q, $sessionStorage, $rootScope, $state) {
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

        function validUser() {
            if (!$sessionStorage.isLoggedIn) {
                $state.go('Home');
                return false;
            } else {
                $rootScope.isLoggedIn = true;
            }
        }

        return {

            login: login,
            logout: logout,
            validUser: validUser
        };
    });