import { throwError as observableThrowError, of as observableOf } from 'rxjs';
import { DashboardModule } from '@sunbird/dashboard';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CourseProgressComponent } from './course-progress.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SuiModule } from 'ng2-semantic-ui';
import { ContentService, UserService, LearnerService, CoreModule } from '@sunbird/core';
import { By } from '@angular/platform-browser';
import {
  SharedModule, ResourceService, ConfigService, PaginationService,
  ToasterService, ServerResponse
} from '@sunbird/shared';
import { CourseProgressService, UsageService } from './../../services';
import { FormsModule } from '@angular/forms';
import * as testData from './course-progress.component.spec.data';
import { OrderModule } from 'ngx-order-pipe';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
describe('CourseProgressComponent', () => {
  let component: CourseProgressComponent;
  let fixture: ComponentFixture<CourseProgressComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  const resourceBundle = {
    'messages': {
      'emsg': {
        'm0005': 'Something went wrong, please try in some time....'
      },
      'imsg': {
        'm0022': 'Stats for last 7 days',
        'm0044': 'Download failed!',
        'm0043': 'Your profile does not have a valid email ID.Please update your email ID',
        'm0045': 'No data available to download'
      },
      'stmsg': {
        'm0132': 'We have received your download request. The file will be sent to your registered email ID shortly.',
        'm0141': 'Data unavailable to generate Score Report'
      }
    },
    'frmelmnts': {
      'instn': {
        't0056': 'Please try again..'
      }
    }
  };

  const fakeActivatedRoute = {
    'params': observableOf({ contentId: 'do_112470675618004992181', courseId: 'do_112470675618004992181' }),
    'queryParams': observableOf({ batchIdentifier: '0124963192947507200', timePeriod: '7d' }),
    snapshot: {
      'params': { contentId: 'do_112470675618004992181', courseId: 'do_112470675618004992181' },
      data: {
        telemetry: {
          env: 'course', pageid: 'course-stats', type: 'view',
          object: { type: 'course', ver: '1.0' }
        }
      }
    }
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, FormsModule, SharedModule.forRoot(), OrderModule,
        CoreModule, DashboardModule, TelemetryModule.forRoot()],
      declarations: [],
      providers: [CourseProgressService, UsageService, TelemetryService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceBundle }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseProgressComponent);
    component = fixture.componentInstance;
  });

  it('should call userservice, call populateBatchData()', inject([UserService, CourseProgressService],
    (userService, courseService) => {
      userService._userData$.next({ err: null, userProfile: testData.mockUserData.userMockData });
      fixture.detectChanges();
      spyOn(courseService, 'getBatches').and.returnValue(observableOf(testData.mockUserData.getBatchRes));
      component.populateBatchData();
      expect(component.batchlist).toBeDefined();
      expect(component.batchlist.length).toEqual(2);
    }));

  it('should call userservice, call populateBatchData() with zero count', inject([UserService, CourseProgressService],
    (userService, courseService) => {
      userService._userData$.next({ err: null, userProfile: testData.mockUserData.userMockData });
      fixture.detectChanges();
      spyOn(courseService, 'getBatches').and.returnValue(observableOf(testData.mockUserData.getBatchResZero));
      component.populateBatchData();
      expect(component.batchlist).toBeDefined();
      expect(component.batchlist.length).toEqual(0);
    }));

  it('should call userservice, call populateBatchData() with count One', inject([UserService, CourseProgressService],
    (userService, courseService) => {
      userService._userData$.next({ err: null, userProfile: testData.mockUserData.userMockData });
      fixture.detectChanges();
      spyOn(courseService, 'getBatches').and.returnValue(observableOf(testData.mockUserData.getBatchResOne));
      component.populateBatchData();
      expect(component.batchlist).toBeDefined();
      expect(component.batchlist.length).toEqual(1);
    }));

  it('should call collectioneditor with error data', inject([CourseProgressService, UserService, ResourceService, ToasterService],
    (courseService, userService, resourceService, toasterService) => {
      resourceService.messages = resourceBundle.messages;
      userService._userData$.next({ err: null, userProfile: testData.mockUserData.userMockData });
      fixture.detectChanges();
      spyOn(courseService, 'getBatches').and.callFake(() => observableThrowError({}));
      spyOn(toasterService, 'error').and.callThrough();
      component.populateBatchData();
      expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0005);
    }));

  it('on selection of courseId call setBatchId()', inject([UserService], (userService) => {
    userService._userData$.next({ err: null, userProfile: testData.mockUserData.userMockData });
    fixture.detectChanges();
    component.setBatchId(testData.mockUserData.getBatchResZero);
    expect(component.queryParams.batchIdentifier).toEqual(testData.mockUserData.getBatchResZero.id);
  }));

  it('on selection of timeperiod call setTimePeriod()', inject([UserService], (userService) => {
    userService._userData$.next({ err: null, userProfile: testData.mockUserData.userMockData });
    fixture.detectChanges();
    component.setTimePeriod('7d');
    expect(component.queryParams.timePeriod).toEqual('7d');
  }));

  it('spy on downloadDashboardData()', inject([UserService, CourseProgressService, ResourceService, ToasterService],
    (userService, courseService, resourceService, toasterService) => {
      userService._userData$.next({ err: null, userProfile: testData.mockUserData.userMockData });
      fixture.detectChanges();
      spyOn(courseService, 'downloadDashboardData')
        .and.returnValue(observableOf(testData.mockUserData.populateCourseDashboardDataRes));
      component.downloadReport(true);
      expect(component.showDownloadModal).toEqual(false);
    }));

  xit('spy on downloadDashboardData() with error', inject([UserService, CourseProgressService, ResourceService, ToasterService],
    (userService, courseService, resourceService, toasterService) => {
      userService._userData$.next({ err: null, userProfile: testData.mockUserData.userMockData });
      fixture.detectChanges();
      spyOn(courseService, 'downloadDashboardData').and.callFake(() => observableThrowError({}));
      spyOn(toasterService, 'error').and.callThrough();
      component.downloadReport(true);
      expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.imsg.m0045);
    }));

  it('should unsubscribe to userData observable', () => {
    component.queryParams = {};
    component.ngOnInit();
    spyOn(component.userDataSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.userDataSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe from all observable subscriptions', () => {
    component.queryParams = { batchIdentifier: '0124963192947507200' };
    component.ngOnInit();
    spyOn(component.unsubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
  });
  it('should call setpage method and set proper page number', inject([Router, UserService, CourseProgressService],
    (route, userService, courseService) => {
      component.queryParams = { batchIdentifier: '0124963192947507200' };
      component.pager = testData.mockUserData.pager;
      component.pager.totalPages = 8;
      userService._userData$.next({ err: null, userProfile: testData.mockUserData.userMockData });
      fixture.detectChanges();
      spyOn(courseService, 'getBatches').and.returnValue(observableOf(testData.mockUserData.getBatchRes));
      component.populateBatchData();
      component.navigateToPage(1);
      fixture.detectChanges();
      expect(route.navigate).toHaveBeenCalledWith([], { queryParams: component.queryParams });
    }));


  it('should download course progress report on click of progress report', fakeAsync(() => {
    component.queryParams = { batchIdentifier: '0124963192947507200' };
    const usageService = TestBed.get(UsageService);
    spyOn(usageService, 'getData').and.returnValue(observableOf(testData.mockUserData.courseProgressReportMock));
    spyOn<any>(component, 'downloadCourseReport').and.callThrough();
    spyOn(window, 'open');
    component.downloadReport(false);
    tick(10);
    expect(window.open).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith(testData.mockUserData.courseProgressReportMock.result.signedUrl, '_blank');
    expect(component['downloadCourseReport']).toHaveBeenCalled();
    expect(usageService.getData).toHaveBeenCalledWith('/courseReports/course-progress-reports/report-0124963192947507200.csv');
  }));

  it('should show toaster error message when download course progress report fails', inject([ToasterService], (toasterService) => {
    component.queryParams = { batchIdentifier: '0124963192947507200' };
    const usageService = TestBed.get(UsageService);
    spyOn(usageService, 'getData').and.returnValue(observableThrowError(''));
    spyOn(toasterService, 'error');
    spyOn<any>(component, 'downloadCourseReport').and.callThrough();
    component.downloadReport(false);
    expect(toasterService.error).toHaveBeenCalled();
  }));

  it('should get last updatedOn date for score report and progress report', fakeAsync(() => {
    component.queryParams = { batchIdentifier: '0124963192947507200' };
    const courseProgressService = TestBed.get(CourseProgressService);
    spyOn(courseProgressService, 'getReportsMetaData').and.returnValue(observableOf(testData.mockUserData.reportsLastUpdatedDateMock));
    component.getReportUpdatedOnDate();
    // tslint:disable-next-line: max-line-length
    expect(component.scoreReportUpdatedOn).toEqual(null);
    // tslint:disable-next-line: max-line-length
    expect(component.progressReportUpdatedOn).toEqual(testData.mockUserData.reportsLastUpdatedDateMock.result['course-progress-reports'].lastModified);
  }));

  xit('should download assessment report on click of score report', fakeAsync(inject([ToasterService], (toasterService) => {
    component.queryParams = { batchIdentifier: '0124963192947507200' };
    const courseProgressService = TestBed.get(CourseProgressService);
    spyOn(toasterService, 'error');
    spyOn(courseProgressService, 'downloadDashboardData').and.returnValue(observableOf(testData.mockUserData.assessmentReportDownloadMock));
    spyOn<any>(component, 'downloadCourseReport').and.callThrough();
    spyOn(window, 'open');
    component.downloadReport(true);
    tick(10);
    expect(component['downloadCourseReport']).toHaveBeenCalled();
    expect(courseProgressService['downloadDashboardData']).toHaveBeenCalledWith({
      batchIdentifier: '0124963192947507200'
    });
    expect(window.open).toHaveBeenCalledWith(testData.mockUserData.assessmentReportDownloadMock.result.reports.assessmentReportUrl,
      '_blank');
  })));

  it('should set completedCount and participantCount as 0 to the currentBatch if it is empty in the currentBatch', () => {
    component.currentBatch = testData.mockUserData.currentBatchDataBefore;
    component.setCounts(component.currentBatch);
    expect(component.currentBatch['completedCount']).toEqual(0);
    expect(component.currentBatch['participantCount']).toEqual(0);
  });

  it(`should set completedCount and participantCount to the currentBatch with the existing values
  if it is not empty in the currentBatch`, () => {
    component.currentBatch = testData.mockUserData.currentBatchDataWithCount;
    component.setCounts(component.currentBatch);
    expect(component.currentBatch['completedCount']).toEqual(testData.mockUserData.currentBatchDataWithCount.completedCount);
    expect(component.currentBatch['participantCount']).toEqual(testData.mockUserData.currentBatchDataWithCount.participantCount);
  });
});
