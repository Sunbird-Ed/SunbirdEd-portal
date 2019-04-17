import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService, ToasterService, ServerResponse, ConfigService, NavigationHelperService } from '@sunbird/shared';
import { OrgManagementService } from '../../services/org-management/org-management.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IInteractEventInput, IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { UserService } from '@sunbird/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from 'lodash-es';
/**
 * This component helps to upload bulk users data (csv file)
 *
 * This component also creates a unique process id on success upload of csv file
 */
@Component({
  selector: 'app-user',
  templateUrl: './user-upload.component.html'
})
export class UserUploadComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('inputbtn') inputbtn: ElementRef;
  @ViewChild('modal') modal;
  /**
* reference for ActivatedRoute
*/
  public activatedRoute: ActivatedRoute;
  /**
* reference of config service.
*/
  public config: ConfigService;
  /**
* contains upload instructions in an array
*/
  userUploadInstructions: Array<any>;
  /**
* To call admin service which helps to upload csv file
*/
  public orgManagementService: OrgManagementService;
  /**
* Contains process id
*/
  processId: string;
  /**
* Used to display filename in html
*/
  fileName: string;
  /**
* Used to show/hide error message
*/
  bulkUploadError: boolean;
  /**
* Contains error message to show in html
*/
  bulkUploadErrorMessage: string;
  /**
* To show/hide loader
*/
  showLoader: boolean;
  /**
   * Upload org form name
   */
  uploadUserForm: FormGroup;
  /**
 * Contains reference of FormBuilder
 */
  sbFormBuilder: FormBuilder;
  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
  /**
 * To show toaster(error, success etc) after any API calls
 */
  private toasterService: ToasterService;
  /**
* Contains redirect url
*/
  redirectUrl: string;
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  userUploadInteractEdata: IInteractEventEdata;
  downloadCSVInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  public unsubscribe$ = new Subject<void>();
  private uploadUserRefLink: string;
  /**
* Constructor to create injected service(s) object
*
* Default method of DetailsComponent class
*
* @param {ResourceService} resourceService To call resource service which helps to use language constant
*/
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    headers: []
  };
  constructor(orgManagementService: OrgManagementService, config: ConfigService,
    formBuilder: FormBuilder, toasterService: ToasterService, private router: Router,
    resourceService: ResourceService, activatedRoute: ActivatedRoute, public userService: UserService,
    public navigationhelperService: NavigationHelperService) {
    this.resourceService = resourceService;
    this.sbFormBuilder = formBuilder;
    this.orgManagementService = orgManagementService;
    this.toasterService = toasterService;
    this.config = config;
    this.activatedRoute = activatedRoute;
    try {
      this.uploadUserRefLink = (<HTMLInputElement>document.getElementById('userUploadRefLink')).value;
    } catch (error) {
      console.log('Error in reading environment variable for user upload reference link');
    }
  }
  /**
 * This method initializes the user form and validates it,
 * also defines array of instructions to be displayed
 */
  ngOnInit() {
    document.body.classList.add('no-scroll'); // This is a workaround  we need to remove it when library add support to remove body scroll
    this.activatedRoute.data.subscribe(data => {
      if (data.redirectUrl) {
        this.redirectUrl = data.redirectUrl;
      } else {
        this.redirectUrl = '/home';
      }
    });
    this.uploadUserForm = this.sbFormBuilder.group({
      provider: ['', null],
      externalId: ['', null],
      organisationId: ['', null]
    });
    this.userUploadInstructions = [
      { instructions: this.resourceService.frmelmnts.instn.t0070 },
      {
        instructions: this.resourceService.frmelmnts.instn.t0071,
        subinstructions: [
          { instructions: this.resourceService.frmelmnts.instn.t0072 },
          { instructions: this.resourceService.frmelmnts.instn.t0073 },
          { instructions: this.resourceService.frmelmnts.instn.t0074 }
        ]
      }];
    this.showLoader = false;
    this.setInteractEventData();
  }
  /**
 * This method helps to redirect to the parent component
 * page, i.e, bulk upload page
 */
  public redirect() {
    this.fileName = '';
    this.processId = '';
    this.router.navigate([this.redirectUrl]);
  }
  /**
  * This method helps to call uploadOrg method to upload a csv file
  */
  openImageBrowser(inputbtn) {
    if ((this.uploadUserForm.value.provider && this.uploadUserForm.value.externalId) || this.uploadUserForm.value.organisationId) {
      this.bulkUploadError = false;
      this.bulkUploadErrorMessage = '';
      inputbtn.click();
    } else {
      this.bulkUploadError = true;
      this.bulkUploadErrorMessage = this.resourceService.messages.emsg.m0003;
    }
  }
  /**
  * This method helps to upload a csv file and return process id
  */
  uploadUsersCSV(file) {
    const data = this.uploadUserForm.value;
    if (file[0] && file[0].name.match(/.(csv)$/i)) {
      this.showLoader = true;
      const formData = new FormData();
      formData.append('user', file[0]);
      formData.append('orgProvider', data.provider);
      formData.append('orgExternalId', data.externalId);
      formData.append('organisationId', data.organisationId);
      const fd = formData;
      this.fileName = file[0].name;
      this.orgManagementService.bulkUserUpload(fd).pipe(
        takeUntil(this.unsubscribe$))
        .subscribe(
          (apiResponse: ServerResponse) => {
            this.showLoader = false;
            this.processId = apiResponse.result.processId;
            this.toasterService.success(this.resourceService.messages.smsg.m0030);
          },
          err => {
            this.showLoader = false;
            const errorMsg = _.get(err, 'error.params.errmsg') ? _.get(err, 'error.params.errmsg').split(/\../).join('.<br/>') :
              this.resourceService.messages.fmsg.m0051;
            this.toasterService.error(errorMsg);
          });
    } else if (file[0] && !(file[0].name.match(/.(csv)$/i))) {
      this.showLoader = false;
      this.toasterService.error(this.resourceService.messages.stmsg.m0080);
    }
  }
  /**
  * This method is used to show error message
  */
  closeBulkUploadError() {
    this.bulkUploadError = false;
    this.bulkUploadErrorMessage = '';
  }
  ngOnDestroy() {
    document.body.classList.remove('no-scroll'); // This is a workaround we need to remove it when library add support to remove body scroll
    this.modal.deny();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  ngAfterViewInit () {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: 'profile-bulk-upload-user-upload',
          subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
          uri: this.router.url,
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
    });
  }
  setInteractEventData() {
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
  }
}
