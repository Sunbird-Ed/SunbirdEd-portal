import { ResourceService } from '@sunbird/shared';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services';
import {Router, ActivatedRoute} from '@angular/router';
import {  IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';

/**
 * Main menu component
 */
@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
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
  resourcesInteractEdata: IInteractEventEdata;
  resourcesInteractObject: IInteractEventObject;
  /*
  * constructor
  */
  constructor(resourceService: ResourceService, userService: UserService, router: Router) {
    this.resourceService = resourceService;
    this.userService = userService;
    this.router = router;
  }

  ngOnInit() {
    this.resourcesInteractEdata = {
      id: 'library',
       type: 'click',
       pageid: 'library-read'

    };
    this.resourcesInteractObject = {
      id: this.userService.userid,
      type: 'user',
      ver: '1.0'
    };
  }

}
