import { Component, OnInit } from '@angular/core';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { PermissionService } from '@sunbird/core';

/**
 * The Workspace side  component shows the sidebar for workspace
 */
@Component({
  selector: 'app-workspacesidebar',
  templateUrl: './workspacesidebar.component.html',
  styleUrls: ['./workspacesidebar.component.css']
})
export class WorkspacesidebarComponent implements OnInit {

  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
  /**
   * reference of permissionService service.
  */
  public permissionService: PermissionService;
  /**
   * reference of config service.
  */
  public config: ConfigService;
  /**
   * Draft  access roles
  */
  draftRole: Array<string>;
  /**
    * inreviewRole   access roles
  */
  inreviewRole: Array<string>;
  /**
 * publishedRole  access roles
 */
  publishedRole: Array<string>;
  /**
  * alluploadsRole  access roles
  */
  alluploadsRole: Array<string>;
  /**
  * upForReviewRole  access roles
  */
  upForReviewRole: Array<string>;
  /**
  * coursebacthesRole  access roles
 */
  coursebacthesRole: Array<string>;
  /**
    * flaggedRole  access roles
  */
  flaggedRole: Array<string>;

  /**
    * flaggedRole  access roles
  */
  limitedPublishingRole: Array<string>;

  /**
  * Constructor to create injected service(s) object
     Default method of Draft Component class
     * @param {ResourceService} resourceService Reference of ResourceService
     * @param {PermissionService} permissionService Reference of PermissionService
     * @param {ConfigService} config Reference of ConfigService
  */
  constructor(config: ConfigService, resourceService: ResourceService, permissionService: PermissionService) {
    this.resourceService = resourceService;
    this.permissionService = permissionService;
    this.config = config;
  }

  ngOnInit() {
    this.draftRole = this.config.rolesConfig.workSpaceRole.draftRole;
    this.inreviewRole = this.config.rolesConfig.workSpaceRole.inreviewRole;
    this.publishedRole = this.config.rolesConfig.workSpaceRole.publishedRole;
    this.alluploadsRole = this.config.rolesConfig.workSpaceRole.alluploadsRole;
    this.upForReviewRole = this.config.rolesConfig.workSpaceRole.upForReviewRole;
    this.coursebacthesRole = this.config.rolesConfig.workSpaceRole.coursebacthesRole;
    this.flaggedRole = this.config.rolesConfig.workSpaceRole.flaggedRole;
    this.limitedPublishingRole = this.config.rolesConfig.workSpaceRole.limitedPublishingRole;
  }

}
