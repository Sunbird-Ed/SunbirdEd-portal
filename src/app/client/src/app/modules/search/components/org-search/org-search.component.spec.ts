
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  SharedModule, ServerResponse, PaginationService, ResourceService,
  ConfigService, ToasterService, INoResultMessage
} from '@sunbird/shared';
import { SearchService, UserService, LearnerService, ContentService } from '@sunbird/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response } from './org-search.component.spec.data';

import { OrgSearchComponent } from './org-search.component';

describe('OrgSearchComponent', () => {
  let component: OrgSearchComponent;
  let fixture: ComponentFixture<OrgSearchComponent>;

  const resourceBundle = {
    'messages': {
      'stmsg': {
        'm0008': 'no-results',
        'm0007': 'Please search for something else.'
      },
      'emsg': {
        'm0005': 'Something went wrong, please try in some time....'
      },
      'fmsg': {
        'm0077': 'Fetching serach result failed'
      }
    }
  };
  const fakeActivatedRoute = {
    'params': observableOf({ pageNumber: '1' }),
    'queryParams': observableOf({ OrgType: ['012352495007170560157'] }),
    snapshot: {
      data: {
        telemetry: {
          env: 'profile', pageid: 'organization-search', type: 'view', subtype: 'paginate'
        }
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), Ng2IziToastModule, RouterTestingModule],
      declarations: [OrgSearchComponent],
      providers: [ResourceService, SearchService, PaginationService, UserService,
        LearnerService, ContentService, ConfigService, ToasterService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call search api and get success', () => {
    const searchService = TestBed.get(SearchService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(searchService, 'orgSearch').and.callFake(() => observableOf(Response.successData));
    component.populateOrgSearch();
    fixture.detectChanges();
    expect(component.searchList).toBeDefined();
    expect(component.totalCount).toBeDefined();
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeFalsy();
  });

  it('should call search api and get success with empty result', () => {
    const searchService = TestBed.get(SearchService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(searchService, 'orgSearch').and.callFake(() => observableOf(Response.emptySuccessData));
    component.populateOrgSearch();
    fixture.detectChanges();
    expect(component.noResult).toEqual(true);
    expect(component.showLoader).toEqual(false);
  });

  it('should throw error when searchService api is not called and check all variables after error', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'orgSearch').and.callFake(() => observableThrowError({}));
    component.populateOrgSearch();
    fixture.detectChanges();
    expect(component.searchList.length).toBeLessThanOrEqual(0);
    expect(component.searchList.length).toEqual(0);
    expect(component.noResult).toBeTruthy();
  });

  it('should call navigateToPage method and page number should be default, i,e 1', inject([ConfigService, Router],
    (configService, route) => {
      component.pager = { ...Response.pager };
      component.pager.totalPages = 0;
      component.navigateToPage(3);
      fixture.detectChanges();
      expect(component.pageNumber).toEqual(1);
      expect(component.pageLimit).toEqual(configService.appConfig.SEARCH.PAGE_LIMIT);
    }));

  it('should call download org method to download a csv file', () => {
    component.searchList = Response.successData.result.response.content;
    component.downloadOrganisation();
    fixture.detectChanges();
    expect(component.pageNumber).toEqual(1);
  });

  it('should call navigateToPage method and page number should be same as passed', () => {
    component.pager = Response.pager;
    component.navigateToPage(3);
    expect(component.pageNumber).toEqual(3);
  });

  it('should call inview method for visits data', () => {
    spyOn(component, 'inview').and.callThrough();
    component.inview(Response.event);
    expect(component.inview).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  });

  it('should call orgsearch with rootorgid', inject([SearchService], (searchService) => {
    const userService = TestBed.get(UserService);
    userService._userData$.next({ err: null, userProfile: Response.userMockData });
    userService._userProfile = Response.userMockData;
    spyOn(searchService, 'orgSearch').and.callFake(() => observableOf(Response.successData));
    const searchParams = {
      filters: {
        rootOrgId: userService._userProfile.rootOrgId
      },
      limit: 10,
      pageNumber: 1
    };
    searchService.orgSearch(searchParams);
    expect(searchService.orgSearch).toHaveBeenCalledWith(searchParams);
  }));
});
