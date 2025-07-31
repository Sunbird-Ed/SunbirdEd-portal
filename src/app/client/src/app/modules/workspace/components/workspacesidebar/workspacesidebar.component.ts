import { Component, OnInit } from '@angular/core';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { PermissionService } from '@sunbird/core';
import {Router} from '@angular/router';
import { WorkSpaceService } from './../../services';
/**
 * The Workspace side  component shows the sidebar for workspace
 */
@Component({
  selector: 'app-workspacesidebar',
  templateUrl: './workspacesidebar.component.html'
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
  * courseBatchRoles  access roles
 */
  courseBatchRoles: Array<string>;
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
  * allContentRole  access roles
  */
 collaboratingRole: Array<string>;
 /**
  * roles for which training sub-tab to be shown
  */
 trainingRole: Array<string>;

  /**
  * roles for which admin to be shown
  */
 alltextbookRole: Array<string>;
 /**
  * roles for which skillmap to be shown
  */
 skillmapRole: Array<string>;
 /**
  * roles for which skillmap reviewer to be shown
  */
 skillmapReviewerRole: Array<string>;
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
   router: Router, public workSpaceService: WorkSpaceService) {
    this.resourceService = resourceService;
    this.permissionService = permissionService;
    this.config = config;
    this.router = router;
  }

  ngOnInit() {
    this.workSpaceService.getQuestionSetCreationStatus();
    this.alltextbookRole = this.config.rolesConfig.workSpaceRole.alltextbookRole;
    this.createRole = this.config.rolesConfig.workSpaceRole.createRole;
    this.draftRole = this.config.rolesConfig.workSpaceRole.draftRole;
    this.inreviewRole = this.config.rolesConfig.workSpaceRole.inreviewRole;
    this.publishedRole = this.config.rolesConfig.workSpaceRole.publishedRole;
    this.alluploadsRole = this.config.rolesConfig.workSpaceRole.alluploadsRole;
    this.upForReviewRole = this.config.rolesConfig.workSpaceRole.upForReviewRole;
    this.courseBatchRoles = this.config.rolesConfig.workSpaceRole.courseBatchRoles;
    this.flaggedRole = this.config.rolesConfig.workSpaceRole.flaggedRole;
    this.limitedPublishingRole = this.config.rolesConfig.workSpaceRole.limitedPublishingRole;
    this.startRole = this.config.rolesConfig.workSpaceRole.startRole;
    this.allContentRole = this.config.rolesConfig.workSpaceRole.allContentRole;
    this.flagReviewer = this.config.rolesConfig.workSpaceRole.flagReviewer;
    this.collaboratingRole = this.config.rolesConfig.workSpaceRole.collaboratingRole;
    this.skillmapRole = this.config.rolesConfig.workSpaceRole.skillmapRole;
    this.skillmapReviewerRole = this.config.rolesConfig.workSpaceRole.skillmapReviewerRole;
  }

  setInteractData(id) {
    return {
      id,
      type: 'click',
      pageid: 'workspace'
    };
   }

}
