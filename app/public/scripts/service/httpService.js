'use strict';

/**
 * @ngdoc service
 * @name playerApp.httpService
 * @description
 * # httpService
 * Service in the playerApp.
 */
angular.module('loginApp')
    .service('httpService', function($http) {
        this.post = function(url, data, headers) {
            var request = httpCall(url, data, 'POST', headers);
            return (request.then(handleSuccess, handleError));
        };

        function handleSuccess(response) {
            return (response.data);
        }

        function handleError(response) {
            return (response.data);
        }

        function getHeader() {
            var headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Consumer-ID': 'X-Consumer-ID',
                'X-Device-ID': 'X-Device-ID',
                'X-msgid': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
                'ts': '2017-05-25 10:18:56:578+0530',
                'X-Authenticated-Userid': ''

            };
            headers.Accept = 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,image/webp,*/*;q=0.8';
            return headers;
        }

        function httpCall(url, data, method, headers) {
            var headers = headers || getHeader();
            var URL = url;
            return $http({
                method: method,
                url: URL,
                headers: headers,

                data: data
            });
        }
    });