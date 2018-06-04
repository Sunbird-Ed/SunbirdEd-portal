import { Ng2IzitoastService } from 'ng2-izitoast';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule, ResourceService, ConfigService, IAction } from '@sunbird/shared';
import { CoreModule, LearnerService, CoursesService, SearchService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CourseSearchComponent } from './course-search.component';
import { Response } from './course-search.component.spec.data';

describe('CourseSearchComponent', () => {
  let component: CourseSearchComponent;
  let fixture: ComponentFixture<CourseSearchComponent>;
  const resourceBundle = {
    'messages': {
      'stmsg': {
        'm0007': 'Search for something else',
        'm0006': 'No result'
      },
      'fmsg': {
        'm0002': 'Fetching other courses failed, please try again later...',
        'm0077': 'Fetching serach result failed'
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    'params': Observable.from([{ pageNumber: '1' }]),
    'queryParams': Observable.from([{ subject: ['english'], sortType: 'desc', sort_by : 'lastUpdatedOn' }]),
    snapshot: {
      data: {
        telemetry: {
          env: 'course', pageid: 'course-search', type: 'view', subtype: 'paginate'
        }
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, CoreModule],
      declarations: [CourseSearchComponent],
      providers: [ConfigService, CoursesService, SearchService, LearnerService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(CourseSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should subscribe to course service', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(Response.courseSuccess));
    courseService.getEnrolledCourses();
    fixture.detectChanges();
    component.populateEnrolledCourse();
    fixture.detectChanges();
    expect(component.queryParams.sortType).toString();
    expect(component.queryParams.sortType).toBe('desc');
    expect(component.showLoader).toBeTruthy();
  });
  it('should throw error when courseService api throw error ', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(Response.errorCourse));
    courseService.getEnrolledCourses();
    fixture.detectChanges();
    component.populateEnrolledCourse();
    fixture.detectChanges();
    expect(component.showLoader).toBeTruthy();
  });
  xit('should subscribe to searchService', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'courseSearch').and.callFake(() => Observable.of(Response.successData));
    // component.enrolledCourses = Response.enrolledCourses.enrolledCourses;
    component.searchList = Response.successData.result.course;
    component.populateCourseSearch();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.searchList).toBeDefined();
    expect(component.totalCount).toBeDefined();
  });
  xit('should show resume button if enrolled course and other courses have same identifier ', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'courseSearch').and.callFake(() => Observable.of(Response.successData));
    // component.enrolledCourses = Response.sameIdentifier.enrolledCourses;
    component.searchList = Response.successData.result.course;
    component.populateCourseSearch();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.searchList).toBeDefined();
    expect(component.totalCount).toBeDefined();
  });
  it('should subscribe to searchService when enrolled courses are not present', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'courseSearch').and.callFake(() => Observable.of(Response.successData));
    component.searchList = Response.successData.result.course;
    component.populateCourseSearch();
    fixture.detectChanges();
    expect(component.queryParams.sortType).toString();
    expect(component.queryParams.sortType).toBe('desc');
    expect(component.showLoader).toBeFalsy();
    expect(component.searchList).toBeDefined();
    expect(component.totalCount).toBeDefined();
  });
  it('should throw error when searchService api throw error ', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'courseSearch').and.callFake(() => Observable.throw({}));
    component.populateCourseSearch();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeTruthy();
  });
  it('when count is 0 should show no result found', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'courseSearch').and.callFake(() => Observable.of(Response.noResult));
    // component.enrolledCourses = Response.enrolledCourses.enrolledCourses;
    // component.searchList = Response.noResult.result.course;
    component.totalCount = Response.noResult.result.count;
    component.populateCourseSearch();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });
  it('should call navigateToPage method and page number should be default, i,e 1', () => {
    const configService = TestBed.get(ConfigService);
    const route = TestBed.get(Router);
    const queryParams = { subject: ['english'], sortType: 'desc', sort_by : 'lastUpdatedOn'};
    component.pager = Response.pager;
    component.pageLimit = 20;
    component.pager.totalPages = 7;
    component.navigateToPage(3);
    fixture.detectChanges();
    expect(component.pageNumber).toEqual(3);
    expect(component.pageLimit).toEqual(configService.appConfig.SEARCH.PAGE_LIMIT);
    expect(route.navigate).toHaveBeenCalledWith(['search/Courses', 3], { queryParams: queryParams });
  });
});
