import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { AnnouncementService } from '@sunbird/core';
import { ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import * as _ from 'lodash';

/**
 * The delete component deletes the announcement
 * which is requested by the logged in user have announcement
 * creator access
 */
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  /**
	 * Contains unique announcement id
	 */
  announcementId: string;

  /**
	 * Contains parent url
	 */
  parentUrl: string;

  /**
	 * Contains data of provided announcement
	 */
  announcementDetails: any;

  /**
	 * To show / hide loader
	 */
  showLoader = true;

  /**
   * To make details API calls
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
    this.getDetails(this.announcementId);
  }

  /**
   * This method calls the get announcement by id API with a particular announcement
   * id and and gets the details of the announcement
	 *
	 */
  getDetails(announcementId: string) {
    const option = { announcementId: this.announcementId };
    this.announcementService.getAnnouncementById(option).subscribe(
      (apiResponse: ServerResponse) => {
        this.announcementDetails = apiResponse.result;
        if (apiResponse.result.announcement) {
          this.announcementDetails = apiResponse.result.announcement;
        }
        this.showLoader = false;
      },
      err => {
        this.iziToast.error(this.resourceService.messages.emsg.m0005);
        this.showLoader = false;
        this.redirect();
      }
    );
  }

  /**
   * This method detects the parent url, constructs it and
   * helps to redirect to the parent page
	 *
	 */
  redirect() {
    const urlArray = [];
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      _.each(urlPath, (key, index) => {
        urlArray.push(key.path);
      });
    });
    this.parentUrl = _.join(urlArray, '/');
    this.route.navigate([this.parentUrl]);
  }
}

