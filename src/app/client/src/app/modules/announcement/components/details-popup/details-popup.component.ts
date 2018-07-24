
import {takeUntil} from 'rxjs/operators';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnnouncementService } from '@sunbird/core';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse } from '@sunbird/shared';
import * as _ from 'lodash';
import { IAnnouncementDetails } from '@sunbird/announcement';
import { IImpressionEventInput } from '@sunbird/telemetry';

import { Subject } from 'rxjs';
/**
 * The details popup component checks for the announcement details object
 * present in announcement service. If object is undefined it calls API with
 * the announcement id and gets the details.
 */
@Component({
  selector: 'app-details-popup',
  templateUrl: './details-popup.component.html',
  styleUrls: ['./details-popup.component.css']
})
export class DetailsPopupComponent implements OnInit, OnDestroy {

  public unsubscribe = new Subject<void>();

  @ViewChild('modal') modal;
   /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  /**
	 * Contains unique announcement id
	 */
  announcementId: string;

  /**
	 * Contains announcement details returned from API or object called from
   * announcement service
	 */
  announcementDetails: IAnnouncementDetails;

  /**
	 * This variable hepls to show and hide page loader.
   * It is kept true by default as at first when we comes
   * to a page the loader should be displayed before showing
   * any data
	 */
  showLoader = true;

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
	 * Default method of DetailsPopupComponent class
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
   * This method checks in announcement service whether announcement details exist
   * for the given announcement id or not. If not then it calls the
   * get announcement by id API with a particular announcement
   * id and and gets the details of the announcement
	 *
	 * @param {string} announcementId announcement id
	 */
  getDetails(announcementId: string): void {
    if (this.announcementService.announcementDetailsObject === undefined ||
      this.announcementService.announcementDetailsObject.id !== announcementId) {
      const option = { announcementId: this.announcementId };
      this.announcementService.getAnnouncementById(option).pipe(
      takeUntil(this.unsubscribe)).subscribe(
        (apiResponse: ServerResponse) => {
          this.announcementDetails = apiResponse.result;
          if (apiResponse.result.announcement) {
            this.announcementDetails = apiResponse.result.announcement;
          }
          this.showLoader = false;
        },
        err => {
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
          this.showLoader = false;
          this.routerNavigationService.navigateToParentUrl(this.activatedRoute.snapshot);
        }
      );
    } else {
      this.showLoader = false;
      this.announcementDetails = this.announcementService.announcementDetailsObject;
    }
  }

  /**
   * This method calls the getDetails method to show details
   * of a particular announcement
	 */
  ngOnInit() {
    this.activatedRoute.params.pipe(
    takeUntil(this.unsubscribe))
    .subscribe(params => {
      this.announcementId = params.announcementId;
    });
    this.getDetails(this.announcementId);
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      object: {
        id: this.announcementId,
        type: this.activatedRoute.snapshot.data.telemetry.object.type,
        ver: this.activatedRoute.snapshot.data.telemetry.object.ver
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: '/announcement/outbox/' + this.announcementId,
      }
    };
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.modal.deny();
  }
}

