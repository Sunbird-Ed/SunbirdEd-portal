import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';

import { of as observableOf, Observable } from 'rxjs';
import {
  CourseHierarchyGetMockResponse,
  CourseHierarchyGetMockResponseFlagged
} from './../course-player/course-player.component.mock.data';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseConsumptionHeaderComponent } from './course-consumption-header.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseConsumptionService, CourseProgressService } from '../../../services';
import { CoreModule, CoursesService, PermissionService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService, WindowScrollService } from '@sunbird/shared';
import { ContentUtilsServiceService } from '../../../../shared/services/content-utils/content-utils.service';
import { configureTestSuite } from '@sunbird/test-util';

const resourceServiceMockData = {
  messages: {
    imsg: { m0027: 'Something went wrong' },
    stmsg: { m0009: 'error' },
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
  paramsMock = { courseId: 'do_212347136096788480178', batchId: 'do_112498388508524544160' };
  queryParamsMock = { contentId: 'do_112270494168555520130' };
  queryParams = observableOf(this.queryParamsMock);
  params = { first: () => observableOf(this.paramsMock) };
  firstChild = {
    params: observableOf(this.paramsMock),
    queryParams: observableOf(this.queryParamsMock)
  };
  public changeFirstChildParams(params) {
    this.firstChild.params = observableOf(params);
  }
  public changeQueryParams(params) {
    this.paramsMock = params;
  }
}
class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('CourseConsumptionHeaderComponent', () => {
  let component: CourseConsumptionHeaderComponent;
  let fixture: ComponentFixture<CourseConsumptionHeaderComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CourseConsumptionHeaderComponent],
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, TelemetryModule.forRoot()],
      providers: [{ provide: ActivatedRoute, useClass: ActivatedRouteStub }, PermissionService,
        CourseConsumptionService, CourseProgressService, { provide: Router, useClass: RouterStub }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseConsumptionHeaderComponent);
    component = fixture.componentInstance;
  });

  it(`should enable resume button if course is not flagged, batch status is not "0" and courseProgressData obtained from courseProgressService`, () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const courseProgressService = TestBed.get(CourseProgressService);
    const permissionService = TestBed.get(PermissionService);
    const resourceService = TestBed.get(ResourceService);
    spyOn(courseConsumptionService, 'parseChildren').and.returnValue([]);
    spyOn(permissionService, 'checkRolesPermissions').and.returnValue(true);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    component.courseHierarchy = CourseHierarchyGetMockResponse.result.content;
    component.enrolledBatchInfo = { status: 1 };


    component.ngOnInit();
    component.ngAfterViewInit();
    courseProgressService.courseProgressData.emit({ lastPlayedContentId: 'do_123' });
    expect(component.courseHierarchy).toBeDefined();
    expect(component.flaggedCourse).toBeFalsy();
    expect(component.enrolledCourse).toBeTruthy();
    expect(component.showResumeCourse).toBeFalsy();
  });

  it('should not enable resume button if course is flagged and courseProgressData obtained from courseProgressService', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService, 'parseChildren').and.returnValue([]);
    spyOn(courseConsumptionService.updateContentConsumedStatus, 'emit');
    const courseProgressService = TestBed.get(CourseProgressService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    component.courseHierarchy = CourseHierarchyGetMockResponseFlagged.result.content;
    component.ngOnInit();
    component.batchId = '01232121843';
    component.ngAfterViewInit();
    courseProgressService.courseProgressData.emit({});
    expect(component.courseHierarchy).toBeDefined();
    expect(component.flaggedCourse).toBeTruthy();
    expect(component.enrolledCourse).toBeTruthy();
    expect(component.showResumeCourse).toBeTruthy();
    expect(courseConsumptionService.updateContentConsumedStatus.emit).toHaveBeenCalled();
  });

  it('should not enable resume button if batchId is not present', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const courseProgressService = TestBed.get(CourseProgressService);
    const resourceService = TestBed.get(ResourceService);
    const activatedRouteStub = TestBed.get(ActivatedRoute);
    activatedRouteStub.changeFirstChildParams({ courseId: 'do_212347136096788480178' });
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    component.courseHierarchy = CourseHierarchyGetMockResponseFlagged.result.content;
    component.ngOnInit();
    expect(component.courseHierarchy).toBeDefined();
    expect(component.enrolledCourse).toBeFalsy();
    expect(component.showResumeCourse).toBeTruthy();
  });
  it('should unsubscribe from all observable subscriptions', () => {
    spyOn(component.unsubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
  });
  it('should call  getBatchStatus and return true if batch status is  "2" and course is not completed', () => {
    component.enrolledBatchInfo = { status: 2 };
    component.progress = 50;
    spyOn(component, 'getBatchStatus').and.callThrough();
    const returnValue = component.getBatchStatus();
    expect(component.getBatchStatus).toHaveBeenCalled();
    expect(returnValue).toBe(true);
  });
  it('should call  getBatchStatus and return false if batch status is not  "2" and course is  completed', () => {
    component.enrolledBatchInfo = { status: 1 };
    component.progress = 100;
    spyOn(component, 'getBatchStatus').and.callThrough();
    const returnValue = component.getBatchStatus();
    expect(component.getBatchStatus).toHaveBeenCalled();
    expect(returnValue).toBe(false);
  });

  it('should call onShareLink', () => {
    const contentUtilsServiceService = TestBed.get(ContentUtilsServiceService);
    spyOn(contentUtilsServiceService, 'getCoursePublicShareUrl').and.returnValue('http://localhost:3000/learn');
    spyOn(component, 'setTelemetryShareData');
    component.onShareLink();
    expect(component.shareLink).toEqual('http://localhost:3000/learn');
    expect(component.setTelemetryShareData).toHaveBeenCalled();
  });

  it('should emit event to launch the player', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const coursesService = TestBed.get(CoursesService);
    spyOn(courseConsumptionService.launchPlayer, 'emit');
    spyOn(coursesService, 'setExtContentMsg');
    component.resumeCourse();
    expect(courseConsumptionService.launchPlayer.emit).toHaveBeenCalled();
    expect(coursesService.setExtContentMsg).toHaveBeenCalled();
  });
});
