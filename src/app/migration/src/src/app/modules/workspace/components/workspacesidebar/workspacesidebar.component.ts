import { Component, OnInit } from '@angular/core';
import { ResourceService, PermissionService, ConfigService } from '@sunbird/shared';

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
   * Workspace access roles
   */
  draftRole: Array<string>;

  /**
  * Constructor to create injected service(s) object
     Default method of Draft Component class
     * @param {ResourceService} resourceService Reference of ResourceService
     * @param {PermissionService} permissionService Reference of PermissionService
     * @param {ConfigService} config Reference of ConfigService
  */
  constructor(resourceService: ResourceService, permissionService: PermissionService) {
    this.resourceService = resourceService;
    this.permissionService = permissionService;
  }

  ngOnInit() {
    this.draftRole = this.config.rolesConfig.workSpaceRole.draftRole;
    console.log(this.draftRole);
  }

}
