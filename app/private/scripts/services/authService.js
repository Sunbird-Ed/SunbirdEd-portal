'use strict';
angular.module('playerApp')
    .service('authService', function(javaService, config, $q, $sessionStorage, $rootScope, $state, $cookies, $window) {
        this.login = function(req) {
            var url = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + config.URL.AUTH.LOGIN;
            return javaService.post(url, req);
            // var deferred = $q.defer();
            // deferred.resolve(app_mock_data.auth.login)
            // return deferred.promise;
        };

        this.logout = function(req) {
            var url = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + config.URL.AUTH.LOGOUT;
            return javaService.post(url, req);
            // var deferred = $q.defer();
            // deferred.resolve(app_mock_data.auth.logout);
            // return deferred.promise;
        };

        this.getUserProfile = function(uId) {
            var url = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + config.URL.AUTH.PROFILE + '/:' + uId;
            return javaService.get(url);
            // var deferred = $q.defer();
            // deferred.resolve(app_mock_data.auth.profile);
            // return deferred.promise;
        };

        this.validUser = function() {
            var isLoggedIn = $window.localStorage.getItem('isLoggedIn') || $rootScope.isLoggedIn || $window.sessionStorage.setItem('isLoggedIn');

            if (!isLoggedIn) {
                $state.go('LandingPage');
                $rootScope.isLoggedIn = false;
                return false;
            } else {
                $rootScope.isLoggedIn = true;
            }
        };
    });