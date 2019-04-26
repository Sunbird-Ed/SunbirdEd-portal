import { async, ComponentFixture, TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
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
    },
    languageSelected$: of({})
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, SlickModule, SharedModule.forRoot(), NgInviewModule, TelemetryModule.forRoot()],
      declarations: [MainHomeComponent],
      providers: [UserService, CoursesService, ResourceService, LearnerService, AnnouncementService,
         ToasterService, FrameworkService, CacheService, ContentService, PlayerService,
         { provide: Router, useClass: RouterStub },
         { provide: ActivatedRoute, useClass: ActivatedRouteStub },
         { provide: ResourceService, useValue: resourceBundle }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MainHomeComponent);
        component = fixture.componentInstance;
      });
  }));
  it('should subscribe to course service', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => 'error');
    courseService._enrolledCourseData$.next({ err: null, enrolledCourses: testData.courseSuccess});
    courseService.initialize();
    component.populateEnrolledCourse();
    expect(component.showLoader).toBeFalsy();
    expect(component.toDoList).toBeDefined();
  });
  it('should subscribe to course service throw error', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => 'error');
    courseService._enrolledCourseData$.next({ err: testData.courseError, enrolledCourses: null});
    courseService.initialize();
    component.ngOnInit();
    component.populateEnrolledCourse();
    expect(component.showLoader).toBeFalsy();
  });
  it('should call playcontent', () => {
    const playerService = TestBed.get(PlayerService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => 'error');
    spyOn(playerService, 'playContent').and.callFake(() => {
      return;
    });
    component.playContent(testData.metaData);
    expect(playerService.playContent).toHaveBeenCalled();
  });
  it('should call playcontent', () => {
    const playerService = TestBed.get(PlayerService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => 'error');
    spyOn(playerService, 'playContent').and.callThrough();
    component.playContent(testData.metaData);
    expect(playerService.playContent).toHaveBeenCalled();
  });
  it('should call inview method for visits data', fakeAsync(() => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => 'error');
    spyOn(component, 'inview').and.callThrough();
    component.ngOnInit();
    component.ngAfterViewInit();
    tick(100);
    component.inview(testData.inviewData);
    expect(component.inview).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  }));
  it('should call inviewChange method for visits data', fakeAsync(() => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => 'error');
    spyOn(component, 'inviewChange').and.callThrough();
    component.ngOnInit();
    component.ngAfterViewInit();
    tick(100);
    component.inviewChange(testData.toDoList, testData.eventData2);
    expect(component.inviewChange).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  }));
  it('should call announcemnetInview method for visits data', fakeAsync(() => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => 'error');
    spyOn(component, 'anouncementInview').and.callThrough();
    component.ngOnInit();
    component.ngAfterViewInit();
    tick(100);
    component.anouncementInview(testData.announcementInview);
    expect(component.anouncementInview).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  }));
});
