import { Component, OnInit } from '@angular/core';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse } from '@sunbird/shared';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgForm, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { OrgManagementService } from '@sunbird/core';
import { StatusResponse } from '../../interfaces/IStatusResponse';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  /**
* Contains success status result with process id
*/
  success: Array<any>;
  /**
* Contains failure status result with process id
*/
  failure: Array<any>;
  /**
* Contains process id
*/
  processId: string;
  /**
* Used to store the type of upload, either organization or user
*/
  objectType: string;
  /**
* To show toaster(error, success etc) after any API calls
*/
  private toasterService: ToasterService;
  /**
* To call admin service which helps to upload csv file
*/
  public orgManagementService: OrgManagementService;
  /**
 * To show/hide loader
 */
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
  constructor(orgManagementService: OrgManagementService, private router: Router, formBuilder: FormBuilder,
    toasterService: ToasterService, resourceService: ResourceService) {
    this.resourceService = resourceService;
    this.sbFormBuilder = formBuilder;
    this.orgManagementService = orgManagementService;
    this.toasterService = toasterService;
  }
  /**
 * This method is used to initialize the formbuilder and to validate process id form field
 */
  ngOnInit() {
    this.statusForm = this.sbFormBuilder.group({
      processId: ['', null]
    });
  }
  /**
 * This method helps to redirect to the parent component
 * page, i.e, bulk upload page
 */
  public redirect() {
    this.processId = '';
    this.router.navigate(['bulkUpload']);
  }
  /**
 * This method helps to fetch bulk upload status based on the given process id
 */
  getBulkUploadStatus(processId) {
    this.showLoader = true;
    this.orgManagementService.bulkUploadStatus(this.statusForm.value.processId).subscribe(
      (apiResponse: ServerResponse) => {
        this.showLoader = false;
        this.success = apiResponse.result.response[0].successResult;
        this.failure = apiResponse.result.response[0].failureResult;
        this.processId = apiResponse.result.response[0].processId;
        this.objectType = apiResponse.result.response[0].objectType;
        this.toasterService.success(this.resourceService.messages.smsg.m0032);
      }, err => {
        this.showLoader = false;
        const errMsg = err.error.params.errmsg ? err.error.params.errmsg : this.resourceService.messages.fmsg.m0051;
        this.toasterService.error(errMsg);
      });
  }
  /**
 * This method helps to get the status result from the api
 */
  getStatusResult(status) {
    return this[status];
  }
}
