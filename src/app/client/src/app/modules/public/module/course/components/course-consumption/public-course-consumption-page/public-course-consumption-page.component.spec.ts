
import {of,  Observable } from 'rxjs';
import { CourseHierarchyGetMockResponse } from '../public-course-player/public-course-player.component.mock.data';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicCourseConsumptionPageComponent } from './public-course-consumption-page.component';
import {SharedModule, ResourceService, ToasterService, ContentUtilsServiceService, NavigationHelperService } from '@sunbird/shared';
import { CoreModule, CoursesService } from '@sunbird/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import {CourseConsumptionService, CourseProgressService, CourseBatchService} from '@sunbird/learn';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { TelemetryService, TelemetryModule } from '@sunbird/telemetry';

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
    params: {},
    firstChild: { params : {}},
    data: { telemetry: { env: 'explore', pageid: 'explore-course-toc', type: 'view'} },
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

describe('PublicCourseConsumptionPageComponent', () => {
  let component: PublicCourseConsumptionPageComponent;
  let fixture: ComponentFixture<PublicCourseConsumptionPageComponent>;
  let activatedRouteStub, courseService, toasterService, courseConsumptionService, navigationHelperService;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, TelemetryModule.forRoot()],
      declarations: [ PublicCourseConsumptionPageComponent ],
      providers: [{ provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ResourceService, useValue: resourceServiceMockData },
        CourseConsumptionService,  { provide: Router, useClass: MockRouter },
        CourseProgressService, CourseBatchService, ContentUtilsServiceService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicCourseConsumptionPageComponent);
    component = fixture.componentInstance;
    activatedRouteStub = TestBed.get(ActivatedRoute);
    courseService = TestBed.get(CoursesService);
    toasterService = TestBed.get(ToasterService);
    courseConsumptionService = TestBed.get(CourseConsumptionService);
    navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'navigateToResource').and.returnValue('');
    spyOn(toasterService, 'error').and.returnValue('');
  });

  it('should fetch course details on page load', () => {
    activatedRouteStub.snapshot.firstChild.params = {courseId: 'do_212347136096788480178'};
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    courseService.initialize();
    component.ngOnInit();
    expect(component.courseHierarchy).toBeDefined();
    expect(component.showLoader).toBe(false);
  });

  it('should redirect to explore course page if course id not exists', () => {
    activatedRouteStub.snapshot.firstChild.params = {};
    spyOn(component, 'redirectToExplore').and.callThrough();
    component.ngOnInit();
    expect(component.redirectToExplore).toHaveBeenCalled();
    expect(component.navigationHelperService.navigateToResource).toHaveBeenCalledWith('explore-course');
  });

  it('should open share link popup and share url should be of anonymous explore course page', () => {
    activatedRouteStub.snapshot.firstChild.params = {courseId: 'do_212347136096788480178'};
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    spyOn(component, 'onShareLink').and.callThrough();
    courseService.initialize();
    component.ngOnInit();
    component.onShareLink();
    expect(component.sharelinkModal).toBe(true);
    expect(component.shareLink).toContain('explore-course/course/do_212347136096788480178');
  });

  it('should call closeSharePopup', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact');
    component.closeSharePopup('do_121214221212');
    expect(component.sharelinkModal).toBe(false);
    expect(telemetryService.interact).toHaveBeenCalled();
  });

  it('should call logTelemetry', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact');
    component.logTelemetry('do_121214221212');
    expect(telemetryService.interact).toHaveBeenCalled();
  });
});
