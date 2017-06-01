'use strict';
angular.module('playerApp')
    .service('authService', function(httpServiceJava, config, $q, $sessionStorage, $rootScope, $state) {
        function register(req) {
            var url = config.URL.BASE + config.URL.AUTH.REGISTER;
            return httpServiceJava.postOperation(url, req);
            // var deferred = $q.defer();
            // deferred.resolve({
            //     id: '7 c27cbf5 - e299 - 43 b0 - bca7 - 8347 f7e5abcf ',
            //     ver: 'v1 ',
            //     ts: '2017 - 05 - 136 10: 49: 58: 600 + 0530 ',
            //     params: {
            //         ' resmsgid ': null,
            //         ' msgid ': null,
            //         'err ': 'SUCCESS ',
            //         'status ': 'success ',
            //         'errmsg ': 'Success '
            //     },
            //     responseCode: 'OK',
            //     result: {}
            // });
            // return deferred.promise;
        }

        function login(req) {
            var url = config.URL.BASE + config.URL.AUTH.LOGIN;
            // return httpServiceJava.postOperation(url, req);
            var deferred = $q.defer();
            deferred.resolve({
                id: 'sunbird.login',
                ver: '1.0',
                ts: '2017-05-136 10:49:58:600+0530',
                params: {
                    resmsgid: '7 c27cbf5 - e299 - 43 b0 - bca7 - 8347 f7e5abcf',
                    msgid: '8e27 cbf5 - e299 - 43 b0 - bca7 - 8347 f7e5abcf',
                    err: null,
                    status: 'success',
                    errmsg: null
                },
                responseCode: 'OK',
                result: {
                    'authToken': 'token123',
                    'firstName': 'firstname'
                }
            });
            return deferred.promise;
        }

        function logout(req) {
            var url = config.URL.BASE + config.URL.AUTH.LOGOUT;
            // return httpServiceJava.postOperation(url, req);
            var deferred = $q.defer();
            deferred.resolve({
                'id': '7c27cbf5-e299-43b0-bca7-8347f7e5abcf',
                'ver': 'v1',
                'ts': '2017-05-136 10:49:58:600+0530',
                'params': {
                    'resmsgid': null,
                    'msgid': null,
                    'err': 'SUCCESS',
                    'status': 'success',
                    'errmsg': 'Success'
                },
                'responseCode': 'OK',
                'result': {

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
            register: register,
            login: login,
            logout: logout,
            validUser: validUser
        };
    });