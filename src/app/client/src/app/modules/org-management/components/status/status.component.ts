import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ResourceService, ToasterService, ServerResponse, NavigationHelperService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { OrgManagementService } from '../../services';
import { IUserUploadStatusResponse, IOrgUploadStatusResponse } from '../../interfaces';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { UserService } from '@sunbird/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

/**
 * This component helps to display the success/failure response given by the api based on the process id entered
 *
 */
@Component({
  selector: 'app-status',
  templateUrl: './status.component.html'
})
export class StatusComponent implements OnInit, OnDestroy, AfterViewInit {
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

  isProcessCompleted: boolean;
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
  statusForm: UntypedFormGroup;
  /**
* Contains reference of FormBuilder
*/
  sbFormBuilder: UntypedFormBuilder;
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
  constructor(orgManagementService: OrgManagementService, private router: Router, formBuilder: UntypedFormBuilder,
    toasterService: ToasterService, resourceService: ResourceService, activatedRoute: ActivatedRoute, public userService: UserService,
    public navigationhelperService: NavigationHelperService) {
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
            if (this.statusResponse.status && (this.statusResponse.status === 'COMPLETED')) {
              this.isProcessCompleted = true;
              this.processId = this.statusResponse.processId;
              this.toasterService.success(this.resourceService.messages.smsg.m0032);
            } else {
              this.isProcessCompleted = false;
              this.toasterService.info(this.resourceService.messages.imsg.m0040);
            }
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
  ngAfterViewInit () {
    setTimeout(() => {
        this.telemetryImpression = {
          context: {
            env: this.activatedRoute.snapshot.data.telemetry.env
          },
          edata: {
            type: this.activatedRoute.snapshot.data.telemetry.type,
            pageid: 'profile-bulk-upload-check-status',
            subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
            uri: this.router.url,
            duration: this.navigationhelperService.getPageLoadTime()
          }
        };
    });
  }
  setInteractEventData() {
    this.checkStatusInteractEdata = {
      id: 'upload-status',
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
