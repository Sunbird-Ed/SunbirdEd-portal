import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardModule } from './../../../../dashboard/dashboard.module';
import { RouterTestingModule } from '@angular/router/testing';
import { LearnModule } from '@sunbird/learn';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EnrollBatchComponent } from './enroll-batch.component';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule, ResourceService, ToasterService } from '@sunbird/shared';
import { CoreModule, CoursesService, GeneraliseLabelService } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseBatchService, CourseConsumptionService, CourseProgressService } from '../../../services';
import { fakeBatchDetails } from './enroll-batch.component.spec.data';
import { TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from '@sunbird/test-util';

describe('EnrollBatchComponent', () => {
  let component: EnrollBatchComponent;
  let fixture: ComponentFixture<EnrollBatchComponent>;
  let courseBatchService: CourseBatchService;
  let toasterService: ToasterService;
  let coursesService: CoursesService;
  let router: Router;
  const fakeActivatedRoute = {
    params: of({ 'batchId': '01278712683697766417' }),
    queryParams: of({ 'autoEnroll': false }),
    snapshot: {
      params: [
        {
          pageNumber: '1',
        }
      ],
      data: {
        telemetry: { env: 'Course', pageid: 'batch-enroll', type: 'view', object: { ver: '1.0', type: 'batch' } }
      }
    }
  };
  const fakeResourceService = {
    frmelmnts: {
      lbl: {},
      btn: {}
    },
    messages: {
      smsg: {
        m0036: 'Course Enrolled for this batch successfully...'
      },
      emsg: {
        m0001: 'Cannot enroll now. Try again later'
      },
      fmsg: {
        m0082: 'This course is not opened for enrolling',
        m0054: 'Fetching batch detail failed, please try again later...'
      }
    }
  };

  const routerStub = {
    navigate: (route) => { },
    url: 'http://localhost:3000/learn/course/do_2131140513216512001688/enroll/batch/01311408513794867224?autoEnroll=true',
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnrollBatchComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [SharedModule.forRoot(), TelemetryModule.forRoot(), CoreModule, SuiModule, LearnModule, RouterTestingModule,
        DashboardModule, HttpClientTestingModule],
      providers: [CourseConsumptionService, TelemetryService, CourseBatchService, CourseProgressService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: fakeResourceService },
        { provide: GeneraliseLabelService, useValue: fakeResourceService },
        { provide: Router, useValue: routerStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollBatchComponent);
    component = fixture.componentInstance;
    courseBatchService = TestBed.get(CourseBatchService);
    toasterService = TestBed.get(ToasterService);
    coursesService = TestBed.get(CoursesService);
    router = TestBed.get(Router);
  });

  it('should fetch details using the batch id', () => {
    const courseBatchServiceSpy = spyOn(courseBatchService, 'getEnrollToBatchDetails').and.callFake(() => of(fakeBatchDetails));
    const setTelemetryDataSpy = spyOn(component, 'setTelemetryData').and.callThrough();
    component.ngOnInit();
    expect(component.batchId).toBe('01278712683697766417');
    expect(courseBatchServiceSpy).toHaveBeenCalled();
    expect(courseBatchServiceSpy).toHaveBeenCalledWith('01278712683697766417');
    expect(component.batchDetails).toEqual(fakeBatchDetails);
    expect(setTelemetryDataSpy).toHaveBeenCalled();
    expect(component.submitInteractEdata).toEqual({
      id: 'enroll-batch-popup',
      type: 'click',
      pageid: 'course-consumption'
    });
    expect(component.telemetryCdata).toEqual([{ 'type': 'batch', 'id': '01278712683697766417' }]);
  });

  it('should redirect when error occurs during batch details fetch', () => {
    const batchDetails = _.clone(fakeBatchDetails);
    batchDetails.enrollmentType = 'invite-only';
    spyOn(courseBatchService, 'getEnrollToBatchDetails').and.callFake(() => of(batchDetails));
    const toasterSpy = spyOn(toasterService, 'error');
    const redirectSpy = spyOn(component, 'redirect');
    component.ngOnInit();
    expect(toasterSpy).toHaveBeenCalled();
    expect(toasterSpy).toHaveBeenCalledWith(fakeResourceService.messages.fmsg.m0082);
    expect(redirectSpy).toHaveBeenCalled();
  });

  it('should redirect when batch enrollment type is not open', () => {
    spyOn(courseBatchService, 'getEnrollToBatchDetails').and.callFake(() => throwError('Error'));
    const toasterSpy = spyOn(toasterService, 'error');
    const redirectSpy = spyOn(component, 'redirect');
    component.ngOnInit();
    expect(toasterSpy).toHaveBeenCalled();
    expect(toasterSpy).toHaveBeenCalledWith(fakeResourceService.messages.fmsg.m0054);
    expect(redirectSpy).toHaveBeenCalled();
  });

  it('should enroll to course on click of enroll button', () => {
    spyOn(courseBatchService, 'getEnrollToBatchDetails').and.callFake(() => of(fakeBatchDetails));
    const courseBatchServiceSpy = spyOn(courseBatchService, 'enrollToCourse').and.callFake(() => of(''));
    spyOnProperty(component.userService, 'userid', 'get').and.returnValue('d0d8a341-9637-484c-b871-0c27015af238');
    const fetchEnrolledCourseDataSpy = spyOn(component, 'fetchEnrolledCourseData');
    const telemetryLogEvent = spyOn(component, 'telemetryLogEvents');
    component.ngOnInit();
    component.modalVisibility = true;
    fixture.detectChanges();
    const enrollButton = fixture.debugElement.query(By.css('#enrollToCourse'));
    enrollButton.triggerEventHandler('click', null);
    expect(component.disableSubmitBtn).toBe(true);
    expect(courseBatchServiceSpy).toHaveBeenCalled();
    expect(courseBatchServiceSpy).toHaveBeenCalledWith({
      'request': {
        'courseId': 'do_2127871108662804481320',
        'userId': 'd0d8a341-9637-484c-b871-0c27015af238',
        'batchId': '01278712683697766417'
      }
    });
    expect(component.disableSubmitBtn).toBe(true);
    expect(fetchEnrolledCourseDataSpy).toHaveBeenCalled();
    expect(telemetryLogEvent).toHaveBeenCalled();
  });

  it('should handle error occured during enrolling to course', () => {
    spyOn(courseBatchService, 'getEnrollToBatchDetails').and.callFake(() => of(fakeBatchDetails));
    const courseBatchServiceSpy = spyOn(courseBatchService, 'enrollToCourse').and.callFake(() => throwError(''));
    spyOnProperty(component.userService, 'userid', 'get').and.returnValue('d0d8a341-9637-484c-b871-0c27015af238');
    const toasterSpy = spyOn(toasterService, 'error');
    const telemetryLogEvent = spyOn(component, 'telemetryLogEvents');
    component.ngOnInit();
    component.modalVisibility = true;
    fixture.detectChanges();
    const enrollButton = fixture.debugElement.query(By.css('#enrollToCourse'));
    enrollButton.triggerEventHandler('click', null);
    expect(courseBatchServiceSpy).toHaveBeenCalled();
    expect(courseBatchServiceSpy).toHaveBeenCalledWith({
      'request': {
        'courseId': 'do_2127871108662804481320',
        'userId': 'd0d8a341-9637-484c-b871-0c27015af238',
        'batchId': '01278712683697766417'
      }
    });
    expect(telemetryLogEvent).toHaveBeenCalled();
    expect(component.disableSubmitBtn).toBe(false);
    expect(toasterSpy).toHaveBeenCalled();
    expect(toasterSpy).toHaveBeenCalledWith(fakeResourceService.messages.emsg.m0001);
  });

  it('should auto enroll to course', () => {
    spyOn(courseBatchService, 'getEnrollToBatchDetails').and.callFake(() => of(fakeBatchDetails));
    const courseBatchServiceSpy = spyOn(courseBatchService, 'enrollToCourse').and.callFake(() => of(''));
    spyOnProperty(component.userService, 'userid', 'get').and.returnValue('d0d8a341-9637-484c-b871-0c27015af238');
    const fetchEnrolledCourseDataSpy = spyOn(component, 'fetchEnrolledCourseData');
    const telemetryLogEvent = spyOn(component, 'telemetryLogEvents');
    TestBed.get(ActivatedRoute).queryParams = of({ autoEnroll: true });
    component.ngOnInit();
    fixture.detectChanges();
    component.enrollToCourse();
    expect(component.disableSubmitBtn).toBe(true);
    expect(courseBatchServiceSpy).toHaveBeenCalled();
    expect(courseBatchServiceSpy).toHaveBeenCalledWith({
      'request': {
        'courseId': 'do_2127871108662804481320',
        'userId': 'd0d8a341-9637-484c-b871-0c27015af238',
        'batchId': '01278712683697766417'
      }
    });
    expect(component.disableSubmitBtn).toBe(true);
    expect(fetchEnrolledCourseDataSpy).toHaveBeenCalled();
    expect(telemetryLogEvent).toHaveBeenCalled();
  });

  it('should fetch enrolled course data', fakeAsync(() => {
    spyOn(coursesService, 'getEnrolledCourses').and.returnValue(of(''));
    const routerSpy = spyOn(router, 'navigate').and.returnValue(new Promise((resolve, reject) => { }));
    component.batchDetails = fakeBatchDetails;
    const toasterSpy = spyOn(toasterService, 'success');
    component.fetchEnrolledCourseData();
    tick(2000);
    expect(routerSpy).toHaveBeenCalled();
    expect(component.disableSubmitBtn).toBe(false);
    expect(toasterSpy).toHaveBeenCalled();
    expect(toasterSpy).toHaveBeenCalledWith(fakeResourceService.messages.smsg.m0036);
    expect(router.navigate).toHaveBeenCalled();
  }));

  it('should send audit event on course enrolled', () => {
    component.batchDetails = {
      identifier: '01278712683697766417',
      courseId: 'do_2127871108662804481320',
    };
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'audit');
    component.logAuditEvent();
    expect(telemetryService.audit).toHaveBeenCalled();
  });

  it('should call redirect', () => {
    const router = TestBed.get(Router);
    spyOn(router, 'navigate');
    component.redirect();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should log telemetry events', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'log');
    component.telemetryLogEvents(true);
    expect(telemetryService.log).toHaveBeenCalled();
  });
});
