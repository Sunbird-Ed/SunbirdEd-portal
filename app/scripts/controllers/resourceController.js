'use strict';

angular.module('playerApp')
        .controller('resourceCtrl', function (resourceService, $log, $scope, $state, $rootScope, $sessionStorage, $timeout, config) {
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
            
            /**
             * This function helps to show loader with message.
             * @param {String} headerMessage
             * @param {String} loaderMessage
             */
            function showLoaderWithMessage(headerMessage, loaderMessage) {
                var loader = {};
                loader.showLoader = true;
                loader.headerMessage = headerMessage;
                loader.loaderMessage = loaderMessage;
                resource.loader = loader;
            }
            
            resource.playContent = function (item) {
                var params = {content: item};
                $state.go('Player', params);
            }
            resource.sections = function () {
                showLoaderWithMessage("", config.MESSAGES.RESOURCE.PAGE.START)
                resourceService.resources().then(function (successResponse) {
                    console.log('successResponse', successResponse.result);
                    if (successResponse && successResponse.responseCode === 'OK') {
                        resource.loader.showLoader = false;
                        resource.page = successResponse.result.response.sections;
                        console.log('page', resource.page);
                    } else {
                        resource.loader.showLoader = false;
                        handleFailedResponse(successResponse);
                    }
                }).catch(function (error) {
                    resource.loader.showLoader = false;
                    $log.warn(error);
                    handleFailedResponse(error);
                });
            };
            resource.sections();
        });