
import { of as observableOf,
  throwError as observableThrowError,  Observable } from 'rxjs';
import { getUserList, updateBatchDetails, getUserDetails } from './../update-course-batch/update-course-batch.component.data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, tick , fakeAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import {SharedModule, ResourceService, ToasterService} from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';
import { CreateBatchComponent } from './create-batch.component';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mockResponse } from './create-batch.component.data';
import { LearnModule, CourseBatchService,
  CourseProgressService, CourseConsumptionService} from '@sunbird/learn';


class RouterStub {
  navigate = jasmine.createSpy('navigate');
}
let originalTimeout;
const resourceServiceMockData = {
  messages: {
    imsg: { m0027: 'Something went wrong' },
    stmsg: { m0009: 'error' },
    smsg: {m0033 : 'success'},
    fmsg: {m0052: 'error'}
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
        telemetry: {
          object: {}
        }
      }
    }
};

describe('CreateBatchComponent', () => {
  let component: CreateBatchComponent;
  let fixture: ComponentFixture<CreateBatchComponent>;

  beforeEach(async(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    TestBed.configureTestingModule({
      declarations: [CreateBatchComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [SharedModule.forRoot(), CoreModule, SuiModule, RouterTestingModule,
        HttpClientTestingModule, LearnModule],
      providers: [CourseBatchService, ToasterService, ResourceService, UserService, CourseConsumptionService,
        CourseProgressService, TelemetryService, { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBatchComponent);
    component = fixture.componentInstance;
  });
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it('should fetch batch details and show update Form model', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseBatchService, 'getUserList').and.returnValue(observableOf(getUserList));
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.
    returnValue(observableOf({createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed'}));
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    fixture.detectChanges();
    expect(component.participantList.length).toBe(3);
    expect(component.mentorList.length).toBe(1);
    expect(component.mentorList[0].id).toBe('b2479136-8608-41c0-b3b1-283f38c338ed');
    expect(component.courseCreator).toBeDefined();
    expect(component.createBatchForm).toBeDefined();
    expect(component.showCreateModal).toBeTruthy();
  });
  it('should create batch and show success message if api return success', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const toasterService = TestBed.get(ToasterService);
    const userService = TestBed.get(UserService);
    userService._userProfile = { organisationIds: [] };
    spyOn(courseBatchService, 'getUserList').and.returnValue(observableOf(getUserList));
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.
    returnValue(observableOf({createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed'}));
    spyOn(courseBatchService, 'createBatch').and.returnValue(observableOf(updateBatchDetails));
    spyOn(toasterService, 'success');
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    fixture.detectChanges();
    component.createBatchForm.value.startDate = new Date();
    component.createBatch();
    expect(component.createBatchForm).toBeDefined();
    expect(component.showCreateModal).toBeTruthy();
    expect(toasterService.success).toHaveBeenCalledWith('success');
  });
  it('should create batch and show error message if api fails', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const toasterService = TestBed.get(ToasterService);
    const userService = TestBed.get(UserService);
    userService._userProfile = { organisationIds: [] };
    spyOn(courseBatchService, 'getUserList').and.returnValue(observableOf(getUserList));
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.
    returnValue(observableOf({createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed'}));
    spyOn(courseBatchService, 'createBatch').and.returnValue(observableThrowError(updateBatchDetails));
    spyOn(toasterService, 'error');
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    fixture.detectChanges();
    component.createBatchForm.value.startDate = new Date();
    component.createBatch();
    expect(component.createBatchForm).toBeDefined();
    expect(component.showCreateModal).toBeTruthy();
    expect(toasterService.error).toHaveBeenCalledWith('error');
  });

  it('should create batch with enrollment date and return success message ', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const toasterService = TestBed.get(ToasterService);
    const userService = TestBed.get(UserService);
    userService._userProfile = { organisationIds: [] };
    spyOn(courseBatchService, 'getUserList').and.returnValue(observableOf(getUserList));
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.
    returnValue(observableOf({createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed'}));
    spyOn(courseBatchService, 'createBatch').and.returnValue(observableOf(updateBatchDetails));
    spyOn(toasterService, 'success');
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    fixture.detectChanges();
    component.createBatchForm.value.startDate = new Date('10 april 2019');
    component.createBatchForm.value.enrollmentType = 'open';
    component.createBatchForm.value.enrollmentEndDate = new Date('9 april 2019');
    component.createBatch();
    expect(component.createBatchForm).toBeDefined();
    expect(component.showCreateModal).toBeTruthy();
    expect(toasterService.success).toHaveBeenCalledWith('success');
  });
});
