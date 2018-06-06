import { CourseHierarchyGetMockResponse } from './../course-player/course-player.component.mock.data';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseConsumptionPageComponent } from './course-consumption-page.component';
import {SharedModule, ResourceService, ToasterService } from '@sunbird/shared';
import { CoreModule, CoursesService, LearnerService } from '@sunbird/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {CourseConsumptionService, CourseProgressService} from '../../../services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';

const enrolledCourse = {
  courseSuccessNotEnroll: {
    'id': 'api.course.getbyuser', 'params': {
        'resmsgid': 'null', 'msgid': 'c9099093-7305-8258-9781-014df666da36',
        'status': 'success', 'err': 'null', 'errmsg': 'null'
    }, 'responseCode': 'OK',
    'result': {
        'courses': {
            '0': {
                'active': 'true', 'courseId': 'do_2123412199319552001265', 'courseName': '27-sept',
                'description': 'test', 'leafNodesCount': '0', 'progress': '0', 'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
            }
        }
    }
  },
  courseSuccessEnroll: {
    'id': 'api.course.getbyuser', 'params': {
        'resmsgid': 'null', 'msgid': 'c9099093-7305-8258-9781-014df666da36',
        'status': 'success', 'err': 'null', 'errmsg': 'null'
    }, 'responseCode': 'OK',
    'result': {
        'courses': {
            '0': {
                'active': 'true', 'courseId': 'do_2123412199319552001265', 'courseName': '27-sept', 'batchId': 'do_112498388508524544160',
                'description': 'test', 'leafNodesCount': '0', 'progress': '0', 'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
            }
        }
    }
  },
  courseError: {
      'id': 'api.course.getbyuser', 'params': {
          'resmsgid': 'UNAUTHORIZED', 'msgid': 'c9099093-7305-8258-9781-014df666da36',
          'status': 'error', 'err': 'UNAUTHORIZED', 'errmsg': 'UNAUTHORIZED'
      }, 'responseCode': 'error',
      'result': { 'courses': {} }
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
  }
};
class ActivatedRouteStub {
  paramsMock = {courseId: 'do_212347136096788480178', batchId: 'do_112498388508524544160'};
  queryParamsMock = {contentId: 'do_112270494168555520130'};
  queryParams =  Observable.of(this.queryParamsMock);
  params = Observable.of({});
  firstChild = {
    params : Observable.of(this.paramsMock)
  };
  public changeFirstChildParams(params) {
    this.firstChild.params = Observable.of(params);
  }
  public changeQueryParams(params) {
    this.paramsMock = params;
  }
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule.forRoot(), Ng2IziToastModule],
      declarations: [ CourseConsumptionPageComponent ],
      providers: [{ provide: ActivatedRoute, useClass: ActivatedRouteStub },
        CourseConsumptionService,  { provide: Router, useClass: MockRouter },
        CourseProgressService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseConsumptionPageComponent);
    component = fixture.componentInstance;
  });

  it('should fetch courseHierarchy from courseConsumptionService', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(enrolledCourse.courseSuccessEnroll));
    courseService.initialize();
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(Observable.of(CourseHierarchyGetMockResponse.result.content));
    component.ngOnInit();
    expect(component.courseHierarchy).toBeDefined();
    component.ngOnDestroy();
  });
  it('should throw error if courseHierarchy api fails', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(toasterService, 'error');
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(Observable.throw(CourseHierarchyGetMockResponse.result.content));
    component.ngOnInit();
    expect(component.courseHierarchy).toBeUndefined();
    expect(component.toasterService.error).toHaveBeenCalled();
    component.ngOnDestroy();
  });
  it('should navigate to course view page if batch is not enrolled', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(enrolledCourse.courseSuccessNotEnroll));
    courseService.initialize();
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(Observable.of(CourseHierarchyGetMockResponse.result.content));
    component.ngOnInit();
    expect(component.courseHierarchy).toBeDefined();
    expect(component.enrolledCourse).toBeFalsy();
    expect(component.router.navigate).toHaveBeenCalledWith(['/learn/course/do_212347136096788480178']);
    component.ngOnDestroy();
  });
  it('should stay on the same page if course is enrolled and batchId obtained from url', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(enrolledCourse.courseSuccessEnroll));
    courseService.initialize();
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(Observable.of(CourseHierarchyGetMockResponse.result.content));
    component.ngOnInit();
    expect(component.courseHierarchy).toBeDefined();
    expect(component.enrolledCourse).toBeTruthy();
    component.ngOnDestroy();
  });
  it('should navigate to course view page if fetching enrolled course fails', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    courseService._enrolledCourseData$.next({err: {}, enrolledCourses: null});
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(Observable.of(CourseHierarchyGetMockResponse.result.content));
    spyOn(toasterService, 'error');
    component.ngOnInit();
    expect(component.courseHierarchy).toBeDefined();
    expect(component.enrolledCourse).toBeFalsy();
    expect(component.toasterService.error).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalledWith(['/learn/course/do_212347136096788480178']);
    component.ngOnDestroy();
  });
});
