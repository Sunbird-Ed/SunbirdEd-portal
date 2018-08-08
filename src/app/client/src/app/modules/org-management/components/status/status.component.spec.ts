
import {of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { LearnerService, CoreModule } from '@sunbird/core';
import { OrgManagementService } from '@sunbird/org-management';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService, ToasterService, ConfigService, SharedModule } from '@sunbird/shared';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { StatusComponent } from './status.component';
import { FormBuilder } from '@angular/forms';
import { mockRes } from './status.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';
describe('StatusComponent', () => {
  let component: StatusComponent;
  let fixture: ComponentFixture<StatusComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    'data': observableOf({ 'redirectUrl': '/profile' }),
    snapshot: {
      data: {
        telemetry: {
          env: 'profile', pageid: 'profile-bulk-upload-check-status', subtype: 'paginate', type: 'view',
          object: { type: '', ver: '1.0' }
        }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatusComponent],
      imports: [SuiModule, HttpClientTestingModule, Ng2IziToastModule, CoreModule.forRoot(), SharedModule.forRoot(),
        TelemetryModule.forRoot()],
      providers: [OrgManagementService, FormBuilder,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
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
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });
  it('should call organization management service and get success status based on given processId', () => {
    const resourceService = TestBed.get(ResourceService);
    const orgManagementService = TestBed.get(OrgManagementService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = mockRes.resourceBundle.messages;
    spyOn(orgManagementService, 'getBulkUploadStatus').and.callFake(() => observableOf(mockRes.successResponse));
    spyOn(toasterService, 'success').and.callThrough();
    const processId = '012465880638177280660';
    component.getBulkUploadStatus(processId);
    expect(toasterService.success).toHaveBeenCalledWith(mockRes.resourceBundle.messages.smsg.m0032);
    expect(component.statusResponse).toEqual(mockRes.successResponse.result.response[0]);
  });
  it('should call organization management service and get failure status based on given processId', () => {
    const resourceService = TestBed.get(ResourceService);
    const orgManagementService = TestBed.get(OrgManagementService);
    resourceService.messages = mockRes.resourceBundle.messages;
    spyOn(orgManagementService, 'getBulkUploadStatus').and.callFake(() => observableOf(mockRes.failureResponse));
    const processId = '012465880638177280660';
    component.getBulkUploadStatus(processId);
    component.statusResponse = mockRes.successResponse.result.response[0];
  });
  it('should call getStatusResult to get the status result', () => {
    component.getStatusResult('success');
    fixture.detectChanges();
  });
  it('should recognize viewchild', () => {
    const modal = fixture.componentInstance.modal;
    component.ngOnDestroy();
    expect(component.modal).toBeDefined();
  });
  it('should unsubscribe from all observable subscriptions', () => {
    const processId = '012465880638177280660';
    component.getBulkUploadStatus(processId);
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });
  it('should call getBulkUploadStatus method and pass else condition if processId contains only whiteSpaces', () => {
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const orgManagementService = TestBed.get(OrgManagementService);
    resourceService.messages = mockRes.resourceBundle.messages;
    spyOn(orgManagementService, 'getBulkUploadStatus').and.callFake(() => observableOf(mockRes.errorResponse));
    const processId = '  ';
    spyOn(toasterService, 'error').and.callThrough();
    component.statusForm.value.processId = '   ';
    component.getBulkUploadStatus(processId);
    expect(toasterService.error).toHaveBeenCalledWith(mockRes.resourceBundle.messages.stmsg.m0006);
    expect(component.showLoader).toBeFalsy();
  });
});
