import { ResourceService } from '@sunbird/shared';
import { Component } from '@angular/core';
import { UserService } from '../../services';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import * as _ from 'lodash';

/**
 * Main menu component
 */
@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {
  showExploreHeader = false;
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
    this.getUrl();
  }

  getUrl() {
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe((urlAfterRedirects: NavigationEnd) => {
      const urlSegment = urlAfterRedirects.url.split('/');
      if (_.includes(urlSegment, 'explore')) {
        this.showExploreHeader = true;
      } else {
        this.showExploreHeader = false;
      }
    });
  }
}
