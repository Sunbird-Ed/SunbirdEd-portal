'use strict';

/**
 * @ngdoc service
 * @name playerApp.httpService
 * @description
 * # httpService
 * Service in the playerApp.
 */
angular.module('playerApp')
        .service('httpService', ['$http', 'config', function ($http, config) {
            function getHeader() {
                var headers = {
                    'Content-Type': 'application/json',
                    cid: 'sunbird'
                };
                headers.Accept = 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,image/webp,*/*;q=0.8';
                return headers;
            }
            function httpCall(url, data, method, header, qs) {
                var headers = header || getHeader();
                var URL = config.URL.BASE_PREFIX + url;
                return $http({
                    method: method,
                    url: URL,
                    headers: headers,
                    params: qs,
                    data: { request: data }
                // data: data
                });
            }

            function handleSuccess(response) {
                if (response.data && response.status === 440) {
                    alert('Session expired, please login again...');
                    window.document.location.replace('/logout');
                }
                return (response.data);
            }

            function handleError(response) {
                return (response.data);
            }
            this.post = function (url, data, headers) {
                var request = httpCall(url, data, 'POST', headers);
                return (request.then(handleSuccess, handleError));
            };

            this.get = function (url, data, headers, qs) {
                var request = httpCall(url, data, 'GET', headers, qs);
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
                var request = $http.post(config.URL.BASE_PREFIX + url, data, {
                    //                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        cid: 'sunbird'
                    }
                });
                return (request.then(handleSuccess, handleError));
            };
        }]);
