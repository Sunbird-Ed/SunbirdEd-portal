import { Component, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { FileUploadService } from './../../services';

/**
 * This component helps to render file uploader html
 */
@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html'
})
export class FileUploaderComponent implements OnInit {

  /**
   * Contains file uplaod service reference
   */
  public fileUploadService: FileUploadService;

  /**
   * Contains resource service reference
   */
  public resourceService: ResourceService;

  /**
   * Default method of class FileUploaderComponent
   *
   * @param {FileUploadService} fileUpload To upload file
   * @param {ResourceService} resource To get language constant
   */
  constructor(fileUploadService: FileUploadService, resourceService: ResourceService) {
    this.fileUploadService = fileUploadService;
    this.resourceService = resourceService;
  }

  /**
   * Initialize file upload plugin
   */
  ngOnInit() {
    const options = {
      containerName: 'attachments/announcement',
      fileSizeErrorText: this.resourceService.messages.emsg.m0007
    };
    this.fileUploadService.initilizeFileUploader(options);
  }

}
