'use strict'

angular.module('playerApp')
  .factory('fileUpload', ['$filter', 'config', '$timeout', 'toasterService', 'uuid4', function ($filter, config, $timeout, toasterService, uuid4) {
    var options = {
      endpoint: config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + config.URL.CONTENT.UPLOAD_MEDIA,
      customHeaders: {
        Accept: 'application/json',
        'X-Consumer-ID': 'X-Consumer-ID',
        'X-Device-ID': 'X-Device-ID',
        'X-msgid': uuid4.generate(),
        ts: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss:sssZ'),
        'X-Source': 'web',
        'X-Org-code': 'AP'
      }
    }
    return {
      /**
       * @method initializeFineUploader
       * @desc initialize FineUploader third party plugin
       * @memberOf Factory.fineUploader
       * @param {Object}  option - Option object to invoke controller callback function
       * @returns {Callback} Trigger callback function
       */
      createFineUploadInstance: function (controllerOption) {
        controllerOption = _.merge({}, controllerOption, options)
        $timeout(function () {
          var objFineUploader = new qq.FineUploader({
            element: document.getElementById('fine-uploader-manual-trigger'),
            template: 'qq-template-manual-trigger',
            autoUpload: true,
            paramsInBody: true,
            debug: false,
            request: {
              endpoint: controllerOption.endpoint,
              inputName: 'file',
              customHeaders: controllerOption.customHeaders
            },
            validation: {
              sizeLimit: controllerOption.fileSizeLimit,
              allowedExtensions: controllerOption.allowedExtensions
            },
            messages: {
              sizeError: '{file} ' + controllerOption.fileSizeErrorText + ' ' + controllerOption.fileSizeLimit / (1000 * 1024) + ' MB.'
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
                  controllerOption.uploadSuccess(id, name, uploadDetails)
                }
              },
              onSubmitted: function (id, name) {
                this.setParams({
                  filename: name,
                  container: controllerOption.containerName
                })
              },
              onCancel: function (id, name) {
                controllerOption.onCancel(id, name)
              }
            }
          })
          window.cancelUploadFile = function () {
            document.getElementById('hide-section-with-button').style.display = 'block'
          }
        }, 2000)
      }
    }
  }])
