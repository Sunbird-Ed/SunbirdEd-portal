import { Injectable } from '@angular/core';
import { FineUploader, UIOptions } from 'fine-uploader';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import { Output, EventEmitter } from '@angular/core';
import { ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class OfflineFileUploaderService {
  processingFiles: Boolean = false;
  /**
   * File uploader ui option
   */
  uiOptions: UIOptions;
  uploader: FineUploader;

  @Output() closeImportModal = new EventEmitter<any>();
  isUpload: EventEmitter<any> = new EventEmitter();


  constructor(
    public tosterService: ToasterService
  ) { }
  get getWindowObject(): any {
    return window;
  }

  getDefaultOption(): any {
    return {
      request: {
        endpoint: 'api/content/v1/import',
        folders: true,
        inputName: 'file',
        customHeaders: {
          'Accept': 'application/json',
          'X-msgid': UUID.UUID(),
          'ts': moment().format(),
        }
      },
      failedUploadTextDisplay: {
        mode: 'default',
        responseProperty: 'error'
      },
      fileValidation: {
        itemLimit: 100,
        allowedExtensions: ['ecar'],
        stopOnFirstInvalidFile: false,
      }
    };
  }

  /**
   * Function to initilize file uploader with default config - upload api http param,
   * file validation(type, size) and validation error message
   *
   * @param {object} componentConfig contains component specific config to override default one
   */
  initilizeFileUploader(componentConfig: object) {
    const self = this;
    // Merge component and default option(s)
    const options = _.merge({}, this.getDefaultOption(), componentConfig);
    this.uiOptions = {
      element: document.getElementById('qq-template-manual-trigger'),
      template: 'qq-template-manual-trigger',
      autoUpload: true,
      request: options.request,
      warnBeforeUnload: true,
      callbacks: {
        onProgress: () => {
          this.processingFiles = true;
        },
        onCancel: () => {
          this.processingFiles = false;

        },
        onAllComplete: (id, name) => {
          this.processingFiles = false;
          const uploadingFailed = document.getElementsByClassName('qq-upload-fail');
          const totalFiles = document.getElementsByClassName('qq-upload-list-selector');
          const successFullyUploaded = document.getElementsByClassName('qq-upload-success');
          if (uploadingFailed.length) {
            this.tosterService.error(
              `Content Import Failed: ${uploadingFailed.length} `
            );
          } else if (successFullyUploaded.length && uploadingFailed.length) {
            this.tosterService.warning(
              `Content Imported successfully
              : ${successFullyUploaded.length} , Content Import Failed: ${uploadingFailed.length}`
            );
          } else if (successFullyUploaded.length) {
            this.tosterService.success(
              `Content Imported Scuessfully : ${successFullyUploaded.length}`
            );
            this.isUpload.emit('true');
          }
        },
      },
    };
    this.getWindowObject.cancelUploadFile = () => {
      document.getElementById('hide-section-with-button').style.display = 'block';
    };

    this.uploader = new FineUploader(this.uiOptions);
  }
}
