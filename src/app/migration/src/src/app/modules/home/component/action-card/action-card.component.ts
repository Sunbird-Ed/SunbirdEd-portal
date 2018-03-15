import { Component, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { ActionCard } from './../../interfaces/index';
/**
 *This Component contains the details about enrolled courses.
 */
@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.css']
})
export class ActionCardComponent {
  /**
   * To call resource service which helps to use language constant.
   */
  public resourceService: ResourceService;
  /**
   * This is used to render the enrolled courses values in the view.
   */
  @Input() enrolledCourses: ActionCard;
  /**
   * The constructor
   * @param {ResourceService} resourceService Reference of ResourceService.
   */
  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
  }
}
