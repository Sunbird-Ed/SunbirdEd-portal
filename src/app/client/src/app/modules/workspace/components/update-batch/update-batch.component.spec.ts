
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule, UserService } from '@sunbird/core';
import { ResourceService, SharedModule, ToasterService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { WorkspaceModule } from '@sunbird/workspace';
import { SuiModule } from 'ng2-semantic-ui';
import { of as observableOf, throwError as observableThrowError, of, throwError } from 'rxjs';
import { BatchService } from '../../services';
import { UpdateBatchComponent } from './update-batch.component';
import { getUserDetails, getUserList, participantList, updateBatchDetails } from './update-batch.component.spec.data';
import { Validators, FormControl, FormGroup } from '@angular/forms';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

const resourceServiceMockData = {
  messages: {
    imsg: { m0027: 'Something went wrong' },
    stmsg: { m0009: 'error' },
    fmsg: { m0054: 'error', m0056: 'error', m0052: 'error' },
    smsg: { m0033: 'success', m0034: 'success' }
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

describe('UpdateBatchComponent', () => {
  let component: UpdateBatchComponent;
  let fixture: ComponentFixture<UpdateBatchComponent>;

  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [SharedModule.forRoot(), CoreModule, SuiModule, RouterTestingModule,
        HttpClientTestingModule, WorkspaceModule],
      providers: [ToasterService, ResourceService, UserService, TelemetryService, { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBatchComponent);
    component = fixture.componentInstance;
    component.batchUpdateForm = new FormGroup({
      name: new FormControl('test', [Validators.required]),
      description: new FormControl('description'),
      enrollmentType: new FormControl('active', [Validators.required]),
      startDate: new FormControl(new Date(1597238870556), [Validators.required]),
      endDate: new FormControl(1597238870556),
      mentors: new FormControl(),
      users: new FormControl(),
      enrollmentEndDate: new FormControl(1597238870556)
    });
  });

  it('should fetch batch details and show update Form model', () => {
    const batchService = TestBed.get(BatchService);
    spyOn(batchService, 'getUserList').and.callFake((request) => {
      if (request) {
        return observableOf(getUserDetails);
      } else {
        return observableOf(getUserList);
      }
    });
    spyOn(batchService, 'getParticipantList').and.callFake((request) => {
      return observableOf(participantList);
    });
    spyOn(batchService, 'getUpdateBatchDetails').and.returnValue(observableOf(updateBatchDetails));
    fixture.detectChanges();
    expect(component.participantList.length).toBe(3);
    expect(component.mentorList.length).toBe(1);
    expect(component.mentorList[0].id).toBe('b2479136-8608-41c0-b3b1-283f38c338ed');
    expect(component.batchUpdateForm).toBeDefined();
    expect(component.showUpdateModal).toBeTruthy();
    expect(component.selectedParticipants.length).toBe(2);
    expect(component.selectedMentors.length).toBe(6);
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
    spyOn(batchService, 'getUserList').and.returnValue(observableOf(getUserList));
    spyOn(batchService, 'getBatchDetails').and.returnValue(observableThrowError(updateBatchDetails));
    spyOn(toasterService, 'error');
    fixture.detectChanges();
    expect(toasterService.error).toHaveBeenCalledWith('error');
    expect(component.router.navigate).toHaveBeenCalled();
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
    spyOn(batchService, 'getUserList').and.callFake((request) => {
      if (request) {
        return observableThrowError(getUserDetails);
      } else {
        return observableOf(getUserList);
      }
    });
    spyOn(batchService, 'getParticipantList').and.callFake((request) => {
      return observableOf(participantList);
    });
    spyOn(batchService, 'getUpdateBatchDetails').and.returnValue(observableOf(updateBatchDetails));
    spyOn(toasterService, 'error');
    fixture.detectChanges();
    expect(component.participantList.length).toBe(3);
    expect(component.mentorList.length).toBe(1);
    expect(component.mentorList[0].id).toBe('b2479136-8608-41c0-b3b1-283f38c338ed');
    expect(toasterService.error).toHaveBeenCalledWith('error');
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should update batch and show success message if api return success', () => {
    const batchService = TestBed.get(BatchService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    const userService = TestBed.get(UserService);
    userService._userProfile = { organisationIds: [] };
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(batchService, 'getUserList').and.callFake((request) => {
      if (request) {
        return observableOf(getUserDetails);
      } else {
        return observableOf(getUserList);
      }
    });
    spyOn(batchService, 'getParticipantList').and.callFake((request) => {
      return observableOf(participantList);
    });
    spyOn(batchService, 'getUpdateBatchDetails').and.returnValue(observableOf(updateBatchDetails));
    spyOn(batchService, 'updateBatch').and.returnValue(observableOf(updateBatchDetails));
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
    spyOn(batchService, 'getUserList').and.callFake((request) => {
      if (request) {
        return observableOf(getUserDetails);
      } else {
        return observableOf(getUserList);
      }
    });
    spyOn(batchService, 'getParticipantList').and.callFake((request) => {
      return observableOf(participantList);
    });
    spyOn(batchService, 'getUpdateBatchDetails').and.returnValue(observableOf(updateBatchDetails));
    spyOn(batchService, 'updateBatch').and.returnValue(observableThrowError(updateBatchDetails));
    spyOn(toasterService, 'error');
    fixture.detectChanges();
    component.updateBatch();
    expect(toasterService.error).toHaveBeenCalledWith('error');
  });

  it('should call setTelemetryCData', () => {
    component.telemetryCdata = [{ id: 'do_22121' }];
    component.setTelemetryCData([]);
    expect(component.telemetryCdata).toBeDefined();
  });

  it('should call clearForm', () => {
    component.batchUpdateForm.controls['name'].setValue('test');
    component.batchUpdateForm.controls['mentors'].setValue('test');
    component.batchUpdateForm.controls['enrollmentEndDate'].setValue('test');
    component.batchUpdateForm.controls['endDate'].setValue('test');
    component.batchUpdateForm.controls['description'].setValue('test');
    component.batchUpdateForm.controls['users'].setValue('test');

    spyOn(component.batchUpdateForm.controls['name'], 'reset');
    spyOn(component.batchUpdateForm.controls['mentors'], 'reset');
    spyOn(component.batchUpdateForm.controls['enrollmentEndDate'], 'reset');
    spyOn(component.batchUpdateForm.controls['endDate'], 'reset');
    spyOn(component.batchUpdateForm.controls['description'], 'reset');
    spyOn(component.batchUpdateForm.controls['users'], 'reset');
    component.clearForm();
    expect(component.batchUpdateForm.controls['name'].reset).toHaveBeenCalled();
    expect(component.batchUpdateForm.controls['mentors'].reset).toHaveBeenCalled();
    expect(component.batchUpdateForm.controls['enrollmentEndDate'].reset).toHaveBeenCalled();
    expect(component.batchUpdateForm.controls['endDate'].reset).toHaveBeenCalled();
    expect(component.batchUpdateForm.controls['description'].reset).toHaveBeenCalled();
    expect(component.batchUpdateForm.controls['users'].reset).toHaveBeenCalled();
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

  it('should call reload', (done) => {
    const batchService = TestBed.get(BatchService);
    const router = TestBed.get(Router);
    spyOn(batchService.updateEvent, 'emit');
    component['reload']();
    setTimeout(() => {
      expect(batchService.updateEvent.emit).toHaveBeenCalledWith({ event: 'update' });
      expect(router.navigate).toHaveBeenCalled();
      done();
    }, 1100);
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

  it('should call updateParticipantsToBatch', () => {
    const batchService = TestBed.get(BatchService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(batchService, 'addUsersToBatch').and.returnValue(of({}));
    spyOn(toasterService, 'success');
    spyOn<any>(component, 'reload');
    component['updateParticipantsToBatch'](2323212121, ['userId1', 'userId2']);
    expect(component.disableSubmitBtn).toBe(false);
    expect(toasterService.success).toHaveBeenCalledWith('success');
    expect(component['reload']).toHaveBeenCalled();
  });

  it('should call updateParticipantsToBatch, on error', () => {
    const batchService = TestBed.get(BatchService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(batchService, 'addUsersToBatch').and.returnValue(throwError({ params: {}, error: { params: { errmsg: 'error' } } }));
    spyOn(toasterService, 'error');
    component['updateParticipantsToBatch'](2323212121, ['userId1', 'userId2']);
    expect(component.disableSubmitBtn).toBe(false);
    expect(toasterService.error).toHaveBeenCalledWith('error');
  });

  it('should call updateParticipantsToBatch, on error', () => {
    const batchService = TestBed.get(BatchService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(batchService, 'addUsersToBatch').and.returnValue(throwError({}));
    spyOn(toasterService, 'error');
    component['updateParticipantsToBatch'](2323212121, ['userId1', 'userId2']);
    expect(component.disableSubmitBtn).toBe(false);
    expect(toasterService.error).toHaveBeenCalled();
  });

});
