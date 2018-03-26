import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
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
  it('should call redirect', inject([Router], (router) => {
    spyOn(component, 'redirect').and.callThrough();
    component.redirect();
    fixture.detectChanges();
    expect(component.redirect).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['bulkUpload']);
  }));
  xit('should call downloadSample method to download a csv file', () => {
    spyOn(component, 'downloadSample').and.callThrough();
    component.downloadSample();
    fixture.detectChanges();
    expect(component.downloadSample).toHaveBeenCalled();
  });
  it('should call openImageBrowser method', () => {
    component.uploadUserForm.value.provider = 1234;
    component.uploadUserForm.value.externalId = 5678;
    component.uploadUserForm.value.organizationId = 98765;
    component.openImageBrowser('inputbtn');
    fixture.detectChanges();
    spyOn(component, 'openImageBrowser').and.callThrough();
  });
  it('should not call openImageBrowser method', () => {
    spyOn(component, 'openImageBrowser').and.callThrough();
    component.openImageBrowser('inputbtn');
    fixture.detectChanges();
    expect(component.bulkUploadError).toBe(true);
  });
  it('should call closeBulkUploadError method', () => {
    spyOn(component, 'closeBulkUploadError').and.callThrough();
    component.closeBulkUploadError();
    expect(component.closeBulkUploadError).toHaveBeenCalled();
    expect(component.showLoader).toBe(false);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should call uploadUser method and return success response with processId', inject([OrgManagementService,
    ResourceService, ToasterService, HttpClient], (orgManagementService, resourceService, toasterService, http) => {
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
        user: file,
        externalId: 5678,
        organizationId: 9876
      }];
      spyOn(component, 'uploadUser').and.callThrough();
      spyOn(orgManagementService, 'bulkUserUpload').and.callFake(() => Observable.of(testData.mockRes.successResponse));
      component.uploadUser(file);
      orgManagementService.bulkUserUpload().subscribe(
        apiResponse => {
          console.log('api', apiResponse);
          expect(component.processId).not.toBe(null);
          expect(component.showLoader).toBe(false);
          expect(apiResponse.responseCode).toBe('OK');
        });
      spyOn(resourceService, 'getResource').and.callThrough();
      spyOn(toasterService, 'success').and.callThrough();
    }));
  it('should not call uploadUser method', () => {
    const file = '';
    spyOn(component, 'uploadUser').and.callThrough();
    component.uploadUser(file);
    expect(component.bulkUploadError).toBe(true);
    // orgManagementService.bulkOrgUpload().subscribe(
    //   apiResponse => {
    //     expect(component.showLoader).toBe(false);
    //     expect(apiResponse.responseCode).toBe('OK');
    //   }
    // )
  });
  it('should call uploadUser method and return error response', inject([OrgManagementService,
    ResourceService, ToasterService, HttpClient], (orgManagementService, resourceService, toasterService, http) => {
      const file = [{
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
        subject: ''
      }];
      spyOn(component, 'uploadUser').and.callThrough();
      spyOn(orgManagementService, 'bulkUserUpload').and.callFake(() => Observable.of(testData.mockRes.errorResponse));
      component.uploadUser(file);
      orgManagementService.bulkUserUpload().subscribe(
        apiResponse => {
          expect(component.showLoader).toBe(false);
          expect(apiResponse.responseCode).toBe('CLIENT_ERROR');
        }
      );
      spyOn(resourceService, 'getResource').and.callThrough();
      spyOn(toasterService, 'error').and.callThrough();
    }));
});
