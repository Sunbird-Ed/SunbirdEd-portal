import { Ng2IzitoastService } from 'ng2-izitoast';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule, ResourceService, ConfigService, IAction } from '@sunbird/shared';
import { CoreModule, LearnerService, CoursesService, SearchService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LibrarySearchComponent } from './library-search.component';
import { Response } from './library-search.component.spec.data';

describe('LibrarySearchComponent', () => {
  let component: LibrarySearchComponent;
  let fixture: ComponentFixture<LibrarySearchComponent>;
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
    'queryParams': Observable.from([{ sortType: 'desc', sort_by : 'lastUpdatedOn'}]),
    snapshot: {
      data: {
        telemetry: {
          env: 'library', pageid: 'library-search', type: 'view', subtype: 'paginate'
        }
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, CoreModule],
      declarations: [LibrarySearchComponent],
      providers: [ConfigService, SearchService, LearnerService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(LibrarySearchComponent);
    component = fixture.componentInstance;
  });
  it('should subscribe to searchService', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'contentSearch').and.callFake(() => Observable.of(Response.successData));
    component.searchList = Response.successData.result.content;
    component.queryParams = mockQueryParma;
    component.populateContentSearch();
    fixture.detectChanges();
    expect(component.queryParams.sortType).toString();
    expect(component.queryParams.sortType).toBe('desc');
    expect(component.showLoader).toBeFalsy();
    expect(component.searchList).toBeDefined();
    expect(component.totalCount).toBeDefined();
  });
  it('should throw error when searchService api throw error ', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'contentSearch').and.callFake(() => Observable.throw({}));
    component.queryParams = mockQueryParma;
    component.populateContentSearch();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeTruthy();
  });
  it('when count is 0 should show no result found', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'contentSearch').and.callFake(() => Observable.of(Response.noResult));
    component.searchList = Response.noResult.result.content;
    component.totalCount = Response.noResult.result.count;
    component.queryParams = mockQueryParma;
    component.populateContentSearch();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });
});
