// Import NG core testing module(s)
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// Import modules
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import 'rxjs/add/operator/mergeMap';
// Import services
import { AnnouncementService, UserService, CoursesService, LearnerService } from '@sunbird/core';
import { SharedModule, ResourceService, ConfigService } from '@sunbird/shared';
import { MainHomeComponent } from './main-home.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as mockData from './main-home-component.spec.data';
const testData = mockData.mockRes;
describe('MainHomeComponent', () => {
  let component: MainHomeComponent;
  let fixture: ComponentFixture<MainHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, SlickModule, HttpClientModule, SharedModule],
      declarations: [MainHomeComponent],
      providers: [UserService, CoursesService, ResourceService, LearnerService, AnnouncementService],
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
    component.getDetails();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.profileList).toBeDefined();
    expect(component.toDoList).toBeDefined();
  });

  it('should subscribe to course service', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(testData.courseSuccess));
    courseService.getEnrolledCourses();
    fixture.detectChanges();
    component.getCourses();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.enrolledCourses).toBeDefined();
    expect(component.toDoList).toBeDefined();
  });
});
