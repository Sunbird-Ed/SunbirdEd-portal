
import { Component, Input } from '@angular/core';
// Import services
import {  CoursesService } from '@sunbird/core';
import { ResourceService } from '@sunbird/shared';

/**
 * ActionCardComponent contains information about
 *enrolled courses by the user
 */
@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.css']
})

export class ActionCardComponent {
  /**
   * Property of ResourceService used to render resourcebundels.
   */
  public resourceService: ResourceService;
  /**
   * Property of CoursesService used to render enrolled course data.
   */
  public courseService: CoursesService;
  /**
   * item is type number used to get the values to diplay in the view.
   */
  @Input() item;
  /**
   * The constructor
   * @param {ResourceService} resourceService  ResourceService used to render resourcebundels.
   * @param {CoursesService} courseService CoursesService used to render enrolled course data.
   */
  constructor(resourceService: ResourceService, courseService: CoursesService) {
    this.resourceService = resourceService;
    this.courseService = courseService;

  }

}
