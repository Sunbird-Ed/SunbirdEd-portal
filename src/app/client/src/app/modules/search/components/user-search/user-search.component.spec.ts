
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { UserFilterComponent } from './../user-filter/user-filter.component';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  SharedModule, ServerResponse, PaginationService, ResourceService,
  ConfigService, ToasterService, INoResultMessage
} from '@sunbird/shared';
import { SearchService, UserService, LearnerService, ContentService } from '@sunbird/core';
import { UserSearchService } from './../../services';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserSearchComponent } from './user-search.component';
import { Response } from './user-search.component.spec.data';
describe('UserSearchComponent', () => {
  let component: UserSearchComponent;
  let fixture: ComponentFixture<UserSearchComponent>;
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
  const mockQueryParma = {
    'Grades': ['Grade 1'],
    'Medium': ['Bengali'],
    'Subjects': ['Bengali'],
    'Location': ['Banglore'],
    'roles': ['BOOK_CREATOR'],
  };
  const fakeActivatedRoute = {
    'params': observableOf({ pageNumber: '1' }),
    'queryParams': observableOf({ OrgType: ['012352495007170560157'] }),
    snapshot: {
      data: {
        telemetry: {
          env: 'profile', pageid: 'use-search', type: 'view', subtype: 'paginate'
        }
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), Ng2IziToastModule],
      declarations: [UserSearchComponent, UserFilterComponent],
      providers: [ResourceService, SearchService, PaginationService, UserService,
        LearnerService, ContentService, ConfigService, ToasterService, UserSearchService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSearchComponent);
    component = fixture.componentInstance;
  });

  it('should call search api for populateUserSearch', () => {
    const searchService = TestBed.get(SearchService);
    const learnerService = TestBed.get(LearnerService);
    component.queryParams = mockQueryParma;
    spyOn(searchService, 'userSearch').and.callFake(() => observableOf(Response.successData));
    component.populateUserSearch();
    expect(component.searchList).toBeDefined();
    expect(component.noResult).toBeFalsy();
    expect(component.showLoader).toBeFalsy();
    fixture.detectChanges();
  });

  it('should call search api for populateUserSearch and get empty result', () => {
    const searchService = TestBed.get(SearchService);
    const learnerService = TestBed.get(LearnerService);
    component.queryParams = mockQueryParma;
    spyOn(searchService, 'userSearch').and.callFake(() => observableOf(Response.emptySuccessData));
    fixture.detectChanges();
    component.populateUserSearch();
    expect(component.noResult).toEqual(true);
    expect(component.showLoader).toEqual(false);
  });

  it('should throw error when searchService api is not called', () => {
    const searchService = TestBed.get(SearchService);
    const learnerService = TestBed.get(LearnerService);
    component.queryParams = mockQueryParma;
    component.searchList = Response.successData.result.response.content;
    component.userProfile = {orgRoleMap: [], rootOrgAdmin: true};
    spyOn(searchService, 'getOrganisationDetails').and.callFake(() => observableOf(Response.orgDetailsSearch));
    component.queryParams = mockQueryParma;
    spyOn(searchService, 'userSearch').and.callFake(() => observableThrowError({}));
    component.populateOrgNameAndSetRoles();
    component.populateUserSearch();
    fixture.detectChanges();
    expect(component.searchList.length).toBeLessThanOrEqual(1);
    expect(component.searchList.length).toEqual(1);
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeTruthy();
  });

  it('should call downloadUser method to download a csv file', () => {
    component.searchList = Response.successData.result.response.content;
    component.downloadUser();
    fixture.detectChanges();
    expect(component.pageNumber).toEqual(1);
  });

  it('should call navigateToPage method and page number should be default, i,e 1', inject([ConfigService, Router],
    (configService, route) => {
      component.pager = { ...Response.pager };
      component.pager.totalPages = 0;
      component.pageLimit = configService.appConfig.SEARCH.PAGE_LIMIT;
      component.navigateToPage(1);
      expect(component.pageNumber).toEqual(1);
      expect(component.pageLimit).toEqual(configService.appConfig.SEARCH.PAGE_LIMIT);
      const queryParams = {};
      fixture.detectChanges();
    }));

  it('should call navigateToPage method and page number should be same as passed', () => {
    component.pager = Response.pager;
    component.navigateToPage(3);
    expect(component.pageNumber).toEqual(3);
  });

  it('should call inview method for visits data', () => {
    component.telemetryImpression = {
      context: { env: 'user-search' },
      edata: { type: '', pageid: '', uri: '', subtype: '' }
    };
    spyOn(component, 'inview').and.callThrough();
    component.inview(Response.event);
    expect(component.inview).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  });

  it('should subscribe user profile and call populateUserSearch', () => {
    component.searchList = Response.successData.result.response.content;
    const userService = TestBed.get(UserService);
    userService._userData$.next({ err: null, userProfile: Response.userProfile });
    spyOn(component, 'populateUserSearch').and.callThrough();
    fixture.detectChanges();
    expect(component.populateUserSearch).toHaveBeenCalled();
    expect(component.pageNumber).toEqual(1);
  });
});


