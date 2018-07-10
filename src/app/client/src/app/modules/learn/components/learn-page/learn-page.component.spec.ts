
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule, ResourceService, ServerResponse, ConfigService, ToasterService} from '@sunbird/shared';
import { PageApiService, LearnerService, CoursesService, UserService, CoreModule, PlayerService} from '@sunbird/core';
import { ICaraouselData, IAction } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import * as _ from 'lodash';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {Response} from './learn-page.component.spec.data';
import { LearnPageComponent } from './learn-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
const resourceServiceMockData = {
  messages : {
    stmsg : { m0007: 'error',  m0006: 'error'},
    emsg: { m0005: 'error'}, fmsg: {m0002: 'unable to fetch details'}
  },
  frmelmnts: {
  }
};
describe('LearnPageComponent', () => {
  let component: LearnPageComponent;
  let fixture: ComponentFixture<LearnPageComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    'params': observableOf({ pageNumber: '1' }),
  'queryParams':  observableOf({ subject: ['English'], sortType: 'desc', sort_by : 'lastUpdatedOn' }),
    snapshot: {
      data: {
        telemetry: {
          env: 'course', pageid: 'course', type: 'view', subtype: 'paginate'
        }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, SlickModule,
         SharedModule.forRoot(), CoreModule.forRoot(), TelemetryModule.forRoot(), NgInviewModule],
      declarations: [ LearnPageComponent ],
      providers: [{ provide: Router, useClass: RouterStub },
         { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
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
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    component.filters = { board: ['NCERT'], subject: [] };
    spyOn(pageSectionService, 'getPageData').and.callFake(() => observableOf(Response.successData));
    component.populatePageData();
    fixture.detectChanges();
     expect(component.showLoader).toBeFalsy();
     expect(component.caraouselData).toBeDefined();
  });
  it('should subscribe to pageSectionService for else', () => {
    const courseService = TestBed.get(CoursesService);
    const pageSectionService = TestBed.get(PageApiService);
    const learnerService = TestBed.get(LearnerService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    component.filters = { board: ['NCERT'], subject: [] };
    spyOn(pageSectionService, 'getPageData').and.callFake(() => observableOf(Response.noData));
    component.populatePageData();
    fixture.detectChanges();
     expect(component.showLoader).toBeFalsy();
     expect(component.noResult).toBeTruthy();
  });
  it('should subscribe to course service', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    courseService._enrolledCourseData$.next({ err: null, enrolledCourses: Response.courseSuccess.result.courses});
    courseService.initialize();
    fixture.detectChanges();
    component.populateEnrolledCourse();
    expect(component.showLoader).toBeTruthy();
    expect(component.queryParams.sortType).toString();
    expect(component.queryParams.sortType).toBe('desc');
  });
  it('should take else path when enrolledCourses length is 0 ', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(Response.noCourses));
    courseService.getEnrolledCourses();
    fixture.detectChanges();
    component.populateEnrolledCourse();
    fixture.detectChanges();
    expect(component.queryParams.sortType).toString();
    expect(component.queryParams.sortType).toBe('desc');
    expect(component.showLoader).toBeTruthy();
  });
  it('should throw error when courseService api is not called ', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    const resourceService = TestBed.get(ResourceService);
   resourceService.messages = Response.resourceBundle.messages;
    courseService._enrolledCourseData$.next({ err: Response.errorCourse, enrolledCourses: null});
    courseService.initialize();
    fixture.detectChanges();
    component.populateEnrolledCourse();
    expect(component.showLoader).toBeTruthy();
  });
  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.unsubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
  });
  it('should call inview method for visits data', () => {
    spyOn(component, 'prepareVisits').and.callThrough();
    component.prepareVisits(Response.event);
    expect(component.prepareVisits).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  });
  it('should call inview method for visits data for else if condition', () => {
    spyOn(component, 'prepareVisits').and.callThrough();
    component.prepareVisits(Response.event1);
    expect(component.prepareVisits).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  });
  it('should call playcontent', () => {
    const playerService = TestBed.get(PlayerService);
    const event = { data: { metaData: { batchId: '0122838911932661768' } } };
    spyOn(playerService, 'playContent').and.callFake(() => observableOf(event.data.metaData));
    component.playContent(event);
    expect(playerService.playContent).toHaveBeenCalled();
  });
  it('should throw error', () => {
    const courseService = TestBed.get(CoursesService);
    const pageSectionService = TestBed.get(PageApiService);
    const learnerService = TestBed.get(LearnerService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    component.filters = { board: ['NCERT'], subject: [] };
    component.enrolledCourses = Response.sameIdentifier.enrolledCourses;
    spyOn(pageSectionService, 'getPageData').and.callFake(() => observableThrowError({}));
    spyOn(toasterService, 'error').and.callThrough();
    component.populatePageData();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeTruthy();
    expect(component.noResultMessage).toBeTruthy();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0002);
  });
});
