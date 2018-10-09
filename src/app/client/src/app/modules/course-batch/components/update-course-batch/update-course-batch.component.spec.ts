import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCourseBatchComponent } from './update-course-batch.component';
import { FormsModule, NgForm, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  of as observableOf,
  throwError as observableThrowError, Observable
} from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule, ResourceService, ToasterService } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { CourseBatchService } from '../../services';
import { UserService } from '@sunbird/core';
import { mockResponse } from './update-course-batch.component.spec.data';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

const resourceServiceMockData = {
  messages: {
    imsg: { m0027: 'Something went wrong' },
    stmsg: {
      m0009: 'error',
      m0119: 'We are updating batch...'
    },
    smsg: { m0034: 'Batch Updated sucessfully' },
    fmsg: { 'm0052': 'Creating batch failed, please try again later...' }
  },
  frmelmnts: {
    btn: {
      tryagain: 'tryagain',
      close: 'close'
    },
    lbl: {
      description: 'description',
      createnewbatch: ''
    }
  }
};
const fakeActivatedRoute = {
  'params': observableOf({ 'courseId': 'do_1125083286221291521153', 'batchId': '01248661735846707228' }),
  'parent': { 'params': observableOf({ 'courseId': 'do_1125083286221291521153' }) },
  'snapshot': {
    params: [
      {
        courseId: 'do_1125083286221291521153',
        batchId: '01248661735846707228'
      }
    ],
    data: {
      telemetry: { env: 'course', pageid: 'batch-edit', type: 'view', object: { ver: '1.0', type: 'batch' } },
      roles: 'coursebacthesRole'
    }
  }
};
describe('UpdateCourseBatchComponent', () => {
  let component: UpdateCourseBatchComponent;
  let fixture: ComponentFixture<UpdateCourseBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [UpdateCourseBatchComponent],
      imports: [SuiModule, FormsModule, ReactiveFormsModule, FormsModule, SharedModule.forRoot(),
        CoreModule.forRoot(), SuiModule, RouterTestingModule,
        HttpClientTestingModule],
      providers: [CourseBatchService, ToasterService,
        { provide: Router, useClass: RouterStub },
        { provide: ResourceService, useValue: resourceServiceMockData },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCourseBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should initialize the component expected calls for initializeUpdateForm and  fetchBatchDetails ', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    resourceService.messages = mockResponse.resourceBundle.messages;
    const userService = TestBed.get(UserService);
    spyOn(courseBatchService, 'getCourseHierarchy').and.
      returnValue(observableOf({ createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed' }));
    spyOn(courseBatchService, 'getUpdateBatchDetails').and.
      returnValue(observableOf(mockResponse.updateBatchDetails));
    component.ngOnInit();
    expect(component.courseCreator).toBeFalsy();
    expect(component.showUpdateModal).toBeTruthy();
    expect(component.batchUpdateForm.status).toBe('VALID');
    expect(component.disableSubmitBtn).toBeFalsy();
  });
  it('should update batch and show success message if api return success', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    resourceService.messages = mockResponse.resourceBundle.messages;
    const userService = TestBed.get(UserService);
    userService._userProfile = { organisationIds: [] };
    spyOn(courseBatchService, 'getUserList').and.returnValue(observableOf(mockResponse.getUserList));
    spyOn(courseBatchService, 'getCourseHierarchy').and.
      returnValue(observableOf({ createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed' }));
    spyOn(courseBatchService, 'getUpdateBatchDetails').and.
      returnValue(observableOf(mockResponse.updateBatchDetails));
    spyOn(toasterService, 'success').and.callThrough();
    toasterService.success(resourceServiceMockData.messages.smsg.m0034);
    component.ngOnInit();
    component.updateBatch();
    expect(component.updateBatch).toBeDefined();
    expect(toasterService.success).toHaveBeenCalledWith(resourceServiceMockData.messages.smsg.m0034);
    expect(component.showLoader).toBeTruthy();
  });
  it('should update batch and show error message if api fails', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    resourceService.messages = mockResponse.resourceBundle.messages;
    const userService = TestBed.get(UserService);
    userService._userProfile = { organisationIds: [] };
    spyOn(courseBatchService, 'getUserList').and.returnValue(observableOf(mockResponse.getUserList));
    spyOn(courseBatchService, 'getCourseHierarchy').and.
      returnValue(observableOf({ createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed' }));
    spyOn(courseBatchService, 'getUpdateBatchDetails').and.
      returnValue(observableOf(mockResponse.updateBatchDetails));
    spyOn(courseBatchService, 'updateBatch').and.returnValue(observableThrowError({}));
    spyOn(toasterService, 'error').and.callThrough();
    toasterService.error(resourceServiceMockData.messages.fmsg.m0052);
    component.ngOnInit();
    component.updateBatch();
    expect(toasterService.error).toHaveBeenCalledWith(resourceServiceMockData.messages.fmsg.m0052);
    expect(component.showLoader).toBeFalsy();
  });
});
