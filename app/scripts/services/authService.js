'use strict';
angular.module('playerApp')
    .service('authService', function(httpServiceJava, config, $q, $sessionStorage, $rootScope, $state, $cookies, $window) {
        this.login = function(req) {
            var url = config.URL.USER_BASE + config.URL.AUTH.LOGIN;
            // return httpServiceJava.post(url, req);
            var deferred = $q.defer();
            deferred.resolve(app_mock_data.auth.login)
            return deferred.promise;

        }

        this.logout =  function(req) {
            var url = config.URL.USER_BASE + config.URL.AUTH.LOGOUT;
            // return httpServiceJava.post(url, req);
            var deferred = $q.defer();
            deferred.resolve(app_mock_data.auth.logout)
            return deferred.promise;
        }

        this.getUserProfile = function(uId) {

            var url = config.URL.USER_BASE + config.URL.AUTH.PROFILE + '/:' + uId;
            var deferred = $q.defer();
            deferred.resolve(app_mock_data.auth.profile)
            return deferred.promise;
        }

        this.validUser = function() {
            var isLoggedIn = $window.localStorage.getItem('isLoggedIn') || $rootScope.isLoggedIn;

            if (!isLoggedIn) {
                $state.go('Home');
                $rootScope.isLoggedIn = false;
                return false;
            } else {
                $rootScope.isLoggedIn = true;
            }
        }
    });