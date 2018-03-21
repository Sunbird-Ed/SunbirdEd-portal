import { Component, OnInit } from '@angular/core';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse, ConfigService } from '@sunbird/shared';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AdminService } from '@sunbird/core';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {
  showLoader = false;
  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
  /**
 * To call resource service which helps to use language constant
 */
  public adminService: AdminService;
  /**
 * reference of config service.
 */
  public config: ConfigService;
  /**
 * Upload organization access roles
 */
  uploadOrganizations: Array<string>;
  processId: string;
  fileName: string;
  /**
   * To show toaster(error, success etc) after any API calls
   */
  private toasterService: ToasterService;
  /**
 * Constructor to create injected service(s) object
 *
 * Default method of DetailsComponent class
 *
 * @param {ResourceService} resourceService To call resource service which helps to use language constant
 */
  sampleOrgCSV: Array<Object>;

  constructor(adminService: AdminService, toasterService: ToasterService, private router: Router,
    config: ConfigService, resourceService: ResourceService) {
    this.adminService = adminService;
    this.resourceService = resourceService;
    this.config = config;
    this.toasterService = toasterService;
  }

  ngOnInit() {
    this.uploadOrganizations = this.config.rolesConfig.headerDropdownRoles.adminDashboard;
    this.sampleOrgCSV = [{
      orgName: 'orgName',
      isRootOrg: 'isRootOrg',
      channel: 'channel',
      externalId: 'externalId',
      provider: 'provider',
      description: 'description',
      homeUrl: 'homeUrl',
      orgCode: 'orgCode',
      orgType: 'orgType',
      preferredLanguage: 'preferredLanguage',
      contactDetail: 'contactDetail'
    }];
  }
  public redirect() {
    this.fileName = '';
    this.processId = '';
    this.router.navigate(['admin/bulkUpload']);
  }
  public downloadSample() {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true
    };
    console.log('inside downloadSample()');
    // tslint:disable-next-line:no-unused-expression
    new Angular2Csv(this.sampleOrgCSV, 'Sample_Organizations', options);
  }
  public validateFile() {
    const fd = new FormData();
    const reader = new FileReader();
  }
  uploadOrg(file) {
    if (file[0]) {
      if (file[0].name.match(/.(csv)$/i)) {
        this.showLoader = true;
        const formData = new FormData();
        formData.append('org', file[0]);
        const fd = formData;
        this.adminService.bulkOrgUpload(fd).subscribe(
          (apiResponse: ServerResponse) => {
            if (apiResponse.responseCode === 'CLIENT_ERROR') {
              this.toasterService.error(apiResponse.params.errmsg);
            } else {
              this.showLoader = false;
              this.processId = apiResponse.result.processId;
              console.log('response', apiResponse);
              this.toasterService.success(this.resourceService.messages.smsg.m0031);
              this.fileName = file[0].name;
            }
          },
          err => {
            this.showLoader = false;
            this.toasterService.error(err.error.params.errmsg);
          });
        console.log('formdata', file[0]);
      } else {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0051);
      }
    }
  }
}
