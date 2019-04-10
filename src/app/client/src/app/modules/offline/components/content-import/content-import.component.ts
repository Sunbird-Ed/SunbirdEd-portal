import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FineUploader, UIOptions } from 'fine-uploader';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import * as _ from 'lodash-es';
import { ConfigService, ToasterService, ResourceService } from '@sunbird/shared';
import { EventEmitter } from 'events';
import {
  IErrorEventData, IStartEventInput, IEndEventInput
} from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';

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

  /**
   * To show warning/error/success message
   */
  public tosterService: ToasterService;
  public resourceService: ResourceService;
  /*
   * Default method of class FileUploadService
   *
   * @param {ConfigService} config Reference of config service
   * @param {ToasterService} tosterService Reference of toster service
   */
  public fileuploadingError: IErrorEventData;

  constructor(
    config: ConfigService,
    tosterService: ToasterService,
    public activatedRoute: ActivatedRoute,

  ) {
    // this.progress = 0;
    this.config = config;
    this.tosterService = tosterService;
  }

  ngOnInit() {
    const options = {
      containerName: 'attachments/announcement',
    };
    this.initilizeFileUploader(options);
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
  getDefaultOption(): any {
    return {
      request: {
        // endpoint: this.config.urlConFig.URLS.LEARNER_PREFIX + this.config.urlConFig.URLS.CONTENT.UPLOAD_MEDIA,ent/v1/import
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
        acceptFiles: ".ecar"
      }
    };
  }

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
      validation: options.fileValidation,
      callbacks: {
        onComplete: (id, name, responseJSON, xhr) => {
          if (responseJSON.responseCode === 'OK') {

          }
        },
        onUpload(id, name) {
        },
        onCancel: (id, name) => {

        }
      },
    };
    this.getWindowObject.cancelUploadFile = () => {
      document.getElementById('hide-section-with-button').style.display = 'block';
    };

    this.uploader = new FineUploader(this.uiOptions);
  }

}
