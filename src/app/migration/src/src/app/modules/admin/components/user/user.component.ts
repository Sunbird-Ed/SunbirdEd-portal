import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse } from '@sunbird/shared';
import { Angular2Csv } from 'angular2-csv';
import { AdminService } from '@sunbird/core';
import { NgForm, FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild('inputbtn') inputbtn: ElementRef;
  sampleUserCSV: Array<Object>;
  /**
* To call admin service which helps to upload csv file
*/
  public adminService: AdminService;
  processId: string;
  fileName: string;
  bulkUploadError: boolean;
  bulkUploadErrorMessage: string;
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
  constructor(adminService: AdminService, formBuilder: FormBuilder, toasterService: ToasterService, private router: Router,
    resourceService: ResourceService) {
    this.resourceService = resourceService;
    this.sbFormBuilder = formBuilder;
    this.adminService = adminService;
    this.toasterService = toasterService;
  }

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
  public redirect() {
    this.fileName = '';
    this.processId = '';
    this.router.navigate(['admin/bulkUpload']);
  }
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
  openImageBrowser(inputbtn) {
    console.log('inside openImageBrowser');
    if ((this.uploadUserForm.value.provider && this.uploadUserForm.value.externalId) || this.uploadUserForm.value.organisationId) {
      this.bulkUploadError = false;
      this.bulkUploadErrorMessage = '';
      inputbtn.click();
    } else {
      this.bulkUploadError = true;
      this.bulkUploadErrorMessage = this.resourceService.messages.emsg.m0003;
      // inputbtn.click();
    }
  }
  uploadUser(file) {
    // this.openImageBrowser();
    console.log('inside upload');
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
      this.adminService.bulkUserUpload(fd).subscribe(
        (apiResponse: ServerResponse) => {
          this.showLoader = false;
          this.processId = apiResponse.result.processId;
          this.toasterService.success(this.resourceService.messages.smsg.m0030);
        },
        err => {
          this.showLoader = false;
          this.toasterService.error(err.error.params.errmsg);
        });
    } else {
      this.showLoader = false;
      this.toasterService.error(this.resourceService.messages.fmsg.m0051);
    }
  }
  closeBulkUploadError() {
    this.bulkUploadError = false;
    this.bulkUploadErrorMessage = '';
  }
}
