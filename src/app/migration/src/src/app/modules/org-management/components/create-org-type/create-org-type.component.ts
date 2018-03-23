import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AnnouncementService } from '@sunbird/core';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse } from '@sunbird/shared';
import { OrgTypeService } from './../../services/';
import { FormControl } from '@angular/forms';
import * as _ from 'lodash';

/**
 * The delete component deletes the announcement
 * which is requested by the logged in user have announcement
 * creator access
 */
@Component({
  selector: 'app-create-org-type',
  templateUrl: './create-org-type.component.html',
  styleUrls: ['./create-org-type.component.css']
})
export class CreateOrgTypeComponent implements OnInit {
  /**
	 * Contains
	 */
  createForm = true;

  orgName = new FormControl();

  /**
	 * Contains page number of outbox list
	 */
  pageNumber = 1;

  /**
   * To make get announcement by id
   */
  private announcementService: AnnouncementService;

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
   * To call OrgTypeService
   */
  public orgTypeService: OrgTypeService;


  /**
	 * Constructor to create injected service(s) object
	 *
	 * Default method of DeleteComponent class
	 *
   * @param {AnnouncementService} announcementService Reference of AnnouncementService
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {ResourceService} resourceService Reference of ResourceService
   * @param {ToasterService} toasterService Reference of ToasterService
   * @param {RouterNavigationService} routerNavigationService Reference of routerNavigationService
   * @param {OrgTypeService} orgTypeService Reference of OrgTypeService
	 */
  constructor(announcementService: AnnouncementService,
    activatedRoute: ActivatedRoute,
    resourceService: ResourceService,
    toasterService: ToasterService,
    routerNavigationService: RouterNavigationService,
    orgTypeService: OrgTypeService) {
    this.announcementService = announcementService;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.routerNavigationService = routerNavigationService;
    this.orgTypeService = orgTypeService;
  }

  /**
   * This method calls the delete API with a particular announcement
   * id and and changes the status to cancelled of that particular
   * announcement.
	 */
  addOrgType(): void {
    if (this.orgName && this.orgName.value) {
      this.orgTypeService.addOrgType(this.orgName.value).subscribe(
        (apiResponse: ServerResponse) => {
          this.toasterService.success(this.resourceService.messages.smsg.m0035);
          this.redirect();
        },
        err => {
          this.toasterService.error(this.resourceService.messages.fmsg.m0060);
          this.redirect();
        }
      );
    } else {
      this.toasterService.error('Org type name is mandatory');
    }
  }

  updateOrgType(): void {
    if (this.orgName && this.orgName.value) {
      // const param = {'id': this.orgTypeService.orgTypeDetails.id, 'name': this.orgName.value};
      const param = { 'id': '', 'name': this.orgName.value };
      this.orgTypeService.updateOrgType(param).subscribe(
        (apiResponse: ServerResponse) => {
          this.toasterService.success(this.orgName.value + ' ' + this.resourceService.messages.smsg.m0037);
          this.redirect();
        },
        err => {
          this.toasterService.error(this.resourceService.messages.fmsg.m0060);
          this.redirect();
        }
      );
    } else {
      this.toasterService.error('Org type name is mandatory');
    }
  }

  /**
   * This method helps to redirect to the parent component
   * page, i.e, outbox listing page with proper page number
	 *
	 */
  redirect(): void {
    this.routerNavigationService.navigateToParentUrl(this.activatedRoute.snapshot);
  }

  /**
   * This method sets the annmouncementId and pagenumber from
   * activated route
	 */
  ngOnInit() {
    // if (this.orgTypeService.orgTypeDetails === 'create') {
    //   this.createForm = true;
    // } else if (this.orgTypeService.orgTypeDetails) {
    //   this.createForm = false;
    // } else {
    //   this.redirect();
    // }

    this.orgTypeService.orgTypeData$.subscribe((val) => {
      console.log('===', val);
      // alert()
    });


    // this.activatedRoute.url.subscribe(url => {
    //   console.log(url[0].path)
    //   if (url[0].path === 'update') {
    //     this.createForm = false;
    //     alert(update)
    //    // this.orgName = new FormControl(this.orgTypeService.orgTypeDetails.name);
    //   } else if (url[0].path === 'create') {
    //     this.createForm = true;
    //     alert(ct)
    //   } else {
    //     this.redirect();
    //   }
    // });



  }
}

