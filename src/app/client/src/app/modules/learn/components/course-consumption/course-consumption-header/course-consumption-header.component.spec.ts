import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';

import { of as observableOf, of, throwError } from 'rxjs';
import {
  CourseHierarchyGetMockResponse,
  CourseHierarchyGetMockResponseFlagged
} from './../course-player/course-player.component.mock.data';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseConsumptionHeaderComponent } from './course-consumption-header.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseConsumptionService, CourseProgressService } from '../../../services';
import { CoreModule, CoursesService, PermissionService, CopyContentService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService, ToasterService, ContentData } from '@sunbird/shared';
import { ContentUtilsServiceService } from '../../../../shared/services/content-utils/content-utils.service';
import { configureTestSuite } from '@sunbird/test-util';
import { GroupsService } from '../../../../groups/services/groups/groups.service';

const resourceServiceMockData = {
  messages: {
    imsg: { m0027: 'Something went wrong', activityAddedSuccess: 'Activity added successfully' },
    stmsg: { m0009: 'error', activityAddFail: 'Unable to add activity, please try again' },
    emsg: { m0005: 'error', noAdminRole: `You don't have permission to add activity to the group` },
    smsg: { m0042: ''},
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
        CourseConsumptionService, CourseProgressService, { provide: Router, useClass: RouterStub },
        TelemetryService, CopyContentService ],
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
    spyOn(component['courseConsumptionService'], 'isTrackableCollection').and.returnValue(true);
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
    spyOn(component['courseConsumptionService'], 'isTrackableCollection').and.returnValue(true);
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
    spyOn(component['courseConsumptionService'], 'isTrackableCollection').and.returnValue(true);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    component.courseHierarchy = CourseHierarchyGetMockResponseFlagged.result.content;
    component.ngOnInit();
    expect(component.courseHierarchy).toBeDefined();
    expect(component.enrolledCourse).toBeFalsy();
    expect(component.showResumeCourse).toBeTruthy();
  });
  it('should unsubscribe from all observable subscriptions', () => {
    spyOn(component.unsubscribe, 'next');
    spyOn(component.unsubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe.next).toHaveBeenCalled();
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

  it('should call addActivityToGroup', () => {
    const groupService = TestBed.get(GroupsService);
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    groupService.groupData = { memberRole: 'admin' };
    component.courseId = 'do_113016540611043328128';
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'success');
    spyOn(groupService, 'addActivities').and.returnValue(of(true));
    courseConsumptionService.coursePagePreviousUrl = { url: '/my-groups/group-details/dc423bed-67c1-4475-92b7-84c58c663204/add-activity-to-group/courses/1' };
    component.addActivityToGroup();
    expect(toasterService.success).toHaveBeenCalledWith('Activity added successfully');
  });

  it('should call addActivityToGroup on error', () => {
    const groupService = TestBed.get(GroupsService);
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    component.courseId = 'do_113016540611043328128';
    groupService.groupData = { memberRole: 'admin' };
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    spyOn(groupService, 'addActivities').and.returnValue(throwError({}));
    courseConsumptionService.coursePagePreviousUrl = { url: '/my-groups/group-details/dc423bed-67c1-4475-92b7-84c58c663204/add-activity-to-group/courses/1' };
    component.addActivityToGroup();
    expect(toasterService.error).toHaveBeenCalledWith('Unable to add activity, please try again');
  });

  it('should call show error for non admin user', () => {
    const groupService = TestBed.get(GroupsService);
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    component.courseId = 'do_113016540611043328128';
    groupService.groupData = { memberRole: 'member' };
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    spyOn(groupService, 'addActivities').and.returnValue(throwError({}));
    courseConsumptionService.coursePagePreviousUrl = { url: '/my-groups/group-details/dc423bed-67c1-4475-92b7-84c58c663204/add-activity-to-group/courses/1' };
    component.addActivityToGroup();
    expect(toasterService.error).toHaveBeenCalledWith(`Unable to add activity, please try again`);
  });

  it('should call route to dashboard', () => {
    component.courseHierarchy = CourseHierarchyGetMockResponse.result.content;
    component.courseId  = 'do_212347136096788480178';
    component.showDashboard();
    expect(component['router'].navigate).toHaveBeenCalledWith(['learn/course', component.courseId, 'dashboard', 'batches']);
  });

  it('should close the dashboard', () => {
    component.courseId  = 'do_212347136096788480178';
    component.closeDashboard();
    expect(component['router'].navigate).toHaveBeenCalledWith(['learn/course', component.courseId]);
  });

  it('should close the dashboard', () => {
    component.resourceService.messages = resourceServiceMockData.messages;
    spyOn(component.copyContentService, 'copyContent').and.returnValue(of ({content: {}}));
    spyOn(component.toasterService, 'success');
    let content: ContentData;
    component.copyContent(content);
    expect(component.copyContentService.copyContent).toHaveBeenCalled();
    component.copyContentService.copyContent(content).subscribe(data => {
      expect(component.toasterService.success).toHaveBeenCalled();
      expect(component.showCopyLoader).toBeFalsy();
    });
  });

  it('should show error if copy content fails', () => {
    component.resourceService.messages = resourceServiceMockData.messages;
    const copycontentService = TestBed.get(CopyContentService);
    spyOn(copycontentService, 'copyContent').and.returnValue(throwError ({content: {}}));
    spyOn(component.toasterService, 'error');
    let content: ContentData;
    component.copyContent(content);
    expect(copycontentService.copyContent).toHaveBeenCalled();
    expect(component.toasterService.error).toHaveBeenCalled();
    expect(component.showCopyLoader).toBeFalsy();
  });

  it('should call goBack and return to learn page', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const router = TestBed.get(Router);
    courseConsumptionService.coursePagePreviousUrl = { url: '/learn' };
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/learn']);
  });

  it('should call goBack and return to learn page while previousPageUrl is undefiened', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const router = TestBed.get(Router);
    courseConsumptionService.coursePagePreviousUrl = '';
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/learn']);
  });

  it('should call goBack and return to previous page with query params', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const router = TestBed.get(Router);
    courseConsumptionService.coursePagePreviousUrl = { url: '/search/Courses/1', queryParams: {key: 'misc course'} };
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/search/Courses/1'], {queryParams:  {key: 'misc course'} });
  });

  it('should call logTelemetry', () => {
    const activatedRouteStub = TestBed.get(ActivatedRoute);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact').and.callThrough();
    activatedRouteStub['snapshot'] = {
      params: [ {
        courseId: 'do_1125083286221291521153',
      }],
      data: {
        telemetry: {
          object: {}
        }
      }
    };
    component.courseHierarchy = CourseHierarchyGetMockResponse.result.content;
    component.logTelemetry('course-start', CourseHierarchyGetMockResponse.result.content);
    expect(telemetryService.interact).toHaveBeenCalled();
  });

  it('should close share popup and log interact telemetry', () => {
    const activatedRouteStub = TestBed.get(ActivatedRoute);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact').and.callThrough();
    activatedRouteStub['snapshot'] = {
      params: [ {
        courseId: 'do_1125083286221291521153',
      }],
      data: {
        telemetry: {
          object: {}
        }
      }
    };
    component.closeSharePopup('close-share-link-popup');
    expect(component.sharelinkModal).toBeFalsy();
    expect(telemetryService.interact).toHaveBeenCalled();
  });

  it ('should enable isTrackable', () => {
    CourseHierarchyGetMockResponseFlagged.result.content['trackable.enabled'] = 'Yes';
    component.courseHierarchy = CourseHierarchyGetMockResponseFlagged.result.content;
    spyOn(component['courseConsumptionService'], 'canViewDashboard').and.returnValue(true);
    spyOn(component['courseConsumptionService'], 'isTrackableCollection').and.returnValue(true);
    component.ngOnInit();
    expect(component.isTrackable).toBeTruthy();
    expect(component.viewDashboard).toBeTruthy();
  });

  it ('should disable isTrackable', () => {
    CourseHierarchyGetMockResponseFlagged.result.content['trackable.enabled'] = 'No';
    CourseHierarchyGetMockResponseFlagged.result.content['contentType'] = 'Textbook';
    component.courseHierarchy = CourseHierarchyGetMockResponseFlagged.result.content;
    spyOn(component['courseConsumptionService'], 'canViewDashboard').and.returnValue(false);
    spyOn(component['courseConsumptionService'], 'isTrackableCollection').and.returnValue(false);
    component.ngOnInit();
    expect(component.isTrackable).toBeFalsy();
    expect(component.viewDashboard).toBeFalsy();
  });
});
