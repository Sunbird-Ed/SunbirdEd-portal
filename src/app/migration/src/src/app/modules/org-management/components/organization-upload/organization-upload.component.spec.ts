import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrganizationUploadComponent } from './organization-upload.component';
import { SuiModule } from 'ng2-semantic-ui';
import { LearnerService } from '@sunbird/core';
import { OrgManagementService } from '@sunbird/org-management';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { Ng2IziToastModule } from 'ng2-izitoast';
import * as testData from './organization-upload.component.spec.data';
import { By } from '@angular/platform-browser';

describe('OrganizationUploadComponent', () => {
  let component: OrganizationUploadComponent;
  let fixture: ComponentFixture<OrganizationUploadComponent>;
  let router: Router;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const ResourceData = {
    'frmelmnts': {
      'instn': {
        't0013': 'Download the csv file for reference',
        't0002': 'You can add or upload details of up to 199 organizations at a time in one csv file',
        't0007': 'The OrgName column is mandatory. Enter organization name in this column',
        't0021': `Enter each organization's name in a separate row`,
        't0022': 'Entering details in all other columns is optional:',
        't0023': 'isRootOrg: Valid values for this column True False',
        't0024': 'channel: Unique ID provided during master organization creation',
        't0025': `externalId: Unique ID associated with each organization in the administrating organization's repository`,
        't0026': 'provider: Channel ID of the administrator organization',
        't0027': 'description: Details describing the organization',
        't0028': `homeUrl: Organization's homepage url`,
        't0029': `orgCode: Organization's unique code, if any,`,
        't0030': 'orgType: Type of organization, such as, NGO, primary school, secondary school etc',
        't0031': 'preferredLanguage: Language preferences for the organization, if any',
        't0032': `contactDetail: Organization's phone number and email ID.
        Details should be entered within curly brackets in single quotes. For example: [{'Phonenumber': '1234567890'}]`,
        't0049': 'channel is mandatory if value for column isRootorg is True',
        't0050': 'externalid and provider are mutually mandatory'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationUploadComponent],
      imports: [SuiModule, HttpClientTestingModule, Ng2IziToastModule],
      providers: [OrgManagementService, ConfigService, ToasterService,
        ResourceService, LearnerService,
        { provide: Router, useClass: RouterStub },
        { provide: ResourceService, useValue: ResourceData }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
  });
  it('should call redirect', () => {
    component.redirect();
    fixture.detectChanges();
  });
  it('should call downloadSample method and download a sample csv file', () => {
    component.downloadSample();
    fixture.detectChanges();
  });
  xit('should call openImageBrowser method', () => {
    let inputEl: DebugElement;
    inputEl = fixture.debugElement.query(By.css('inputbtn'));
    inputEl.triggerEventHandler('click', null);
    component.openImageBrowser(inputEl);
    fixture.detectChanges();
  });
  it('should  call uploadOrg method and return success response with process id', () => {
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const orgManagementService = TestBed.get(OrgManagementService);
    resourceService.messages = testData.mockRes.resourceBundle.messages;
    spyOn(orgManagementService, 'bulkOrgUpload').and.callFake(() => Observable.of(testData.mockRes.successResponse));
    component.uploadOrg(testData.mockRes.validfile);
  });
  it('should call uploadOrg method and return error response', () => {
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const orgManagementService = TestBed.get(OrgManagementService);
    resourceService.messages = testData.mockRes.resourceBundle.messages;
    spyOn(orgManagementService, 'bulkOrgUpload').and.callFake(() => Observable.of(testData.mockRes.errorResponse));
    component.uploadOrg(testData.mockRes.invalidfile);
    expect(component.showLoader).toBe(false);
  });
  it('should not call uploadOrg method', () => {
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = testData.mockRes.resourceBundle.messages;
    component.uploadOrg(testData.mockRes.errorfile);
  });
});
