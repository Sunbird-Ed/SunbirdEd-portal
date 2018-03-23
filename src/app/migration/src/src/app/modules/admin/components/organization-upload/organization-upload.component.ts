import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse, ConfigService } from '@sunbird/shared';
import { Route, Router } from '@angular/router';
import { OrgManagementService } from '@sunbird/core';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-organization',
  templateUrl: './organization-upload.component.html',
  styleUrls: ['./organization-upload.component.css']
})
export class OrganizationUploadComponent implements OnInit {
  @ViewChild('inputbtn') inputbtn: ElementRef;
  showLoader = false;
  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
  /**
 * To call resource service which helps to use language constant
 */
  public orgManagementService: OrgManagementService;
  /**
 * reference of config service.
 */
  public config: ConfigService;
  /**
 * Upload organization access roles
 */
  uploadOrganizations: Array<string>;
  /**
  * Contains unique process id
  */
  processId: string;
  /**
  * Contains uploaded fileName
  */
  fileName: string;
  /**
   * To show toaster(error, success etc) after any API calls
   */
  private toasterService: ToasterService;
  /**
    * Contains sample organization csv format
    */
  sampleOrgCSV: Array<Object>;

  constructor(orgManagementService: OrgManagementService, toasterService: ToasterService, private router: Router,
    config: ConfigService, resourceService: ResourceService) {
    this.orgManagementService = orgManagementService;
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
  /**
 * This method helps to redirect to the parent component
 * page, i.e, bulk upload page
 */
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
    // tslint:disable-next-line:no-unused-expression
    new Angular2Csv(this.sampleOrgCSV, 'Sample_Organizations', options);
  }
  openImageBrowser(inputbtn) {
    console.log('inside openImageBrowser');
    inputbtn.click();
  }
  uploadOrg(file) {
    if (file[0]) {
      if (file[0].name.match(/.(csv)$/i)) {
        this.showLoader = true;
        const formData = new FormData();
        formData.append('org', file[0]);
        const fd = formData;
        this.orgManagementService.bulkOrgUpload(fd).subscribe(
          (apiResponse: ServerResponse) => {
            this.showLoader = false;
            this.processId = apiResponse.result.processId;
            this.toasterService.success(this.resourceService.messages.smsg.m0031);
            this.fileName = file[0].name;
          },
          err => {
            this.showLoader = false;
            this.toasterService.error(err.error.params.errmsg);
          });
      } else {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0051);
      }
    }
  }
}
