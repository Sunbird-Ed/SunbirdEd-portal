'use strict';
angular.module('playerApp')
    .service('authService', function(httpService, config, $q, $sessionStorage, $rootScope, $state) {
        function login(req) {
            var url = config.URL.USER_BASE + config.URL.AUTH.LOGIN;
            return httpService.post(url, req);
        }

        function logout(req) {
            var url = config.URL.BASE + config.URL.AUTH.LOGOUT;
            return httpService.postOperation(url, req);
            // var deferred = $q.defer();
            // deferred.resolve({
            //     'id': '7c27cbf5-e299-43b0-bca7-8347f7e5abcf',
            //     'ver': 'v1',
            //     'ts': '2017-05-136 10:49:58:600+0530',
            //     'params': {
            //         'resmsgid': null,
            //         'msgid': null,
            //         'err': 'SUCCESS',
            //         'status': 'success',
            //         'errmsg': 'Success'
            //     },
            //     'responseCode': 'OK',
            //     'result': {

            //     }
            // });
            // return deferred.promise;
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