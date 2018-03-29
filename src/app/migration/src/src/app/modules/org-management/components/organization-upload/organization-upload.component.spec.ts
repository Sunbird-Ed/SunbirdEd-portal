import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrganizationUploadComponent } from './organization-upload.component';
import { SuiModule } from 'ng2-semantic-ui';
import { LearnerService } from '@sunbird/core';
import { OrgManagementService } from '@sunbird/org-management';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA, DebugElement, ElementRef } from '@angular/core';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse, ConfigService } from '@sunbird/shared';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { Ng2IzitoastService } from 'ng2-izitoast';
import * as testData from './organization-upload.component.spec.data';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { By } from '@angular/platform-browser';

describe('OrganizationUploadComponent', () => {
  let component: OrganizationUploadComponent;
  let fixture: ComponentFixture<OrganizationUploadComponent>;
  let router: Router;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationUploadComponent],
      imports: [SuiModule, HttpClientTestingModule, Ng2IziToastModule],
      providers: [Ng2IzitoastService, OrgManagementService, ConfigService, ToasterService,
        ResourceService, LearnerService, HttpClient,
        { provide: Router, useClass: RouterStub }
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
