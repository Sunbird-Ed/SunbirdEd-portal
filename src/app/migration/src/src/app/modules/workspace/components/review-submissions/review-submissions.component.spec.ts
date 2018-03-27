import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
// Import NG testing module(s)
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReviewSubmissionsComponent } from './review-submissions.component';

// Import services
import { SharedModule, PaginationService } from '@sunbird/shared';
import { WorkSpaceService } from '../../services';
import {
  UserService, LearnerService, CoursesService, PermissionService,
  SearchService, ContentService
} from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
// Test data
import * as mockData from './review-submissions.component.spec.data';
const testData = mockData.mockRes;

describe('ReviewSubmissionsComponent', () => {
  let component: ReviewSubmissionsComponent;
  let fixture: ComponentFixture<ReviewSubmissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewSubmissionsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, SharedModule],
      providers: [PaginationService, WorkSpaceService, UserService,
        SearchService, ContentService, LearnerService, CoursesService,
        PermissionService
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
    spyOn(searchService, 'searchContentByUserId').and.callFake(() => Observable.of(testData.searchSuccessWithCountTwo));
    component.fetchReviewContents(9, 1);
    fixture.detectChanges();
    expect(component.reviewContent).toBeDefined();
    expect(component.reviewContent.length).toBeGreaterThan(1);
  }));

  // if  search api's throw's error
   it('should throw error', inject([SearchService], (searchService) => {
     spyOn(searchService, 'searchContentByUserId').and.callFake(() => Observable.throw({}));
     component.fetchReviewContents(9 , 1);
     fixture.detectChanges();
     expect(component.reviewContent.length).toBeLessThanOrEqual(0);
     expect(component.reviewContent.length).toEqual(0);
   }));
});
