
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
// Import NG testing module(s)
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReviewSubmissionsComponent } from './review-submissions.component';
import { Ng2IziToastModule } from 'ng2-izitoast';

// Import services
import { SharedModule, PaginationService, ResourceService, ToasterService } from '@sunbird/shared';
import { WorkSpaceService } from '../../services';
import {
  UserService, LearnerService, CoursesService, PermissionService,
  SearchService, ContentService
} from '@sunbird/core';
// Test data
import * as mockData from './review-submissions.component.spec.data';
const testData = mockData.mockRes;
// Import Module
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
const fakeActivatedRoute = {
  'params': observableOf({ 'pageNumber': 1 }),
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
class RouterStub {
  navigate = jasmine.createSpy('navigate');
}
const resourceBundle = {
  'messages': {
    'fmsg': {
      'm0012': 'Fetching review content failed, please try again'
    },
    'stmsg': {
      'm0018': 'We are fetching draft content...',
      'm0008': 'no-results',
      'm0033': 'You dont have any content for review...'
    }
  }
};
describe('ReviewSubmissionsComponent', () => {
  let component: ReviewSubmissionsComponent;
  let fixture: ComponentFixture<ReviewSubmissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewSubmissionsComponent],
      imports: [HttpClientTestingModule, Ng2IziToastModule, RouterTestingModule, SharedModule.forRoot(),
        TelemetryModule.forRoot(), NgInviewModule],
      providers: [PaginationService, WorkSpaceService, UserService,
        SearchService, ContentService, LearnerService, CoursesService,
        PermissionService, ToasterService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  // If search api returns more than one review content
  it('should call search api and returns result count more than 1', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableOf(testData.searchSuccessWithCountTwo));
    component.fetchReviewContents(9, 1);
    fixture.detectChanges();
    expect(component.reviewContent).toBeDefined();
    expect(component.reviewContent.length).toBeGreaterThan(1);
  }));

  // if  search api's throw's error
  it('should throw error', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableThrowError({}));
    component.fetchReviewContents(9, 1);
    fixture.detectChanges();
    expect(component.reviewContent.length).toBeLessThanOrEqual(0);
    expect(component.reviewContent.length).toEqual(0);
  }));

  it('should call search api and returns result count 0', inject([SearchService], (searchService) => {
    spyOn(searchService, 'compositeSearch').and.callFake(() => observableOf(testData.searchSuccessWithCountZero));
    component.fetchReviewContents(9, 1);
    fixture.detectChanges();
    expect(component.reviewContent).toBeDefined();
    expect(component.reviewContent.length).toBe(0);
    expect(component.showLoader).toBeFalsy();
  }));

  it('should call setpage method and set proper page number', inject([Router],
    (route) => {
      component.pager = testData.pager;
      component.pager.totalPages = 8;
      component.navigateToPage(1);
      fixture.detectChanges();
      expect(route.navigate).toHaveBeenCalledWith(['workspace/content/review', component.pageNumber]);
    }));
  it('should call setpage method and set proper page number 1', inject([Router],
    (route) => {
      component.pager = testData.pager;
      component.pager.totalPages = 0;
      component.navigateToPage(3);
      fixture.detectChanges();
      expect(component.pageNumber).toEqual(1);
    }));

  it('should call contentClick to open content player ', inject([Router],
    (route) => {
      const params = {
        action: {
          class: 'trash large icon', displayType: 'icon',
          eventName: 'onImage'
        }, data: { metaData: { identifier: 'do_2124341006465925121871' } }
      };
      component.contentClick(params);
      fixture.detectChanges();
      expect(component.pageNumber).toEqual(1);
    }));
  it('should call inview method for visits data', () => {
    component.telemetryImpression = testData.telemetryData;
    spyOn(component, 'inview').and.callThrough();
    component.inview(testData.event.inview);
    expect(component.inview).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  });
});
