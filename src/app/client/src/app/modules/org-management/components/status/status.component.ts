import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrgManagementService } from '../../services';
import { IUserUploadStatusResponse, IOrgUploadStatusResponse } from '../../interfaces';
import { IInteractEventInput, IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { UserService } from '@sunbird/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

/**
 * This component helps to display the success/failure response given by the api based on the process id entered
 *
 */
@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal;
  /**
* reference for ActivatedRoute
*/
  public activatedRoute: ActivatedRoute;
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
* Contains redirect url
*/
  redirectUrl: string;
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  checkStatusInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  public unsubscribe$ = new Subject<void>();

  /**
* Constructor to create injected service(s) object
*
* Default method of DetailsComponent class
*
* @param {ResourceService} resourceService To call resource service which helps to use language constant
*/
  constructor(orgManagementService: OrgManagementService, private router: Router, formBuilder: FormBuilder,
    toasterService: ToasterService, resourceService: ResourceService, activatedRoute: ActivatedRoute, public userService: UserService) {
    this.resourceService = resourceService;
    this.sbFormBuilder = formBuilder;
    this.orgManagementService = orgManagementService;
    this.toasterService = toasterService;
    this.activatedRoute = activatedRoute;
  }
  /**
 * This method is used to initialize the formbuilder and to validate process id form field
 */
  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      if (data.redirectUrl) {
        this.redirectUrl = data.redirectUrl;
      } else {
        this.redirectUrl = '/home';
      }
    });
    this.statusForm = this.sbFormBuilder.group({
      processId: ['', null]
    });
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: 'profile-bulk-upload-check-status',
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        uri: this.router.url
      }
    };
    this.setInteractEventData();
  }
  /**
 * This method helps to redirect to the parent component
 * page, i.e, bulk upload page
 */
  public redirect() {
    this.processId = '';
    this.router.navigate([this.redirectUrl]);
  }
  /**
 * This method helps to fetch bulk upload status based on the given process id
 */
  getBulkUploadStatus(processId) {
    this.showLoader = true;
    if (!(/^\s+$/.test(this.statusForm.value.processId))) {
      this.orgManagementService.getBulkUploadStatus(this.statusForm.value.processId.trim()).pipe(
        takeUntil(this.unsubscribe$))
        .subscribe(
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
    } else {
      this.toasterService.error(this.resourceService.messages.stmsg.m0006);
      this.showLoader = false;
    }
  }
  /**
 * This method helps to get the status result from the api
 */
  getStatusResult(status) {
    return status;
  }
  ngOnDestroy() {
    this.modal.deny();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  setInteractEventData() {
    this.checkStatusInteractEdata = {
      id: 'upload-status',
      type: 'click',
      pageid: 'profile-read'
    };
    this.telemetryInteractObject = {
      id: this.userService.userid,
      type: 'user',
      ver: '1.0'
    };
  }
}
