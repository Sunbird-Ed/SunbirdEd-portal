
import {of as observableOf, throwError as observableThrowError,  Observable } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LearnModule, CourseBatchService, CourseConsumptionService} from '@sunbird/learn';
import {UpdateCourseBatchComponent} from './update-course-batch.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed, tick , fakeAsync } from '@angular/core/testing';
import {SharedModule, ResourceService, ToasterService} from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import * as _ from 'lodash-es';
import { DiscussionService } from '../../../../../../app/modules/discussion/services/discussion/discussion.service';
import { MockResponseData } from './update-course-batch.component.data';
import {
  getUserList,
  updateBatchDetails,
  getUserDetails,
  selectedMentors,
  selectedParticipants,
  participantList
} from './update-course-batch.component.data';
import { FormGroup, FormControl } from '@angular/forms';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

const resourceServiceMockData = {
  messages: {
    imsg: { m0027: 'Something went wrong' },
    stmsg: { m0009: 'error' },
    fmsg: {m0054 : 'error', m0056: 'error', m0052: 'error'},
    smsg: {m0033: 'success', m0034: 'success', m0065: 'enabled', m0066: 'disabled'},
    emsg: {m0005: 'discussion forum error'}
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
  'queryParams': observableOf({ enrollmentType: 'invite-only' }),
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

describe('UpdateCourseBatchComponent', () => {
  let component: UpdateCourseBatchComponent;
  let fixture: ComponentFixture<UpdateCourseBatchComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateCourseBatchComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [SharedModule.forRoot(), CoreModule, SuiModule, RouterTestingModule,
        HttpClientTestingModule, LearnModule],
      providers: [ToasterService, ResourceService, UserService, TelemetryService,
        DiscussionService, { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCourseBatchComponent);
    component = fixture.componentInstance;
    spyOn(component['lazzyLoadScriptService'], 'loadScript').and.returnValue(observableOf({}));
  });

  it('should fetch batch details and show update Form model', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseBatchService, 'getUserList').and.callFake((request) => {
      if (request) {
        return observableOf(getUserDetails);
      } else {
        return observableOf(getUserList);
      }
    });
    spyOn(courseBatchService, 'getParticipantList').and.callFake((request) => {
        return observableOf(participantList);
    });
    spyOn(courseBatchService, 'getUpdateBatchDetails').and.returnValue(observableOf(updateBatchDetails));
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.
    returnValue(observableOf({createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed'}));
    fixture.detectChanges();
    expect(component.participantList.length).toBe(7);
    expect(component.mentorList.length).toBe(1);
    expect(component.courseCreator).toBeDefined();
    expect(component.batchUpdateForm).toBeDefined();
    expect(component.showUpdateModal).toBeTruthy();
    expect(component.selectedParticipants.length).toBe(2);
    expect(component.selectedMentors.length).toBe(6);
  });
  it('should navigate to parent page if fetching batch details fails', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const userService = TestBed.get(UserService);
    const activatedRoute = TestBed.get(ActivatedRoute);
    userService._userid = 'b2479136-8608-41c0-b3b1-283f38c338d';
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(courseBatchService, 'getUserList').and.returnValue(observableOf(getUserList));
    spyOn(courseBatchService, 'getUpdateBatchDetails').and.returnValue(observableThrowError(updateBatchDetails));
    spyOn(toasterService, 'error');
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.
    returnValue(observableOf({createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed'}));
    fixture.detectChanges();
    expect(toasterService.error).toHaveBeenCalledWith('error');
    expect(component.router.navigate).toHaveBeenCalledWith(['./'], {relativeTo: activatedRoute.parent});
  });
  it('should navigate to parent page if fetching user details fails', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const activatedRoute = TestBed.get(ActivatedRoute);
    const userService = TestBed.get(UserService);
    userService._userid = 'b2479136-8608-41c0-b3b1-283f38c338d';
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(courseBatchService, 'getUserList').and.callFake((request) => {
      if (request) {
        return observableThrowError(getUserDetails);
      } else {
        return observableOf(getUserList);
      }
    });
    spyOn(courseBatchService, 'getUpdateBatchDetails').and.returnValue(observableOf(updateBatchDetails));
    spyOn(toasterService, 'error');
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.
    returnValue(observableOf({createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed'}));
    fixture.detectChanges();
    expect(component.participantList.length).toBe(0);
    expect(component.mentorList.length).toBe(0);
    expect(component.courseCreator).toBeDefined();
    expect(toasterService.error).toHaveBeenCalledWith('error');
    expect(component.router.navigate).toHaveBeenCalledWith(['./'], {relativeTo: activatedRoute.parent});
  });
  it('should update batch and show success message if api return success', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    const userService = TestBed.get(UserService);
    userService._userProfile = { organisationIds: [] };
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(courseBatchService, 'getUserList').and.callFake((request) => {
      if (request) {
        return observableOf(getUserDetails);
      } else {
        return observableOf(getUserList);
      }
    });
    spyOn(courseBatchService, 'getParticipantList').and.callFake((request) => {
      return observableOf(participantList);
    });

    spyOn(courseBatchService, 'getUpdateBatchDetails').and.returnValue(observableOf(updateBatchDetails));
    spyOn(courseBatchService, 'updateBatch').and.returnValue(observableOf(updateBatchDetails));
    spyOn(toasterService, 'success');
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.
    returnValue(observableOf({createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed'}));
    fixture.detectChanges();
    component.updateBatch();
    expect(toasterService.success).toHaveBeenCalledWith('success');
  });
  it('should update batch and show error message if api fails', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    const userService = TestBed.get(UserService);
    userService._userProfile = { organisationIds: [] };
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(courseBatchService, 'getUserList').and.callFake((request) => {
      if (request) {
        return observableOf(getUserDetails);
      } else {
        return observableOf(getUserList);
      }
    });
    spyOn(courseBatchService, 'getParticipantList').and.callFake((request) => {
      return observableOf(participantList);
    });

    spyOn(courseBatchService, 'getUpdateBatchDetails').and.returnValue(observableOf(updateBatchDetails));
    spyOn(courseBatchService, 'updateBatch').and.returnValue(observableThrowError(updateBatchDetails));
    spyOn(toasterService, 'error');
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.
    returnValue(observableOf({createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed'}));
    fixture.detectChanges();
    component.updateBatch();
    expect(toasterService.error).toHaveBeenCalledWith('error');
  });
  it('should call removeMentor method  and remove the selected mentors', () => {
    component.selectedMentors = [selectedMentors] ;
    const mentor = {'id': '8b79899c-573f-44ed-a0a2-e39d9299bf20', 'name': 'User eight', 'avatar': null};
    spyOn(component, 'removeMentor').and.callThrough();
    component.removeMentor(mentor);
    expect(component.selectedMentors.length).toBe(1);
  });
  it('should call removeParticipant method  and remove the  selectedParticipants', () => {
    component.selectedParticipants = [selectedParticipants] ;
    const user = {'id': '8b79899c-573f-44ed-a0a2-e39d9299bf20', 'name': 'User one', 'avatar': null};
    spyOn(component, 'removeParticipant').and.callThrough();
    component.removeParticipant(user);
    expect(component.selectedParticipants.length).toBe(1);
  });
  it('should call resetForm method  and reset the form except start date', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(component['discussionCsService'], 'getForumIds').and.returnValue(observableOf(MockResponseData.fetchForumResponse));
    spyOn(courseBatchService, 'getUserList').and.callFake((request) => {
      if (request) {
        return observableOf(getUserDetails);
      } else {
        return observableOf(getUserList);
      }
    });
    spyOn(courseBatchService, 'getParticipantList').and.callFake((request) => {
      return observableOf(participantList);
    });

    spyOn(courseBatchService, 'getUpdateBatchDetails').and.returnValue(observableOf(updateBatchDetails));
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.
    returnValue(observableOf({createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed'}));
    component.ngOnInit();
    spyOn(component, 'resetForm').and.callThrough();
    component.resetForm();
    expect(component.batchUpdateForm.controls['name'].value).toBeNull();
    expect(component.batchUpdateForm.controls['description'].value).toBeNull();
    expect(component.batchUpdateForm.controls['endDate'].value).toBeNull();
    expect(component.forumIds).toEqual([9]);
  });

  it('should call resetForm method  and reset the form when batchDetails status is not 1)', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const discussionService = TestBed.get(DiscussionService);
    spyOn(courseBatchService, 'getUserList').and.callFake((request) => {
      if (request) {
        return observableOf(getUserDetails);
      } else {
        return observableOf(getUserList);
      }
    });
    spyOn(courseBatchService, 'getParticipantList').and.callFake((request) => {
      return observableOf(participantList);
    });

    spyOn(courseBatchService, 'getUpdateBatchDetails').and.returnValue(observableOf(updateBatchDetails));
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.
    returnValue(observableOf({createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed'}));
    component.ngOnInit();
    spyOn(component, 'resetForm').and.callThrough();
    component['batchDetails'].status = 0;
    component.resetForm();
    expect(component.batchUpdateForm.controls['name'].value).toBeNull();
    expect(component.batchUpdateForm.controls['description'].value).toBeNull();
    expect(component.batchUpdateForm.controls['endDate'].value).toBeNull();
  });

  it('should update batch if batch has enrollmentend date and show success message', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    const userService = TestBed.get(UserService);
    userService._userProfile = { organisationIds: [] };
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(courseBatchService, 'getUserList').and.callFake((request) => {
      if (request) {
        return observableOf(getUserDetails);
      } else {
        return observableOf(getUserList);
      }
    });
    spyOn(courseBatchService, 'getParticipantList').and.callFake((request) => {
      return observableOf(participantList);
    });

    spyOn(courseBatchService, 'getUpdateBatchDetails').and.returnValue(observableOf(updateBatchDetails));
    spyOn(courseBatchService, 'updateBatch').and.returnValue(observableOf(updateBatchDetails));
    spyOn(toasterService, 'success');
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.
    returnValue(observableOf({createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed'}));
    fixture.detectChanges();
    component.batchUpdateForm.value.enrollmentType = 'open';
    component.batchUpdateForm.value.enrollmentEndDate = new Date();
    component.updateBatch();
    expect(toasterService.success).toHaveBeenCalledWith('success');
  });

 it('should update batch min enrollmentend date should be todays date and show success message', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    const userService = TestBed.get(UserService);
    userService._userProfile = { organisationIds: [] };
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(courseBatchService, 'getUserList').and.callFake((request) => {
      if (request) {
        return observableOf(getUserDetails);
      } else {
        return observableOf(getUserList);
      }
    });
   spyOn(courseBatchService, 'getParticipantList').and.callFake((request) => {
     return observableOf(participantList);
   });

   const batchDetails = updateBatchDetails;
   batchDetails.enrollmentEndDate = null;
    spyOn(courseBatchService, 'getUpdateBatchDetails').and.returnValue(observableOf(batchDetails));
    spyOn(courseBatchService, 'updateBatch').and.returnValue(observableOf(updateBatchDetails));
    spyOn(toasterService, 'success');
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.
    returnValue(observableOf({createdBy: 'b2479136-8608-41c0-b3b1-283f38c338ed'}));
    fixture.detectChanges();
    component.batchUpdateForm.value.enrollmentType = 'open';
    component.batchUpdateForm.value.enrollmentEndDate = new Date();
    component.updateBatch();
   expect(component.pickerMinDateForEnrollmentEndDate).toBe(component.pickerMinDate);
   expect(toasterService.success).toHaveBeenCalledWith('success');
  });

  it('should despatch an event which will be caught in course-player page to navigate', () => {
    component.batchUpdateForm = new FormGroup({
      issueCertificate: new FormControl('yes')
    });
    const courseBatchService = TestBed.get(CourseBatchService);
    spyOn(courseBatchService.updateEvent, 'emit');
    component.checkIssueCertificate('13456789');
    expect(courseBatchService.updateEvent.emit).toHaveBeenCalledWith({
      event: 'issueCert',
      value: 'yes',
      mode: 'edit',
      batchId: '13456789'
    });
  });
  it('should log issue-certificate-yes interact telemetry on changing input to yes', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact');
    const activatedRoute = TestBed.get(ActivatedRoute);
    const telemetryData = {
      context: {
        env:  activatedRoute.snapshot.data.telemetry.env,
        cdata: [{
          id: component['courseId'],
          type: 'Course'
        }, {
          id: component['batchId'],
          type: 'Batch'
        }]
      },
      edata: {
        id: `issue-certificate-yes`,
        type: 'click',
        pageid: activatedRoute.snapshot.data.telemetry.pageid
      }
    };
    component.handleInputChange('issue-certificate-yes');
    expect(telemetryService.interact).toHaveBeenCalledWith(telemetryData);
  });

  it('should call setTelemetryCData', () => {
    component.telemetryCdata = [{ id: 'do_22121' }];
    component.setTelemetryCData([]);
    expect(component.telemetryCdata).toBeDefined();
  });

  it('should get maskEmail and maskPhone', () => {
   const userData = getUserList.result.response.content[0];
   userData['maskedEmail'] = userData.email;
   userData['maskedPhone'] = userData.phone;
   const result = component['getUserOtherDetail'](userData);
    expect(result).toEqual(` (${userData.email}, ${userData.phone})`);
  });

  it('should get only maskEmail', () => {
    const userData = getUserList.result.response.content[0];
    userData['maskedEmail'] = userData.email;
    userData['maskedPhone'] = '';
    const result = component['getUserOtherDetail'](userData);
     expect(result).toEqual(` (${userData.email})`);
  });

  it('should get only maskPhone', () => {
    const userData = getUserList.result.response.content[0];
    userData['maskedEmail'] = '';
    userData['maskedPhone'] = userData.phone;
    const result = component['getUserOtherDetail'](userData);
     expect(result).toEqual(` (${userData.phone})`);
  });

  it('should get participant list', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    spyOn(courseBatchService, 'getUserList').and.returnValue(observableOf(getUserDetails));
    component['getUserList']('', 'participant');
    expect(component.participantList).toBeDefined();
  });

  it('should get mentors list', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    spyOn(courseBatchService, 'getUserList').and.returnValue(observableOf(getUserDetails));
    component['getUserList']('', 'mentors');
    expect(component.mentorList).toBeDefined();
  });

  it('should show error while fetching participant or mentors list', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    spyOn(courseBatchService, 'getUserList').and.returnValue(observableThrowError({}));
    component['getUserList']('', 'mentors');
    expect(toasterService.error).toHaveBeenCalledWith('error');
  });

  it('should add participant to batch', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    spyOn(courseBatchService, 'addUsersToBatch').and.returnValue(observableOf({}));
    component['addParticipantToBatch']('123', '1234');
    expect(courseBatchService.addUsersToBatch).toHaveBeenCalled();
  });

  it('should remove participant to batch', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    spyOn(courseBatchService, 'removeUsersFromBatch').and.returnValue(observableOf({}));
    component['removeParticipantFromBatch']('123', '1234');
    expect(courseBatchService.removeUsersFromBatch).toHaveBeenCalled();
  });

  it('should generate data for discussion forum', () => {
    component.generateDataForDF();
    expect(component.fetchForumIdReq).toEqual({
      'type': 'batch',
      'identifier': [undefined]
    });
  });

   it('should fetch form config for batch discussion forum', () => {
    const discussionService = TestBed.get(DiscussionService);
    spyOn(discussionService, 'fetchForumConfig').and.returnValue(observableOf(MockResponseData.forumConfig));
    component.fetchForumConfig();
    expect(component.createForumRequest).toEqual(MockResponseData.forumConfig[0]);
  });

  it('should check enable disable discussion', () => {
    spyOn(component, 'enableDiscussionForum');
    component.batchUpdateForm = new FormGroup({
      enableDiscussions: new FormControl('true')
    });
    const courseBatchService = TestBed.get(CourseBatchService);
    spyOn(courseBatchService.updateEvent, 'emit');
    component.checkEnableDiscussions('SOME_BATCH_ID');
    expect(component.enableDiscussionForum).toHaveBeenCalled();
  });

  it('should enabled discussion options', () => {
    const discussionService = TestBed.get(DiscussionService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(discussionService, 'createForum').and.returnValue(observableOf(MockResponseData.enableDiscussionForumData));
    spyOn(toasterService, 'success').and.stub();
    component.enableDiscussionForum();
    expect(discussionService.createForum).toHaveBeenCalled();
  });

  it('should disabled discussion options', () => {
    const discussionService = TestBed.get(DiscussionService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(discussionService, 'removeForum').and.returnValue(observableOf(MockResponseData.enableDiscussionForumData));
    spyOn(toasterService, 'success').and.stub();
    component.disableDiscussionForum('SOME_BATCH_ID');
    expect(discussionService.removeForum).toHaveBeenCalled();
  });

  it('should show error in create forum request failed', () => {
    const discussionService = TestBed.get(DiscussionService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(discussionService, 'createForum').and.returnValue(observableThrowError({}));
    spyOn(toasterService, 'error');
    component.enableDiscussionForum();
    expect(toasterService.error).toHaveBeenCalledWith('discussion forum error');
  });

  it('should show error in fetch forum ids request failed', () => {
    const discussionService = TestBed.get(DiscussionService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(discussionService, 'fetchForumConfig').and.returnValue(observableThrowError({}));
    spyOn(toasterService, 'error');
    component.fetchForumConfig();
    expect(toasterService.error).toHaveBeenCalledWith('discussion forum error');
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
