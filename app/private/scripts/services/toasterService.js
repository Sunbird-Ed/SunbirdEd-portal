'use strict';

/**
 * @ngdoc service
 * @name playerApp.toasterService
 * @description
 * @author Anuj Gupta
 * # toasterService
 * Service in the playerApp.
 */

angular.module('playerApp')
    .service('toasterService', [function () {
        iziToast.settings({
            position: 'topCenter',
            titleSize: '18'
        });

        this.success = function (message) {
            iziToast.success({
                title: message
            });
        };

        this.info = function (message) {
            iziToast.info({
                title: message
            });
        };

        this.error = function (message) {
            iziToast.error({
                progressBar: false,
                timeout: false,
                title: message
            });
        };

        this.warning = function (message) {
            iziToast.warning({
                title: message
            });
        };

        this.loader = function (headerMessage, loaderMessage) {
            var loader = {};
            loader.showLoader = true;
            loader.headerMessage = headerMessage;
            loader.loaderMessage = loaderMessage;
            return loader;
        };
    }]);
