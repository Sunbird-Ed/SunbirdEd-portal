import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { OrgTypeService } from './../../services';

/**
 * The component helps to display all the organisation types
 * that has been added by the user having system adminstartion role
 */
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
   * Contains all the organisation type data
   */
  orgTypes: object;

  /**
   * To navigate to other pages
   */
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
   * To call OrgType Service for getting the listing
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
   * @param {OrgTypeService} orgTypeService Reference of OrgTypeService
	 */
  constructor(route: Router,
    activatedRoute: ActivatedRoute,
    resourceService: ResourceService,
    toasterService: ToasterService,
    orgTypeService: OrgTypeService) {
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.orgTypeService = orgTypeService;
  }

  /**
   * This method helps to display the organisation
   * type listing data
	 *
	 */
  populateOrgType(): void {
    this.orgTypeService.getOrgTypes();
    this.orgTypeService.orgTypeData$.subscribe((apiResponse) => {
      if (apiResponse && apiResponse.orgTypeData) {
        this.orgTypes = { ...apiResponse.orgTypeData.result.response };
        this.orgTypes = _.sortBy(this.orgTypes, function (orgTypeList) { return orgTypeList.name.toLowerCase(); });
        this.showLoader = false;
      } else if (apiResponse && apiResponse.err) {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
    });
  }

  /**
   * This method calls the populateOrgType function
   * to get the organisation listing data.
   *
   * It also updates the listing data when a organisation type is
   * added or updated by subscribing the events after
   * creation/updation od organisation types.
	 *
	 */
  ngOnInit() {
    this.populateOrgType();

    // Update event
    this.orgTypeService.orgTypeUpdateEvent.subscribe(data => {
      _.each(this.orgTypes, (key, index) => {
        if (data && data.id === key.id) {
          this.orgTypes[index].name = data.name;
        }
      });
    });
  }
}

