
import { of, Observable } from 'rxjs';
import { CourseHierarchyGetMockResponse, telemetryInteractMockData, coursePlayerMockData } from './public-course-player.component.mock.data';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicCoursePlayerComponent } from './public-course-player.component';
import { SharedModule, ResourceService, ToasterService, ContentUtilsServiceService } from '@sunbird/shared';
import { CoreModule, CoursesService } from '@sunbird/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CourseConsumptionService, CourseProgressService, CourseBatchService } from '@sunbird/learn';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryService } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';

const resourceServiceMockData = {
  messages: {
    imsg: { m0027: 'Something went wrong' },
    fmsg: { m0001: 'error', m0003: 'error' },
    emsg: { m0005: 'error' }
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
        env: 'explore-course', pageid: 'explore-course-toc', type: 'view'
      }
    },
    params: {},
    firstChild: { params: {} }
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
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule],
      declarations: [PublicCoursePlayerComponent],
      providers: [{ provide: ActivatedRoute, useClass: ActivatedRouteStub },
      { provide: ResourceService, useValue: resourceServiceMockData },
        CourseConsumptionService, { provide: Router, useClass: MockRouter },
        CourseProgressService, CourseBatchService, ContentUtilsServiceService, TelemetryService],
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
    activatedRouteStub.snapshot.params = { courseId: 'do_212347136096788480178' };
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    courseService.initialize();
    component.ngOnInit();
    expect(component.courseHierarchy).toBeDefined();
    expect(component.loader).toBe(false);
  });
  it('should show join training popup', () => {
    courseService.initialize();
    component.ngOnInit();
    component.navigateToContent({ event: { type: 'click' } }, 'id');
    expect(component.showJoinTrainingModal).toBeTruthy();
  });
  xit('should log telemetry on click of join training popup close icon', () => {
    activatedRouteStub.snapshot.params = { courseId: 'do_212347136096788480178' };
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact');
    courseService.initialize();
    component.ngOnInit();
    component.navigateToContent({ event: { type: 'click' } }, 'id');
    expect(component.showJoinTrainingModal).toBeTruthy();
    expect(component.showJoinTrainingModal).toBeFalsy();
    expect(telemetryService.interact).toHaveBeenCalledWith(telemetryInteractMockData);
  });

  it('should call parseChildContent', () => {
    component.courseHierarchy = coursePlayerMockData.courseHierarchy;
    component['parseChildContent']();
    expect(component.curriculum).toEqual(coursePlayerMockData.curriculum);
  });

});
