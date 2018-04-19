import { ResourceService } from '@sunbird/shared';
import { Component } from '@angular/core';
import { UserService } from '../../services';

/**
 * Main menu component
 */
@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {
  /**
   * reference of resourceService service.
   */
  public resourceService: ResourceService;
  /**
   * reference of UserService service.
   */
  public userService: UserService;
  /*
  * constructor
  */
  constructor(resourceService: ResourceService, userService: UserService) {
    this.resourceService = resourceService;
    this.userService = userService;
  }

}
