import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import 'rxjs/add/operator/mergeMap';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { AnnouncementService, UserService, CoursesService, LearnerService } from '@sunbird/core';
import { SharedModule, ResourceService, ConfigService, ToasterService } from '@sunbird/shared';
import { MainHomeComponent } from './main-home.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as mockData from './main-home-component.spec.data';
const testData = mockData.mockRes;
describe('MainHomeComponent', () => {
  let component: MainHomeComponent;
  let fixture: ComponentFixture<MainHomeComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, SlickModule, SharedModule, Ng2IziToastModule],
      declarations: [MainHomeComponent],
      providers: [UserService, CoursesService, ResourceService, LearnerService, AnnouncementService, ToasterService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MainHomeComponent);
        component = fixture.componentInstance;
      });
  }));
  it('should subscribe to user service', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(testData.userSuccess));
    userService.getUserProfile();
    fixture.detectChanges();
    component.populateUserProfile();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.toDoList).toBeDefined();
  });
  it('should throw error', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(testData.userError));
    userService.getUserProfile();
    fixture.detectChanges();
    component.populateUserProfile();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
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
    expect(component.toDoList).toBeDefined();
  });
  it('should throw error', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(testData.courseError));
    courseService.getEnrolledCourses();
    fixture.detectChanges();
    component.populateEnrolledCourse();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });
});
