import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule, ResourceService, ConfigService, IAction } from '@sunbird/shared';
import { CoreModule, LearnerService, CoursesService, SearchService, OrgDetailsService} from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ExploreContentComponent } from './explore-content.component';
import { Response } from './explore-content.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';
import { PublicPlayerService } from './../../../../services';
describe('ExploreContentComponent', () => {
  let component: ExploreContentComponent;
  let fixture: ComponentFixture<ExploreContentComponent>;
  const resourceBundle = {
    'messages': {
      'stmsg': {
        'm0007': 'Search for something else',
        'm0006': 'No result'
      },
      'fmsg': {
        'm0077': 'Fetching search result failed',
        'm0051': 'Fetching other courses failed, please try again later...'
      }
    }
  };
  const mockQueryParma = {
    'query': 'hello'
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    'params': observableOf({ pageNumber: '3' }),
    'queryParams': observableOf({
      sortType: 'desc', sort_by: 'lastUpdatedOn',
      key: 'hello'
    }),
    snapshot: {
      params: {
        slug: 'ap'
      },
      data: {
        telemetry: {
          env: 'get', pageid: 'get', type: 'edit', subtype: 'paginate'
        }
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule.forRoot(), TelemetryModule.forRoot()],
      declarations: [ExploreContentComponent],
      providers: [ConfigService, SearchService, LearnerService, OrgDetailsService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }, PublicPlayerService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreContentComponent);
    component = fixture.componentInstance;
  });
  it('should subscribe to searchService', () => {
    component.slug = '123456567';
    component.queryParams = mockQueryParma;
    const searchService = TestBed.get(SearchService);
    const orgManagementService = TestBed.get(OrgDetailsService);
    spyOn(searchService, 'contentSearch').and.callFake(() => observableOf(Response.successData));
    component.searchList = Response.successData.result.content;
    component.populateContentSearch();
    fixture.detectChanges();
    expect(component.queryParams.sortType).toString();
    expect(component.showLoader).toBeFalsy();
    expect(component.searchList).toBeDefined();
    expect(component.totalCount).toBeDefined();
  });

  it('should call searchService with badgeAssertions and channel', () => {
    component.slug = '123456567';
    component.hashTagId = '0123166367624478721';
    component.queryParams = {
      'key': 'hello'
    };
    component.filters = {
      contentType: ['Collection', 'TextBook', 'LessonPlan', 'Resource', 'Story', 'Worksheet', 'Game']
    };
    const requestParams = Response.requestParam;
    const searchService = TestBed.get(SearchService);
    const orgManagementService = TestBed.get(OrgDetailsService);
    spyOn(searchService, 'contentSearch').and.callFake(() => observableOf(Response.successData));
    component.searchList = Response.successData.result.content;
    component.populateContentSearch();
    fixture.detectChanges();
    expect(searchService.contentSearch).toHaveBeenCalledWith(requestParams);
    expect(component.queryParams.sortType).toString();
    expect(component.showLoader).toBeFalsy();
    expect(component.searchList).toBeDefined();
    expect(component.totalCount).toBeDefined();
  });
  it('should throw error when searchService api throw error ', () => {
    component.slug = '123456567';
    const searchService = TestBed.get(SearchService);
    const orgManagementService = TestBed.get(OrgDetailsService);
    spyOn(searchService, 'contentSearch').and.callFake(() => observableThrowError({}));
    component.queryParams = mockQueryParma;
    component.populateContentSearch();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeTruthy();
  });
  it('when count is 0 should show no result found', () => {
    component.slug = '123456567';
    const searchService = TestBed.get(SearchService);
    const orgManagementService = TestBed.get(OrgDetailsService);
    spyOn(searchService, 'contentSearch').and.callFake(() => observableOf(Response.noResult));
    component.searchList = Response.noResult.result.content;
    component.totalCount = Response.noResult.result.count;
    component.queryParams = mockQueryParma;
    component.populateContentSearch();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });
  it('should call filterData method', () => {
    const facetArray = ['subject', 'medium', 'board'];
    component.filterData(facetArray);
    expect(component.facetArray).toEqual(facetArray);
  });
  it('should call processFilterData method', () => {
    const obj = {
      'gradeLevel': [
        {
          'name': 'grade 7',
          'count': 8
        },
        {
          'name': 'class 2',
          'count': 85
        }
      ],
      'subject': [
        {
          'name': 'chemistry',
          'count': 2
        },
        {
          'name': 'marathi',
          'count': 9
        }
      ],
      'medium': [
        {
          'name': 'nepali',
          'count': 1
        },
        {
          'name': 'odia',
          'count': 12
        }
      ],
      'board': [
        {
          'name': 'state (uttar pradesh)',
          'count': 7
        },
        {
          'name': 'state (tamil nadu)',
          'count': 5
        }
      ]
    };
    component.facets = Response.facetData;
    component.processFilterData();
    expect(component.facets).toEqual(obj);
  });
  it('should call compareObjects method', () => {
    const objA = {
      board: ['gradeLevel']
    };
    const objB = {
      board: ['gradeLevel']
    };
    component.compareObjects(objA, objB);
    expect(component.facets).toEqual(undefined);
  });
  it('should call navigateToPage method', () => {
    const router = TestBed.get(Router);
    const page = 3;
    component.pager = {
      currentPage: 3,
      endIndex: 19,
      endPage: 5,
      pageSize: 20,
      pages: [1, 2, 3, 4],
      startIndex: 0,
      startPage: 1,
      totalItems: 45,
      totalPages: 66
    };
    component.queryParams = { key: 'abc' };
    component.navigateToPage(page);
    expect(component.pageNumber).toEqual(page);
    expect(router.navigate).toHaveBeenCalledWith(['explore', 3], { queryParams: component.queryParams });
  });
  it('should call getChannelId method', () => {
    const orgService = TestBed.get(OrgDetailsService);
    spyOn(orgService, 'getOrgDetails').and.callFake(() => observableOf(Response.orgDetailsSuccessData));
    spyOn(component, 'setFilters').and.callThrough();
    component.getChannelId();
    expect(component.hashTagId).toEqual(Response.orgDetailsSuccessData.hashTagId);
    expect(component.setFilters).toHaveBeenCalled();
  });
  it('should call getChannelId method and return error', () => {
    const router = TestBed.get(Router);
    const orgService = TestBed.get(OrgDetailsService);
    const response = {};
    spyOn(orgService, 'getOrgDetails').and.callFake(() => observableThrowError(response));
    spyOn(component, 'getChannelId').and.callThrough();
    component.getChannelId();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });
  it('should call setFilters method', () => {
    component.setFilters();
    expect(component.filterType).toEqual('explore');
    expect(component.redirectUrl).toEqual('/explore/1');
  });
  it('should call playContent method in Public player service when triggered with appropriate arguments', () => {
    const router = TestBed.get(Router);
    const publicPlayerService = TestBed.get(PublicPlayerService);
    component.queryParams = {};
    const event = {
      data: {
        metaData:
          { mimeType: 'application/vnd.ekstep.content-collection', identifier: '1234' }
      }
    };
    spyOn(publicPlayerService, 'playContent').and.callThrough();
    component.playContent(event);
    expect(publicPlayerService.playContent).toHaveBeenCalledWith(event);
  });
  it('should call inview method', () => {
    component.telemetryImpression = {
      context: {
        env: 'public'
      },
      edata: {
        type: '',
        pageid: '',
        uri: '',
        subtype: 'pageexit'
      }
    };
    const event = Response.inviewData;
    component.inview(event);
    expect(component.telemetryImpression.edata.subtype).toEqual('pageexit');
  });
  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });
});
