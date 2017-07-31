'use strict';

/**
 * @ngdoc service
 * @name playerApp.httpService
 * @description
 * # httpService
 * Service in the playerApp.
 */
angular.module('playerApp')
    .service('httpServiceJava', function ($http, $rootScope, $filter, config, uuid4) {
        function getHeader() {
            $rootScope.userId = $rootScope.userId || $('#userId').attr('value');
            var headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Consumer-ID': 'X-Consumer-ID',
                'X-Device-ID': 'X-Device-ID',
                'X-msgid': uuid4.generate(),
                ts: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss:sssZ'),
                'X-Authenticated-Userid': $rootScope.userId,
                'X-Source': 'web',
                'X-Org-code': 'AP',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkMTc1MDI' +
                'wNDdlODc0ODZjOTM0ZDQ1ODdlYTQ4MmM3MyJ9.7LWocwCn5rrCScFQYOne8_Op2EOo-xTCK5JCFarHKSs'
            };
            headers.Accept = 'text/html,application/xhtml+xml,application/xml,' +
                             'application/json;q=0.9,image/webp,*/*;q=0.8';
            return headers;
        }

        function httpCall(url, data, method, header) {
            var headers = header || getHeader();
            var URL = config.URL.BASE_PREFIX + url;
            return $http({
                method: method,
                url: URL,
                headers: headers,
                // data: { request: data },
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

        this.get = function (url, data, headers) {
            var request = httpCall(url, data, 'GET', headers);
            return (request.then(handleSuccess, handleError));
        };

        this.remove = function (url, data, headers) {
            var request = httpCall(url, data, 'DELETE', headers);
            return (request.then(handleSuccess, handleError));
        };

        this.put = function (url, data, headers) {
            var request = httpCall(url, data, 'PUT', headers);
            return (request.then(handleSuccess, handleError));
        };

        this.patch = function (url, data, headers) {
            var request = httpCall(url, data, 'PATCH', headers);
            return (request.then(handleSuccess, handleError));
        };

        this.upload = function (url, data, headers) {
            var request = $http.post(config.URL.BASE_PREFIX + url, data, {
                //  transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    cid: 'sunbird'
                }
            });
            return (request.then(handleSuccess, handleError));
        };
    });
