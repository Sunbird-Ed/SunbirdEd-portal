import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse } from '@sunbird/shared';
import { Angular2Csv } from 'angular2-csv';
import { OrgManagementService } from '../../services/org-management/org-management.service';
import { NgForm, FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user-upload.component.html',
  styleUrls: ['./user-upload.component.css']
})
export class UserUploadComponent implements OnInit {
  @ViewChild('inputbtn') inputbtn: ElementRef;
  sampleUserCSV: Array<Object>;
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
* Constructor to create injected service(s) object
*
* Default method of DetailsComponent class
*
* @param {ResourceService} resourceService To call resource service which helps to use language constant
*/
  constructor(orgManagementService: OrgManagementService, formBuilder: FormBuilder, toasterService: ToasterService, private router: Router,
    resourceService: ResourceService) {
    this.resourceService = resourceService;
    this.sbFormBuilder = formBuilder;
    this.orgManagementService = orgManagementService;
    this.toasterService = toasterService;
  }
  /**
 * This method initializes the user form and validates it,
 * also defines a csv format to be downloaded
 */
  ngOnInit() {
    this.uploadUserForm = this.sbFormBuilder.group({
      provider: ['', null],
      externalId: ['', null],
      organisationId: ['', null]
    });
    this.sampleUserCSV = [{
      firstName: 'firstName',
      lastName: 'lastName',
      phone: 'phone',
      email: 'email',
      userName: 'userName',
      password: 'password',
      provider: 'provider',
      phoneVerified: 'phoneVerified',
      emailVerified: 'emailVerified',
      roles: 'roles',
      position: 'position',
      grade: 'grade',
      location: 'location',
      dob: 'dob',
      gender: 'gender',
      language: 'language',
      profileSummary: 'profileSummary',
      subject: 'subject'
    }];
    this.showLoader = false;
  }
  /**
 * This method helps to redirect to the parent component
 * page, i.e, bulk upload page
 */
  public redirect() {
    this.fileName = '';
    this.processId = '';
    this.router.navigate(['bulkUpload']);
  }
  /**
 * This method helps to download a sample csv file
 */
  public downloadSample() {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true
    };
    // tslint:disable-next-line:no-unused-expression
    new Angular2Csv(this.sampleUserCSV, 'Sample_Users', options);
  }
  /**
 * This method helps to call uploadOrg method to upload a csv file
 */
  openImageBrowser(inputbtn) {
    console.log('inside openImageBrowser');
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
  uploadUser(file) {
    const data = this.uploadUserForm.value;
    if (file[0] && file[0].name.match(/.(csv)$/i)) {
      this.showLoader = true;
      const formData = new FormData();
      formData.append('user', file[0]);
      formData.append('provider', data.provider);
      formData.append('externalId', data.externalId);
      formData.append('organisationId', data.organisationId);
      const fd = formData;
      this.fileName = file[0].name;
      this.orgManagementService.bulkUserUpload(fd).subscribe(
        (apiResponse: ServerResponse) => {
          this.showLoader = false;
          this.processId = apiResponse.result.processId;
          this.toasterService.success(this.resourceService.messages.smsg.m0030);
        },
        err => {
          this.showLoader = false;
          this.toasterService.error(err.error.params.errmsg);
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
}
