import { UpforReviewFilterComponent } from './up-for-review-filter.component';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { SharedModule, PaginationService, ToasterService, ResourceService, ConfigService } from '@sunbird/shared';
import { SearchService, ContentService } from '@sunbird/core';
import { WorkSpaceService } from '../../services';
import { UserService, LearnerService, CoursesService, PermissionService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

describe('BatchFilterComponent', () => {
  let component: UpforReviewFilterComponent;
  let fixture: ComponentFixture<UpforReviewFilterComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    'params': Observable.from([{ pageNumber: '1' }]),
    'queryParams': Observable.from([{ subject: ['english', 'odia'] }])
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpforReviewFilterComponent ],
      imports: [HttpClientTestingModule, Ng2IziToastModule, SharedModule],
      providers: [PaginationService, WorkSpaceService, UserService,
        SearchService, ContentService, LearnerService, CoursesService,
        PermissionService, ResourceService, ToasterService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpforReviewFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should call removeFilterSelection method ', inject([ConfigService, Router],
    (configService, route) => {
      component.queryParams = { subject: ['english'] };
      const queryParams = {subject: [ ]};
     component.removeFilterSelection('subject', 'english');
     fixture.detectChanges();
     expect(route.navigate).toHaveBeenCalledWith(['workspace/content/upForReview', 1], {queryParams: queryParams});
  }));
  it('should call applySorting method ', inject([ConfigService, Router],
    (configService, route) => {
      const sortByOption = 'Created On';
      const queryParams = {subject: [ 'english', 'odia' ], sortType: 'asc', sort_by: 'Created On'};
     component.applySorting(sortByOption);
     fixture.detectChanges();
     expect(route.navigate).toHaveBeenCalledWith(['workspace/content/upForReview', 1], {queryParams: queryParams});
  }));
});

