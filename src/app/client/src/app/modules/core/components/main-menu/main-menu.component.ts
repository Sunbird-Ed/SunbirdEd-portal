import { ResourceService } from '@sunbird/shared';
import { Component } from '@angular/core';
import { UserService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';

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
  /**
   * reference of Router.
   */
  private router: Router;
  /*
  * constructor
  */
  constructor(resourceService: ResourceService, userService: UserService, router: Router) {
    this.resourceService = resourceService;
    this.userService = userService;
    this.router = router;
  }

}
