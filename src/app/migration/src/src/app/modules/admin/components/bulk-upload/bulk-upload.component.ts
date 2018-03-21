import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse, ConfigService } from '@sunbird/shared';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnInit {
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
  public bulkOrgProcessId: boolean;
  /**
 * Constructor to create injected service(s) object
 *
 * Default method of DetailsComponent class
 *
 * @param {ResourceService} resourceService To call resource service which helps to use language constant
 */
  constructor(config: ConfigService, private router: Router, private route: ActivatedRoute, resourceService: ResourceService) {
    this.resourceService = resourceService;
    this.config = config;
  }

  ngOnInit() {
    this.admin = this.config.rolesConfig.headerDropdownRoles.adminDashboard;
  }
}
