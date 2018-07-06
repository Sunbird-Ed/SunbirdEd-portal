import { WorkspaceModule } from '@sunbird/workspace';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
// import { LearnModule, UpdateCourseBatchComponent, batchService, CourseConsumptionService} from '@sunbird/learn';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed, tick , fakeAsync } from '@angular/core/testing';
import {SharedModule, ResourceService, ToasterService} from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {getUserList, updateBatchDetails, getUserDetails} from './update-batch.component.spec.data';
import { BatchService } from '../../services';
import { UpdateBatchComponent } from './update-batch.component';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

const resourceServiceMockData = {
  messages: {
    imsg: { m0027: 'Something went wrong' },
    stmsg: { m0009: 'error' },
    fmsg: {m0054 : 'error', m0056: 'error', m0052: 'error'},
    smsg: {m0033: 'success'}
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
  'params': Observable.from([{ 'courseId': 'do_1125083286221291521153' }]),
  'parent': { 'params': Observable.from([{ 'courseId': 'do_1125083286221291521153' }]) },
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

describe('UpdateBatchComponent', () => {
  let component: UpdateBatchComponent;
  let fixture: ComponentFixture<UpdateBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [SharedModule.forRoot(), CoreModule.forRoot(), SuiModule, RouterTestingModule,
        HttpClientTestingModule, WorkspaceModule],
      providers: [ToasterService, ResourceService, UserService, TelemetryService, { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBatchComponent);
    component = fixture.componentInstance;
  });

  it('should fetch batch details and show update Form model', () => {
    const batchService = TestBed.get(BatchService);
    spyOn(batchService, 'getUserList').and.returnValue(Observable.of(getUserList));
    spyOn(batchService, 'getUserDetails').and.returnValue(Observable.of(getUserDetails));
    spyOn(batchService, 'getBatchDetails').and.returnValue(Observable.of(updateBatchDetails));
    fixture.detectChanges();
    expect(component.participantList.length).toBe(3);
    expect(component.mentorList.length).toBe(1);
    expect(component.mentorList[0].id).toBe('b2479136-8608-41c0-b3b1-283f38c338ed');
    expect(component.batchUpdateForm).toBeDefined();
    expect(component.showUpdateModal).toBeTruthy();
    expect(component.selectedParticipants.length).toBe(2);
    expect(component.selectedMentors.length).toBe(7);
  });
  it('should navigate to parent page if fetching batch details fails', () => {
    const batchService = TestBed.get(BatchService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const userService = TestBed.get(UserService);
    const activatedRoute = TestBed.get(ActivatedRoute);
    userService._userid = 'b2479136-8608-41c0-b3b1-283f38c338d';
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(batchService, 'getUserList').and.returnValue(Observable.of(getUserList));
    spyOn(batchService, 'getBatchDetails').and.returnValue(Observable.throw(updateBatchDetails));
    spyOn(toasterService, 'error');
    fixture.detectChanges();
    expect(toasterService.error).toHaveBeenCalledWith('error');
    expect(component.router.navigate).toHaveBeenCalledWith(['workspace/content/batches/1']);
  });
  it('should navigate to parent page if fetching user details fails', () => {
    const batchService = TestBed.get(BatchService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    const activatedRoute = TestBed.get(ActivatedRoute);
    const userService = TestBed.get(UserService);
    userService._userid = 'b2479136-8608-41c0-b3b1-283f38c338d';
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(batchService, 'getUserList').and.returnValue(Observable.of(getUserList));
    spyOn(batchService, 'getBatchDetails').and.returnValue(Observable.of(updateBatchDetails));
    spyOn(batchService, 'getUserDetails').and.returnValue(Observable.throw(getUserDetails));
    spyOn(toasterService, 'error');
    fixture.detectChanges();
    expect(component.participantList.length).toBe(3);
    expect(component.mentorList.length).toBe(1);
    expect(component.mentorList[0].id).toBe('b2479136-8608-41c0-b3b1-283f38c338ed');
    expect(toasterService.error).toHaveBeenCalledWith('error');
    expect(component.router.navigate).toHaveBeenCalledWith(['workspace/content/batches/1']);
  });
  it('should update batch and show success message if api return success', () => {
    const batchService = TestBed.get(BatchService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    const userService = TestBed.get(UserService);
    userService._userProfile = { organisationIds: [] };
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(batchService, 'getUserList').and.returnValue(Observable.of(getUserList));
    spyOn(batchService, 'getUserDetails').and.returnValue(Observable.of(getUserDetails));
    spyOn(batchService, 'getBatchDetails').and.returnValue(Observable.of(updateBatchDetails));
    spyOn(batchService, 'updateBatch').and.returnValue(Observable.of(updateBatchDetails));
    spyOn(toasterService, 'success');
    fixture.detectChanges();
    component.updateBatch();
    expect(toasterService.success).toHaveBeenCalledWith('success');
  });
  it('should update batch and show error message if api fails', () => {
    const batchService = TestBed.get(BatchService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    const userService = TestBed.get(UserService);
    userService._userProfile = { organisationIds: [] };
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(batchService, 'getUserList').and.returnValue(Observable.of(getUserList));
    spyOn(batchService, 'getUserDetails').and.returnValue(Observable.of(getUserDetails));
    spyOn(batchService, 'getBatchDetails').and.returnValue(Observable.of(updateBatchDetails));
    spyOn(batchService, 'updateBatch').and.returnValue(Observable.throw(updateBatchDetails));
    spyOn(toasterService, 'error');
    fixture.detectChanges();
    component.updateBatch();
    expect(toasterService.error).toHaveBeenCalledWith('error');
  });
});
