import { Component, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash';

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
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;

  @Input() announcementDetails: object;

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
}

