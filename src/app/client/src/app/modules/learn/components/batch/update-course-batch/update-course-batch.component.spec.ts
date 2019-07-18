
import {of as observableOf, throwError as observableThrowError,  Observable } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LearnModule, UpdateCourseBatchComponent, CourseBatchService, CourseConsumptionService} from '@sunbird/learn';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed, tick , fakeAsync } from '@angular/core/testing';
import {SharedModule, ResourceService, ToasterService} from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  getUserList,
  updateBatchDetails,
  getUserDetails,
  selectedMentors,
  selectedParticipants,
  participantList
} from './update-course-batch.component.data';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

const resourceServiceMockData = {
  messages: {
    imsg: { m0027: 'Something went wrong' },
    stmsg: { m0009: 'error' },
    fmsg: {m0054 : 'error', m0056: 'error', m0052: 'error'},
    smsg: {m0033: 'success', m0034: 'success'}
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

describe('UpdateCourseBatchComponent', () => {
  let component: UpdateCourseBatchComponent;
  let fixture: ComponentFixture<UpdateCourseBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [SharedModule.forRoot(), CoreModule, SuiModule, RouterTestingModule,
        HttpClientTestingModule, LearnModule],
      providers: [ToasterService, ResourceService, UserService, TelemetryService, { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCourseBatchComponent);
    component = fixture.componentInstance;
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
});
