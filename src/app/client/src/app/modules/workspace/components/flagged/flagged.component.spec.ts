
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FlaggedComponent } from './flagged.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { SharedModule, PaginationService, ToasterService, ResourceService, ConfigService } from '@sunbird/shared';
import { SearchService, ContentService } from '@sunbird/core';
import { WorkSpaceService } from '../../services';
import { UserService, LearnerService, CoursesService, PermissionService } from '@sunbird/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Response } from './flagged.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';

describe('FlaggedComponent', () => {
  let component: FlaggedComponent;
  let fixture: ComponentFixture<FlaggedComponent>;
  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0023': 'Fetching flagged content  failed, please try again',
        'm0004': ''
      },
      'stmsg': {
        'm0038': 'We are fetching flagged contents...',
        'm0008': 'no-results',
        'm0039': 'You dont up for flagged...'
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
          env: 'workspace', pageid: 'workspace-content-flagged', subtype: 'scroll', type: 'list',
          object: { type: '', ver: '1.0' }
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
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FlaggedComponent],
      imports: [HttpClientTestingModule, Ng2IziToastModule, SharedModule.forRoot(), TelemetryModule.forRoot(),
        NgInviewModule],
      providers: [PaginationService, WorkSpaceService, UserService,
        SearchService, ContentService, LearnerService, CoursesService,
        PermissionService, ResourceService, ToasterService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlaggedComponent);
    component = fixture.componentInstance;
  });
  it('should call search api and returns result count more than 1', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableOf(Response.searchSuccessWithCountTwo));
    component.fetchFlaggedContents(9, 1);
    fixture.detectChanges();
    expect(component.flaggedContent).toBeDefined();
  }));
  // if  search api's throw's error
  it('should throw error', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableThrowError({}));
    fixture.detectChanges();
    component.fetchFlaggedContents(9, 1);
    expect(component.flaggedContent.length).toBeLessThanOrEqual(0);
    expect(component.flaggedContent.length).toEqual(0);
  }));
  // if result count is 0
  it('should show no results for result count 0', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableOf(Response.searchSuccessWithCountZero));
    component.fetchFlaggedContents(9, 1);
    fixture.detectChanges();
    expect(component.flaggedContent).toBeDefined();
  }));

  it('should call setpage method and set proper page number ', inject([SearchService, Router], (searchService,
    route) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    component.pager = Response.pager;
    component.pager.totalPages = 8;
    component.navigateToPage(1);
    expect(route.navigate).toHaveBeenCalledWith(['workspace/content/flagged', component.pageNumber]);
  }));

  it('should call setpage method and set  page number zero and return it  ', inject([SearchService, Router], (searchService,
    route) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    component.pager = Response.pager;
    component.pager.totalPages = 0;
    component.navigateToPage(0);
  }));

  it('should call contentClick method and open content player  ', inject([SearchService, Router], (searchService,
    route) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(Response.userSuccess.success));
    userService._userProfile = mockroleOrgMap;
    const content = { data: { metaData: { 'mimeType': 'application/vnd.ekstep.ecml-archive', 'identifier': 'do_112485749070602240134' } } };
    component.contentClick(content);
  }));
  it('should call inview method for visits data', () => {
    component.telemetryImpression = Response.telemetryData;
    spyOn(component, 'inview').and.callThrough();
    component.inview(Response.event);
    expect(component.inview).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  });
});
