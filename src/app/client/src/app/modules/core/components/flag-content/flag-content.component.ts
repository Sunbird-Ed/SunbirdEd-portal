import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse } from '@sunbird/shared';

/**
 * The delete component deletes the announcement
 * which is requested by the logged in user have announcement
 * creator access
 */
@Component({
  selector: 'app-flag-content',
  templateUrl: './flag-content.component.html',
  styleUrls: ['./flag-content.component.css']
})
export class FlagContentComponent implements OnInit {


  flagReasons = [{
    name: 'Inappropriate content',
    value: 'Inappropriate Content',
    description: 'Hateful, harmful or explicit lesson that is inappropriate for young learners'
  }, {
    name: 'Copyright violation',
    value: 'Copyright Violation',
    description: 'Uses copyrighted work without permission'
  }, {
    name: 'Privacy violation',
    value: 'Privacy Violation',
    description: 'Collects sensitive data or personal information about users, such as name' +
    '\n address, photo or other personally identifiable information'
  }, {
    name: 'Other',
    value: 'Other'
  }];


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
	 * Constructor to create injected service(s) object
	 *
	 * Default method of DeleteComponent class
	 *
   * @param {AnnouncementService} announcementService Reference of AnnouncementService
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {ResourceService} resourceService Reference of ResourceService
   * @param {ToasterService} toasterService Reference of ToasterService
   * @param {RouterNavigationService} routerNavigationService Reference of routerNavigationService
	 */
  constructor(activatedRoute: ActivatedRoute,
    resourceService: ResourceService,
    toasterService: ToasterService,
    routerNavigationService: RouterNavigationService) {
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.routerNavigationService = routerNavigationService;
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
    // this.activatedRoute.params.subscribe(params => {
    //   this.announcementId = params.announcementId;
    // });
    // this.activatedRoute.parent.params.subscribe((params) => {
    //   this.pageNumber = Number(params.pageNumber);
    // });
  }
}

