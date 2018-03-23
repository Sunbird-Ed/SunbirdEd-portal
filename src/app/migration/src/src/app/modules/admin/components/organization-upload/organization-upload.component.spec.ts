import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrganizationUploadComponent } from './organization-upload.component';
import { SuiModule } from 'ng2-semantic-ui';
import { LearnerService, OrgManagementService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse, ConfigService } from '@sunbird/shared';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { Ng2IzitoastService } from 'ng2-izitoast';
import * as testData from './organization-upload.component.spec.data';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

describe('OrganizationUploadComponent', () => {
  let component: OrganizationUploadComponent;
  let fixture: ComponentFixture<OrganizationUploadComponent>;
  class MockInputFile {
    files: Array<File>;
    constructor() {
      this.files = new Array<File>();
      let content = [{
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
      let data = new Blob([content], {});
      let arrayOfBlob = new Array<Blob>();
      arrayOfBlob.push(data);
      let file = new File(arrayOfBlob, "Mock.csv");
      this.files.push(file);
    }
  }
  let mockFileInput: MockInputFile;
  let router: Router;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationUploadComponent],
      imports: [SuiModule, HttpClientTestingModule, Ng2IziToastModule],
      providers: [Ng2IzitoastService, OrgManagementService, ConfigService, ToasterService, ResourceService, LearnerService, HttpClient,
        { provide: Router, useClass: RouterStub },
        { provide: HTMLInputElement, useClass: MockInputFile }
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call redirect', () => {
    // spyOn(routerNavigationService, 'navigateToParentUrl').and.returnValue(undefined);
    component.redirect();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  xit('should call downloadSample method and download a sample csv file', () => {
    component.downloadSample();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should accept a file for upload and call organization management service to generate process id', inject([OrgManagementService,
    ResourceService, ToasterService, HttpClient],
    (orgManagementService, resourceService, toasterService, http) => {
      // component.showLoader = false;
      var modifiedDate = new Date();
      var file = new File([], 'orgSample001.csv');
      spyOn(component, 'uploadOrg').and.callThrough();
      spyOn(orgManagementService, 'bulkOrgUpload').and.callFake(() => Observable.of(testData.mockRes.successResponse));
      component.uploadOrg(mockFileInput);
      orgManagementService.bulkOrgUpload(mockFileInput).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
        }
      )
      spyOn(resourceService, 'getResource').and.callThrough();
      spyOn(toasterService, 'success').and.callThrough();
      // expect(component.showLoader).toBe(false);
    }));
});
