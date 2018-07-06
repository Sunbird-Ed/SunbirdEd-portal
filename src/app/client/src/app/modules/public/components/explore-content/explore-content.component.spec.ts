import { Ng2IzitoastService } from 'ng2-izitoast';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule, ResourceService, ConfigService, IAction } from '@sunbird/shared';
import { CoreModule, LearnerService, CoursesService, SearchService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ExploreContentComponent } from './explore-content.component';
import { Response } from './explore-content.component.spec.data';
import { OrgManagementService } from './../../services';
import { TelemetryModule } from '@sunbird/telemetry';
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
    'params': Observable.from([{ pageNumber: '3' }]),
    'queryParams': Observable.from([{ sortType: 'desc', sort_by : 'lastUpdatedOn',
     key : 'hello'}
    ]),
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
      providers: [ConfigService, SearchService, LearnerService, OrgManagementService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
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
    const orgManagementService = TestBed.get(OrgManagementService);
    spyOn(orgManagementService, 'getChannel').and.callFake(() => Observable.of('123456567'));
    spyOn(searchService, 'contentSearch').and.callFake(() => Observable.of(Response.successData));
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
    // component.queryParams = mockQueryParma;
    component.queryParams = {
    'key': 'hello'
    };
    component.filters = {
      contentType: ['Collection', 'TextBook', 'LessonPlan', 'Resource', 'Story', 'Worksheet', 'Game']
    };
    const requestParams = Response.requestParam;
    const searchService = TestBed.get(SearchService);
    const orgManagementService = TestBed.get(OrgManagementService);
    spyOn(orgManagementService, 'getChannel').and.callFake(() => Observable.of('123456567'));
    spyOn(searchService, 'contentSearch').and.callFake(() => Observable.of(Response.successData));
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
    const orgManagementService = TestBed.get(OrgManagementService);
    spyOn(orgManagementService, 'getChannel').and.callFake(() => Observable.of('123456567'));
    spyOn(searchService, 'contentSearch').and.callFake(() => Observable.throw({}));
    component.queryParams = mockQueryParma;
    component.populateContentSearch();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeTruthy();
  });
  it('when count is 0 should show no result found', () => {
    component.slug = '123456567';
    const searchService = TestBed.get(SearchService);
    const orgManagementService = TestBed.get(OrgManagementService);
    spyOn(orgManagementService, 'getChannel').and.callFake(() => Observable.of('123456567'));
    spyOn(searchService, 'contentSearch').and.callFake(() => Observable.of(Response.noResult));
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
    const facetArray = [{
      name: 'gradeLevel',
      values: [
        {name: 'grade 9', count: 10}
      ]
    }];
    component.processFilterData();
    expect(component.facets).toEqual(undefined);
  });
});
