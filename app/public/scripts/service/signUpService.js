'use strict';

angular.module('loginApp')
    .service('signUpService', ['httpService', function (httpService) {
        var signUpUrl = '/public/service/user/v1/create';
        this.signUp = function (req) {
            var url = signUpUrl;
            return httpService.post(url, req);
        };
    }]);
