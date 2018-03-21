import { Component, OnInit } from '@angular/core';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse } from '@sunbird/shared';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgForm, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AdminService } from '@sunbird/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  success: Array<any>;
  failure: Array<any>;
  processId: string;
  objectType: string;
  uploadStatus: string;
  /**
* To show toaster(error, success etc) after any API calls
*/
  private toasterService: ToasterService;
  /**
* To call admin service which helps to upload csv file
*/
  public adminService: AdminService;
  showLoader = false;
  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
  /**
 * status check form name
 */
  statusForm: FormGroup;
  /**
* Contains reference of FormBuilder
*/
  sbFormBuilder: FormBuilder;
  /**
* Constructor to create injected service(s) object
*
* Default method of DetailsComponent class
*
* @param {ResourceService} resourceService To call resource service which helps to use language constant
*/
  constructor(adminService: AdminService, private router: Router, formBuilder: FormBuilder, toasterService: ToasterService, resourceService: ResourceService) {
    this.resourceService = resourceService;
    this.sbFormBuilder = formBuilder;
    this.adminService = adminService;
    this.toasterService = toasterService;
  }

  ngOnInit() {
    this.statusForm = this.sbFormBuilder.group({
      processId: ['', null]
    });
  }
  public redirect() {
    this.processId = '';
    this.router.navigate(['admin/bulkUpload']);
  }
  getBulkUploadStatus(processId) {
    console.log('processId', this.statusForm.value.processId);
    this.showLoader = true;
    this.adminService.bulkUploadStatus(this.statusForm.value.processId).subscribe(
      (apiResponse: ServerResponse) => {
        this.showLoader = false;
        this.success = apiResponse.result.response[0].successResult;
        this.failure = apiResponse.result.response[0].failureResult;
        this.processId = apiResponse.result.response[0].processId;
        this.objectType = apiResponse.result.response[0].objectType;
        this.uploadStatus = apiResponse.params.status;
        this.toasterService.success(this.resourceService.messages.smsg.m0032);
      }, err => {
        this.showLoader = false;
        console.log('err', err)
        const errMsg = (err.error.params && err.error.params.errmsg) ? err.error.params.errmsg : this.resourceService.messages.fmsg.m0051;
        this.toasterService.error(errMsg);
      }
    )
  }

  getStatusResult(status) {
    return this[status];
  }
}
