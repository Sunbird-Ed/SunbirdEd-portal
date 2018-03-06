import { Component, Input } from '@angular/core';
// Import services
import { ResourceService } from '@sunbird/shared';
import { ActionCard } from './../../interfaces/index';
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
   * item is type ActionCard used to get the values to diplay in the view.
   */
  @Input() enrolledCourses: ActionCard;
  /**
   * The constructor
   * @param {ResourceService} resourceService  ResourceService used to render resourcebundels.
   */
  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
  }
}
