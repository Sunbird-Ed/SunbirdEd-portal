import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { ResourceService, ToasterService, ServerResponse, ConfigService, NavigationHelperService } from '@sunbird/shared';
import { OrgManagementService } from '../../../org-management/services/org-management/org-management.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IInteractEventInput, IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { UserService, OrgDetailsService } from '@sunbird/core';
import { takeUntil, first, tap, mergeMap } from 'rxjs/operators';
import { Subject, forkJoin, combineLatest } from 'rxjs';
import * as _ from 'lodash-es';
import { CbseProgramService } from '../../services/cbse-program/cbse-program.service';
import { CbseComponent } from '../cbse/cbse.component';
/**
 * This component helps to upload bulk users data (csv file)
 *
 * This component also creates a unique process id on success upload of csv file
 */
@Component({
  moduleId: module.id,
  selector: 'csv-upload',
  templateUrl: 'csv-upload.component.html',
  styleUrls: ['csv-upload.component.scss']
})
export class CsvUploadComponent implements OnInit {
  @ViewChild('inputbtn') inputbtn: ElementRef;
  @ViewChild('modal') modal;
  @Input() certType: string;
  /**
  *Element Ref  for copyLinkButton;
  */
  @ViewChild('copyErrorData') copyErrorButton: ElementRef;
  public userId: any;
  public rootOrgId: any;
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
  public cbseProgramService: CbseProgramService;
  public userService: UserService;
  public cbseComponent: CbseComponent;
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
  * To show / hide modal
  */
  modalName = 'upload';
  /**
   * Upload org form name
   */
  uploadUserForm: FormGroup;
  /**
 * Contains reference of FormBuilder
 */
  sbFormBuilder: FormBuilder;
  /**
* error object
*/
  errors: [];
  /**
 * error object
 */
  error: '';
  file: any;
  activateUpload = false;
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
  private certKeys: any;
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
  constructor(cbseComponent: CbseComponent, cbseProgramService: CbseProgramService, orgManagementService: OrgManagementService, config: ConfigService,
    formBuilder: FormBuilder, toasterService: ToasterService,
    resourceService: ResourceService, userService: UserService,
    public navigationhelperService: NavigationHelperService, private orgDetailsService: OrgDetailsService) {
    this.cbseComponent = cbseComponent;
    this.resourceService = resourceService;
    this.sbFormBuilder = formBuilder;
    this.orgManagementService = orgManagementService;
    this.cbseProgramService = cbseProgramService;
    this.userService = userService;
    this.toasterService = toasterService;
    this.config = config;
  }
  /**
 * This method initializes the user form and validates it,
 * also defines array of instructions to be displayed
 */
  ngOnInit() {
    this.userService.userData$.pipe(
      tap(user => {
        if (user && user.userProfile) {
          this.userId = user.userProfile.userId;
          this.rootOrgId = user.userProfile.rootOrgId;
        }
      }),
      mergeMap(userData => {
        return this.orgDetailsService.getOrgDetails(_.get(userData, 'rootOrg.slug')).pipe(
          tap(orgDetails => {
            if (orgDetails){
              this.certKeys = _.get(orgDetails, 'keys.signKeys[0]');
            }
          })
        );
      })
    ).subscribe()
    console.log(this.certType);
    console.log(this.userId);
    console.log(this.rootOrgId);
    this.uploadUserForm = this.sbFormBuilder.group({
      provider: ['', null],
      externalId: ['', null],
      organisationId: ['', null]
    });
    this.userUploadInstructions = [
      { instructions: 'Enter the school name or the student name (depending on the certificate type) in the "Name" column' },
      { instructions: 'Enter School External ID. This is the unique ID provided by the state.' },
      { instructions: 'Enter only one name and ID per row' },
      { instructions: 'Maximum records per file is 200' },
      { instructions: 'Save the file as .csv ' },
    ];
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
  }
  /**
  * This method helps to call uploadOrg method to upload a csv file
  */
  openImageBrowser(inputbtn) {
    this.bulkUploadError = false;
    this.bulkUploadErrorMessage = '';
    inputbtn.click();
  }
  fileChanged(event) {
    this.file = event.target.files[0];
    this.activateUpload = true;
  }
  /**
  * This method helps to upload a csv file and return process id
  */
  uploadUsersCSV() {
    const file = this.file;
    const data = this.uploadUserForm.value;
    if (file && file.name.match(/.(csv)$/i)) {
      this.showLoader = true;
      this.cbseProgramService.postCertData(file, this.certType, this.userId, this.rootOrgId, this.certKeys)
        .subscribe(
          data => {
            console.log(data);
            this.showLoader = false;
            this.toasterService.success('File uploaded successfully');
            this.modal.deny();
            this.cbseComponent.selectedOption = '';
          },
          err => {
            console.log(err);
            this.showLoader = false;
            const errorMsg = _.get(err, 'error.params.errmsg') ? _.get(err, 'error.params.errmsg').split(/\../).join('.<br/>') : this.resourceService.messages.fmsg.m0051;
            this.error = errorMsg.replace('[', '').replace(']', '').replace(/\,/g, ',\n');
            this.errors = errorMsg.replace('[', '').replace(']', '').split(',');
            this.modalName = 'error';
            this.cbseComponent.selectedOption = '';
          },
          () => {
            console.log('Finally...');
          }
        );
    } else if (file && !(file.name.match(/.(csv)$/i))) {
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
  copyToClipboard() {
    const element = (<HTMLInputElement>document.getElementById('errorTextArea'));
    element.value = '';
    element.value = this.error;
    element.select();
    document.execCommand('copy');
  }
  ngOnDestroy() {
    document.body.classList.remove('no-scroll'); // This is a workaround we need to remove it when library add support to remove body scroll
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
