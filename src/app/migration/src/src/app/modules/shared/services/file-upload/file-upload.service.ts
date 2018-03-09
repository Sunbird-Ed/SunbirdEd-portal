import { Injectable } from '@angular/core';
import { ConfigService } from './../config/config.service';
import { FineUploader, UIOptions } from 'fine-uploader';
import { ToasterService } from './../toaster/toaster.service';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import * as _ from 'lodash';

@Injectable()
export class FileUploadService {

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
  }

  /**
   * Default file upload configuration. It can be easily override by passing component specific config.
   *
   * Default config contains http params - url and headers and allowed file extension(s) and size
   */
  getDefaultOption(): object {
    return {
      request: {
        endpoint: this.config.urlConFig.URLS.LEARNER_PREFIX + this.config.urlConFig.URLS.CONTENT.UPLOAD_MEDIA,
        inputName: 'file',
        customHeaders: {
          Accept: 'application/json',
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
        sizeLimit: this.config.pageConfig.ANNOUNCEMENT.MAXFILESIZETOUPLOAD,
        allowedExtensions: this.config.pageConfig.ANNOUNCEMENT.ALLOWEDFILEEXTENSION
      },
      containerName: 'attachments/announcement'
    };
  }

  /**
   * Initilize fineuploader plugin
   */
  initilizeFileUploader(componentOption: object) {
    const fileDetails = { 'name': '', 'mimetype': '', 'size': '', 'link': '' };
    const options = _.merge({}, this.getDefaultOption(), componentOption);
    this.uiOptions = {
      element: document.getElementById('fine-uploader-manual-trigger1'),
      template: 'qq-template-manual-trigger',
      autoUpload: true,
      debug: true,
      // stopOnFirstInvalidFile: false,
      request: options.request,
      validation: options.fileValidation,
      messages: {
        sizeError: '{file} ' + options.fileSizeErrorText + ' ' +
          options.sizeLimit / (1000 * 1024) + ' MB.',
        tooManyItemsError: 'Too many items ({netItems}) would be uploaded. Item limit is {itemLimit}.'
      },
      failedUploadTextDisplay: options.failedUploadTextDisplay,
      showMessage: this.showErrorMessage,
      text: { fileInputTitle: 'UPLOAD ATTACHMENT' },
      callbacks: {
        onComplete: (id, name, responseJSON, xhr) => {
          if (responseJSON.responseCode === 'OK') {
            fileDetails.link = responseJSON.result.url;
            fileDetails.size = this.formatFileSize(+fileDetails.size);
            options.uploadSuccess(fileDetails);
          }
        },
        onSubmitted: function (id, name) {
          this.setParams({ 'filename': name, 'container': 'attachments/announcement' });
          fileDetails.name = name;
          fileDetails.mimetype = this.getFile(id).type;
          fileDetails.size = this.getSize(id);
        },
        onCancel: options.onCancel
      },
    };
    setTimeout(() => {
      this.uploader = new FineUploader(this.uiOptions);
    }, 100);
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
      return '?';
    }

    let counter = 0;
    while (bytes >= 1024) {
      bytes /= 1024;
      counter++;
    }

    return bytes.toFixed(+ precision) + ' ' + units[counter];
  }

  /**
   * To show validation error message(s)
   */
  showErrorMessage = (message: string): void => {
    this.tosterService.warning(message);
  }
}
