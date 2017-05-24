'use strict';
angular.module('playerApp')
    .service('userService', function(httpService, config) {
        function register(req) {
            var url = config.URL.BASE + config.URL.USER.REGISTER;
            return httpService.postOperation(url, req);
        }
        return {
            register: register,
        };
    });