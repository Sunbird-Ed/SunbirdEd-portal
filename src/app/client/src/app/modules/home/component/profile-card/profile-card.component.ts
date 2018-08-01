import { ResourceService } from '@sunbird/shared';
import { Component, Input } from '@angular/core';
import { ProfileCard } from './../../interfaces/index';
/**
 * This component is a card contains details about user profile
 * like profilecompleteness, missingfields.
 */
@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent {
  /**
   * To call resource service which helps to use language constant.
   */
  public resourceService: ResourceService;
  /**
   * This is used to render the userProfile values in the view.
   */
  @Input() profile: ProfileCard;
  /**
  * inject service(s)
  * @param {ResourceService} resourceService Reference of ResourceService.
 */
  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
  }
}
