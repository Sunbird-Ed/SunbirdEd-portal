
import {throwError, of,  Observable } from 'rxjs';
import { enrolledBatch } from './../../batch/batch-details/batch-details.component.data';
import { CourseHierarchyGetMockResponse } from './../course-player/course-player.component.mock.data';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { CourseConsumptionPageComponent } from './course-consumption-page.component';
import {SharedModule, ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { CoreModule, CoursesService, LearnerService, GeneraliseLabelService } from '@sunbird/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import {CourseConsumptionService, CourseProgressService, CourseBatchService} from '../../../services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';

const enrolledCourse = {
  courseSuccessEnroll: {
    'id': 'api.course.getbyuser', 'params': {
        'resmsgid': 'null', 'msgid': 'c9099093-7305-8258-9781-014df666da36',
        'status': 'success', 'err': 'null', 'errmsg': 'null'
    }, 'responseCode': 'OK',
    'result': {
        'courses': {
            '0': {
                'active': 'true', 'courseId': 'do_212347136096788480178', 'courseName': '27-sept', 'batchId': 'do_112498388508524544160',
                'description': 'test', 'leafNodesCount': '0', 'progress': '0', 'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
            }
        }
    }
  }
};
const resourceServiceMockData = {
  messages : {
    imsg: { m0027: 'Something went wrong'},
    fmsg: { m0001: 'error', m0003: 'error' },
    emsg: { m0005: 'error'}
  },
  frmelmnts: {
    btn: {
      tryagain: 'tryagain',
      close: 'close'
    },
    lbl: {
      description: 'description'
    }
  },
  languageSelected$: of({})
};
class ActivatedRouteStub {
  snapshot = {
    queryParams: {},
    params: {},
    firstChild: { params : {}}
  };
}
class MockRouter {
  navigate = jasmine.createSpy('navigate');
  public navigationEnd = new NavigationEnd(1, '/learn', '/learn');
  public events = new Observable(observer => {
    observer.next(this.navigationEnd);
    observer.complete();
  });
}

describe('CourseConsumptionPageComponent', () => {
  let component: CourseConsumptionPageComponent;
  let fixture: ComponentFixture<CourseConsumptionPageComponent>;
  let activatedRouteStub, courseService, toasterService, courseConsumptionService, courseBatchService, learnerService,
  navigationHelperService, generaliseLabelService;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, RouterTestingModule, TelemetryModule.forRoot()],
      declarations: [ CourseConsumptionPageComponent ],
      providers: [{ provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ResourceService, useValue: resourceServiceMockData },
        CourseConsumptionService,  { provide: Router, useClass: MockRouter },
        CourseProgressService, CourseBatchService, TelemetryService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseConsumptionPageComponent);
    component = fixture.componentInstance;
    activatedRouteStub = TestBed.get(ActivatedRoute);
    courseService = TestBed.get(CoursesService);
    toasterService = TestBed.get(ToasterService);
    courseConsumptionService = TestBed.get(CourseConsumptionService);
    courseBatchService = TestBed.get(CourseBatchService);
    learnerService = TestBed.get(LearnerService);
    navigationHelperService = TestBed.get(NavigationHelperService);
    generaliseLabelService = TestBed.get(GeneraliseLabelService);
    spyOn(generaliseLabelService, 'initialize').and.returnValue('');
    spyOn(navigationHelperService, 'navigateToResource').and.returnValue('');
    spyOn(toasterService, 'error').and.returnValue('');
    activatedRouteStub.snapshot.firstChild.params = { courseId: 'do_212347136096788480178', batchId: 'do_112498388508524544160'};
  });
  it('should navigate to enroll course page if batch and autoEnroll available in queryParams', () => {
    activatedRouteStub.snapshot.firstChild.params = {courseId: 'do_212347136096788480178', batchId: ''};
    activatedRouteStub.snapshot.queryParams = {batch: 'do_112498388508524544160', autoEnroll: 'true'};
    spyOn(learnerService, 'get').and.returnValue(of({}));
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    spyOn(courseBatchService, 'getEnrolledBatchDetails').and.returnValue(of(enrolledBatch));
    courseService.initialize();
    component.ngOnInit();
    const routedURL = ['learn/course/do_212347136096788480178/enroll/batch/do_112498388508524544160'];
    const reqParams = {
      queryParams: { autoEnroll: 'true' }
    };
    expect(component.router.navigate).toHaveBeenCalledWith(routedURL, reqParams);
  });
  xit('should refresh component with updated batch details when user selects another batch', () => {
    const spy = spyOn<any>(component['fetchEnrolledCourses$'], 'next');
    component.refreshComponent(true);
    expect(spy).toHaveBeenCalled();
    expect(component.showBatchInfo).toBeFalsy();
  });
  it('should fetch course details if it not enrolled course and should not fetch enrolled batch details', fakeAsync(() => {
    activatedRouteStub.snapshot.firstChild.params = {courseId: 'do_123'};
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    spyOn(learnerService, 'get').and.returnValue(of(enrolledCourse.courseSuccessEnroll));
    courseService.initialize();
    component.ngOnInit();
    tick(200);
    expect(component.courseHierarchy).toBeDefined();
  }));    
  it('should navigate to course view page if batchId/courseId combination dint match any enrolled course list', () => {
    activatedRouteStub.snapshot.firstChild.params = {courseId: 'do_123',  batchId: '123'};
    spyOn(learnerService, 'get').and.returnValue(of(enrolledCourse.courseSuccessEnroll));
    courseService.initialize();
    component.ngOnInit();
    expect(component.navigationHelperService.navigateToResource).toHaveBeenCalledWith('/learn');
  });
  it('should unsubscribe from all observable subscriptions', () => {
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });
  it('should throw error if getEnrolledBatchDetails api fails', () => {
    spyOn(learnerService, 'get').and.returnValue(of(enrolledCourse.courseSuccessEnroll));
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    spyOn(courseBatchService, 'getEnrolledBatchDetails').and.returnValue(throwError(enrolledBatch));
    courseService.initialize();
    component.ngOnInit();
    expect(component.courseHierarchy).toBeUndefined();
    expect(component.toasterService.error).toHaveBeenCalled();
  });
  it('should throw error if courseHierarchy api fails', () => {
    spyOn(learnerService, 'get').and.returnValue(of(enrolledCourse.courseSuccessEnroll));
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(throwError(CourseHierarchyGetMockResponse.result.content));
    courseService.initialize();
    component.ngOnInit();
    expect(component.courseHierarchy).toBeUndefined();
    expect(component.toasterService.error).toHaveBeenCalled();
  });
  it('should navigate to course consumption page if batch from route dint match but course found in enroll list', () => {
    activatedRouteStub.snapshot.firstChild.params = {courseId: 'do_212347136096788480178',  batchId: '123'};
    spyOn(learnerService, 'get').and.returnValue(of(enrolledCourse.courseSuccessEnroll));
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    spyOn(courseBatchService, 'getEnrolledBatchDetails').and.returnValue(of(enrolledBatch));
    courseService.initialize();
    component.ngOnInit();
    expect(component.router.navigate).toHaveBeenCalledWith(['learn/course/do_212347136096788480178/batch/do_112498388508524544160']);
  });
  it('should fetch courseHierarchy,EnrolledBatchDetails if course is enrolled', fakeAsync(() => {
    spyOn(learnerService, 'get').and.returnValue(of(enrolledCourse.courseSuccessEnroll));
    spyOn(courseBatchService, 'getEnrolledBatchDetails').and.returnValue(of(enrolledBatch));
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    courseService.initialize();
    component.ngOnInit();
    tick(200);
    expect(component.courseHierarchy).toBeDefined();
    expect(component.enrolledBatchInfo).toBeDefined();
    expect(component.batchId).toBeTruthy();
  }));
  it('should navigate to course consumption page if course is present in enrolled list,if batchId is not in activated route',
  fakeAsync(() => {
    activatedRouteStub.snapshot.firstChild.params = {courseId: 'do_212347136096788480178'};
    spyOn(learnerService, 'get').and.returnValue(of(enrolledCourse.courseSuccessEnroll));
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    spyOn(courseBatchService, 'getEnrolledBatchDetails').and.returnValue(of(enrolledBatch));
    courseService.initialize();
    component.ngOnInit();
    tick(200);
    expect(component.router.navigate).toHaveBeenCalledWith(['learn/course/do_212347136096788480178/batch/do_112498388508524544160']);
    expect(component.enrolledBatchInfo).toBeDefined();
    expect(component.courseHierarchy).toBeDefined();
  }));
});
