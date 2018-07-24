
import {of as observableOf,  Observable } from 'rxjs';
import { CourseHierarchyGetMockResponse,
  CourseHierarchyGetMockResponseFlagged } from './../course-player/course-player.component.mock.data';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseConsumptionHeaderComponent } from './course-consumption-header.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {CourseConsumptionService, CourseProgressService} from '../../../services';
import {CoreModule} from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService, WindowScrollService } from '@sunbird/shared';

const resourceServiceMockData = {
  messages : {
    imsg: { m0027: 'Something went wrong'},
    stmsg: { m0009: 'error' },
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
  queryParams =  observableOf(this.queryParamsMock);
  params = {first: () => observableOf(this.paramsMock)};
  firstChild = {
    params : observableOf(this.paramsMock),
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseConsumptionHeaderComponent ],
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule.forRoot()],
      providers: [{ provide: ActivatedRoute, useClass: ActivatedRouteStub },
        CourseConsumptionService, CourseProgressService, { provide: Router, useClass: RouterStub }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseConsumptionHeaderComponent);
    component = fixture.componentInstance;
  });

  it(`should enable resume button if course is not flagged, batch status is not "0" and
  courseProgressData obtained from courseProgressService`, () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const courseProgressService = TestBed.get(CourseProgressService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    component.courseHierarchy = CourseHierarchyGetMockResponse.result.content;
    component.enrolledBatchInfo = {status: 1};
    component.ngOnInit();
    component.ngAfterViewInit();
    courseProgressService.courseProgressData.emit({lastPlayedContentId: 'do_123'});
    expect(component.courseHierarchy).toBeDefined();
    expect(component.flaggedCourse).toBeFalsy();
    expect(component.enrolledCourse).toBeTruthy();
    expect(component.showResumeCourse).toBeFalsy();
  });

   it('should not enable resume button if course is flagged and courseProgressData obtained from courseProgressService', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const courseProgressService = TestBed.get(CourseProgressService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    component.courseHierarchy = CourseHierarchyGetMockResponseFlagged.result.content;
    component.ngOnInit();
    component.ngAfterViewInit();
    courseProgressService.courseProgressData.emit({});
    expect(component.courseHierarchy).toBeDefined();
    expect(component.flaggedCourse).toBeTruthy();
    expect(component.enrolledCourse).toBeTruthy();
    expect(component.showResumeCourse).toBeTruthy();
  });

   it('should not enable resume button if batchId is not present', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const courseProgressService = TestBed.get(CourseProgressService);
    const resourceService = TestBed.get(ResourceService);
    const activatedRouteStub = TestBed.get(ActivatedRoute);
    activatedRouteStub.changeFirstChildParams({courseId: 'do_212347136096788480178'});
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
});
