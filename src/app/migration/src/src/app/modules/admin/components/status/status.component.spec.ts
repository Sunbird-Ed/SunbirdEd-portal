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
      providers: [Ng2IzitoastService, OrgManagementService, ConfigService, ToasterService,
        ResourceService, LearnerService, FormBuilder, HttpClient,
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
    const router = TestBed.get(Router);
    spyOn(component, 'redirect').and.callThrough();
    component.redirect();
    fixture.detectChanges();
    expect(component.redirect).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['bulkUpload']);
  });
  it('should call organization management service and get failure or success status based on given processId', () => {
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const http = TestBed.get(HttpClient);
    const orgManagementService = TestBed.get(OrgManagementService);
    spyOn(orgManagementService, 'bulkUploadStatus').and.callFake(() => Observable.of(testData.mockRes.successResponse));
    spyOn(component, 'getBulkUploadStatus').and.callThrough();
    const processId = '012465880638177280660';
    component.getBulkUploadStatus(processId);
    orgManagementService.bulkUploadStatus(processId).subscribe(
      apiResponse => {
        expect(apiResponse.responseCode).toBe('OK');
        spyOn(toasterService, 'success').and.callThrough();
        // expect(component.showLoader).toBe(false);
      });
    spyOn(resourceService, 'getResource').and.callThrough();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should call organization management service and get error response based on given processId', () => {
    component.getBulkUploadStatus('12134');
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const http = TestBed.get(HttpClient);
    const orgManagementService = TestBed.get(OrgManagementService);
    spyOn(orgManagementService, 'bulkUploadStatus').and.callFake(() => Observable.of(testData.mockRes.errorResponse));
    spyOn(component, 'getBulkUploadStatus').and.callThrough();
    spyOn(resourceService, 'getResource').and.callThrough();
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(http, 'get').and.callFake(() => Observable.of(testData.mockRes.resourceBundle));
    http.get().subscribe(
      data => {
        resourceService.messages = data.messages;
      }
    );
    const processId = '123456';
    component.getBulkUploadStatus(processId);
    orgManagementService.bulkUploadStatus(processId).subscribe(
      apiResponse => {
        console.log('correct');
      },
      err => {
        console.log('here');
        expect(component.showLoader).toBe(false);
        expect(err.params.status).toBe('INVALID_PROCESS_ID');
        expect(err.error.responseCode).toBe('RESOURCE_NOT_FOUND');
      });
    spyOn(resourceService, 'getResource').and.callThrough();
    // spyOn(toasterService, 'error').and.callThrough();
    // expect(component.showLoader).toBe(false);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should call getStatusResult to get the status result', () => {
    component.getStatusResult('success');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
