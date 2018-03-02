import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { AnnouncementService } from '@sunbird/core';
import { ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';

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
export class DeleteComponent {
  /**
	 * Contains unique announcement id
	 */
  announcementId: string;

  /**
	 * Contains page number of outbox list
	 */
  pageNumber = 1;

  /**
   * To make outbox API calls
   */
  private announcementService: AnnouncementService;

  /**
   * To navigate to other pages
   */
  route: Router;

  /**
   * To get params from url
   */
  private activatedRoute: ActivatedRoute;

  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;

  /**
   * To call toaster service
   */
  private iziToast: ToasterService;

  /**
	 * Constructor to create injected service(s) object
	 *
	 * Default method of DeleteComponent class
	 *
   * @param {AnnouncementService} announcementService To make outbox API calls
   * @param {Router} route To navigate to other pages
   * @param {ActivatedRoute} activatedRoute To get params from url
   * @param {ResourceService} resourceService To call resource service which helps to use language constant
   * @param {ToasterService} iziToast To call toaster service
	 */
  constructor(announcementService: AnnouncementService,
    route: Router,
    activatedRoute: ActivatedRoute,
    resourceService: ResourceService,
    iziToast: ToasterService) {
    this.announcementService = announcementService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.iziToast = iziToast;
    this.activatedRoute.params.subscribe(params => {
      this.announcementId = params.announcementId;
    });
    this.activatedRoute.parent.params.subscribe((params) => {
      this.pageNumber = Number(params.pageNumber);
    });
  }

  /**
   * This method calls the delete API with a particular announcement
   * id and and changes the status to cancelled of that particular
   * announcement.
	 *
	 */
  deleteAnnouncement() {
    const option = { announcementId: this.announcementId };
    this.announcementService.deleteAnnouncement(option).subscribe(
      (apiResponse: ServerResponse) => {
        this.iziToast.success('Succesfully deleted');
        this.redirect();
      },
      err => {
        this.iziToast.error(err.error.params.errmsg);
        this.redirect();
      }
    );
  }

  /**
   * This method helps to redirect to the previous
   * page, i.e, outbox listing page with proper page number
	 *
	 */
  redirect() {
    this.route.navigate(['announcement/outbox/', this.pageNumber]);
  }
}
