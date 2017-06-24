'use strict';

angular.module('playerApp')
        .controller('resourceCtrl', function (resourceService, $log, $scope,$state, $rootScope, $sessionStorage, $timeout, $location) {
            var resource = this;
            resource.contentPlayer = {
                isContentPlayerEnabled: false
            };
            $rootScope.searchResult = [];
            function handleFailedResponse(errorResponse) {
                var error = {};
                error.isError = true;
                error.message = errorResponse.responseCode === 'CLIENT_ERROR' ? 'invalid username or password' : '';
                error.responseCode = errorResponse.responseCode;
                error.error = error;
            }
            resource.playContent = function (item) {
                var params = {content: item};
                $state.go('Player', params);
            }
            resource.sections = function () {
                resourceService.resources().then(function (successResponse) {
                    console.log('successResponse', successResponse.result);
                    if (successResponse && successResponse.responseCode === 'OK') {
                        resource.page = successResponse.result.response.sections;
                        console.log('page', resource.page);
                    } else {
                        handleFailedResponse(successResponse);
                    }
                }).catch(function (error) {
                    $log.warn(error);
                    handleFailedResponse(error);
                });
            };
            resource.sections();
        });