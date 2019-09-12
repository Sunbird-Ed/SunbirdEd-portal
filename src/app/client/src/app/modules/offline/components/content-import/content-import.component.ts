import { OfflineFileUploaderService } from '../../services';
import { Component, OnInit, AfterViewInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FineUploader, UIOptions } from 'fine-uploader';
import * as _ from 'lodash-es';
import { ConfigService, ToasterService, ResourceService } from '@sunbird/shared';
import {
  IErrorEventData, IStartEventInput, IEndEventInput
} from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import { IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';


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
   * Array which have all the upladed image object
   */

  progress: any;

  processingFiles: Boolean = false;
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
  selectContentFilesEdata: IInteractEventEdata;
  ImportContentModalClose: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;

  constructor(
    public config: ConfigService,
    public tosterService: ToasterService,
    public resourceService: ResourceService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public offlineFileUploaderService: OfflineFileUploaderService) {
  }

  ngOnInit() {
    const options = {
      containerName: 'attachments/announcement',
    };
    this.offlineFileUploaderService.initilizeFileUploader(options);
    this.openFileBrowser();
    this.setInteractData();
  }

  setInteractData() {
    this.telemetryInteractObject = {
      id: '',
      type: 'watch-video',
      ver: '1.0'
    };
    this.selectContentFilesEdata = {
      id: 'select-content-files-button',
      type: 'click',
      pageid: 'library'
    };
    this.ImportContentModalClose = {
      id: 'import-modal-close',
      type: 'click',
      pageid: 'library'
    };
  }

  ngAfterViewInit() {
    this.removeFirstChild();
  }
  get getWindowObject(): any {
    return window;
  }

  openFileBrowser() {
    $('#selectFile > input[type=file]').trigger('click');
  }

  removeFirstChild() {
    const dropArea = document.getElementsByClassName('qq-uploader-selector');
    dropArea[1].remove();
    const list = document.getElementById('file-uploading-list');
    list.removeChild(list.childNodes[0]);
  }

  modalClose() {
    const progressUploads = document.getElementsByClassName('qq-in-progress');
    if (progressUploads.length) {
      const isProgress = confirm(this.resourceService.frmelmnts.lbl.contentsUploaded);
      if (isProgress) {
        this.modal.deny();
        this.router.navigateByUrl('/');
        // this.offlineFileUploaderService.uploader.cancelAll();
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
