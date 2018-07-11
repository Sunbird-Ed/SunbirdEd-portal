
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { TelemetryModule } from '@sunbird/telemetry';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule, ResourceService, ConfigService, IAction } from '@sunbird/shared';
import { CoreModule, LearnerService, CoursesService, SearchService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HomeSearchComponent } from './home-search.component';
import {Response} from './home-search.component.spec.data';

describe('HomeSearchComponent', () => {
  let component: HomeSearchComponent;
  let fixture: ComponentFixture<HomeSearchComponent>;
  const resourceBundle = {
    'messages': {
      'stmsg': {
        'm0007': 'Search for something else',
        'm0006': 'No result'
      },
      'fmsg': {
        'm0051': 'Fetching other courses failed, please try again later...',
        'm0077': 'Fetching serach result failed'
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
      data: {
        telemetry: {
          env: 'home', pageid: 'home-search', type: 'view', subtype: 'paginate'
        }
      }
    }
  };
  const mockQueryParma = {
    'Curriculum': ['CBSE'],
    'Medium': ['Bengali'],
    'Subjects': ['Bengali'],
    'Concepts': [],
    'query': 'hello'
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule.forRoot(), TelemetryModule.forRoot()],
      declarations: [HomeSearchComponent],
      providers: [ConfigService, SearchService, LearnerService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSearchComponent);
    component = fixture.componentInstance;
  });

  it('should call search api', () => {
    const searchService = TestBed.get(SearchService);
    component.queryParams = mockQueryParma;
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableOf(Response.successData));
    component.populateCompositeSearch();
    fixture.detectChanges();
    expect(component.searchList).toBeDefined();
    expect(component.totalCount).toBeDefined();
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeFalsy();
  });
  it('should call search api', () => {
    const searchService = TestBed.get(SearchService);
    component.queryParams = mockQueryParma;
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableOf(Response.successDataWithNoCount));
    component.populateCompositeSearch();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeTruthy();
  });
  it('should throw error when searchService api is not called', () => {
    const searchService = TestBed.get(SearchService);
    component.queryParams = mockQueryParma;
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableThrowError({}));
    component.populateCompositeSearch();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeTruthy();
  });
  it('should call navigateToPage method and page number', () => {
    const configService = TestBed.get(ConfigService);
    const route = TestBed.get(Router);
    component.queryParams = mockQueryParma;
    const queryParams = component.queryParams;
    component.pager = Response.pager;
    component.pageLimit = 20;
    component.pager.totalPages = 7;
    component.navigateToPage(3);
    fixture.detectChanges();
    expect(component.pageNumber).toEqual(1);
    expect(component.pageLimit).toEqual(configService.appConfig.SEARCH.PAGE_LIMIT);
    expect(route.navigate).toHaveBeenCalledWith(['search/All', 3], { queryParams:  queryParams });
  });
});
