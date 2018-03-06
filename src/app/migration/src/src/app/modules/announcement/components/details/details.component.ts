import { Component, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
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
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;

  @Input() announcementDetails: any;

  /**
	 * Constructor to create injected service(s) object
	 *
	 * Default method of DeleteComponent class
	 *
   * @param {ResourceService} resourceService To call resource service which helps to use language constant
	 */
  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
  }
}

