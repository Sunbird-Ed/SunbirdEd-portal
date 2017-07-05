'use strict';

angular.module('playerApp')
    .controller('SignUpCtrl', function(userService, config) {
        var newUser = this;

        /**
         * This function called when api failed, and its show failed response for 2 sec.
         * @param {String} message
         */
        function showErrorMessage(isClose, message, messageType) {
            var error = {};
            error.showError = true;
            error.isClose = isClose;
            error.message = message;
            error.messageType = messageType;
            return error;
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
            return loader;
        }
        newUser.signUp = function() {
            newUser.loader = showLoaderWithMessage('', config.MESSAGES.RESOURCE.PAGE.START);

            userService.signUp().then(function(successResponse) {
                if (successResponse && successResponse.responseCode === 'OK') {
                    newUser.loader.showLoader = false;
                } else {
                    newUser.loader.showLoader = false;
                    newUser.error = showErrorMessage(true, config.MESSAGES.RESOURCE.PAGE.FAILED, config.MESSAGES.COMMON.ERROR);
                }
            }).catch(function(error) {
                newUser.loader.showLoader = false;
                newUser.error = showErrorMessage(true, config.MESSAGES.RESOURCE.PAGE.FAILED, config.MESSAGES.COMMON.ERROR);
            });
        };
    });