import { Injectable, EventEmitter } from '@angular/core';
import { ConfigService } from './../config/config.service';
import { FineUploader, UIOptions } from 'fine-uploader';
import { ToasterService } from './../toaster/toaster.service';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import * as _ from 'lodash';

@Injectable()
/**
 * @class FileUploadService
 */
export class FileUploadService {
  /**
   * To listen event after adding/removing files
   */
  uploadEvent = new EventEmitter();
  /**
   * File uploader
   */
  uploader: FineUploader;
  /**
   * File uploader ui option
   */
  uiOptions: UIOptions;

  /**
   * To get file upload api url
   */
  config: ConfigService;

  /**
   * Array which have all the upladed image object
   */
  attachedFiles = [];

  /**
   * To show warning/error/success message
   */
  public tosterService: ToasterService;

  /**
   * Default method of class FileUploadService
   *
   * @param {ConfigService} config Reference of config service
   * @param {ToasterService} tosterService Reference of toster service
   */
  constructor(config: ConfigService, tosterService: ToasterService) {
    this.config = config;
    this.tosterService = tosterService;
    this.attachedFiles = [];
  }

  /**
   * Return the global native browser window object
   */
  get getWindowObject(): any {
    return window;
  }

  /**
   * Default file upload configuration. It can be easily override by passing component specific config.
   *
   * Default config contains http params - url and headers and allowed file extension(s) and size
   */
  getDefaultOption(): any {
    return {
      request: {
        endpoint: this.config.urlConFig.URLS.LEARNER_PREFIX + this.config.urlConFig.URLS.CONTENT.UPLOAD_MEDIA,
        inputName: 'file',
        customHeaders: {
          'Accept': 'application/json',
          'X-Consumer-ID': 'X-Consumer-ID',
          'X-Device-ID': 'X-Device-ID',
          'X-msgid': UUID.UUID(),
          'ts': moment().format(),
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
        sizeLimit: this.config.appConfig.ANNOUNCEMENT.FILEUPLOAD.MAXFILESIZETOUPLOAD,
        allowedExtensions: this.config.appConfig.ANNOUNCEMENT.FILEUPLOAD.ALLOWEDFILEEXTENSION,
        stopOnFirstInvalidFile: false
      },
      containerName: 'attachments/announcement'
    };
  }

  /**
   * Function to initilize file uploader with default config - upload api http param,
   * file validation(type, size) and validation error message
   *
   * @param {object} componentConfig contains component specific config to override default one
   */
  initilizeFileUploader(componentConfig: object) {
    this.attachedFiles = [];
    // To hold uploaded file details
    const self = this;
    const fileDetails = { 'name': '', 'mimetype': '', 'size': '', 'link': '' };
    // Merge component and default option(s)
    const options = _.merge({}, this.getDefaultOption(), componentConfig);
    this.uiOptions = {
      element: document.getElementById('fine-uploader-manual-trigger'),
      template: 'qq-template-manual-trigger',
      autoUpload: true,
      request: options.request,
      validation: options.fileValidation,
      messages: {
        sizeError: '{file} ' + options.fileSizeErrorText + ' ' +
          options.fileValidation.sizeLimit / (1000 * 1024) + ' MB.',
        tooManyItemsError: 'Too many items ({netItems}) would be uploaded. Item limit is {itemLimit}.'
      },
      failedUploadTextDisplay: options.failedUploadTextDisplay,
      showMessage: this.showErrorMessage,
      text: { fileInputTitle: 'UPLOAD ATTACHMENT' },
      callbacks: {
        onComplete: function (id, name, responseJSON, xhr) {
          if (responseJSON.responseCode === 'OK') {
            fileDetails.link = responseJSON.result.url;
            fileDetails.name = name;
            fileDetails.mimetype = this.getFile(id).type;
            fileDetails.size = self.formatFileSize(this.getSize(id));
            self.attachedFiles.push({ ...fileDetails });
            self.uploadEvent.emit('uploaded');
          }
        },
        onSubmitted: function (id, name) {
          this.setParams({ 'filename': name, 'container': 'attachments/announcement' });
        },
        onCancel: (id, name) => {
          _.forEach(self.attachedFiles, (value, key) => {
            if ( value && value.name === name) {
              self.attachedFiles.splice(key, 1);
              self.uploadEvent.emit('removed');
            }
          });
        }
      },
    };
    this.getWindowObject.cancelUploadFile = () => {
      document.getElementById('hide-section-with-button').style.display = 'block';
    };

    this.uploader = new FineUploader(this.uiOptions);
  }

  /**
   * Convert bytes into largest possible unit. Takes an precision argument that defaults to 2.
   *
   * Usage: bytes | fileSize:precision
   * Example: {{ 1024 |  fileSize }} formats to: 1 KB
   */
  formatFileSize(bytes: number = 0, precision: number = 2): string {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) {
      return 'N/A';
    }

    let counter = 0;
    while (bytes >= 1024) {
      bytes /= 1024;
      counter++;
    }

    return bytes.toFixed(+ precision) + ' ' + units[counter];
  }

  /**
   * Callback function gets executed when fine uploader throws any validation error message
   *
   * @param {string} message error message text
   */
  showErrorMessage = (message: string): void => {
    this.tosterService.warning(message);
  }
}
