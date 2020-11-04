
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PublishedComponent } from './published.component';
// Import services
import { SharedModule, PaginationService, ToasterService, ResourceService } from '@sunbird/shared';
import { SearchService, ContentService } from '@sunbird/core';
import { WorkSpaceService } from '../../services';
import { UserService, LearnerService, CoursesService, PermissionService } from '@sunbird/core';
// Import Module
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
// Test data
import * as mockData from './published.component.spec.data';
const testData = mockData.mockRes;
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { SuiModule } from 'ng2-semantic-ui';
import { CoreModule } from '@sunbird/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { configureTestSuite } from '@sunbird/test-util';

describe('PublishedComponent', () => {
  let component: PublishedComponent;
  let fixture: ComponentFixture<PublishedComponent>;
  const fakeActivatedRoute = {
    'params': observableOf({ 'pageNumber': 1 }),
    'queryParams': observableOf({ subject: ['english', 'odia'], sort_by: 'lastUpdatedOn', sortType: 'asc' }),
    snapshot: {
      params: [
        {
          pageNumber: '1',
        }
      ],
      data: {
        telemetry: {
          env: 'workspace', pageid: 'workspace-content-unlisted', subtype: 'scroll', type: 'list',
          object: { type: '', ver: '1.0' }
        }
      }
    }
  };
  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0013': 'Fetching published content failed, please try again'
      },
      'stmsg': {
        'm0022': 'You dont  have any published content...',
        'm0008': 'no-results',
        'm0034': 'We are deleting the content...'
      },
      'smsg': {
        'm0006': 'Content deleted successfully...'
      }
    }
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PublishedComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, SuiModule , CoreModule, SharedModule.forRoot(),
        TelemetryModule.forRoot(), NgInviewModule],
      providers: [PaginationService, WorkSpaceService, UserService,
        SearchService, ContentService, LearnerService, CoursesService,
        PermissionService, ResourceService, ToasterService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceBundle }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // If search api returns more than one published
  it('should call search api and returns result count more than 1', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableOf(testData.searchSuccessWithCountTwo));
    component.fetchPublishedContent(9, 1,  { queryParams: { subject: ['english', 'odia'], sort_by: 'lastUpdatedOn', sortType: 'asc'}});
    fixture.detectChanges();
    expect(component.publishedContent).toBeDefined();
    expect(component.publishedContent.length).toBeGreaterThan(1);
    expect(component.sort).toEqual({lastUpdatedOn: 'asc'});
    expect(component.noResult).toBeFalsy();
  }));

  it('should call delete api and get success response', inject([WorkSpaceService, ActivatedRoute],
    (workSpaceService, activatedRoute, resourceService, http) => {
      spyOn(workSpaceService, 'deleteContent').and.callFake(() => observableOf(testData.deleteSuccess));
      spyOn(component, 'contentClick').and.callThrough();
      const params = {
        action: {
          class: 'trash large icon', displayType: 'icon',
          eventName: 'delete'
        }, data: { metaData: { identifier: 'do_2124341006465925121871' } }
      };
      component.contentClick(params);
      const DeleteParam = {
        contentIds: ['do_2124341006465925121871']
      };
      workSpaceService.deleteContent(DeleteParam).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
          expect(apiResponse.params.status).toBe('successful');
        }
      );
      fixture.detectChanges();
    }));
  // if  search api's throw's error
  it('should throw error', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableThrowError({}));
    component.fetchPublishedContent(9, 1, { queryParams: { subject: ['english', 'odia'], sort_by: 'lastUpdatedOn', sortType: 'asc'}});
    fixture.detectChanges();
    expect(component.publishedContent.length).toBeLessThanOrEqual(0);
    expect(component.publishedContent.length).toEqual(0);
    expect(component.sort).toEqual({lastUpdatedOn: 'asc'});
  }));
  it('should call inview method for visits data', () => {
    component.telemetryImpression = testData.telemetryData;
    spyOn(component, 'inview').and.callThrough();
    component.inview(testData.event.inview);
    expect(component.inview).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  });

  it('should call fetchPublishedContents()', () => {
    spyOn(component, 'fetchPublishedContent');
    const bothParams = { params: {pageNumber: 1}, queryParams: {subject: ['english', 'odia'], sort_by: 'lastUpdatedOn', sortType: 'asc'}};
    component.pageNumber = 1;
    component.queryParams = bothParams.queryParams ;
    component.ngOnInit();
    expect(component.fetchPublishedContent).toHaveBeenCalledWith(9, 1, bothParams);
  });

  it('should navigate to given pageNumber along with the filter if added', () => {
    const route = TestBed.get(Router);
    spyOn(route, 'navigate').and.stub();
    component.pager = testData.pager;
    const bothParams = { params: {pageNumber: 1}, queryParams: {subject: ['english', 'odia'], sort_by: 'lastUpdatedOn', sortType: 'asc'}};
    component.queryParams = bothParams.queryParams ;
    component.pageNumber = 1;
    component.navigateToPage(1);
    fixture.detectChanges();
    expect(route.navigate).toHaveBeenCalledWith(['workspace/content/published', 1],
    { queryParams: component.queryParams });
  });

  it('should call isPublishedCourse and showCourseQRCodeBtn should be true', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'compositeSearch').and.returnValue(observableOf(mockData.mockRes.searchSuccess));
    component.isPublishedCourse();
    expect(component.showCourseQRCodeBtn).toBeTruthy();
  });

  it('should call getCourseQRCsv', () => {
    const returnData = { result: { fileUrl: 'test'}};
    const coursesService = TestBed.get(CoursesService);
    spyOn(window, 'open');
    spyOn(coursesService, 'getQRCodeFile').and.returnValue(observableOf(returnData));
    component.getCourseQRCsv();
    expect(window.open).toHaveBeenCalledWith(returnData.result.fileUrl, '_blank');
  });
});
