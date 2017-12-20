'use strict'

angular.module('playerApp')
  .service('toasterService', [function () {
    /**
     * @class toasterService
     * @desc Service to manage izi toaster messages.
     * @memberOf Services
     */
    iziToast.settings({
      position: 'topCenter',
      titleSize: '18'
    })
    /**
             * @method success
             * @desc Format success message
             * @memberOf Services.toasterService
             * @param {string}  message - Success message
             * @instance
             */
    this.success = function (message) {
      iziToast.success({
        title: message
      })
    }

    /**
             * @method info
             * @desc Format information message
             * @memberOf Services.toasterService
             * @param {string}  message - Info message
             * @instance
             */
    this.info = function (message) {
      iziToast.info({
        title: message
      })
    }
    /**
             * @method error
             * @desc Format error message
             * @memberOf Services.toasterService
             * @param {string}  message - Error message
             * @instance
             */
    this.error = function (message) {
      iziToast.error({
        progressBar: false,
        timeout: false,
        title: message
      })
    }
    /**
             * @method warning
             * @desc Format warning message
             * @memberOf Services.toasterService
             * @param {string}  message - Warning message
             * @instance
             */

    this.warning = function (message) {
      iziToast.warning({
        title: message
      })
    }

    /**
             * @method loader
             * @desc Manage loader
             * @memberOf Services.toasterService
             * @param {string}  headerMessage - Loader header message
             * @param {string}  loaderMessage - Loader body message
             * @instance
             */
    this.loader = function (headerMessage, loaderMessage) {
      var loader = {}
      loader.showLoader = true
      loader.headerMessage = headerMessage
      loader.loaderMessage = loaderMessage
      return loader
    }
  }])
