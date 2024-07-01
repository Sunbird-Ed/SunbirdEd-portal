import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse, NavigationHelperService } from '@sunbird/shared';
import { OrgTypeService } from './../../services/';
import { UntypedFormControl } from '@angular/forms';
import * as _ from 'lodash-es';
import { IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * This component helps to display the creation/updation popup.
 *
 * It also creates and updates organisation type.
 */
@Component({
  selector: 'app-create-org-type',
  templateUrl: './create-org-type.component.html'
})
export class CreateOrgTypeComponent implements OnInit, OnDestroy, AfterViewInit {
  public addOrganizationType: IInteractEventEdata;
  public updateOrganizationType: IInteractEventEdata;
  public cancelModal: IInteractEventEdata;
  @ViewChild('modal', {static: true}) modal;
  pageId: string;
  /**
  * telemetryImpression
  */
  telemetryImpression: IImpressionEventInput;
  /**
  * page uri for telemetry
  */
  pageUri: string;

  /**
	 * This flag helps to identify whether a form is creation or updation.
   * It is used to display the creation/updation form.
	 */
  createForm = true;

  /**
	 * Creates a object of the form control
	 */
  orgName = new UntypedFormControl();

  /**
	 * Contains the organisation type identifier
	 */
  orgTypeId: string;

  /**
   * To send activatedRoute.snapshot to routerNavigationService
   */
  public activatedRoute: ActivatedRoute;

  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;

  /**
   * To show toaster(error, success etc) after any API calls
   */
  private toasterService: ToasterService;

  /**
   * To navigate back to parent component
   */
  public routerNavigationService: RouterNavigationService;

  /**
   * To call OrgType Service for craeting/updating organisation type
   */
  public orgTypeService: OrgTypeService;

  public unsubscribe$ = new Subject<void>();

  disableApproveBtn = false;

  /**
	 * Constructor to create injected service(s) object
	 *
	 * Default method of DeleteComponent class
	 *
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {ResourceService} resourceService Reference of ResourceService
   * @param {ToasterService} toasterService Reference of ToasterService
   * @param {RouterNavigationService} routerNavigationService Reference of routerNavigationService
   * @param {OrgTypeService} orgTypeService Reference of OrgTypeService
	 */
  constructor(activatedRoute: ActivatedRoute,
    resourceService: ResourceService,
    toasterService: ToasterService,
    routerNavigationService: RouterNavigationService,
    orgTypeService: OrgTypeService,
    public navigationhelperService: NavigationHelperService) {
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.routerNavigationService = routerNavigationService;
    this.orgTypeService = orgTypeService;
  }

  /**
   * This method calls the add organisation type API with the organisation
   * type name.
   *
   * After success or failure it is redirected to the organisation type listing page
   * with proper messaga.
	 */
  addOrgType(): void {
    this.orgTypeService.addOrgType(this.orgName.value).pipe(
      takeUntil(this.unsubscribe$))
      .subscribe(
        (apiResponse: ServerResponse) => {
          this.toasterService.success(this.resourceService.messages.smsg.m0035);
          this.modal.deny();
          this.redirect();
        },
        err => {
          this.toasterService.error(err.error.params.errmsg);
          this.redirect();
        }
      );
  }

  /**
   * This method calls the update organisation type API with a object of
   * organisation type identifier and name.
   *
   * After success or failure it is redirected to the organisation type listing page
   * with proper messaga.
	 */
  updateOrgType(): void {
    const param = { 'id': this.orgTypeId, 'name': this.orgName.value };
    this.orgTypeService.updateOrgType(param).pipe(
      takeUntil(this.unsubscribe$))
      .subscribe(
        (apiResponse: ServerResponse) => {
          this.toasterService.success(this.orgName.value + ' ' + this.resourceService.messages.smsg.m0037);
          this.modal.deny();
          this.redirect();
        },
        err => {
          this.toasterService.error(err.error.params.errmsg);
          this.redirect();
        }
      );
  }

  /**
   * This method helps to redirect to the parent component
   * page, i.e, view organisation type page
	 *
	 */
  redirect(): void {
    this.routerNavigationService.navigateToParentUrl(this.activatedRoute.snapshot);
  }

  /**
   * This method helps to identify that the page is creation
   * or updation by subscribing the actiavtedRoute url.
   *
   * It also sets the data to the updation form by subscribing the
   * activatedRoute param
	 */
  ngOnInit() {
    this.activatedRoute.url.subscribe(url => {
      if (url[0].path === 'update') {
        this.createForm = false;
        this.pageUri = 'orgType/update/' + this.orgTypeId;
        this.pageId = 'update-organization-type';
        this.orgTypeService.orgTypeData$.subscribe((orgTypeList) => {
          if (orgTypeList && orgTypeList.orgTypeData) {
            _.find(orgTypeList.orgTypeData.result.response, (orgList) => {
              this.orgTypeId = this.activatedRoute.snapshot.params.orgId;
              if (orgList.id === this.orgTypeId) {
                this.orgName = new UntypedFormControl(orgList.name);
                return true;
              }
            });
          }
        });
      } else if (url[0].path === 'create') {
        this.createForm = true;
        this.pageUri = 'orgType/create';
        this.pageId = 'create-organization-type';
      }
    });
    this.setInteractEventData();
  }

  setInteractEventData() {
    this.addOrganizationType = {
      id: 'create-organization-type',
      type: 'click',
      pageid: this.pageId
    };
    this.updateOrganizationType = {
      id: 'update-organization-type',
      type: 'click',
      pageid: this.pageId
    };
    this.cancelModal = {
      id: 'cancel',
      type: 'click',
      pageid: this.pageId
    };
  }

  ngAfterViewInit () {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.pageId,
          uri: this.pageUri,
          subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

