import { Component, OnInit } from '@angular/core';
import { ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrgManagementService } from '../../services';
import { IUserUploadStatusResponse, IOrgUploadStatusResponse } from '../../interfaces';

/**
 * This component helps to display the success/failure response given by the api based on the process id entered
 *
 */
@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  /**
* Contains status response
*/
  statusResponse: IUserUploadStatusResponse | IOrgUploadStatusResponse;
  /**
* Contains process id
*/
  processId: string;
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
    this.orgManagementService.getBulkUploadStatus(this.statusForm.value.processId).subscribe(
      (apiResponse: ServerResponse) => {
        this.showLoader = false;
        this.statusResponse = apiResponse.result.response[0];
        this.processId = this.statusResponse.processId;
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
    return status;
  }
}
