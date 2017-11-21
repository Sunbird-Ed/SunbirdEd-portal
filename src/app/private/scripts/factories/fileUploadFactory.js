'use strict'

angular.module('playerApp')
  .factory('fileUpload', ['$timeout', 'toasterService', function ($timeout, toasterService) {
    return {
      /**
       * @method initializeFineUploader
       * @desc initialize FineUploader third party plugin
       * @memberOf Factory.fineUploader
       * @param {Object}  option - Option object to invoke controller callback function
       * @returns {Callback} Trigger callback function
       */
      createFineUploadInstance: function (options) {
        $timeout(function () {
          var objFineUploader = new qq.FineUploader({
            element: document.getElementById('fine-uploader-manual-trigger'),
            template: 'qq-template-manual-trigger',
            autoUpload: true,
            paramsInBody: true,
            debug: false,
            request: {
              endpoint: options.endpoint,
              inputName: 'file',
              customHeaders: options.customHeaders
            },
            validation: {
              sizeLimit: options.fileSizeLimit,
              allowedExtensions: options.allowedExtensions
            },
            messages: {
              sizeError: '{file} ' + options.fileSizeErrorText + ' ' + options.fileSizeLimit / (1000 * 1024) + ' MB.'
            },
            failedUploadTextDisplay: {
              mode: 'default',
              responseProperty: 'error'
            },
            showMessage: function (message) {
              toasterService.error(message)
            },
            callbacks: {
              onComplete: function (id, name, responseJSON, xhr) {
                if (responseJSON.responseCode === 'OK') {
                  var uploadDetails = {
                    'name': name,
                    'mimetype': this.getFile(id).type,
                    'size': this.getSize(id),
                    'link': responseJSON.result.url
                  }
                  options.uploadSuccess(id, name, uploadDetails)
                }
              },
              onSubmitted: function (id, name) {
                this.setParams({
                  filename: name,
                  container: options.containerName
                })
              },
              onCancel: function (id, name) {
                options.onCancel(id, name)
              }
            }
          })
          window.cancelUploadFile = function () {
            document.getElementById('hide-section-with-button').style.display = 'block'
          }
        }, 3000)
      }
    }
  }])
