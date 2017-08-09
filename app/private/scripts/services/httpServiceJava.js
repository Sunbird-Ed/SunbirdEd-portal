'use strict';

/**
 * @ngdoc service
 * @name playerApp.httpService
 * @description
 * # httpService
 * Service in the playerApp.
 */
angular.module('playerApp')
    .service('httpServiceJava', ['$http', '$rootScope', '$filter', 'config', 'uuid4',
        function ($http, $rootScope, $filter, config, uuid4) {
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
                    'X-Org-code': 'AP'
                };
                headers.Accept = 'text/html,application/xhtml+xml,application/xml,' +
                             'application/json;q=0.9,image/webp,*/*;q=0.8';
                return headers;
            }

            function httpCall(url, data, method, header) {
                var headers = header || getHeader();
                var URL = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + url;
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
                if (response.data && response.status === 440) {
                    alert('Session expired, please login again...');
                    window.document.location.replace('/logout');
                }
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

            this.upload = function (url, data) {
                var URL = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + url;
                var headers = {
                    'Content-Type': undefined,
                    'X-Consumer-ID': 'X-Consumer-ID',
                    'X-Device-ID': 'X-Device-ID',
                    'X-msgid': uuid4.generate(),
                    ts: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss:sssZ'),
                    'X-Authenticated-Userid': $rootScope.userId,
                    'X-Source': 'web',
                    'X-Org-code': 'AP'
                };
                var request = $http({
                    method: 'POST',
                    url: URL,
                    headers: headers,
                    data: data
                });
                return (request.then(handleSuccess, handleError));
            };
        }]);
