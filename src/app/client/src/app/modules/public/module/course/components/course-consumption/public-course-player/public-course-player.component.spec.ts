
import {of,  Observable } from 'rxjs';
import { CourseHierarchyGetMockResponse } from './public-course-player.component.mock.data';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicCoursePlayerComponent } from './public-course-player.component';
import {SharedModule, ResourceService, ToasterService, ContentUtilsServiceService } from '@sunbird/shared';
import { CoreModule, CoursesService } from '@sunbird/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import {CourseConsumptionService, CourseProgressService, CourseBatchService} from '@sunbird/learn';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
  snapshot = {
    data: {
      telemetry: {
        env: 'explore', pageid: 'explore-course-toc', type: 'view'
      }
    },
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

describe('PublicCoursePlayerComponent', () => {
  let component: PublicCoursePlayerComponent;
  let fixture: ComponentFixture<PublicCoursePlayerComponent>;
  let activatedRouteStub, courseService, toasterService, courseConsumptionService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule],
      declarations: [ PublicCoursePlayerComponent ],
      providers: [{ provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ResourceService, useValue: resourceServiceMockData },
        CourseConsumptionService,  { provide: Router, useClass: MockRouter },
        CourseProgressService, CourseBatchService, ContentUtilsServiceService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicCoursePlayerComponent);
    component = fixture.componentInstance;
    activatedRouteStub = TestBed.get(ActivatedRoute);
    courseService = TestBed.get(CoursesService);
    toasterService = TestBed.get(ToasterService);
    courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(toasterService, 'error').and.returnValue('');
  });
  it('should fetch course details on page load', () => {
    activatedRouteStub.snapshot.params = {courseId: 'do_212347136096788480178'};
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    courseService.initialize();
    component.ngOnInit();
    expect(component.courseHierarchy).toBeDefined();
    expect(component.loader).toBe(false);
  });
});
