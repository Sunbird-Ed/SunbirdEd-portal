import { Ng2IzitoastService } from 'ng2-izitoast';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule, ResourceService, ServerResponse, ConfigService, ToasterService} from '@sunbird/shared';
import { PageApiService, LearnerService, CoursesService, UserService} from '@sunbird/core';
import { ICaraouselData, IAction } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import * as _ from 'lodash';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {Response} from './learn-page.component.spec.data';
import { LearnPageComponent } from './learn-page.component';


describe('LearnPageComponent', () => {
  let component: LearnPageComponent;
  let fixture: ComponentFixture<LearnPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, SlickModule, SharedModule],
      declarations: [ LearnPageComponent ],
      providers: [ResourceService, PageApiService, ConfigService, LearnerService, CoursesService, UserService,
         ToasterService, Ng2IzitoastService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should subscribe to pageSectionService', () => {
    const courseService = TestBed.get(CoursesService);
    const pageSectionService = TestBed.get(PageApiService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(pageSectionService, 'getPageData').and.callFake(() => Observable.of(Response.successData));
    component.enrolledCourses = Response.enrolledCourses.enrolledCourses;
    component.caraouselData = Response.successData.result.response.sections;
    component.populatePageData();
    fixture.detectChanges();
     expect(component.showLoader).toBeFalsy();
     expect(component.caraouselData).toBeDefined();
  });
  it('should subscribe to course service', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(Response.courseSuccess));
    courseService.getEnrolledCourses();
    fixture.detectChanges();
    component.populateEnrolledCourse();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });
  it('should take else path when enrolledCourses length is 0 ', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(Response.noCourses));
    courseService.getEnrolledCourses();
    fixture.detectChanges();
    component.populateEnrolledCourse();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });
  it('should throw error when courseService api is not called ', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    const resourceService = TestBed.get(ResourceService);
   resourceService.messages = Response.resourceBundle.messages;
    spyOn(learnerService, 'get').and.callFake(() => Observable.throw(Response.errorCourse));
    courseService.getEnrolledCourses();
    fixture.detectChanges();
    component.populateEnrolledCourse();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });
});
