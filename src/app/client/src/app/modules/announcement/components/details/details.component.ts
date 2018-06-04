import { Component, Input, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash';
import { IAnnouncementDetails } from '@sunbird/announcement';
import { IImpressionEventInput,  IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
/**
 * The details component takes input of the announcement details
 * object and renders it with the data
 */
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
  /**
   * announcementDetails is used to render the Announcement values in the view
   */
  @Input() announcementDetails: IAnnouncementDetails;
  public viewAnnouncementInteractEdata: IInteractEventEdata;
  public telemetryInteractObject: IInteractEventObject;

  /**
	 * Constructor to create injected service(s) object
	 *
	 * Default method of DetailsComponent class
	 *
   * @param {ResourceService} resourceService To call resource service which helps to use language constant
	 */
  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
  }
  ngOnInit() {
    this.setInteractEventData();
  }
  setInteractEventData() {
    this.viewAnnouncementInteractEdata = {
      id: 'attachment',
      type: 'click',
      pageid: 'announcement-create'
    };
    this.telemetryInteractObject = {
      id: '',
      type: 'announcement',
      ver: '1.0'
    };
  }
}

