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
import { StatusComponent } from './status.component';
import { NgForm, FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as testData from './status.component.spec.data';

describe('StatusComponent', () => {
  let component: StatusComponent;
  let fixture: ComponentFixture<StatusComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatusComponent],
      imports: [SuiModule, HttpClientTestingModule, Ng2IziToastModule],
      providers: [Ng2IzitoastService, OrgManagementService, ConfigService, ToasterService, ResourceService, LearnerService, FormBuilder, HttpClient,
        { provide: Router, useClass: RouterStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call redirect', () => {
    component.redirect();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should call organization management service and get failure or success status based on given processId', inject([OrgManagementService,
    ResourceService, ToasterService, HttpClient], (orgManagementService, resourceService, toasterService, http) => {
      spyOn(orgManagementService, 'bulkUploadStatus').and.callFake(() => Observable.of(testData.mockRes.successResponse));
      spyOn(component, 'getBulkUploadStatus').and.callThrough();
      const processId = '012465880638177280660';
      component.getBulkUploadStatus(processId);
      orgManagementService.bulkUploadStatus(processId).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
          spyOn(toasterService, 'success').and.callThrough();
          // expect(component.showLoader).toBe(false);
        }
      )
      spyOn(resourceService, 'getResource').and.callThrough();
      fixture.detectChanges();
      expect(component).toBeTruthy();
    }));
  it('should call organization management service and get error response based on given processId', inject([OrgManagementService,
    ResourceService, ToasterService, HttpClient], (orgManagementService, resourceService, toasterService, http) => {
      component.getBulkUploadStatus('12134');
      spyOn(orgManagementService, 'bulkUploadStatus').and.callFake(() => Observable.of(testData.mockRes.errorResponse));
      spyOn(component, 'getBulkUploadStatus').and.callThrough();
      const processId = '123456';
      component.getBulkUploadStatus(processId);
      orgManagementService.bulkUploadStatus(processId).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('RESOURCE_NOT_FOUND');
          spyOn(toasterService, 'error').and.callThrough();
          // expect(component.showLoader).toBe(false);
        }
      )
      spyOn(resourceService, 'getResource').and.callThrough();
      // spyOn(toasterService, 'error').and.callThrough();
      // expect(component.showLoader).toBe(false);
      fixture.detectChanges();
      expect(component).toBeTruthy();
    }));
  it('should call getStatusResult to get the status result', () => {
    component.getStatusResult('success');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
