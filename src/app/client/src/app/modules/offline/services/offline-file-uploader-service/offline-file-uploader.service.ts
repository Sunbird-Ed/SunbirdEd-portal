import { Injectable } from '@angular/core';
import { FineUploader, UIOptions } from 'fine-uploader';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import { Output, EventEmitter } from '@angular/core';
import { ToasterService, ResourceService } from '@sunbird/shared';
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
    public tosterService: ToasterService, public resourceService: ResourceService
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
      maxConnections: 1,
      validation: {
        acceptFiles: ['.ecar'],
      },
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
          if (successFullyUploaded.length && uploadingFailed.length) {
            const successMessage = _.replace(this.resourceService.messages.smsg.m0054,
              '{UploadedContentLength}', successFullyUploaded.length);
            const failureMessage = _.replace(this.resourceService.messages.fmsg.m0093,
              '{FailedContentLength}', uploadingFailed.length);
            this.tosterService.warning(`${successMessage}, ${failureMessage}`);
          } else if (uploadingFailed.length) {
            this.tosterService.error(_.replace(this.resourceService.messages.fmsg.m0093,
              '{FailedContentLength}', uploadingFailed.length));
          } else if (successFullyUploaded.length) {
            this.tosterService.success(_.replace(this.resourceService.messages.smsg.m0054,
              '{UploadedContentLength}', successFullyUploaded.length));
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
