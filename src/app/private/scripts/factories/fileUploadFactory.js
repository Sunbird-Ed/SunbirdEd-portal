'use strict'

angular.module('playerApp')
  .factory('fileUpload', ['$filter', 'config', '$timeout', 'toasterService',
    'uuid4', function ($filter, config, $timeout, toasterService, uuid4) {
      var controllerOption = {}
      var fileTypeSize = {}
      // FineUploader option - you can easily override these option by passing controller specific option
      var options = {
        request: {
          endpoint: config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + config.URL.CONTENT.UPLOAD_MEDIA,
          inputName: 'file',
          customHeaders: {
            Accept: 'application/json',
            'X-Consumer-ID': 'X-Consumer-ID',
            'X-Device-ID': 'X-Device-ID',
            'X-msgid': uuid4.generate(),
            ts: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss:sssZ'),
            'X-Source': 'web',
            'X-Org-code': 'AP'
          }
        },
        failedUploadTextDisplay: {
          mode: 'default',
          responseProperty: 'error'
        },
        fileValidation: {
          itemLimit: 10,
          sizeLimit: config.AnncmntMaxFileSizeToUpload,
          allowedExtensions: config.AnncmntAllowedFileExtension
        }
      }

      /**
     * @method onFileUploadSuccess
     * @desc callback function - will executed onAfterFileUploadSuccess
     * @param   {int}  id  [selected file number]
     * @param   {string}  name  [file name]
     * @param   {object}  responseJSON  [api response]
     * @param   {object}  xhr  [api response]
     */
      var onFileUploadSuccess = function (id, name, responseJSON, xhr) {
        if (responseJSON.responseCode === 'OK') {
          var uploadDetails = {
            'name': name,
            'mimetype': fileTypeSize.type,
            'size': fileTypeSize.size,
            'link': responseJSON.result.url
          }
          controllerOption.uploadSuccess(id, name, uploadDetails)
        }
      }

      /**
     * @method onFileUploadCancel
     * @desc callback function - will executed on after user click on cancel button
     * @param   {int}  id    [file id]
     * @param   {string}  name  [file name]
     */
      var onFileUploadCancel = function (id, name) {
        controllerOption.onCancel(id, name)
      }

      /**
     * @method showErrorMessage
     * @desc function to show error message
     * @param   {string}  message  [message to display]
     */
      var showErrorMessage = function (message) {
        toasterService.error(message)
      }

      return {
      /**
       * @method initializeFineUploader
       * @desc initialize FineUploader third party plugin
       * @memberOf Factory.fineUploader
       * @param {Object}  option - Option object to invoke controller callback function
       * @returns {Callback} Trigger callback function
       */
        createFineUploadInstance: function (ctrlOption, cb) {
          controllerOption = _.merge({}, ctrlOption, options)
          $timeout(function () {
            var objFineUploader = new qq.FineUploader({ // eslint-disable-line
              element: document.getElementById('fine-uploader-manual-trigger'),
              template: 'qq-template-manual-trigger',
              autoUpload: true,
              paramsInBody: true,
              debug: false,
              stopOnFirstInvalidFile: false,
              request: controllerOption.request,
              validation: controllerOption.fileValidation,
              messages: {
                sizeError: '{file} ' + controllerOption.fileSizeErrorText + ' ' +
                controllerOption.fileSizeLimit / (1000 * 1024) + ' MB.',
                tooManyItemsError: 'Too many items ({netItems}) would be uploaded. Item limit is {itemLimit}.'
              },
              failedUploadTextDisplay: controllerOption.failedUploadTextDisplay,
              showMessage: showErrorMessage,
              text: {
                fileInputTitle: 'UPLOAD ATTACHMENT'
              },
              callbacks: {
                onComplete: onFileUploadSuccess,
                onSubmitted: function (id, name) {
                  this.setParams({
                    filename: name,
                    container: controllerOption.containerName
                  })

                  fileTypeSize = { 'type': this.getFile(id).type, 'size': this.getSize(id) }
                },
                onCancel: onFileUploadCancel
              }
            })
            cb(true) // eslint-disable-line
            window.cancelUploadFile = function () {
              document.getElementById('hide-section-with-button').style.display = 'block'
            }
          }, 800)
        },
        onFileUploadSuccess: onFileUploadSuccess,
        onFileUploadCancel: onFileUploadCancel,
        showErrorMessage: showErrorMessage
      }
    }])
