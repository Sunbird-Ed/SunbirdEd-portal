import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';

import { Ng2IziToastModule } from 'ng2-izitoast';
import { AnnouncementService, UserService, CoursesService, LearnerService, FrameworkService, ContentService,
   PlayerService } from '@sunbird/core';
import { SharedModule, ResourceService, ConfigService, ToasterService } from '@sunbird/shared';
import { MainHomeComponent } from './main-home.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as mockData from './main-home-component.spec.data';
import { CacheService } from 'ng2-cache-service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgInviewModule } from 'angular-inport';
import { TelemetryModule } from '@sunbird/telemetry';
const testData = mockData.mockRes;
describe('MainHomeComponent', () => {
  let component: MainHomeComponent;
  let fixture: ComponentFixture<MainHomeComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    snapshot: {
      params: [
        {
          pageNumber: '1',
        }
      ],
      data: {
        telemetry: {
          env: 'home', pageid: 'home', subtype: 'paginate', type: 'view',
          object: { type: '', ver: '1.0' }
        }
      }
    };
  }
  const env = 'home';
class ActivatedRouteStub {
    snapshot = {
      root: { firstChild : {data: { telemetry: { env: env} } } },
      data : {
         telemetry: { env: env }
      }
    };
  }
  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0001': 'api failed, please try again',
        'm0004': 'api failed, please try again'
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, SlickModule, SharedModule.forRoot(),
       Ng2IziToastModule, NgInviewModule, TelemetryModule.forRoot()],
      declarations: [MainHomeComponent],
      providers: [UserService, CoursesService, ResourceService, LearnerService, AnnouncementService,
         ToasterService, FrameworkService, CacheService, ContentService, PlayerService,
         { provide: Router, useClass: RouterStub },
         { provide: ActivatedRoute, useClass: ActivatedRouteStub },
         { provide: ResourceService, useValue: resourceBundle }],
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
    userService._userData$.next({ err: null, userProfile: testData.userSuccess});
    userService.getUserProfile();
    fixture.detectChanges();
    component.populateUserProfile();
    expect(component.showLoader).toBeFalsy();
    expect(component.toDoList).toBeDefined();
  });
  it('should throw error in user Service ', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    userService._userData$.next({ err: testData.userError, userProfile: null});
    userService.getUserProfile();
    fixture.detectChanges();
    component.populateUserProfile();
    expect(component.showLoader).toBeFalsy();
  });
  it('should subscribe to course service', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    courseService._enrolledCourseData$.next({ err: null, enrolledCourses: testData.courseSuccess});
    courseService.initialize();
    fixture.detectChanges();
    component.populateEnrolledCourse();
    expect(component.showLoader).toBeFalsy();
    expect(component.toDoList).toBeDefined();
  });
 it('should subscribe to course service throw error', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    courseService._enrolledCourseData$.next({ err: testData.courseError, enrolledCourses: null});
    courseService.initialize();
    fixture.detectChanges();
    component.populateEnrolledCourse();
    expect(component.showLoader).toBeFalsy();
  });
});
