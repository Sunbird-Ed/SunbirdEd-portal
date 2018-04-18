import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AnnouncementService } from '@sunbird/core';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse } from '@sunbird/shared';
import { OrgTypeService } from './../../services/';
import { FormControl } from '@angular/forms';
import * as _ from 'lodash';

/**
 * This component helps to display the creation/updation popup.
 *
 * It also creates and updates organisation type.
 */
@Component({
  selector: 'app-create-org-type',
  templateUrl: './create-org-type.component.html',
  styleUrls: ['./create-org-type.component.css']
})
export class CreateOrgTypeComponent implements OnInit {

  /**
	 * This flag helps to identify whether a form is creation or updation.
   * It is used to display the creation/updation form.
	 */
  createForm = true;

  /**
	 * Creates a object of the form control
	 */
  orgName = new FormControl();

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
    orgTypeService: OrgTypeService) {
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
    this.orgTypeService.addOrgType(this.orgName.value).subscribe(
      (apiResponse: ServerResponse) => {
        this.toasterService.success(this.resourceService.messages.smsg.m0035);
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
    this.orgTypeService.updateOrgType(param).subscribe(
      (apiResponse: ServerResponse) => {
        this.toasterService.success(this.orgName.value + ' ' + this.resourceService.messages.smsg.m0037);
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
        this.orgTypeService.orgTypeData$.subscribe((orgTypeList) => {
          if (orgTypeList && orgTypeList.orgTypeData) {
            _.find(orgTypeList.orgTypeData.result.response, (orgList) => {
              this.orgTypeId = this.activatedRoute.snapshot.params.orgId;
              if (orgList.id === this.orgTypeId) {
                this.orgName = new FormControl(orgList.name);
              }
            });
          }
        });
      } else if (url[0].path === 'create') {
        this.createForm = true;
      }
    });
  }
}

