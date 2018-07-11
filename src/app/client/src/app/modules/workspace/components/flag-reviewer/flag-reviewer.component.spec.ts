
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { FlagReviewerComponent } from './flag-reviewer.component';
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
import { Response } from './flag-reviewer.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';

describe('FlagReviewerComponent', () => {
  let component: FlagReviewerComponent;
  let fixture: ComponentFixture<FlagReviewerComponent>;
  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0083': 'Fetching flagged review content failed, please try again',
        'm0004': ''
      },
      'stmsg': {
        'm0115': 'We are fetching flagged review content',
        'm0008': 'no-results',
        'm0033': 'You dont have any content for review...'
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
    userRoles: ['PUBLIC']
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FlagReviewerComponent],
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
    fixture = TestBed.createComponent(FlagReviewerComponent);
    component = fixture.componentInstance;
  });
  it('should call search api and returns result count more than 1', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    userService._userData$.next({ err: null, userProfile: mockUserRoles });
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableOf(Response.searchSuccessWithCountTwo));
    component.fecthFlagReviewerContent(9, 1, bothParams);
    fixture.detectChanges();
    expect(component.flageReviewerContentData).toBeDefined();
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
    component.fecthFlagReviewerContent(9, 1, bothParams);
    expect(component.flageReviewerContentData.length).toBeLessThanOrEqual(0);
    expect(component.flageReviewerContentData.length).toEqual(0);
  }));
  // if result count is 0
  it('should show no results for result count 0', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    userService._userData$.next({ err: null, userProfile: mockUserRoles });
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableOf(Response.searchSuccessWithCountZero));
    component.fecthFlagReviewerContent(9, 1, bothParams);
    fixture.detectChanges();
    expect(component.flageReviewerContentData).toBeDefined();
  }));
  it('should call inview method for visits data', () => {
    component.telemetryImpression = Response.telemetryData;
    spyOn(component, 'inview').and.callThrough();
    component.inview(Response.event.inview);
    expect(component.inview).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  });
});


