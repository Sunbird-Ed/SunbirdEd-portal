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
import { Observable } from 'rxjs/Observable';
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
      'fmsg': {
        'm0006': 'Unable to fetch User'
      }
    }
  };
  const mockQueryParma = {
    'Grades': ['Grade 1'],
    'Medium': ['Bengali'],
    'Subjects': ['Bengali'],
    'Location' : ['Banglore'],
    'roles': ['BOOK_CREATOR'],
  };
  const fakeActivatedRoute = {
    'params': Observable.from([{ pageNumber: '1' }]),
    'queryParams': Observable.from([{ OrgType: ['012352495007170560157'] }])
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, Ng2IziToastModule],
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call search api for populateUserSearch', () => {
    const searchService = TestBed.get(SearchService);
    const learnerService = TestBed.get(LearnerService);
    component.queryParams = mockQueryParma;
    spyOn(searchService, 'userSearch').and.callFake(() => Observable.of(Response.successData));
    component.populateUserSearch();
    expect(component.searchList).toBeDefined();
    expect(component.noResult).toBeFalsy();
    expect(component.showLoader).toBeFalsy();
    fixture.detectChanges();
  });

  it('should throw error when searchService api is not called', () => {
    const searchService = TestBed.get(SearchService);
    component.queryParams = mockQueryParma;
    spyOn(searchService, 'userSearch').and.callFake(() => Observable.throw({}));
    component.populateUserSearch();
    fixture.detectChanges();
    expect(component.searchList.length).toBeLessThanOrEqual(0);
    expect(component.searchList.length).toEqual(0);
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeFalsy();
  });

  it('should call search api for populateOrgNameAndSetRoles', () => {
    const searchService = TestBed.get(SearchService);
    const learnerService = TestBed.get(LearnerService);
    component.queryParams = mockQueryParma;
    const options = {
        orgid: [
        '0123164136298905609',
        '0123059488965918723',
        '0124226794392862720',
        '0123653943740170242'
      ]
    };
    searchService.getOrganisationDetails(options.orgid).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
          expect(apiResponse.params.status).toBe('successful');
        }
    );
    fixture.detectChanges();
  });

  // it('should call downloadUser method to download a csv file', () => {
  //   component.downloadUser();
  //   fixture.detectChanges();
  // });


  it('should call navigateToPage method and page number should be default, i,e 1', inject([ConfigService, Router],
    (configService, route) => {
      component.pager = Response.pager;
      component.pager.totalPages = 2;
      component.pageLimit = configService.appConfig.SEARCH.PAGE_LIMIT;
      component.navigateToPage(1);
      expect(component.pageNumber).toEqual(1);
      expect(component.pageLimit).toEqual(configService.appConfig.SEARCH.PAGE_LIMIT);
      const queryParams = {};
      fixture.detectChanges();
  }));
});


