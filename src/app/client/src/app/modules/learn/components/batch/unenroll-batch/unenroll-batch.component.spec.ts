import { UserService } from '@sunbird/core';
import { CourseBatchService } from '../../../services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardModule } from '../../../../dashboard/dashboard.module';
import { RouterTestingModule } from '@angular/router/testing';
import { LearnModule } from '@sunbird/learn';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UnEnrollBatchComponent } from './unenroll-batch.component';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule, ResourceService, ToasterService } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import * as _ from 'lodash-es';
import { fakeOpenBatchDetails } from './unenroll-batch.component.spec.data';
import { By } from '@angular/platform-browser';
describe('UnEnrollBatchComponent', () => {
  let component: UnEnrollBatchComponent;
  let fixture: ComponentFixture<UnEnrollBatchComponent>;
  let courseBatchService;
  let toasterService;
  const fakeActivatedRoute = {
    params: of({ 'batchId': '01278646366204723214' }),
    snapshot: {
      params: [
        {
          pageNumber: '1',
        }
      ],
      data: {
        telemetry: {
          env: 'workspace', pageid: 'workspace-course-batch', subtype: 'scroll', type: 'list',
          object: { type: 'batch', ver: '1.0' }
        }
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeResourceService = {
    frmelmnts: {
      lbl: {},
      btn: {}
    },
    messages: {
      smsg: {
        m0045: 'User unenrolled from the batch successfully...'
      },
      fmsg: {
        m0082: 'This course is not opened for enrolling',
        m0054: 'Fetching batch detail failed, please try again later...'
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [SharedModule.forRoot(), TelemetryModule.forRoot(), CoreModule, SuiModule, LearnModule, RouterTestingModule,
        DashboardModule, HttpClientTestingModule],
      providers: [
        UserService,
        {
          provide: ActivatedRoute, useValue: fakeActivatedRoute
        },
        {
          provide: ResourceService, useValue: fakeResourceService
        },
        { provide: Router, useClass: RouterStub }]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(UnEnrollBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    courseBatchService = TestBed.get(CourseBatchService);
    toasterService = TestBed.get(ToasterService);
  });

  it('should fetch batch details with batch Id', () => {
    const spy = spyOn(courseBatchService, 'getEnrollToBatchDetails').and.callFake(() => of(fakeOpenBatchDetails));
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('01278646366204723214');
    expect(component.batchDetails).toEqual(fakeOpenBatchDetails);
  });

  it('should redirect when fetch details throw error', () => {
    const spy = spyOn(courseBatchService, 'getEnrollToBatchDetails').and.callFake(() => throwError(''));
    const toasterSpy = spyOn(toasterService, 'error');
    const redirectSpy = spyOn(component, 'redirect');
    component.ngOnInit();
    expect(toasterSpy).toHaveBeenCalled();
    expect(toasterSpy).toHaveBeenCalledWith(fakeResourceService.messages.fmsg.m0054);
    expect(redirectSpy).toHaveBeenCalled();
  });

  it('should redirect whenever batch is invite only', () => {
    const batchDetails = _.clone(fakeOpenBatchDetails);
    batchDetails.enrollmentType = 'invite-only';
    spyOn(courseBatchService, 'getEnrollToBatchDetails').and.callFake(() => of(batchDetails));
    const redirectSpy = spyOn(component, 'redirect').and.callThrough();
    const toasterSpy = spyOn(toasterService, 'error');
    component.ngOnInit();
    expect(toasterSpy).toHaveBeenCalled();
    expect(toasterSpy).toHaveBeenCalledTimes(1);
    expect(toasterSpy).toHaveBeenCalledWith(fakeResourceService.messages.fmsg.m0082);
    expect(redirectSpy).toHaveBeenCalled();
  });

  it('should fetch participant details when batch is open', () => {
    spyOn(courseBatchService, 'getEnrollToBatchDetails').and.callFake(() => of(fakeOpenBatchDetails));
    const fetchParticipantsDetailsSpy = spyOn(component, 'fetchParticipantsDetails').and.callThrough();
    component.showEnrollDetails = false;
    component.ngOnInit();
    expect(fetchParticipantsDetailsSpy).toHaveBeenCalled();
    expect(component.showEnrollDetails).toBe(true);
  });

  it('should call unenroll from course on click of unenroll button', () => {
    const unenrollButton = fixture.debugElement.query(By.css('#unenrollFromCourse'));
    const unenrollFromCourseSpy = spyOn(component, 'unenrollFromCourse').and.callThrough();
    const toasterSpy = spyOn(toasterService, 'success');
    const courseBatchServiceSpy = spyOn(courseBatchService, 'unenrollFromCourse').and.returnValue(of({}));
    spyOn(courseBatchService, 'getEnrollToBatchDetails').and.callFake(() => of(fakeOpenBatchDetails));
    spyOnProperty(component.userService, 'userid').and.returnValue('d0d8a341-9637-484c-b871-0c27015af238');
    const goBackToCoursePageSpy = spyOn(component, 'goBackToCoursePage');
    component.ngOnInit();
    fixture.detectChanges();
    unenrollButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(unenrollFromCourseSpy).toHaveBeenCalled();
    expect(courseBatchServiceSpy).toHaveBeenCalledWith({
      'request': {
        'courseId': 'do_21278645271447142411200',
        'userId': 'd0d8a341-9637-484c-b871-0c27015af238',
        'batchId': '01278646366204723214'
      }
    });
    expect(component.disableSubmitBtn).toBe(true);
    expect(toasterSpy).toHaveBeenCalledWith(fakeResourceService.messages.smsg.m0045);
    expect(goBackToCoursePageSpy).toHaveBeenCalled();
  });

  it('should get user list when participants is there', () => {
    const batchDetails = _.clone(fakeOpenBatchDetails);
    batchDetails.participants = [];
    spyOn(courseBatchService, 'getEnrollToBatchDetails').and.callFake(() => of(batchDetails));
    spyOn(component, 'fetchParticipantsDetails').and.callThrough();
    spyOn(courseBatchService, 'getUserList').and.returnValue(of({result: {response: {content: ''}}}));
    component.showEnrollDetails = false;
    component.ngOnInit();
    expect(component.showEnrollDetails).toBe(true);
  });
});
