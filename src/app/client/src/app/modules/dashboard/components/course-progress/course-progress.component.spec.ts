
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
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

import {
  SharedModule, ResourceService, ConfigService, PaginationService,
  ToasterService, ServerResponse
} from '@sunbird/shared';
import { IAnnouncementListData, IPagination } from '@sunbird/announcement';
import { CourseProgressService } from './../../services';
import { FormsModule } from '@angular/forms';
import * as testData from './course-progress.component.spec.data';
import { OrderModule } from 'ngx-order-pipe';
import { TelemetryModule } from '@sunbird/telemetry';

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
        'm0022': 'Stats for last 7 days'
      }
    }
  };

  const fakeActivatedRoute = {
    'params': observableOf({ contentId: 'do_112470675618004992181' }),
    'queryParams': observableOf({ batchIdentifier: '0124963192947507200', timePeriod: '7d' }),
    snapshot: {
      data: {
        telemetry: {
          env: 'course', pageid: 'course-stats', type: 'view',
          object: { type: 'course', ver: '1.0' }
        }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, FormsModule, SharedModule.forRoot(), OrderModule,
        CoreModule.forRoot(), DashboardModule, TelemetryModule],
      declarations: [],
      providers: [CourseProgressService,
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
    component.setBatchId('01248661735846707228');
    expect(component.queryParams.batchIdentifier).toEqual('01248661735846707228');
  }));

  it('on selection of timeperiod call setTimePeriod()', inject([UserService], (userService) => {
    userService._userData$.next({ err: null, userProfile: testData.mockUserData.userMockData });
    fixture.detectChanges();
    component.setTimePeriod('7d');
    expect(component.queryParams.timePeriod).toEqual('7d');
  }));

  it('spy on populateCourseDashboardData()', inject([UserService, CourseProgressService],
    (userService, courseService) => {
      userService._userData$.next({ err: null, userProfile: testData.mockUserData.userMockData });
      fixture.detectChanges();
      spyOn(courseService, 'getDashboardData').and.returnValue(observableOf(testData.mockUserData.populateCourseDashboardDataRes));
      component.populateCourseDashboardData();
      expect(component.dashboarData).toBeDefined();
      expect(component.showLoader).toEqual(false);
    }));

  it('spy on populateCourseDashboardData() with error', inject([UserService, CourseProgressService, ResourceService, ToasterService],
    (userService, courseService, resourceService, toasterService) => {
      userService._userData$.next({ err: null, userProfile: testData.mockUserData.userMockData });
      fixture.detectChanges();
      spyOn(courseService, 'getDashboardData').and.callFake(() => observableThrowError(testData.mockUserData.dashboardError));
      spyOn(toasterService, 'error').and.callThrough();
      component.populateCourseDashboardData();
      expect(toasterService.error).toHaveBeenCalledWith(testData.mockUserData.dashboardError.error.params.errmsg);
    }));

  it('spy on downloadDashboardData()', inject([UserService, CourseProgressService],
    (userService, courseService) => {
      userService._userData$.next({ err: null, userProfile: testData.mockUserData.userMockData });
      fixture.detectChanges();
      spyOn(courseService, 'downloadDashboardData')
        .and.returnValue(observableOf(testData.mockUserData.populateCourseDashboardDataRes));
      component.downloadReport();
      expect(component.showDownloadModal).toEqual(true);
    }));

  it('spy on downloadDashboardData() with error', inject([UserService, CourseProgressService, ResourceService, ToasterService],
    (userService, courseService, resourceService, toasterService) => {
      userService._userData$.next({ err: null, userProfile: testData.mockUserData.userMockData });
      fixture.detectChanges();
      spyOn(courseService, 'downloadDashboardData').and.callFake(() => observableThrowError({}));
      spyOn(toasterService, 'error').and.callThrough();
      component.downloadReport();
      expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0005);
    }));

  it('should unsubscribe to userData observable', () => {
    component.ngOnInit();
    spyOn(component.userDataSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.userDataSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.unsubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
  });
});
