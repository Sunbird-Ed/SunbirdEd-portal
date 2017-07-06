'use strict';

angular.module('loginApp')
    .service('signUpService', function(httpService) {
        var signUpUrl = 'http://52.172.36.121:9000/v1/user/create';
        this.signUp = function(req) {
            var url = signUpUrl;
            return httpService.post(url, req);
        };
    });