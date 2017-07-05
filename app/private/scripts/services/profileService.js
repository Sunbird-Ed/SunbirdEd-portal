'use strict';
angular.module('playerApp')
    .service('profileService', function(javaService, config, $q, $sessionStorage, $rootScope, $state, $cookies, $window) {
        this.getUserProfile = function(uId) {
            var url = config.URL.LEARNER_PREFIX + config.URL.USER.GET_PROFILE + '/' + uId;
            return javaService.get(url);
        };
    });