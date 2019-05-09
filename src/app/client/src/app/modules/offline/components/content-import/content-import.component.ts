import { OfflineFileUploaderService } from '../../services';
import { Component, OnInit, AfterViewInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FineUploader, UIOptions } from 'fine-uploader';
import * as _ from 'lodash-es';
import { ConfigService, ToasterService, ResourceService } from '@sunbird/shared';
import {
  IErrorEventData, IStartEventInput, IEndEventInput
} from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-content-import',
  templateUrl: './content-import.component.html',
  styleUrls: ['./content-import.component.scss']
})
export class ContentImportComponent implements OnInit, AfterViewInit {


  qq: any;
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

  progress: any;

  processingFiles: Boolean = false;

  /**
   * To show warning/error/success message
   */
  public tosterService: ToasterService;
  // public resourceService: ResourceService;
  /*
   * Default method of class FileUploadService
   *
   * @param {ConfigService} config Reference of config service
   * @param {ToasterService} tosterService Reference of toster service
   */
  public fileuploadingError: IErrorEventData;

  @ViewChild('modal') modal;
  @Output() closeImportModal = new EventEmitter<any>();
  isUpload: EventEmitter<any> = new EventEmitter();

  constructor(
    config: ConfigService,
    tosterService: ToasterService,
    public resourceService: ResourceService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public offlineFileUploaderService: OfflineFileUploaderService

  ) {
    // this.progress = 0;
    this.config = config;
    this.tosterService = tosterService;
  }

  ngOnInit() {
    const options = {
      containerName: 'attachments/announcement',
    };
    this.offlineFileUploaderService.initilizeFileUploader(options);
  }

  ngAfterViewInit() {
    this.removeFirstChild();
  }


  get getWindowObject(): any {
    return window;
  }

  /**
   * Default file upload configuration. It can be easily override by passing component specific config.
   *
   * Default config contains http params - url and headers and allowed file extension(s) and size
   */
  // getDefaultOption(): any {
  //   return {
  //     request: {
  //       // endpoint: this.config.urlConFig.URLS.LEARNER_PREFIX + this.config.urlConFig.URLS.CONTENT.UPLOAD_MEDIA,ent/v1/import
  //       endpoint: 'api/content/v1/import',
  //       folders: true,
  //       inputName: 'file',
  //       customHeaders: {
  //         'Accept': 'application/json',
  //         'X-msgid': UUID.UUID(),
  //         'ts': moment().format(),
  //       }
  //     },
  //     failedUploadTextDisplay: {
  //       mode: 'default',
  //       responseProperty: 'error'
  //     },
  //     fileValidation: {
  //       itemLimit: 100,
  //       allowedExtensions: ['ecar'],
  //       stopOnFirstInvalidFile: false,
  //     }
  //   };
  // }

  removeFirstChild() {
    const dropArea = document.getElementsByClassName('qq-uploader-selector');
    dropArea[1].remove();

    const list = document.getElementById('file-uploading-list');
    list.removeChild(list.childNodes[0]);
  }

  /**
   * Function to initilize file uploader with default config - upload api http param,
   * file validation(type, size) and validation error message
   *
   * @param {object} componentConfig contains component specific config to override default one
   */
  // initilizeFileUploader(componentConfig: object) {
  //   const self = this;
  //   // Merge component and default option(s)
  //   const options = _.merge({}, this.getDefaultOption(), componentConfig);
  //   this.uiOptions = {
  //     element: document.getElementById('qq-template-manual-trigger'),
  //     template: 'qq-template-manual-trigger',
  //     autoUpload: true,
  //     request: options.request,
  //     warnBeforeUnload: true,
  //     callbacks: {
  //       onComplete: (id, name, responseJSON, xhr) => {
  //         if (responseJSON.responseCode === 'OK') {

  //         }
  //       },
  //       onProgress: () => {
  //         this.processingFiles = true;
  //       },
  //       onCancel: () => {
  //         this.processingFiles = false;

  //       },
  //       onAllComplete: (id, name) => {
  //         this.processingFiles = false;
  //         const uploadingFailed = document.getElementsByClassName('qq-upload-fail');
  //         const totalFiles = document.getElementsByClassName('qq-upload-list-selector');
  //         const successFullyUploaded = document.getElementsByClassName('qq-upload-success');
  //         if (uploadingFailed.length) {
  //           this.tosterService.error(
  //             `Content Import Failed: ${uploadingFailed.length} `
  //           );
  //         } else if (successFullyUploaded.length && uploadingFailed.length) {
  //           this.tosterService.warning(
  //             `Content Imported successfully
  //             : ${successFullyUploaded.length} , Content Import Failed: ${uploadingFailed.length}`
  //           );
  //         } else if (successFullyUploaded.length) {
  //           this.tosterService.success(
  //             `Content Imported Scuessfully : ${successFullyUploaded.length}`
  //           );
  //           this.isUpload.emit('true');
  //         }
  //       },
  //     },
  //   };
  //   this.getWindowObject.cancelUploadFile = () => {
  //     document.getElementById('hide-section-with-button').style.display = 'block';
  //   };

  //   this.uploader = new FineUploader(this.uiOptions);
  // }

  modalClose() {
    const progressUploads = document.getElementsByClassName('qq-in-progress');
    if (progressUploads.length) {
      const isProgress = confirm('Contents are being uploaded');
      if (isProgress) {
        this.modal.deny();
        this.router.navigateByUrl('/');
        return false;
      }
      return false;
    }
    this.modal.deny();
    this.router.navigateByUrl('/');

  }
  closeModal() {
    this.closeImportModal.emit('success');
  }
}
