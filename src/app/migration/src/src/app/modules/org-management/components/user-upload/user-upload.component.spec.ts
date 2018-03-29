import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { LearnerService } from '@sunbird/core';
import { OrgManagementService } from '@sunbird/org-management';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { FormBuilder } from '@angular/forms';
import { UserUploadComponent } from './user-upload.component';
import * as testData from './user-upload.component.spec.data';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserUploadComponent', () => {
  let component: UserUploadComponent;
  let fixture: ComponentFixture<UserUploadComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserUploadComponent],
      imports: [SuiModule, HttpClientTestingModule, Ng2IziToastModule, FormsModule, ReactiveFormsModule, RouterTestingModule],
      providers: [OrgManagementService, ConfigService, ToasterService,
        ResourceService, LearnerService, FormBuilder,
        { provide: Router, useClass: RouterStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should call redirect', () => {
    const router = TestBed.get(Router);
    component.redirect();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['bulkUpload']);
  });
  it('should call downloadSample method to download a csv file', () => {
    component.downloadSampleCSV();
    fixture.detectChanges();
  });
  xit('should call openImageBrowser method', () => {
    component.uploadUserForm.value.provider = 1234;
    component.uploadUserForm.value.externalId = 5678;
    component.uploadUserForm.value.organizationId = 98765;
    component.openImageBrowser('inputbtn');
    fixture.detectChanges();
  });
  it('should not call openImageBrowser method', () => {
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = testData.mockRes.resourceBundle.messages;
    component.openImageBrowser('inputbtn');
    fixture.detectChanges();
    expect(component.bulkUploadError).toBe(true);
  });
  it('should call closeBulkUploadError method', () => {
    component.closeBulkUploadError();
    expect(component.showLoader).toBe(false);
    fixture.detectChanges();
  });
  it('should call uploadUsersCSV method and return success response with processId', () => {
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const orgManagementService = TestBed.get(OrgManagementService);
    resourceService.messages = testData.mockRes.resourceBundle.messages;
    spyOn(orgManagementService, 'bulkUserUpload').and.callFake(() => Observable.of(testData.mockRes.successResponse));
    component.uploadUsersCSV(testData.mockRes.validfile);
  });
  it('should not call uploadUsersCSV method', () => {
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = testData.mockRes.resourceBundle.messages;
    component.uploadUsersCSV(testData.mockRes.invalidfile);
    spyOn(toasterService, 'error').and.callThrough();
    component.bulkUploadError = true;
    expect(component.bulkUploadError).toBe(true);
  });
  it('should call uploadUsersCSV method and return error response', () => {
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const orgManagementService = TestBed.get(OrgManagementService);
    resourceService.messages = testData.mockRes.resourceBundle.messages;
    spyOn(orgManagementService, 'bulkUserUpload').and.callFake(() => Observable.of(testData.mockRes.errorResponse));
    component.uploadUsersCSV(testData.mockRes.errorfile);
  });
});
