import { Component, OnInit } from '@angular/core';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { PermissionService } from '@sunbird/core';
import {Router, ActivatedRoute} from '@angular/router';
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

  /*
  roles allowed to create content
  */
  createRole: Array<string>;
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
    * limitedPublishingRole  access roles
  */
  limitedPublishingRole: Array<string>;

  /**
    * start  access roles
  */
  startRole: Array<string>;

  /**
  * allContentRole  access roles
  */
  allContentRole: Array<string>;

  /**
  * flagReviewer  access roles
  */
  flagReviewer: Array<string>;

   /**
   * reference of Router.
   */
  private router: Router;

  /**
  * Constructor to create injected service(s) object
     Default method of Draft Component class
     * @param {ResourceService} resourceService Reference of ResourceService
     * @param {PermissionService} permissionService Reference of PermissionService
     * @param {ConfigService} config Reference of ConfigService
  */
  constructor(config: ConfigService, resourceService: ResourceService, permissionService: PermissionService,
   router: Router) {
    this.resourceService = resourceService;
    this.permissionService = permissionService;
    this.config = config;
    this.router = router;
  }

  ngOnInit() {
    this.createRole = this.config.rolesConfig.workSpaceRole.createRole;
    this.draftRole = this.config.rolesConfig.workSpaceRole.draftRole;
    this.inreviewRole = this.config.rolesConfig.workSpaceRole.inreviewRole;
    this.publishedRole = this.config.rolesConfig.workSpaceRole.publishedRole;
    this.alluploadsRole = this.config.rolesConfig.workSpaceRole.alluploadsRole;
    this.upForReviewRole = this.config.rolesConfig.workSpaceRole.upForReviewRole;
    this.coursebacthesRole = this.config.rolesConfig.workSpaceRole.coursebacthesRole;
    this.flaggedRole = this.config.rolesConfig.workSpaceRole.flaggedRole;
    this.limitedPublishingRole = this.config.rolesConfig.workSpaceRole.limitedPublishingRole;
    this.startRole = this.config.rolesConfig.workSpaceRole.startRole;
    this.allContentRole = this.config.rolesConfig.workSpaceRole.allContentRole;
    this.flagReviewer = this.config.rolesConfig.workSpaceRole.flagReviewer;
  }

}
