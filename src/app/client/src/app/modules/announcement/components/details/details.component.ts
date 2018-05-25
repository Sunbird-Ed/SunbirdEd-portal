import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash';
import { IAnnouncementDetails } from '@sunbird/announcement';
import { IEndEventInput, IStartEventInput, IImpressionEventInput } from '@sunbird/telemetry';
/**
 * The details component takes input of the announcement details
 * object and renders it with the data
 */
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;

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
   * announcementDetails is used to render the Announcement values in the view
   */
  @Input() announcementDetails: IAnnouncementDetails;

  /**
	 * Constructor to create injected service(s) object
	 *
	 * Default method of DetailsComponent class
	 *
   * @param {ResourceService} resourceService To call resource service which helps to use language constant
	 */
  constructor(resourceService: ResourceService, route: Router,
    activatedRoute: ActivatedRoute) {
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    // this.telemetryImpression = {
    //   context: {
    //     env: this.activatedRoute.snapshot.data.telemetry.env
    //   },
    //   object: {
    //     id: this.activatedRoute.snapshot.params.announcementId,
    //     type: this.activatedRoute.snapshot.data.telemetry.object.type,
    //     ver: this.activatedRoute.snapshot.data.telemetry.object.ver
    //   },
    //   edata: {
    //     type: this.activatedRoute.snapshot.data.telemetry.type,
    //     pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
    //     uri: '/announcement/outbox/',
    //   }
    // };
  }
}

