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
import { CoreModule, UserService, CoursesService, PermissionService, CopyContentService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService, ToasterService, ContentData, OfflineCardService } from '@sunbird/shared';
import { ContentUtilsServiceService } from '../../../../shared/services/content-utils/content-utils.service';
import { configureTestSuite } from '@sunbird/test-util';
import dayjs from 'dayjs';
import { DiscussionService } from './../../../../discussion/services/discussion/discussion.service';
import { MockResponseData } from './course-consumption-header.spec.data';
import { ContentManagerService } from '../../../../public/module/offline/services/content-manager/content-manager.service';

const resourceServiceMockData = {
  messages: {
    imsg: { m0027: 'Something went wrong', activityAddedSuccess: 'Activity added successfully' },
    stmsg: {
      m0009: 'error', activityAddFail: 'Unable to add activity, please try again',
      desktop: {
        deleteTextbookSuccessMessage: 'Textbook deleted successfully'
      }
    },
    etmsg: {
      desktop: {
        'deleteTextbookErrorMessage': 'Unable to delete textbook. Please try again..',
      }
    },
    emsg: { m0005: 'Something went wrong, try again later', noAdminRole: `You don't have permission to add activity to the group` },
    smsg: { m0042: '', m0059: 'Content successfully copied' },
    fmsg: { m0096: 'Could not Update. Try again later', m0091: 'Could not copy content. Try again later', m0090: 'Could not download. Try again later' }
  },
  frmelmnts: {
    btn: {
      tryagain: 'tryagain',
      close: 'close'
    },
    lbl: {
      description: 'description',
      BatchExpiringIn: "Batch expiring in"
    }
  }
};
class ActivatedRouteStub {
  paramsMock = { courseId: 'do_212347136096788480178', batchId: 'do_112498388508524544160' };
  queryParamsMock = { contentId: 'do_112270494168555520130' };
  queryParams = observableOf(this.queryParamsMock);
  params = { first: () => observableOf(this.paramsMock) };
  snapshot = {
    data: {
      telemetry: {
        env: 'get', pageid: 'get', type: 'edit', subtype: 'paginate'
      },
    },
    params: {
      courseId: 'do_212347136096788480178'
    }
  };
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
        TelemetryService, CopyContentService, DiscussionService, UserService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseConsumptionHeaderComponent);
    component = fixture.componentInstance;
    jasmine.getEnv().allowRespy(true);
    component.profileInfo = {
      firstName: 'Gourav',
      lastName: 'More1',
      id: '1234567890'
    };
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

  it('should call  getTimeRemaining and return remaning time', () => {
    const endDate = new Date().getTime() + 2000 * 60 * 60 * 24;
    const incrEndDate = dayjs(endDate).format('MMM DD, YYYY');
    spyOn(Date, 'now').and.returnValue(1387636363717);
    spyOn(component, 'getTimeRemaining').and.callThrough();
    spyOn(component, 'getFormData').and.callThrough();
    component.batchEndCounter = 2;
    const returnValue = component.getTimeRemaining(incrEndDate);
    expect(component.getTimeRemaining).toHaveBeenCalled();
  });

  it('should get formconfig to show remaining time of batch', () => {
    const endDate = new Date().getTime() + 2000 * 60 * 60 * 24;
    const incrEndDate = dayjs(endDate).format('MMM DD, YYYY');
    spyOn(component, 'getTimeRemaining').and.callThrough();
    spyOn(component, 'getFormData').and.callThrough();
    component.getTimeRemaining(incrEndDate);
    expect(component.getFormData).toHaveBeenCalled();
  });

  it('if same date and hours or mins left should show the remaning time', () => {
    const endDate = new Date().getTime() + 60 * 60 * 24;
    const incrEndDate = dayjs(endDate).format('MMM DD, YYYY');
    spyOn(component, 'getTimeRemaining').and.callThrough();
    spyOn(component, 'getFormData').and.callThrough();
    component.batchEndCounter = 2;
    const returnValue = component.getTimeRemaining(incrEndDate);
    expect(component.getTimeRemaining).toHaveBeenCalled();
    expect(component.showBatchCounter).toBeTruthy();
    expect(returnValue).toBeDefined();
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

  it('should call route to dashboard', () => {
    component.courseHierarchy = CourseHierarchyGetMockResponse.result.content;
    component.courseId = 'do_212347136096788480178';
    component.showDashboard();
    expect(component['router'].navigate).toHaveBeenCalledWith(['learn/course', component.courseId, 'dashboard', 'batches']);
  });

  it('should close the dashboard', () => {
    component.courseId = 'do_212347136096788480178';
    component.closeDashboard();
    expect(component['router'].navigate).toHaveBeenCalledWith(['learn/course', component.courseId]);
  });

  it('should close the dashboard', () => {
    component.resourceService.messages = resourceServiceMockData.messages;
    spyOn(component.copyContentService, 'copyContent').and.returnValue(of({ content: {} }));
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
    spyOn(copycontentService, 'copyContent').and.returnValue(throwError({ content: {} }));
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
    courseConsumptionService.coursePagePreviousUrl = { url: '/search/Courses/1', queryParams: { key: 'misc course' } };
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/search/Courses/1'], { queryParams: { key: 'misc course' } });
  });

  it('should call logTelemetry', () => {
    const activatedRouteStub = TestBed.get(ActivatedRoute);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact').and.callThrough();
    activatedRouteStub['snapshot'] = {
      params: [{
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
      params: [{
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

  it('should enable isTrackable', () => {
    CourseHierarchyGetMockResponseFlagged.result.content['trackable.enabled'] = 'Yes';
    component.courseHierarchy = CourseHierarchyGetMockResponseFlagged.result.content;
    spyOn(component['courseConsumptionService'], 'canViewDashboard').and.returnValue(true);
    spyOn(component['courseConsumptionService'], 'isTrackableCollection').and.returnValue(true);
    component.ngOnInit();
    expect(component.isTrackable).toBeTruthy();
    expect(component.viewDashboard).toBeTruthy();
  });

  it('should disable isTrackable', () => {
    CourseHierarchyGetMockResponseFlagged.result.content['trackable.enabled'] = 'No';
    CourseHierarchyGetMockResponseFlagged.result.content['contentType'] = 'Textbook';
    component.courseHierarchy = CourseHierarchyGetMockResponseFlagged.result.content;
    spyOn(component['courseConsumptionService'], 'canViewDashboard').and.returnValue(false);
    spyOn(component['courseConsumptionService'], 'isTrackableCollection').and.returnValue(false);
    component.ngOnInit();
    expect(component.isTrackable).toBeFalsy();
    expect(component.viewDashboard).toBeFalsy();
  });

  it('should generate context data for course/batch', () => {
    /** Arrange */
    component.courseId = 'do_11317805943810457614592';
    const mockRequest = {
      identifier: ['do_11317805943810457614592'],
      type: 'course'
    };

    /** Act */
    component.generateDataForDF();

    /** Assert */
    expect(component.fetchForumIdReq).toEqual(mockRequest);

  });

  it('should check checkDownloadStatus', () => {
    component.courseHierarchy = MockResponseData.contentHeaderData.collectionData.result.content;
    component.contentDownloadStatus = { [MockResponseData.contentHeaderData.collectionData.result.content.identifier]: 'COMPLETED' };
    component.checkDownloadStatus();
    expect(component.courseHierarchy).toEqual(MockResponseData.contentHeaderData.collectionData.result.content);
    expect(component.courseHierarchy['downloadStatus']).toEqual('DOWNLOADED');
  });

  it('should check collection status', () => {
    component.courseHierarchy = MockResponseData.contentHeaderData.collectionData.result.content;
    component.contentDownloadStatus = { [MockResponseData.contentHeaderData.collectionData.result.content.identifier]: 'COMPLETED' };
    spyOn(component, 'checkDownloadStatus').and.callThrough();
    const status = component.checkStatus('DOWNLOADED');
    expect(status).toBeTruthy();
  });

  it('should check isYoutubeContentPresent', () => {
    const offlineCardService = TestBed.get(OfflineCardService);
    component.courseHierarchy = MockResponseData.contentHeaderData.collectionData;
    spyOn(offlineCardService, 'isYoutubeContent').and.returnValue(false);
    spyOn(component, 'downloadCollection').and.returnValue(MockResponseData.contentHeaderData.collectionData);
    component.isYoutubeContentPresent(MockResponseData.contentHeaderData.collectionData);
    expect(component.showModal).toBeFalsy();
    expect(component.downloadCollection).toHaveBeenCalledWith(MockResponseData.contentHeaderData.collectionData);
  });

  it('should call updateCollection and successfuly update collection ', () => {
    component.courseHierarchy = MockResponseData.contentHeaderData.collectionData;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'updateContent').and.returnValue(of(MockResponseData.contentHeaderData.updateCollection.success));
    component.updateCollection(MockResponseData.contentHeaderData.collectionData);
    expect(component.showUpdate).toBeFalsy();
  });

  it('should call updateCollection and error while updating collection ', () => {
    component.courseHierarchy = MockResponseData.contentHeaderData.collectionData;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'updateContent').and.returnValue(throwError(MockResponseData.contentHeaderData.updateCollection.error));
    component.updateCollection(MockResponseData.contentHeaderData.collectionData);
    expect(component.isConnected).toBeTruthy();
    expect(component.showUpdate).toBeTruthy();
    expect(component.toasterService.error(resourceServiceMockData.messages.fmsg.m0096));
  });

  it('should call exportCollection and successfuly export collection ', () => {
    component.courseHierarchy = MockResponseData.contentHeaderData.collectionData;
    component.showExportLoader = true;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'exportContent').and.returnValue(of(MockResponseData.contentHeaderData.exportCollection.success));
    component.exportCollection(MockResponseData.contentHeaderData.collectionData);
    expect(component.showExportLoader).toBeFalsy();
    expect(component.toasterService.success(resourceServiceMockData.messages.smsg.m0059));
  });

  it('should call exportCollection and error while  exporting collection ', () => {
    component.courseHierarchy = MockResponseData.contentHeaderData.collectionData;
    component.showExportLoader = true;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'exportContent').and.returnValue(throwError(MockResponseData.contentHeaderData.exportCollection.error));
    component.exportCollection(MockResponseData.contentHeaderData.collectionData);
    expect(component.showExportLoader).toBeFalsy();
    expect(component.toasterService.error(resourceServiceMockData.messages.fmsg.m0091));
  });
  it('should check isYoutubeContentPresent', () => {
    const offlineCardService = TestBed.get(OfflineCardService);
    component.courseHierarchy = MockResponseData.contentHeaderData.collectionData;
    spyOn(offlineCardService, 'isYoutubeContent').and.returnValue(false);
    spyOn(component, 'downloadCollection').and.returnValue(MockResponseData.contentHeaderData.collectionData);
    component.isYoutubeContentPresent(MockResponseData.contentHeaderData.collectionData);
    expect(component.showModal).toBeFalsy();
    expect(component.downloadCollection).toHaveBeenCalledWith(MockResponseData.contentHeaderData.collectionData);
  });
  it('should call downloadCollection and successfuly collection downloaded', () => {
    component.contentManagerService.downloadContentId = MockResponseData.contentHeaderData.collectionData.result.content.identifier;
    component.courseHierarchy = MockResponseData.contentHeaderData.collectionData;
    component.disableDelete = false;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'startDownload').and.returnValue(of(MockResponseData.contentHeaderData.downloadCollection.success));
    component.downloadCollection(MockResponseData.contentHeaderData.collectionData);
    expect(component.contentManagerService.downloadContentId).toEqual('');
  });

  it('should call downloadCollection and error while downloading collection', () => {
    component.contentManagerService.downloadContentId = MockResponseData.contentHeaderData.collectionData.result.content.identifier;
    component.courseHierarchy = MockResponseData.contentHeaderData.collectionData;
    component.disableDelete = false;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'startDownload').and.returnValue(throwError(MockResponseData.contentHeaderData.downloadCollection.downloadError));
    component.downloadCollection(MockResponseData.contentHeaderData.collectionData);
    expect(component.contentManagerService.downloadContentId).toEqual('');
    expect(component.contentManagerService.failedContentName).toEqual('');
    expect(component.toasterService.error(resourceServiceMockData.messages.fmsg.m0090));
  });
  it('should call delete collection and successfuly delete collection ', () => {
    component.courseHierarchy = MockResponseData.contentHeaderData.collectionData;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'deleteContent').and.returnValue(of(MockResponseData.contentHeaderData.deleteCollection.success));
    component.deleteCollection(MockResponseData.contentHeaderData.collectionData);
    expect(component.toasterService.success(resourceServiceMockData.messages.stmsg.desktop.deleteTextbookSuccessMessage));
  });
  it('should call delete collection and error while deleting collection ', () => {
    component.courseHierarchy = MockResponseData.contentHeaderData.collectionData;
    component.disableDelete = true;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'deleteContent').and.returnValue(throwError(MockResponseData.contentHeaderData.deleteCollection.error));
    component.deleteCollection(MockResponseData.contentHeaderData.collectionData);
    expect(component.disableDelete).toBeFalsy();
    expect(component.toasterService.error(resourceServiceMockData.messages.etmsg.desktop.deleteTextbookErrorMessage));
  });
  it('should navigate to discussion Forum', () => {
    const routerData = {
      forumIds: [6],
      userName: 'cctn1350'
    };
    spyOn(component['router'], 'navigate');
    component.assignForumData(routerData);
    expect(component['router'].navigate).toHaveBeenCalledWith(['/discussion-forum'], {
      queryParams: {
        categories: JSON.stringify({ result: routerData.forumIds }),
        userName: routerData.userName
      }
    });
  });
});
