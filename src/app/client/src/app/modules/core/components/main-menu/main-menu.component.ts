import { ResourceService } from '@sunbird/shared';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';

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
  homeMenuIntractEdata: IInteractEventEdata;
  learnMenuIntractEdata: IInteractEventEdata;
  libraryMenuIntractEdata: IInteractEventEdata;
  /*
  * constructor
  */
  constructor(resourceService: ResourceService, userService: UserService, router: Router) {
    this.resourceService = resourceService;
    this.userService = userService;
    this.router = router;
  }
  ngOnInit() {
    this.setInteractData();
  }
  setInteractData() {
    this.homeMenuIntractEdata = {
      id: 'home-tab',
      type: 'click',
      pageid: 'home'
    };
    this.libraryMenuIntractEdata = {
      id: 'library-tab',
      type: 'click',
      pageid: 'library'
    };
    this.learnMenuIntractEdata = {
      id: 'learn-tab',
      type: 'click',
      pageid: 'learn'
    };
  }
}
