'use strict';

angular.module('loginApp')
    .service('signUpService', function(httpService) {
        var signUpUrl = '/public/service/v1/user/create';
        this.signUp = function(req) {
            var url = signUpUrl;
            return httpService.post(url, req);
        };
    });