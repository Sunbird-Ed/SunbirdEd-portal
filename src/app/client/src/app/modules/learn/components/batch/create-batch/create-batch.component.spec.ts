
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule, UserService } from '@sunbird/core';
import {
  CourseBatchService,
  CourseConsumptionService, CourseProgressService, LearnModule
} from '@sunbird/learn';
import { ResourceService, SharedModule, ToasterService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { SuiModule } from 'ng2-semantic-ui-v9';
import {
  of as observableOf,
  throwError as observableThrowError
} from 'rxjs';
import { getUserList, updateBatchDetails, MockResponseData} from './../update-course-batch/update-course-batch.component.data';
import { CreateBatchComponent } from './create-batch.component';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { DiscussionService } from '../../../../../../app/modules/discussion/services/discussion/discussion.service';
import { FormGroup, FormControl } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


class RouterStub {
  navigate = jasmine.createSpy('navigate');
}
let originalTimeout;
const resourceServiceMockData = {
  messages: {
    imsg: { m0027: 'Something went wrong' },
    stmsg: { m0009: 'error' },
    smsg: { m0033: 'success', m0034: 'success', m0065: 'enabled', m0066: 'disabled' },
    fmsg: { m0052: 'error' },
    emsg: { m0005: 'discussion forum error' }
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

xdescribe('CreateBatchComponent', () => {
  let component: CreateBatchComponent;
  let fixture: ComponentFixture<CreateBatchComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    TestBed.configureTestingModule({
      declarations: [CreateBatchComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [SharedModule.forRoot(), CoreModule, SuiModule, RouterTestingModule,
        HttpClientTestingModule, LearnModule, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [CourseBatchService, ToasterService, ResourceService, UserService, CourseConsumptionService,
        CourseProgressService, TelemetryService, DiscussionService, { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBatchComponent);
    component = fixture.componentInstance;
    spyOn(component, 'checkIssueCertificate').and.stub();
  });
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it('should fetch batch details and show update Form model', () => {
    const courseBatchService= <any> TestBed.inject(CourseBatchService);
    const courseConsumptionService= <any> TestBed.inject(CourseConsumptionService);
    spyOn(courseBatchService, 'getUserList').and.returnValue(observableOf(getUserList));
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.
      returnValue(observableOf({ createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed' }));
    const resourceService= <any> TestBed.inject(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    fixture.detectChanges();
    expect(component.participantList.length).toBe(2);
    expect(component.mentorList.length).toBe(1);
    expect(component.mentorList[0].id).toBe('b2479136-8608-41c0-b3b1-283f38c338ed');
    expect(component.courseCreator).toBeDefined();
    expect(component.createBatchForm).toBeDefined();
    expect(component.showCreateModal).toBeTruthy();
  });
  it('should create batch and show success message if api return success', () => {
    const courseBatchService= <any> TestBed.inject(CourseBatchService);
    const courseConsumptionService= <any> TestBed.inject(CourseConsumptionService);
    const toasterService= <any> TestBed.inject(ToasterService);
    const userService= <any> TestBed.inject(UserService);
    userService._userProfile = { organisationIds: [] };
    spyOn(courseBatchService, 'getUserList').and.returnValue(observableOf(getUserList));
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.
      returnValue(observableOf({ createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed' }));
    spyOn(courseBatchService, 'createBatch').and.returnValue(observableOf(updateBatchDetails));
    spyOn(toasterService, 'success');
    const resourceService= <any> TestBed.inject(ResourceService);
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
    const courseBatchService= <any> TestBed.inject(CourseBatchService);
    const courseConsumptionService= <any> TestBed.inject(CourseConsumptionService);
    const toasterService= <any> TestBed.inject(ToasterService);
    const userService= <any> TestBed.inject(UserService);
    userService._userProfile = { organisationIds: [] };
    spyOn(courseBatchService, 'getUserList').and.returnValue(observableOf(getUserList));
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.
      returnValue(observableOf({ createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed' }));
    spyOn(courseBatchService, 'createBatch').and.returnValue(observableThrowError(updateBatchDetails));
    spyOn(toasterService, 'error');
    const resourceService= <any> TestBed.inject(ResourceService);
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
    const courseBatchService= <any> TestBed.inject(CourseBatchService);
    const courseConsumptionService= <any> TestBed.inject(CourseConsumptionService);
    const toasterService= <any> TestBed.inject(ToasterService);
    const userService= <any> TestBed.inject(UserService);
    userService._userProfile = { organisationIds: [] };
    spyOn(courseBatchService, 'getUserList').and.returnValue(observableOf(getUserList));
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.
      returnValue(observableOf({ createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed' }));
    spyOn(courseBatchService, 'createBatch').and.returnValue(observableOf(updateBatchDetails));
    spyOn(toasterService, 'success');
    const resourceService= <any> TestBed.inject(ResourceService);
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

  it('should call redirect', () => {
    const router= <any> TestBed.inject(Router);
    component['createBatchModel'] = {
      deny: jasmine.createSpy('deny')
    };
    component.redirect();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should call reload', (done) => {
    const courseBatchService= <any> TestBed.inject(CourseBatchService);
    const router= <any> TestBed.inject(Router);
    spyOn(courseBatchService.updateEvent, 'emit');
    component['reload']();
    setTimeout(() => {
      expect(courseBatchService.updateEvent.emit).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
      done();
    }, 1100);
  });

  it('should call getUserOtherDetail, both email and phone', () => {
    const userData = { maskedEmail: 'sample@demo.com', maskedPhone: '9999888989' };
    const resp = component['getUserOtherDetail'](userData);
    expect(resp).toEqual(' (sample@demo.com, 9999888989)');
  });

  it('should call getUserOtherDetail, with email', () => {
    const userData = { maskedEmail: 'sample@demo.com' };
    const resp = component['getUserOtherDetail'](userData);
    expect(resp).toEqual(' (sample@demo.com)');
  });

  it('should call getUserOtherDetail, both email and phone', () => {
    const userData = { maskedPhone: '9999888989' };
    const resp = component['getUserOtherDetail'](userData);
    expect(resp).toEqual(' (9999888989)');
  });

  it('should call setTelemetryCData', () => {
    component.telemetryCdata = [{ id: 'do_22121' }];
    component.setTelemetryCData([]);
    expect(component.telemetryCdata).toBeDefined();
  });

  it('should call getUserListWithQuery', (done) => {
    component['userSearchTime'] = 100;
    spyOn(window, 'clearTimeout');
    spyOn<any>(component, 'getUserList');
    component['getUserListWithQuery']('query', 'type');
    expect(clearTimeout).toHaveBeenCalledWith(100);

    setTimeout(() => {
      expect(component['getUserList']).toHaveBeenCalledWith('query', 'type');
      done();
    }, 1100);
  });

  it('should call addParticipantToBatch', () => {
    const batchService= <any> TestBed.inject(CourseBatchService);
    const toasterService= <any> TestBed.inject(ToasterService);
    spyOn(batchService, 'addUsersToBatch').and.returnValue(of({}));
    spyOn(toasterService, 'success');
    spyOn<any>(component, 'reload');
    component['addParticipantToBatch'](2323212121, ['userId1', 'userId2']);
    expect(component.disableSubmitBtn).toBe(false);
    expect(toasterService.success).toHaveBeenCalledWith('success');
    expect(component['reload']).toHaveBeenCalled();
  });

  it('should call addParticipantToBatch, on error', () => {
    const batchService= <any> TestBed.inject(CourseBatchService);
    const toasterService= <any> TestBed.inject(ToasterService);
    spyOn(batchService, 'addUsersToBatch').and.returnValue(throwError({ params: {}, error: { params: { errmsg: 'error' } } }));
    spyOn(toasterService, 'error');
    component['addParticipantToBatch'](2323212121, ['userId1', 'userId2']);
    expect(component.disableSubmitBtn).toBe(false);
    expect(toasterService.error).toHaveBeenCalledWith('error');
  });

  it('should call addParticipantToBatch, on error', () => {
    const batchService= <any> TestBed.inject(CourseBatchService);
    const toasterService= <any> TestBed.inject(ToasterService);
    spyOn(batchService, 'addUsersToBatch').and.returnValue(throwError({}));
    spyOn(toasterService, 'error');
    component['addParticipantToBatch'](2323212121, ['userId1', 'userId2']);
    expect(component.disableSubmitBtn).toBe(false);
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('should fetch form config for batch discussion forum', () => {
    const discussionService= <any> TestBed.inject(DiscussionService);
    spyOn(discussionService, 'fetchForumConfig').and.returnValue(observableOf(MockResponseData.forumConfig));
    component.fetchForumConfig();
    expect(component.createForumRequest).toEqual(MockResponseData.forumConfig[0]);
  });

  it('should show error if form config not there', () => {
    const discussionService= <any> TestBed.inject(DiscussionService);
    const toasterService= <any> TestBed.inject(ToasterService);
    spyOn(discussionService, 'fetchForumConfig').and.returnValue(observableThrowError({}));
    spyOn(toasterService, 'error');
    component.fetchForumConfig();
    expect(toasterService.error).toHaveBeenCalledWith('discussion forum error');
  });

  it('should call enable discussion forum if enabled discussion if true', () => {
    spyOn(component, 'enableDiscussionForum');
    component.createBatchForm = new FormGroup({
      enableDiscussions: new FormControl('true')
    });
    const courseBatchService= <any> TestBed.inject(CourseBatchService);
    spyOn(courseBatchService.updateEvent, 'emit');
    component.checkEnableDiscussions('SOME_BATCH_ID');
    expect(component.enableDiscussionForum).toHaveBeenCalled();
  });

  it('should enabled discussion forum and log telemetry if formconfig available', () => {
    const discussionService= <any> TestBed.inject(DiscussionService);
    const toasterService= <any> TestBed.inject(ToasterService);
    spyOn(discussionService, 'createForum').and.returnValue(observableOf(MockResponseData.enableDiscussionForumData));
    spyOn(toasterService, 'success').and.stub();
    component.createForumRequest = {
      'category': {
        'name': 'General Discussion',
        'pid': '6',
        'id': '1',
        'description': '',
        'context': [
          {
            'type': 'batch',
            'identifier': '_batchId'
          }
        ]
      }
    };
    component.enableDiscussionForum('SOME_BATCH_ID');
    expect(discussionService.createForum).toHaveBeenCalled();
  });

  it('should show error if create forum failed', () => {
    const discussionService= <any> TestBed.inject(DiscussionService);
    const toasterService= <any> TestBed.inject(ToasterService);
    spyOn(discussionService, 'createForum').and.returnValue(observableThrowError({}));
    spyOn(toasterService, 'error').and.stub();
    component.createForumRequest = {
      'category': {
        'name': 'General Discussion',
        'pid': '6',
        'id': '1',
        'description': '',
        'context': [
          {
            'type': 'batch',
            'identifier': '_batchId'
          }
        ]
      }
    };
    component.enableDiscussionForum('SOME_BATCH_ID');
    expect(toasterService.error).toHaveBeenCalledWith('discussion forum error');
  });

  it('should show error if formconfig not available', () => {
    const toasterService= <any> TestBed.inject(ToasterService);
    spyOn(toasterService, 'error').and.stub();
    component.createForumRequest = undefined;
    component.enableDiscussionForum('SOME_BATCH_ID');
    expect(toasterService.error).toHaveBeenCalledWith('discussion forum error');
  });

  it('should log enable-DF-yes interact telemetry on changing input to yes', () => {
    const telemetryService= <any> TestBed.inject(TelemetryService);
    spyOn(telemetryService, 'interact');
    const activatedRoute= <any> TestBed.inject(ActivatedRoute);
    const telemetryData = {
      context: {
        env: activatedRoute.snapshot.data.telemetry.env,
        cdata: [{
          id: component['courseId'],
          type: 'Course'
        }, {
          id: 'SOME_BATCH_ID',
          type: 'Batch'
        }]
      },
      edata: {
        id: `enable-DF-yes`,
        type: 'click',
        pageid: activatedRoute.snapshot.data.telemetry.pageid
      }
    };
    component.handleInputChange('enable-DF-yes', {
      id: 'SOME_BATCH_ID',
      type: 'Batch'
    });
    expect(telemetryService.interact).toHaveBeenCalledWith(telemetryData);
  });
  it('should set the picker min date', () => {
    const startDate = new Date();
    component.createBatchForm = new FormGroup({
      startDate: new FormControl(undefined)
    });
    component.pickerMinDate = startDate;
    let result = component.getPickerMinDateForEndDate();
    expect(result).toEqual(new Date(startDate.getTime() + (24 * 60 * 60 * 1000)));
    component.createBatchForm.controls.startDate.setValue(startDate);
    result = component.getPickerMinDateForEndDate();
    expect(result).toEqual(new Date(startDate.getTime() + (24 * 60 * 60 * 1000)));
  });
});
