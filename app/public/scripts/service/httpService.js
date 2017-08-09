'use strict';

/**
 * @ngdoc service
 * @name playerApp.httpService
 * @description
 * # httpService
 * Service in the playerApp.
 */
angular.module('loginApp')
    .service('httpService', function ($http) {
        function getHeader() {
            var headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Consumer-ID': 'X-Consumer-ID',
                'X-Device-ID': 'X-Device-ID',
                'X-msgid': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
                ts: '2017-05-25 10:18:56:578+0530',
                'X-Authenticated-Userid': '',
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkMTc1MDIwNDdlODc0ODZjOTM0ZDQ1ODdlYTQ4MmM3MyJ9.7LWocwCn5rrCScFQYOne8_Op2EOo-xTCK5JCFarHKSs'

            };
        headers.Accept = 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,image/webp,*/*;q=0.8';// eslint-disable-line
            return headers;
        }

        function httpCall(url, data, method, headers) {
            var header = headers || getHeader();
            var URL = url;
            return $http({
                method: method,
                url: URL,
                headers: header,

                data: data
            });
        }

        function handleSuccess(response) {
            return (response.data);
        }

        function handleError(response) {
            return (response.data);
        }

        this.post = function (url, data, headers) {
            var request = httpCall(url, data, 'POST', headers);
            return (request.then(handleSuccess, handleError));
        };
    });
