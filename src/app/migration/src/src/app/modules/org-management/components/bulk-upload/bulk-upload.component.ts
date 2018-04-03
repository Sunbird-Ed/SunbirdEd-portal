import { Component, OnInit } from '@angular/core';
import { ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { PermissionService } from '@sunbird/core';
/**
* This component displays the upload links and status check link which is used to upload csv file
*  and check the status of uploaded file
*/
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
  constructor(permissionService: PermissionService, config: ConfigService, resourceService: ResourceService) {
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
