
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { TelemetryModule } from '@sunbird/telemetry';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule, ResourceService, ConfigService, IAction, UtilService } from '@sunbird/shared';
import { CoreModule, LearnerService, CoursesService, SearchService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
    'params': observableOf({ pageNumber: '3' }),
    'queryParams': observableOf({ sortType: 'desc', sort_by : 'lastUpdatedOn'}),
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
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule.forRoot(), TelemetryModule.forRoot()],
      declarations: [LibrarySearchComponent],
      providers: [ConfigService, SearchService, LearnerService, UtilService,
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
    spyOn(searchService, 'contentSearch').and.callFake(() => observableOf(Response.successData));
    component.searchList = Response.successData.result.content;
    component.queryParams = mockQueryParma;
    const filters = {board: ['NCERT'], gradeLevel: ['KG']};
    component.populateContentSearch(filters);
    fixture.detectChanges();
    expect(component.queryParams.sortType).toString();
    expect(component.queryParams.sortType).toBe('desc');
    expect(component.showLoader).toBeFalsy();
    expect(component.searchList).toBeDefined();
    expect(component.totalCount).toBeDefined();
  });
  it('should throw error when searchService api throw error ', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'contentSearch').and.callFake(() => observableThrowError({}));
    component.queryParams = mockQueryParma;
    const filters = {board: ['NCERT'], gradeLevel: ['KG']};
    component.populateContentSearch(filters);
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeTruthy();
  });
  it('when count is 0 should show no result found', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'contentSearch').and.callFake(() => observableOf(Response.noResult));
    component.searchList = Response.noResult.result.content;
    component.totalCount = Response.noResult.result.count;
    component.queryParams = mockQueryParma;
    const filters = {board: ['NCERT'], gradeLevel: ['KG']};
    component.populateContentSearch(filters);
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });
  it('should call getDataForCard Method to pass the data in Card ', () => {
    const searchService = TestBed.get(SearchService);
    const utilService = TestBed.get(UtilService);
    const config = TestBed.get(ConfigService);
    const constantData = config.appConfig.LibrarySearch.constantData;
    const metaData = config.appConfig.LibrarySearch.metaData;
    const dynamicFields = config.appConfig.LibrarySearch.dynamicFields;
    spyOn(searchService, 'contentSearch').and.callFake(() => observableOf(Response.successData));
    spyOn(component, 'populateContentSearch').and.callThrough();
    spyOn(utilService, 'getDataForCard').and.callThrough();
    component.queryParams = mockQueryParma;
    const filters = {board: ['NCERT'], gradeLevel: ['KG']};
    component.populateContentSearch(filters);
    const searchList = utilService.getDataForCard(Response.successData.result.content, constantData, dynamicFields, metaData);
    fixture.detectChanges();
    expect(utilService.getDataForCard).toHaveBeenCalled();
    expect(utilService.getDataForCard).toHaveBeenCalledWith(Response.successData.result.content, constantData, dynamicFields, metaData);
    expect(component.searchList).toEqual(searchList);
    expect(component.totalCount).toEqual(Response.successData.result.count);
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeFalsy();
  });
});
