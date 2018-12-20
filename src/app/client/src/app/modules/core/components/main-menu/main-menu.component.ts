import { ConfigService, ResourceService } from '@sunbird/shared';
import { Component, OnInit } from '@angular/core';
import { UserService, PermissionService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';

/**
 * Main menu component
 */
@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {
  /**
   * Workspace access roles
   */
  workSpaceRole: Array<string>;
  /**
   * reference of resourceService service.
   */
  public resourceService: ResourceService;
  /**
   * reference of UserService service.
   */
  public userService: UserService;
  /**
   * reference of permissionService service.
   */
  public permissionService: PermissionService;
  /**
   * reference of config service.
   */
  public config: ConfigService;
  /**
   * reference of Router.
   */
  private router: Router;
  homeMenuIntractEdata: IInteractEventEdata;
  learnMenuIntractEdata: IInteractEventEdata;
  libraryMenuIntractEdata: IInteractEventEdata;
  workspaceMenuIntractEdata: IInteractEventEdata;
  /*
  * constructor
  */
  constructor(resourceService: ResourceService, userService: UserService, router: Router,
     permissionService: PermissionService, config: ConfigService) {
    this.resourceService = resourceService;
    this.userService = userService;
    this.permissionService = permissionService;
    this.router = router;
    this.config = config;
    this.workSpaceRole = this.config.rolesConfig.headerDropdownRoles.workSpaceRole;
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
    this.workspaceMenuIntractEdata = {
      id: 'workspace-menu-button',
      type: 'click',
      pageid: 'workspace'
    };
  }

  navigateToWorkspace() {
    const authroles = this.permissionService.getWorkspaceAuthRoles();
    if (authroles) {
      this.router.navigate([authroles.url]);
    }
  }
}
