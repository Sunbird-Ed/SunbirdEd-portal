import { UserService, PermissionService } from './../../services';
import { Component, OnInit } from '@angular/core';
import { ConfigService, ResourceService, UserProfile, UserData} from '@sunbird/shared';
/**
 * Main header component
 */
@Component({
  selector: 'app-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent implements OnInit {
  /**
   * organization log
   */
  orgLogo: string;
  /**
   * user profile details.
   */
  userProfile: UserProfile;
  /**
   * Sui dropdown initiator
   */
  isOpen: boolean;
  /**
   * Workspace access roles
   */
  workSpaceRole: Array<string>;
  /**
   * Admin Dashboard access roles
   */
  adminDashboard: Array<string>;
  /**
   * Announcement access roles
   */
  announcementRole: Array<string>;
  /**
   * MyActivity access roles
   */
  myActivityRole: Array<string>;
  /**
   * Organization Setup access roles
   */
  orgSetupRole: Array<string>;
  /**
   * reference of UserService service.
   */
  public userService: UserService;
  /**
   * reference of config service.
   */
  public config: ConfigService;
  /**
   * reference of resourceService service.
   */
  public resourceService: ResourceService;
  /**
   * reference of permissionService service.
   */
  public permissionService: PermissionService;
  /*
  * constructor
  */
  constructor(config: ConfigService, resourceService: ResourceService,
    permissionService: PermissionService, userService: UserService) {
      this.config = config;
      this.resourceService = resourceService;
      this.permissionService = permissionService;
      this.userService = userService;
  }

  ngOnInit() {
    this.workSpaceRole = this.config.rolesConfig.headerDropdownRoles.workSpaceRole;
    this.adminDashboard = this.config.rolesConfig.headerDropdownRoles.adminDashboard;
    this.announcementRole = this.config.rolesConfig.headerDropdownRoles.announcementRole;
    this.myActivityRole = this.config.rolesConfig.headerDropdownRoles.myActivityRole;
    this.orgSetupRole = this.config.rolesConfig.headerDropdownRoles.orgSetupRole;
    this.userService.userData$.subscribe(
      (user: UserData) => {
          if (user && !user.err) {
            this.userProfile = user.userProfile;
          }
      });
  }
  /**
   * logout function.
   */
  logout () {
    window.document.location.replace('/logout');
  }
}
