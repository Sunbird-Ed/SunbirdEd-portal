import { Ng2IzitoastService } from 'ng2-izitoast';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule, ResourceService, ServerResponse, ConfigService, ToasterService} from '@sunbird/shared';
import { PageSectionService, LearnerService, CoursesService, UserService} from '@sunbird/core';
import { ICaraouselData, IAction } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import * as _ from 'lodash';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as mockData from './learn-page.component.spec.data';
const testData = mockData.mockRes;
import { LearnPageComponent } from './learn-page.component';


describe('LearnPageComponent', () => {
  let component: LearnPageComponent;
  let fixture: ComponentFixture<LearnPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, SlickModule, SharedModule],
      declarations: [ LearnPageComponent ],
      providers: [ResourceService, PageSectionService, ConfigService, LearnerService, CoursesService, UserService,
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should subscribe to service', () => {
    const courseService = TestBed.get(CoursesService);
    const pageSectionService = TestBed.get(PageSectionService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(pageSectionService, 'getPageData').and.callFake(() => Observable.of(testData.successData));
    component.enrolledCourses = testData.enrolledCourses;
    component.caraouselData = testData.successData.result.response.sections;
    component.populatePageData();
    fixture.detectChanges();
     expect(component.showLoader).toBeFalsy();
     expect(component.caraouselData).toBeDefined();
  });
  it('should subscribe to course service', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(testData.courseSuccess));
    courseService.getEnrolledCourses();
    fixture.detectChanges();
    component.populateEnrolledCourse();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });
  it('should else', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(testData.noCourses));
    courseService.getEnrolledCourses();
    fixture.detectChanges();
    component.populateEnrolledCourse();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });
  it('should take err ', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    const resourceService = TestBed.get(ResourceService);
   resourceService.messages = testData.resourceBundle.messages;
    spyOn(learnerService, 'get').and.callFake(() => Observable.throw(testData.errorCourse));
    courseService.getEnrolledCourses();
    fixture.detectChanges();
    component.populateEnrolledCourse();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });
});
