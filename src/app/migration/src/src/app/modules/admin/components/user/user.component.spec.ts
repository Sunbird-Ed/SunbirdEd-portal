import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { LearnerService, OrgManagementService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse, ConfigService } from '@sunbird/shared';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { NgForm, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserComponent } from './user.component';
import * as testData from './user.component.spec.data';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserComponent],
      imports: [SuiModule, HttpClientTestingModule, Ng2IziToastModule],
      providers: [Ng2IzitoastService, OrgManagementService, ConfigService, ToasterService,
        ResourceService, LearnerService, FormBuilder, HttpClient,
        { provide: Router, useClass: RouterStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call redirect', () => {
    const router = TestBed.get(Router);
    // spyOn(component, 'redirect').and.callThrough();
    component.redirect();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['bulkUpload']);
  });
  it('should call downloadSample method to download a csv file', () => {
    // spyOn(component, 'downloadSample').and.callThrough();
    component.downloadSample();
    fixture.detectChanges();
    expect(component.downloadSample).toHaveBeenCalled();
  });
  xit('should call openImageBrowser method', () => {
    component.uploadUserForm.value.provider = 1234;
    component.uploadUserForm.value.externalId = 5678;
    component.uploadUserForm.value.organizationId = 98765;
    component.openImageBrowser('inputbtn');
    fixture.detectChanges();
    // spyOn(component, 'openImageBrowser').and.callThrough();
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
  it('should call uploadUser method and return success response with processId', () => {
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const http = TestBed.get(HttpClient);
    const orgManagementService = TestBed.get(OrgManagementService);
    const file = [{
      name: 'users.csv',
      firstName: 'Vaish',
      lastName: 'M',
      phone: '7899918811',
      email: 'vaish@gmail.com',
      userName: 'vaishnavi',
      password: 'vaish',
      provider: '',
      phoneVerified: '',
      emailVerified: '',
      roles: 'CONTENT_CREATOR',
      position: '',
      grade: '',
      location: '',
      dob: '',
      gender: '',
      language: '',
      profileSummary: '',
      subject: '',
      externalId: 5678,
      organizationId: 9876
    }];
    resourceService.messages = testData.mockRes.resourceBundle.messages;
    // spyOn(component, 'uploadUser').and.callThrough();
    spyOn(orgManagementService, 'bulkUserUpload').and.callFake(() => Observable.of(testData.mockRes.successResponse));
    component.uploadUser(file);
    // orgManagementService.bulkUserUpload().subscribe(
    //   apiResponse => {
    //     console.log('api', apiResponse);
    //     expect(component.processId).not.toBe(null);
    //     expect(component.showLoader).toBe(false);
    //     expect(apiResponse.responseCode).toBe('OK');
    //   });
    // spyOn(resourceService, 'getResource').and.callThrough();
    // spyOn(toasterService, 'success').and.callThrough();
  });
  it('should not call uploadUser method', () => {
    const file = [{
      name: 'test.png'
    }];
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = testData.mockRes.resourceBundle.messages;
    // spyOn(component, 'uploadUser').and.callThrough();
    component.uploadUser(file);
    spyOn(toasterService, 'error').and.callThrough();
    component.bulkUploadError = true;
    expect(component.bulkUploadError).toBe(true);
  });
  it('should call uploadUser method and return error response', () => {
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const http = TestBed.get(HttpClient);
    const orgManagementService = TestBed.get(OrgManagementService);
    const file = [{
      name: 'user.csv',
      firstName: 'Vaish',
      lastName: 'M',
      userName: 'vaishnavi',
      password: 'vaish',
      subject: ''
    }];
    resourceService.messages = testData.mockRes.resourceBundle.messages;
    // spyOn(component, 'uploadUser').and.callThrough();
    spyOn(orgManagementService, 'bulkUserUpload').and.callFake(() => Observable.of(testData.mockRes.errorResponse));
    component.uploadUser(file);
    // orgManagementService.bulkUserUpload().subscribe(
    //   apiResponse => { },
    //   err => {
    //     component.showLoader = false;
    //     orgManagementService.toasterService.error(err.error.params.errmsg);
    //     spyOn(resourceService, 'getResource').and.callThrough();
    //     spyOn(toasterService, 'error').and.callThrough();
    //   }
    // );
  });
});
