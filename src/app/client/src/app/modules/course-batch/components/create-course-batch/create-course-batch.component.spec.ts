import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed, tick , fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CreateCourseBatchComponent } from './create-course-batch.component';
import { FormsModule, NgForm, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of as observableOf,
  throwError as observableThrowError,  Observable } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {SharedModule, ResourceService, ToasterService} from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import {CourseBatchService} from '../../services';
import { UserService } from '@sunbird/core';
import { mockResponse } from './cretae-course-batch.component.spec.data';
class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

const resourceServiceMockData = {
  messages: {
    imsg: { m0027: 'Something went wrong' },
    stmsg: { m0009: 'error', m0118 : ' We are creating batch ' },
    smsg: {m0033 : 'Batch created sucessfully'},
    fmsg: {m0052: 'Creating batch failed, please try again later...'}
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
  'params': observableOf({ 'courseId': 'do_1125083286221291521153' }),
  'parent': { 'params': observableOf({ 'courseId': 'do_1125083286221291521153' }) },
  'snapshot': {
      params: [
        {
          courseId: 'do_1125083286221291521153',
        }
      ],
      data: {
        telemetry: { env: 'course', pageid: 'batch-create', type: 'view',  mode: 'create',
        object: { ver: '1.0', type: 'batch' }
       }
      }
    }
};

describe('CreateCourseBatchComponent', () => {
  let component: CreateCourseBatchComponent;
  let fixture: ComponentFixture<CreateCourseBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({

      declarations: [CreateCourseBatchComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule, FormsModule, SharedModule.forRoot(), CoreModule.forRoot(), SuiModule, RouterTestingModule,
        HttpClientTestingModule, TelemetryModule.forRoot() ],
      providers: [CourseBatchService, ToasterService, ResourceService,
        { provide: Router, useClass: RouterStub },
        { provide: ResourceService, useValue: resourceServiceMockData },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCourseBatchComponent);
    component = fixture.componentInstance;
  });

  it('should initialize the component expected calls for initializeFormFields and  fetchBatchDetails ', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    resourceService.messages = mockResponse.resourceBundle.messages;
    const userService = TestBed.get(UserService);
    spyOn(courseBatchService, 'getCourseHierarchy').and.
    returnValue(observableOf({createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed'}));
    spyOn(toasterService, 'success').and.callThrough();
    component.ngOnInit();
    expect(component.createBatchForm.status).toBe('INVALID');
    expect(component.courseCreator).toBeFalsy();
  });
  it('should create batch and show success message if api return success', () => {
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
    returnValue(observableOf({createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed'}));
    spyOn(courseBatchService, 'createBatch').and.returnValue(observableOf(mockResponse.createBatchDetails));
    spyOn(toasterService, 'success').and.callThrough();
    toasterService.success(resourceServiceMockData.messages.smsg.m0033);
    fixture.detectChanges();
    component.createBatchForm.value.startDate = new Date();
    component.createBatch();
    expect(component.createBatchForm).toBeDefined();
    expect(toasterService.success).toHaveBeenCalledWith(resourceServiceMockData.messages.smsg.m0033);
    expect(component.showLoader).toBeFalsy();
  });
  it('should create batch and show error message if api fails', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const toasterService = TestBed.get(ToasterService);
    const userService = TestBed.get(UserService);
    userService._userProfile = { organisationIds: [] };
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    resourceService.messages = mockResponse.resourceBundle.messages;
    spyOn(courseBatchService, 'getUserList').and.returnValue(observableOf(mockResponse.getUserList));
    spyOn(courseBatchService, 'getCourseHierarchy').and.
    returnValue(observableOf({createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed'}));
    spyOn(courseBatchService, 'createBatch').and.returnValue(observableThrowError({}));
    spyOn(toasterService, 'error').and.callThrough();
    toasterService.error(resourceServiceMockData.messages.fmsg.m0052);
    fixture.detectChanges();
    component.createBatchForm.value.startDate = new Date();
    component.createBatch();
    expect(component.createBatchForm).toBeDefined();
    expect(toasterService.error).toHaveBeenCalledWith(resourceServiceMockData.messages.fmsg.m0052);
    expect(component.showLoader).toBeFalsy();
  });
});
