
import {of as observableOf, throwError as observableThrowError,  Observable } from 'rxjs';
import { UpForReviewComponent } from './up-for-review.component';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { SharedModule, PaginationService, ToasterService, ResourceService, ConfigService } from '@sunbird/shared';
import { SearchService, ContentService } from '@sunbird/core';
import { WorkSpaceService } from '../../services';
import { UserService, LearnerService, CoursesService, PermissionService } from '@sunbird/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Response } from './up-for-review.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';

describe('UpForReviewComponent', () => {
  let component: UpForReviewComponent;
  let fixture: ComponentFixture<UpForReviewComponent>;
  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0021': 'Fetching up for review content failed, please try again',
        'm0004': ''
      },
      'stmsg': {
        'm0032': 'We are fetching up for review...',
        'm0008': 'no-results',
        'm0033': 'You dont up for review...'
      },
      'smsg': {
        'm0006': 'Content deleted successfully...'
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    'params': observableOf({ pageNumber: '1' }),
    'queryParams': observableOf({ subject: ['english'] }),
    snapshot: {
      params: [
        {
          pageNumber: '1',
        }
      ],
      data: {
        telemetry: {
          env: 'workspace', pageid: 'workspace-content-upforreview', type: 'list',
          object: { type: 'Course', ver: '1.0' }
        }
      }
    }
  };

  const bothParams = { 'params': { 'pageNumber': '1' }, 'queryParams': { 'sort_by': 'Updated On' } };
  const mockroleOrgMap = {
    'ORG_MODERATOR': ['01232002070124134414'],
    'COURSE_MENTOR': ['01232002070124134414'],
    'CONTENT_CREATOR': ['01232002070124134414'],
    'COURSE_CREATOR': ['01232002070124134414'],
    'ANNOUNCEMENT_SENDER': ['01232002070124134414'],
    'CONTENT_REVIEWER': ['01232002070124134414']
  };
  const mockUserRoles = {
    userRoles: ['PUBLIC', 'CONTENT_REVIEWER']
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpForReviewComponent],
      imports: [HttpClientTestingModule, Ng2IziToastModule, SharedModule.forRoot(), TelemetryModule.forRoot()],
      providers: [PaginationService, WorkSpaceService, UserService,
        SearchService, ContentService, LearnerService, CoursesService,
        PermissionService, ResourceService, ToasterService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpForReviewComponent);
    component = fixture.componentInstance;
  });
  it('should call search api and returns result count more than 1', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    userService._userData$.next({ err: null, userProfile: mockUserRoles });
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableOf(Response.searchSuccessWithCountTwo));
    component.fecthUpForReviewContent(9, 1, bothParams);
    fixture.detectChanges();
    expect(component.upForReviewContentData).toBeDefined();
  }));
  // if  search api's throw's error
  it('should throw error', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    userService._userData$.next({ err: null, userProfile: mockUserRoles });
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableThrowError({}));
    fixture.detectChanges();
    component.fecthUpForReviewContent(9, 1, bothParams);
    expect(component.upForReviewContentData.length).toBeLessThanOrEqual(0);
    expect(component.upForReviewContentData.length).toEqual(0);
  }));
  // if result count is 0
  it('should show no results for result count 0', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    userService._userData$.next({ err: null, userProfile: mockUserRoles });
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableOf(Response.searchSuccessWithCountZero));
    component.fecthUpForReviewContent(9, 1, bothParams);
    fixture.detectChanges();
    expect(component.upForReviewContentData).toBeDefined();
  }));
  it('should call inview method for visits data', () => {
    component.telemetryImpression = Response.telemetryData;
    spyOn(component, 'inview').and.callThrough();
    component.inview(Response.event);
    expect(component.inview).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  });
  it('should call getContentType and return contentType based on orgrole', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    userService._userData$.next({ err: null, userProfile: mockUserRoles });
    spyOn(component, 'getContentType').and.callThrough();
    const returnContentType = component.getContentType().contentType;
    const ContentType = ['Collection', 'Course', 'LessonPlan', 'Resource'];
    expect(returnContentType).toEqual(ContentType);
  }));
  it('should call setpage method and set proper page number', inject([ConfigService, Router],
    (configService, route) => {
      const userService = TestBed.get(UserService);
      const learnerService = TestBed.get(LearnerService);
      spyOn(learnerService, 'get').and.returnValue(observableOf(Response.userSuccess.success));
      userService._userProfile = mockroleOrgMap;
      userService._userData$.next({ err: null, userProfile: mockUserRoles });
      const sortByOption = 'Created On';
      const queryParams = {subject: [ 'english', 'odia' ], sortType: 'asc', sort_by: 'Created On'};
      component.queryParams = queryParams;
      component.pager = Response.pager;
      component.pager.totalPages = 8;
      component.navigateToPage(1);
      fixture.detectChanges();
      expect(route.navigate).toHaveBeenCalledWith(['workspace/content/upForReview', 1], {queryParams: queryParams});
  }));

  it('should call setpage method and page number should be default, i,e 1', inject([ConfigService, Router],
    (configService, route) => {
       const userService = TestBed.get(UserService);
      const learnerService = TestBed.get(LearnerService);
      spyOn(learnerService, 'get').and.returnValue(observableOf(Response.userSuccess.success));
      userService._userProfile = mockroleOrgMap;
      userService._userData$.next({ err: null, userProfile: mockUserRoles });
      component.pager = Response.pager;
      component.pager.totalPages = 0;
      component.navigateToPage(3);
      fixture.detectChanges();
      expect(component.pageNumber).toEqual(1);
  }));

  it('should open contentplayer  on list click   ', inject([WorkSpaceService, Router],
    (workSpaceService, route, http) => {
      const userService = TestBed.get(UserService);
      const learnerService = TestBed.get(LearnerService);
      spyOn(learnerService, 'get').and.returnValue(observableOf(Response.userSuccess.success));
      userService._userProfile = mockroleOrgMap;
      userService._userData$.next({ err: null, userProfile: mockUserRoles });
      spyOn(component, 'contentClick').and.callThrough();
      component.contentClick(Response.upforReviewContentData);
      component.state = 'upForReview';
      expect(route.navigate).toHaveBeenCalledWith(['workspace/content/upForReview/content', 'do_1125083103747932161150']);
  }));
  it('should call getContentType and return contentType of TextBook based on orgrole', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const BookReviewer = {
      userRoles: ['PUBLIC', 'BOOK_REVIEWER']
    };
    spyOn(learnerService, 'get').and.returnValue(observableOf(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    userService._userData$.next({ err: null, userProfile: BookReviewer });
    spyOn(component, 'getContentType').and.callThrough();
    const returnContentType = component.getContentType().contentType;
    const ContentType = ['TextBook'];
    expect(returnContentType).toEqual(ContentType);
  }));
   it('should call getContentType and return all contentType  based on orgrole', inject([SearchService], (searchService) => {
    const configservice  = TestBed.get(ConfigService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const BookReviewer = {
      userRoles: ['PUBLIC', 'BOOK_REVIEWER', 'CONTENT_REVIEWER']
    };
    spyOn(learnerService, 'get').and.returnValue(observableOf(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    userService._userData$.next({ err: null, userProfile: BookReviewer });
    spyOn(component, 'getContentType').and.callThrough();
    const returnContentType = component.getContentType().contentType;
    const ContentType = configservice.appConfig.WORKSPACE.contentType;
    expect(returnContentType).toEqual(ContentType);
  }));

});


