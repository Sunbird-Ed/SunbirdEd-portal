import { UpForReviewComponent } from './up-for-review.component';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { SharedModule, PaginationService, ToasterService, ResourceService, ConfigService } from '@sunbird/shared';
import { SearchService, ContentService } from '@sunbird/core';
import { WorkSpaceService } from '../../services';
import { UserService, LearnerService, CoursesService, PermissionService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
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
    'params': Observable.from([{ pageNumber: '1' }]),
    'queryParams': Observable.from([{ subject: ['english'] }]),
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
    spyOn(learnerService, 'get').and.returnValue(Observable.of(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    userService._userData$.next({ err: null, userProfile: mockUserRoles });
    spyOn(searchService, 'compositeSearch').and.callFake(() => Observable.of(Response.searchSuccessWithCountTwo));
    component.fecthUpForReviewContent(9, 1, bothParams);
    fixture.detectChanges();
    expect(component.upForReviewContentData).toBeDefined();
  }));
  // if  search api's throw's error
  it('should throw error', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    userService._userData$.next({ err: null, userProfile: mockUserRoles });
    spyOn(searchService, 'compositeSearch').and.callFake(() => Observable.throw({}));
    fixture.detectChanges();
    component.fecthUpForReviewContent(9, 1, bothParams);
    expect(component.upForReviewContentData.length).toBeLessThanOrEqual(0);
    expect(component.upForReviewContentData.length).toEqual(0);
  }));
  // if result count is 0
  it('should show no results for result count 0', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    userService._userData$.next({ err: null, userProfile: mockUserRoles });
    spyOn(searchService, 'compositeSearch').and.callFake(() => Observable.of(Response.searchSuccessWithCountZero));
    component.fecthUpForReviewContent(9, 1, bothParams);
    fixture.detectChanges();
    expect(component.upForReviewContentData).toBeDefined();
  }));
  it('should call inview method for visits data', () => {
    component.telemetryImpression = Response.telemetryData;
    spyOn(component, 'inview').and.callThrough();
    component.inview(Response.event.inview);
    expect(component.inview).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  });
  it('should call getContentType and return contentType based on orgrole', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    userService._userData$.next({ err: null, userProfile: mockUserRoles });
    spyOn(component, 'getContentType').and.callThrough();
    const returnContentType = component.getContentType().contentType;
    const ContentType = ['Collection', 'Course', 'LessonPlan', 'Resource'];
    expect(returnContentType).toEqual(ContentType);
  }));
});


