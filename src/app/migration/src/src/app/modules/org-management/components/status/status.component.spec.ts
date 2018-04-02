import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { LearnerService, CoreModule } from '@sunbird/core';
import { OrgManagementService } from '@sunbird/org-management';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService, ToasterService, ConfigService, SharedModule } from '@sunbird/shared';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { StatusComponent } from './status.component';
import { FormBuilder } from '@angular/forms';
import { mockRes } from './status.component.spec.data';

describe('StatusComponent', () => {
  let component: StatusComponent;
  let fixture: ComponentFixture<StatusComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatusComponent],
      imports: [SuiModule, HttpClientTestingModule, Ng2IziToastModule, CoreModule, SharedModule],
      providers: [OrgManagementService, FormBuilder,
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
  it('should call redirect', () => {
    const router = TestBed.get(Router);
    spyOn(component, 'redirect').and.callThrough();
    component.redirect();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['bulkUpload']);
  });
  it('should call organization management service and get success status based on given processId', () => {
    const resourceService = TestBed.get(ResourceService);
    const orgManagementService = TestBed.get(OrgManagementService);
    resourceService.messages = mockRes.resourceBundle.messages;
    spyOn(orgManagementService, 'getBulkUploadStatus').and.callFake(() => Observable.of(mockRes.successResponse));
    const processId = '012465880638177280660';
    component.getBulkUploadStatus(processId);
    component.statusResponse = mockRes.successResponse.result.response[0];
    fixture.detectChanges();
  });
  it('should call organization management service and get failure status based on given processId', () => {
    const resourceService = TestBed.get(ResourceService);
    const orgManagementService = TestBed.get(OrgManagementService);
    resourceService.messages = mockRes.resourceBundle.messages;
    spyOn(orgManagementService, 'getBulkUploadStatus').and.callFake(() => Observable.of(mockRes.failureResponse));
    const processId = '012465880638177280660';
    component.getBulkUploadStatus(processId);
    component.statusResponse = mockRes.successResponse.result.response[0];
    fixture.detectChanges();
  });
  xit('should call organization management service and get error response based on given processId', () => {
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const orgManagementService = TestBed.get(OrgManagementService);
    resourceService.messages = mockRes.resourceBundle.messages;
    spyOn(orgManagementService, 'getBulkUploadStatus').and.callFake(() => Observable.of(mockRes.errorResponse));
    const processId = '1234';
    component.getBulkUploadStatus(processId);
    const errMsg = mockRes.resourceBundle.messages.fmsg;
    toasterService.error(mockRes.errorResponse.params.errmsg);
    expect(mockRes.errorResponse.responseCode).toBe('RESOURCE_NOT_FOUND');
    expect(mockRes.errorResponse.params.errmsg).toBe('Invalid Process Id');
    fixture.detectChanges();
  });
  it('should call getStatusResult to get the status result', () => {
    component.getStatusResult('success');
    fixture.detectChanges();
  });
});
