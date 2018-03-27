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
  it('should call organization management service and get success status based on given processId', () => {
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const http = TestBed.get(HttpClient);
    const orgManagementService = TestBed.get(OrgManagementService);
    resourceService.messages = testData.mockRes.resourceBundle.messages;
    spyOn(orgManagementService, 'bulkUploadStatus').and.callFake(() => Observable.of(testData.mockRes.successResponse));
    // spyOn(component, 'getBulkUploadStatus').and.callThrough();
    const processId = '012465880638177280660';
    component.getBulkUploadStatus(processId);
    component.success = testData.mockRes.successResponse.result.response[0].successResult;
    fixture.detectChanges();
  });
  it('should call organization management service and get failure status based on given processId', () => {
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const http = TestBed.get(HttpClient);
    const orgManagementService = TestBed.get(OrgManagementService);
    resourceService.messages = testData.mockRes.resourceBundle.messages;
    spyOn(orgManagementService, 'bulkUploadStatus').and.callFake(() => Observable.of(testData.mockRes.failureResponse));
    const processId = '012465880638177280660';
    component.getBulkUploadStatus(processId);
    component.success = testData.mockRes.successResponse.result.response[0].failureResult;
    fixture.detectChanges();
  });
  xit('should call organization management service and get error response based on given processId', () => {
    // component.getBulkUploadStatus('12134');
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const http = TestBed.get(HttpClient);
    const orgManagementService = TestBed.get(OrgManagementService);
    resourceService.messages = testData.mockRes.resourceBundle.messages;
    spyOn(orgManagementService, 'bulkUploadStatus').and.callFake(() => Observable.of(testData.mockRes.errorResponse));
    const processId = '1234';
    component.getBulkUploadStatus(processId);
    const errMsg = testData.mockRes.resourceBundle.messages.fmsg;
    toasterService.error(testData.mockRes.errorResponse.params.errmsg);
    expect(testData.mockRes.errorResponse.responseCode).toBe('RESOURCE_NOT_FOUND');
    expect(testData.mockRes.errorResponse.params.errmsg).toBe('Invalid Process Id');
    fixture.detectChanges();
  });
  it('should call getStatusResult to get the status result', () => {
    component.getStatusResult('success');
    fixture.detectChanges();
  });
});
