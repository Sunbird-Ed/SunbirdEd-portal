import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse, ConfigService } from '@sunbird/shared';
import { PermissionService } from '@sunbird/core';
@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnInit {
  /**
 * reference of permissionService service.
 */
  public permissionService: PermissionService;
  /**
 * Admin Dashboard access roles
 */
  admin: Array<string>;
  /**
   * reference of config service.
   */
  public config: ConfigService;
  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
  /**
 * Constructor to create injected service(s) object
 *
 * Default method of DetailsComponent class
 *
 * @param {ResourceService} resourceService To call resource service which helps to use language constant
 */
  constructor(permissionService: PermissionService, config: ConfigService, private router: Router, private route: ActivatedRoute,
    resourceService: ResourceService) {
    this.resourceService = resourceService;
    this.config = config;
    this.permissionService = permissionService;
  }
  /**
 * This method is used to provide permission to show the upload links
 */
  ngOnInit() {
    this.admin = this.config.rolesConfig.headerDropdownRoles.adminDashboard;
  }
}
