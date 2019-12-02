import { Component, ViewChild, ElementRef } from '@angular/core';
import { ResourceService, ToasterService, ServerResponse, ConfigService } from '@sunbird/shared';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ManageService } from '../../services/manage/manage.service';
import { UserService } from '../../../core/services/user/user.service';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { Subject } from 'rxjs';
import * as _ from 'lodash-es';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-user-upload',
    templateUrl: 'user-upload.component.html',
    styleUrls: ['user-upload.component.scss']
})
export class UserUploadComponent {

  @ViewChild('inputbtn') inputbtn: ElementRef;
  @ViewChild('modal') modal;
  /**
  *Element Ref  for copyLinkButton;
  */
  @ViewChild('copyErrorData') copyErrorButton: ElementRef;
  /**
  * reference of config service.
  */
  public config: ConfigService;
  /**
   * To show / hide modal
   */
  public modalName = 'upload';
  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
  public file: any;
  public activateUpload = false;
  /**
  * Contains process id
  */
  public  processId: string;
  /**
  * Used to display filename in html
  */
  public fileName: string;
  /**
  * contains upload instructions in an array
  */
  public userUploadInstructions: Array<any>;
  /**
  * To show/hide loader
  */
  public showLoader: boolean;
  /**
	 * telemetryImpression
	*/
  public telemetryImpression: IImpressionEventInput;
  public userUploadInteractEdata: IInteractEventEdata;
  public userErrorInteractEdata: IInteractEventEdata;
  public downloadCSVInteractEdata: IInteractEventEdata;
  public telemetryInteractObject: IInteractEventObject;
  public unsubscribe$ = new Subject<void>();
  private uploadUserRefLink: string;
  /**
  * To call admin service which helps to upload csv file
  */
  public manageService: ManageService;
  /**
  * error object
  */
  public errors: [];
  /**
  * error object
  */
  public error: '';
  /**
  * Used to show/hide error message
  */
  public bulkUploadError: boolean;
  /**
  * Contains error message to show in html
  */
  public bulkUploadErrorMessage: string;
  /**
   * Upload org form name
   */
  public uploadUserForm: FormGroup;
  /**
  * Contains reference of FormBuilder
  */
  public sbFormBuilder: FormBuilder;
  /**
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;
  /**
  * Constructor to create injected service(s) object
  *
  * Default method of DetailsComponent class
  *
  * @param {ResourceService} resourceService To call resource service which helps to use language constant
  */
  public csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    headers: []
  };

  constructor(resourceService: ResourceService, config: ConfigService, toasterService: ToasterService,
    formBuilder: FormBuilder, manageService: ManageService, public userService: UserService) {
    this.resourceService = resourceService;
    this.sbFormBuilder = formBuilder;
    this.toasterService = toasterService;
    this.config = config;
    this.manageService = manageService;
    try {
      this.uploadUserRefLink = (<HTMLInputElement>document.getElementById('userUploadRefLink')).value;
    } catch (error) {
      console.log('Error in reading environment variable for user upload reference link');
    }
  }

  ngOnInit() {
    document.body.classList.add('no-scroll'); // This is a workaround  we need to remove it when library add support to remove body scroll
    this.uploadUserForm = this.sbFormBuilder.group({
      provider: ['', null],
      externalId: ['', null],
      organisationId: ['', null]
    });
    this.userUploadInstructions = [
      { instructions: this.resourceService.frmelmnts.instn.t0099 },
      { instructions: this.resourceService.frmelmnts.instn.t0100 },
      // { instructions: this.resourceService.frmelmnts.instn.t0101 },
      { instructions: this.resourceService.frmelmnts.instn.t0102 },
      { instructions: this.resourceService.frmelmnts.instn.t0103 },
      { instructions: this.resourceService.frmelmnts.instn.t0104 },
      // { instructions: this.resourceService.frmelmnts.instn.t0105 }
      ];
    this.showLoader = false;
    this.setInteractEventData();
  }

  public fileChanged(event) {
    this.file = event.target.files[0];
    this.activateUpload = true;
  }

  /**
  * This method helps to upload a csv file and return process id
  */
  public uploadUsersCSV() {
    const file = this.file;
    const data = this.uploadUserForm.value;
    if (file && file.name.match(/.(csv)$/i)) {
      this.showLoader = true;
      const formData = new FormData();
      formData.append('user', file);
      const fd = formData;
      this.fileName = file.name;
      this.manageService.bulkUserUpload(fd).pipe(
        takeUntil(this.unsubscribe$))
        .subscribe(
          (apiResponse: ServerResponse) => {
            this.showLoader = false;
            this.processId = apiResponse.result.processId;
            this.toasterService.success(this.resourceService.messages.smsg.m0030);
            this.modal.deny();
          },
          err => {
            this.showLoader = false;
            const errorMsg = _.get(err, 'error.params.errmsg') ? _.get(err, 'error.params.errmsg').split(/\../).join('.<br/>') :
            this.resourceService.messages.fmsg.m0051;
            this.error = errorMsg.replace('[', '').replace(']', '').replace(/\,/g, ',\n');
            this.errors = errorMsg.replace('[', '').replace(']', '').split(',');
            this.modalName = 'error';
          });
    } else if (file && !(file.name.match(/.(csv)$/i))) {
      this.showLoader = false;
      this.toasterService.error(this.resourceService.messages.stmsg.m0080);
    }
  }

  /**
  * This method helps to call uploadOrg method to upload a csv file
  */
  public openImageBrowser(inputbtn: any) {
    this.bulkUploadError = false;
    this.bulkUploadErrorMessage = '';
    inputbtn.click();
  }

  public redirect() {
    this.fileName = '';
    this.processId = '';
    document.body.classList.remove('no-scroll'); // This is a workaround we need to remove it when library add support to remove body scroll
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public setInteractEventData() {
    this.userUploadInteractEdata = {
      id: 'upload-user',
      type: 'click',
      pageid: 'profile-read'
    };
    this.downloadCSVInteractEdata = {
      id: 'download-sample-user-csv',
      type: 'click',
      pageid: 'profile-read'
    };
    this.telemetryInteractObject = {
      id: this.userService.userid,
      type: 'User',
      ver: '1.0'
    };
    this.userErrorInteractEdata = {
      id: 'error-upload-user',
      type: 'click',
      pageid: 'profile-read'
    };
  }

  /**
  * This method is used to show error message
  */
  public closeBulkUploadError() {
    this.bulkUploadError = false;
    this.bulkUploadErrorMessage = '';
  }

  public copyToClipboard() {
    const element = (<HTMLInputElement>document.getElementById('errorTextArea'));
    element.value = '';
    element.value = this.error;
    element.select();
    document.execCommand('copy');
  }

}
