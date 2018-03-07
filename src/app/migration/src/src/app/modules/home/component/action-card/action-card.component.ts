import { Component, Input } from '@angular/core';
// Import services
import { ResourceService } from '@sunbird/shared';
import { ActionCard } from './../../interfaces/index';
/**
 *ActionCardComponent is a card for enrolled courses contains deatils about course
 *like title, description, progress of course.
 */
@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.css']
})
export class ActionCardComponent {
  /**
   * To inject ResourceService.
   */
  public resourceService: ResourceService;
  /**
   * enrolledCourses is type of ActionCard used to diplay enrolled courses by user on the view.
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
