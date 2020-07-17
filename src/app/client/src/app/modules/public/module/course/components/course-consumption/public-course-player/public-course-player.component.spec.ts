
import { of, Observable } from 'rxjs';
import { CourseHierarchyGetMockResponse, coursePlayerMockData } from './public-course-player.component.mock.data';
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
    emsg: {
      m0005: 'error',
      m0003: `The Course doesn't have any open batches`
    }
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
    component.courseHierarchy = coursePlayerMockData.courseHierarchy;
    courseService.initialize();
    component.ngOnInit();
    component.navigateToContent({ event: { type: 'click' } }, 'id');
    expect(component.showJoinTrainingModal).toBeTruthy();
  });

  it('should log telemetry on click of join training popup close icon', () => {
    activatedRouteStub.snapshot.params = { courseId: 'do_212347136096788480178' };
    component.courseHierarchy = coursePlayerMockData.courseHierarchy;
    spyOn(component, 'logTelemetry');
    component.navigateToContent({ event: { type: 'click' }, data: {identifier: 'do_212347136096788480178'} }, 'id');
    expect(component.showJoinTrainingModal).toBeTruthy();
    expect(component.logTelemetry).toHaveBeenCalledWith('id', {identifier: 'do_212347136096788480178'});
  });

  it('should call parseChildContent', () => {
    component.courseHierarchy = coursePlayerMockData.courseHierarchy;
    component['parseChildContent']();
    expect(component.curriculum).toEqual(coursePlayerMockData.curriculum);
  });

  it(`Show throw error with msg The course doesn't have any open batches`, () => {
    spyOn(component['courseConsumptionService'], 'getAllOpenBatches');
    component.getAllBatchDetails({content: [], count: 0});
    expect(component['courseConsumptionService'].getAllOpenBatches).toHaveBeenCalledWith({content: [], count: 0});
  });


  it('should call shareUnitLink', () => {
    const contentUtilServiceService = TestBed.get(ContentUtilsServiceService);
    spyOn(contentUtilServiceService, 'getCoursePublicShareUrl').and.returnValue('http://localhost:3000/explore-course/course/do_1130314965721088001129');
    spyOn(component, 'setTelemetryShareData');
    component.shareUnitLink({ identifier: 'do_23823253221' });
    expect(component.shareLink).toEqual('http://localhost:3000/explore-course/course/do_1130314965721088001129?moduleId=do_23823253221');
    expect(component.setTelemetryShareData).toHaveBeenCalled();
  });

  it('should call setTelemetryShareData', () => {
    const param = {
      identifier: 'do_1130314965721088001129',
      contentType: 'Course',
      pkgVersion: 2
    };
    component.setTelemetryShareData(param);
    expect(component.telemetryShareData).toBeDefined();
    expect(component.telemetryShareData).toEqual([{ id: param.identifier, type: param.contentType, ver: param.pkgVersion.toString() }]);
  });

  it('should close the popup and generate telemetry', () => {
    component.courseHierarchy = CourseHierarchyGetMockResponse.result.content;
    component['courseId'] = CourseHierarchyGetMockResponse.result.content.identifier;
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact');
    component.closeSharePopup('close-share-link-popup');
    expect(component.shareLinkModal).toBe(false);
    expect(telemetryService.interact).toHaveBeenCalled();
  });

  it('should close the join training popup on browser back button click', () => {
    activatedRouteStub.snapshot.params = { courseId: 'do_212347136096788480178' };
    component.courseHierarchy = coursePlayerMockData.courseHierarchy;
    component.navigateToContent({ event: { type: 'click' }, data: {identifier: 'do_212347136096788480178'} }, 'id');
    expect(component.showJoinTrainingModal).toBeTruthy();
    component.ngOnDestroy();
    expect(component.joinTrainingModal).toBeUndefined();
  });

  it('call isExpanded and return true', () => {
    const returnVal = component.isExpanded(0);
    expect(returnVal).toBe(true);
  });

  it('call isExpanded and return false', () => {
    component.isExpandedAll = false;
    const returnVal = component.isExpanded(1);
    expect(returnVal).toBe(component.isExpandedAll);
  });


});
