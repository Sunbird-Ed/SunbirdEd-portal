import { Ng2IzitoastService } from 'ng2-izitoast';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule, ResourceService, ServerResponse, ConfigService, PaginationService, ToasterService, IAction} from '@sunbird/shared';
import { LearnerService, CoursesService, UserService, SearchService, ContentService} from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import * as _ from 'lodash';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CourseSearchComponent } from './course-search.component';
import {Response} from './course-search.component.spec.data';

describe('CourseSearchComponent', () => {
  let component: CourseSearchComponent;
  let fixture: ComponentFixture<CourseSearchComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, RouterTestingModule],
      declarations: [ CourseSearchComponent ],
      providers: [ResourceService, ConfigService, LearnerService, ContentService, CoursesService, UserService,
        ToasterService, Ng2IzitoastService, SearchService, PaginationService],
     schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should subscribe to course service', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(Response.courseSuccess));
    courseService.getEnrolledCourses();
    fixture.detectChanges();
    component.populateEnrolledCourse();
    fixture.detectChanges();
    expect(component.showLoader).toBeTruthy();
  });
  it('should throw error when courseService api is not called ', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.callFake(() => Observable.throw(Response.error));
    courseService.getEnrolledCourses();
    fixture.detectChanges();
    component.populateEnrolledCourse();
    fixture.detectChanges();
    expect(component.showLoader).toBeTruthy();
  });
  it('should subscribe to searchService', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'courseSearch').and.callFake(() => Observable.of(Response.successData));
    component.enrolledCourses = Response.enrolledCourses.enrolledCourses;
    component.searchList = Response.successData.result.course;
    component.populateCourseSearch();
    fixture.detectChanges();
     expect(component.showLoader).toBeFalsy();
     expect(component.searchList).toBeDefined();
     expect(component.totalCount).toBeDefined();
  });
  it('same identifier ', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'courseSearch').and.callFake(() => Observable.of(Response.successData));
    component.enrolledCourses = Response.sameIdentifier.enrolledCourses;
    component.searchList = Response.successData.result.course;
    component.populateCourseSearch();
    fixture.detectChanges();
     expect(component.showLoader).toBeFalsy();
     expect(component.searchList).toBeDefined();
     expect(component.totalCount).toBeDefined();
  });
  it('should subscribe to searchService', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'courseSearch').and.callFake(() => Observable.of(Response.successData));
    component.enrolledCourses = Response.noCourses;
    component.searchList = Response.successData.result.course;
    component.populateCourseSearch();
    fixture.detectChanges();
     expect(component.showLoader).toBeFalsy();
     expect(component.searchList).toBeDefined();
     expect(component.totalCount).toBeDefined();
  });
  it('should throw error', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'courseSearch').and.callFake(() => Observable.throw({}));
    component.populateCourseSearch();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeFalsy();
  });
  it('no result', () => {
    const searchService = TestBed.get(SearchService);
  const resourceService = TestBed.get(ResourceService);
  resourceService.messages = Response.resourceBundle.messages;
    spyOn(searchService, 'courseSearch').and.callFake(() => Observable.of(Response.noResult));
    component.enrolledCourses = Response.enrolledCourses.enrolledCourses;
    component.searchList = Response.noResult.result.course;
    component.totalCount = Response.noResult.result.count;
    component.populateCourseSearch();
    fixture.detectChanges();
     expect(component.showLoader).toBeFalsy();
  });
});
