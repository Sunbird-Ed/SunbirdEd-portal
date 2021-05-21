
import { of, Observable, throwError } from 'rxjs';
import { CourseHierarchyGetMockResponse } from '../public-course-player/public-course-player.component.mock.data';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicCourseConsumptionPageComponent } from './public-course-consumption-page.component';
import { SharedModule, ResourceService, ToasterService, ContentUtilsServiceService, NavigationHelperService, OfflineCardService } from '@sunbird/shared';
import { CoreModule, CoursesService } from '@sunbird/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CourseConsumptionService, CourseProgressService, CourseBatchService } from '@sunbird/learn';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { TelemetryService, TelemetryModule } from '@sunbird/telemetry';
import { MockResponseData } from '../../../../../../learn/components/course-consumption/course-consumption-header/course-consumption-header.spec.data';
import { ContentManagerService } from '../../../../offline/services/content-manager/content-manager.service';

const resourceServiceMockData = {
  messages: {
    imsg: { m0027: 'Something went wrong', activityAddedSuccess: 'Activity added successfully' },
    stmsg: {
      m0009: 'error', activityAddFail: 'Unable to add activity, please try again',
      desktop: {
        deleteCourseSuccessMessage: 'Course deleted successfully'
      }
    },
    etmsg: {
      desktop: {
        'deleteCourseErrorMessage': 'Unable to delete course. Please try again..',
      }
    },
    emsg: { noAdminRole: `You don't have permission to add activity to the group`, m0005: 'error' },
    smsg: { m0042: '', m0059: 'Content successfully copied' },
    fmsg: {
      m0001: 'error',
      m0003: 'error',
      m0096: 'Could not Update. Try again later',
      m0091: 'Could not copy content. Try again later',
      m0090: 'Could not download. Try again later'
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
    params: {},
    firstChild: { params: {} },
    data: { telemetry: { env: 'explore', pageid: 'explore-course-toc', type: 'view' } },
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
      declarations: [PublicCourseConsumptionPageComponent],
      providers: [{ provide: ActivatedRoute, useClass: ActivatedRouteStub },
      { provide: ResourceService, useValue: resourceServiceMockData },
        CourseConsumptionService, { provide: Router, useClass: MockRouter },
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
    activatedRouteStub.snapshot.firstChild.params = { courseId: 'do_212347136096788480178' };
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
    activatedRouteStub.snapshot.firstChild.params = { courseId: 'do_212347136096788480178' };
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
    component.isConnected = true;
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
    component['contentManagerService'].downloadContentId = MockResponseData.contentHeaderData.collectionData.result.content.identifier;
    component.courseHierarchy = MockResponseData.contentHeaderData.collectionData;
    component.disableDelete = false;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'startDownload').and.returnValue(of(MockResponseData.contentHeaderData.downloadCollection.success));
    component.downloadCollection(MockResponseData.contentHeaderData.collectionData);
    expect(component['contentManagerService'].downloadContentId).toEqual('');
  });

  it('should call downloadCollection and error while downloading collection', () => {
    component['contentManagerService'].downloadContentId = MockResponseData.contentHeaderData.collectionData.result.content.identifier;
    component.courseHierarchy = MockResponseData.contentHeaderData.collectionData;
    component.disableDelete = false;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'startDownload').and.returnValue(throwError(MockResponseData.contentHeaderData.downloadCollection.downloadError));
    component.downloadCollection(MockResponseData.contentHeaderData.collectionData);
    expect(component['contentManagerService'].downloadContentId).toEqual('');
    expect(component['contentManagerService'].failedContentName).toEqual('');
    expect(component.toasterService.error(resourceServiceMockData.messages.fmsg.m0090));
  });
  it('should call delete collection and successfuly delete collection ', () => {
    component.courseHierarchy = MockResponseData.contentHeaderData.collectionData;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'deleteContent').and.returnValue(of(MockResponseData.contentHeaderData.deleteCollection.success));
    component.deleteCollection(MockResponseData.contentHeaderData.collectionData);
    expect(component.toasterService.success(resourceServiceMockData.messages.stmsg.desktop.deleteCourseSuccessMessage));
  });
  it('should call delete collection and error while deleting collection ', () => {
    component.courseHierarchy = MockResponseData.contentHeaderData.collectionData;
    component.disableDelete = true;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'deleteContent').and.returnValue(throwError(MockResponseData.contentHeaderData.deleteCollection.error));
    component.deleteCollection(MockResponseData.contentHeaderData.collectionData);
    expect(component.disableDelete).toBeFalsy();
    expect(component.toasterService.error(resourceServiceMockData.messages.etmsg.desktop.deleteCourseErrorMessage));
  });
});
