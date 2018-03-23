import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { ResourceService, ConfigService, ToasterService, ServerResponse } from '@sunbird/shared';
import { OrgTypeService } from './../../services';

@Component({
  selector: 'app-view-org-type',
  templateUrl: './view-org-type.component.html',
  styleUrls: ['./view-org-type.component.css']
})
export class ViewOrgTypeComponent implements OnInit {

  /**
	 * This variable hepls to show and hide page loader.
   * It is kept true by default as at first when we comes
   * to a page the loader should be displayed before showing
   * any data
	 */
  showLoader = true;
  /**
   * To navigate to other pages
   */

  orgTypes: any;

  route: Router;

  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to parent component
   */
  private activatedRoute: ActivatedRoute;
  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;

  /**
   * To show toaster(error, success etc) after any API calls
   */
  private toasterService: ToasterService;

  /**
   * To get url, app configs
   */
  public config: ConfigService;

  /**
   * To call OrgTypeService
   */
  public orgTypeService: OrgTypeService;

  /**
	 * Constructor to create injected service(s) object
	 *
	 * Default method of AnnouncementService class
	 *
   * @param {Router} route Reference of Router
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {ResourceService} resourceService Reference of ResourceService
   * @param {ToasterService} toasterService Reference of ToasterService
   * @param {ConfigService} config Reference of ConfigService
   * @param {OrgTypeService} orgTypeService Reference of OrgTypeService
	 */
  constructor(route: Router,
    activatedRoute: ActivatedRoute,
    resourceService: ResourceService,
    toasterService: ToasterService,
    config: ConfigService,
    orgTypeService: OrgTypeService) {
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.config = config;
    this.orgTypeService = orgTypeService;
  }

  /**
   * populate org type data
	 *
	 */
  populateOrgType(): void {
    // this.orgTypeService.getOrgTypes().subscribe(
    //   (apiResponse: ServerResponse) => {


    //     this.orgTypes = { ...apiResponse.result.response };
    //     this.orgTypes = _.sortBy(this.orgTypes, function (i) { return i.name.toLowerCase(); });
    //     this.showLoader = false;
    //   },
    //   err => {
    //     this.toasterService.error(this.resourceService.messages.emsg.m0005);
    //     this.showLoader = false;
    //   }
    // );



    this.orgTypeService.getOrgTypes();
    this.orgTypeService.orgTypeData$.subscribe((apiResponse: ServerResponse) => {
      console.log('+++', apiResponse);
      if (apiResponse !== undefined) {
        this.orgTypes = { ...apiResponse.result.response };
        this.orgTypes = _.sortBy(this.orgTypes, function (i) { return i.name.toLowerCase(); });
        this.showLoader = false;
      }
    },
      err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
        this.showLoader = false;
      });



  }

  ngOnInit() {
    this.populateOrgType();

  }

}

