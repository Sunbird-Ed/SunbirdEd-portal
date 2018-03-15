import { ResourceService } from '@sunbird/shared';
import { Component } from '@angular/core';

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
  /*
  * constructor
  */
  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
  }

}
