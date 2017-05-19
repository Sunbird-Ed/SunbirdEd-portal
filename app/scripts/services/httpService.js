'use strict';

/**
 * @ngdoc service
 * @name playerApp.httpService
 * @description
 * # httpService
 * Service in the playerApp.
 */
angular.module('playerApp')
    .service('httpService', function($http) {

        function postOperation(url, data, headers) {
            var request = httpCall(url, data, 'POST', headers);
            return (request.then(handleSuccess, handleError));
        }

        function getOperation(url, data, headers) {
            var request = httpCall(url, data, 'GET', headers);
            return (request.then(handleSuccess, handleError));
        }

        function deleteOperation(url, data, headers) {
            var request = httpCall(url, data, 'DELETE', headers);
            return (request.then(handleSuccess, handleError));
        }

        function putOperation(url, data, headers) {
            var request = httpCall(url, data, 'PUT', headers);
            return (request.then(handleSuccess, handleError));
        }

        function patchOperation(url, data, headers) {
            var request = httpCall(url, data, 'PATCH', headers);
            return (request.then(handleSuccess, handleError));
        }

        function upload(url, data, headers) {

            var request = $http.post(url, data, {
                headers: {
                    'Content-Type': undefined,
                    'cid': 'sunbird'
                }
            });
            return (request.then(handleSuccess, handleError));
        }

        function handleSuccess(response) {
            return (response.data);
        }

        function handleError(response) {
            return (response.data);
        }

        function getHeader() {
            var headers = {
                'Content-Type': 'application/json',
                'cid': 'sunbird'
            };
            return headers;
        }

        function httpCall(url, data, method, headers) {
            /*eslint-disable no-redeclare */
            var headers = headers || getHeader();

            return $http({
                method: method,
                url: url,
                headers: headers,
                data: { request: data }
                // data: data
            });
        }

        return ({
            getOperation: getOperation,
            postOperation: postOperation,
            putOperation: putOperation,
            deleteOperation: deleteOperation,
            patchOperation: patchOperation,
            upload: upload
        });
    });
