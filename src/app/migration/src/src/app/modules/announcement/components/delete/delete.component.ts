import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AnnouncementService } from '@sunbird/core';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse } from '@sunbird/shared';

/**
 * The delete component deletes the announcement
 * which is requested by the logged in user have announcement
 * creator access
 */
@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  /**
	 * Contains unique announcement id
	 */
  announcementId: string;

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
  constructor(announcementService: AnnouncementService,
    activatedRoute: ActivatedRoute,
    resourceService: ResourceService,
    toasterService: ToasterService,
    routerNavigationService: RouterNavigationService) {
    this.announcementService = announcementService;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.routerNavigationService = routerNavigationService;
  }

  /**
   * This method calls the delete API with a particular announcement
   * id and and changes the status to cancelled of that particular
   * announcement.
	 */
  deleteAnnouncement(): void {
    const option = { announcementId: this.announcementId };
    this.announcementService.deleteAnnouncement(option).subscribe(
      (apiResponse: ServerResponse) => {
        this.toasterService.success(this.resourceService.messages.smsg.moo41);
        this.redirect();
      },
      err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
        this.redirect();
      }
    );
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
    this.activatedRoute.params.subscribe(params => {
      this.announcementId = params.announcementId;
    });
    this.activatedRoute.parent.params.subscribe((params) => {
      this.pageNumber = Number(params.pageNumber);
    });
  }
}
