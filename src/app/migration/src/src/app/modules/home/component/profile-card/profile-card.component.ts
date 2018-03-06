// Import services
import {  UserService } from '@sunbird/core';
import {  ResourceService } from '@sunbird/shared';
import { Component, Input } from '@angular/core';
import { ProfileCard } from './../../interfaces/index';
/**
 * ProfileCardComponent is a card contains information about
 * user profile like completeness of profile, missing fields in profile.
 */
@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})

export class ProfileCardComponent {
    /**
     * Property of ResourceService used to render resourcebundels.
     */
 public resourceService: ResourceService;
    /**
     * Property of UserService used to render user profile data.
     */
 public userService: UserService;
    /**
     * item is type ProfileCard used to get the values display in the view.
     */
   @Input() profile: ProfileCard;
   /**
   * inject service(s)
   * @param {ResourceService} resourceService ResourceService used to render resourcebundels.
   * @param {UserService} userService UserService used to render user profile data.
  */
  constructor(resourceService: ResourceService,
     userService: UserService) {
       this.resourceService = resourceService;
      this.userService = userService;
     }
}
