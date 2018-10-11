import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule, ResourceService, ConfigService, IAction, ToasterService } from '@sunbird/shared';
import { CoreModule, LearnerService, CoursesService, SearchService, PlayerService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewAllComponent } from './view-all.component';
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response } from './view-all.component.spec.data';
import { PublicPlayerService } from '@sunbird/public';

describe('ViewAllComponent', () => {
  let component: ViewAllComponent;
  let fixture: ComponentFixture<ViewAllComponent>;
  const resourceBundle = {
    'messages': {
      'stmsg': {
        'm0007': 'Search for something else',
        'm0006': 'No result'
      },
      'fmsg': {
        'm0051': 'Fetching other courses failed, please try again later...',
        'm0077': 'Fetching serach result failed'
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    'params': observableOf({ section: 'Latest-Courses' , pageNumber: 1 }),
    'queryParams': observableOf({ contentType: ['Course'], objectType: ['Content'], status: ['Live'],
    defaultSortBy: JSON.stringify({'lastPublishedOn': 'desc'}) }),
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
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule.forRoot(), TelemetryModule.forRoot()],
      declarations: [ ViewAllComponent ],
      providers: [ConfigService, CoursesService, SearchService, LearnerService, PublicPlayerService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllComponent);
    component = fixture.componentInstance;
  });

  it('should call ngOninit when content is present', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    const searchService = TestBed.get(SearchService);
    const route = TestBed.get(Router);
    route.url = 'learn/view-all/LatestCourses/1?contentType: course';
    const queryParams = { contentType: ['Course'], objectType: ['Content'], status: ['Live'],
    defaultSortBy: JSON.stringify({lastPublishedOn: 'desc'})};
    const filters = {contentType: ['Course'], objectType: ['Content'], status: ['Live']};
    const telemetryImpression = { context: { env: 'course' },
      edata: { type: 'view', pageid: 'course', uri: route.url, subtype: 'paginate' }
    };
    const closeIntractEdata = { id: 'close', type: 'click', pageid: 'course'};
    const cardIntractEdata = {  id: 'content-card',  type: 'click', pageid: 'course' };
    const sortIntractEdata = { id: 'sort', type: 'click', pageid: 'course' };
    courseService._enrolledCourseData$.next({ err: null, enrolledCourses: Response.courseSuccess.result.courses});
     spyOn(searchService, 'contentSearch').and.callFake(() => observableOf(Response.successData));
     spyOn(component, 'setTelemetryImpressionData').and.callThrough();
     spyOn(component, 'setInteractEventData').and.callThrough();
    component.ngOnInit();
    component.setTelemetryImpressionData();
    component.setInteractEventData();
    expect(component).toBeTruthy();
    expect(component.setTelemetryImpressionData).toHaveBeenCalled();
    expect(component.telemetryImpression).toEqual(telemetryImpression);
    expect(component.setInteractEventData).toHaveBeenCalled();
    expect(component.closeIntractEdata).toEqual(closeIntractEdata);
    expect(component.cardIntractEdata).toEqual(cardIntractEdata);
    expect(component.sortIntractEdata).toEqual(sortIntractEdata);
    expect(component.queryParams).toEqual(queryParams);
    expect(component.filters).toEqual(filters);
    expect(searchService.contentSearch).toHaveBeenCalled();
    expect(component.closeUrl).toEqual('/learn');
    expect(component.sectionName).toEqual('Latest Courses');
    expect(component.pageNumber).toEqual(1);
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeFalsy();
    expect(component.totalCount).toEqual(1);
  });
  it('should call ngOninit when error', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    const searchService = TestBed.get(SearchService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceBundle.messages;
    const route = TestBed.get(Router);
    route.url = 'learn/view-all/LatestCourses/1?contentType: course';
    const queryParams = { contentType: ['Course'], objectType: ['Content'], status: ['Live'],
    defaultSortBy: JSON.stringify({lastPublishedOn: 'desc'})};
    const filters = {contentType: ['Course'], objectType: ['Content'], status: ['Live']};
    const telemetryImpression = { context: { env: 'course' },
      edata: { type: 'view', pageid: 'course', uri: route.url, subtype: 'paginate' }
    };
    const closeIntractEdata = { id: 'close', type: 'click', pageid: 'course'};
    const cardIntractEdata = {  id: 'content-card',  type: 'click', pageid: 'course' };
    const sortIntractEdata = { id: 'sort', type: 'click', pageid: 'course' };
    courseService._enrolledCourseData$.next({ err: null, enrolledCourses: Response.courseSuccess.result.courses});
     spyOn(searchService, 'contentSearch').and.callFake(() => observableThrowError({}));
     spyOn(component, 'setTelemetryImpressionData').and.callThrough();
     spyOn(component, 'setInteractEventData').and.callThrough();
     spyOn(toasterService, 'error').and.callThrough();
    component.ngOnInit();
    component.setTelemetryImpressionData();
    component.setInteractEventData();
    expect(component).toBeTruthy();
    expect(component.setTelemetryImpressionData).toHaveBeenCalled();
    expect(component.telemetryImpression).toEqual(telemetryImpression);
    expect(component.setInteractEventData).toHaveBeenCalled();
    expect(component.closeIntractEdata).toEqual(closeIntractEdata);
    expect(component.cardIntractEdata).toEqual(cardIntractEdata);
    expect(component.sortIntractEdata).toEqual(sortIntractEdata);
   expect(component.queryParams).toEqual(queryParams);
    expect(component.filters).toEqual(filters);
    expect(searchService.contentSearch).toHaveBeenCalled();
    expect(component.closeUrl).toEqual('/learn');
    expect(component.sectionName).toEqual('Latest Courses');
    expect(component.pageNumber).toEqual(1);
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeTruthy();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0051);
  });
  it('should call playcontent with batchId', () => {
    const playerService = TestBed.get(PlayerService);
    const route = TestBed.get(Router);
    route.url = '/learn/view-all/LatestCourses/1?contentType: course';
    const event = { data: { metaData: { batchId: '0122838911932661768' } } };
    spyOn(playerService, 'playContent').and.callFake(() => observableOf(event.data.metaData));
    component.playContent(event);
    expect(playerService.playContent).toHaveBeenCalled();
  });
  it('should call playcontent without batchId', () => {
    const route = TestBed.get(Router);
    route.url = '/learn/view-all/LatestCourses/1?contentType: course';
    const playerService = TestBed.get(PlayerService);
    const event = { data: { metaData: { contentType: 'story' } } };
    spyOn(playerService, 'playContent').and.callFake(() => observableOf(event.data.metaData));
    component.playContent(event);
    expect(playerService.playContent).toHaveBeenCalled();
  });
  it('should call navigateToPage method', () => {
    const configService = TestBed.get(ConfigService);
    const route = TestBed.get(Router);
    route.url = 'learn/view-all/LatestCourses/1?contentType: course';
    component.queryParams = { contentType: ['Course'], objectType: ['Content'], status: ['Live'],
    defaultSortBy: JSON.stringify({lastPublishedOn: 'desc'})};
    component.pageNumber = 1;
    component.pager = Response.pager;
    component.pageLimit = 20;
    component.pager.totalPages = 7;
    component.navigateToPage(1);
    expect(component.pageNumber).toEqual(1);
    expect(component.pageLimit).toEqual(configService.appConfig.SEARCH.PAGE_LIMIT);
    expect(route.navigate).toHaveBeenCalledWith(['learn/view-all/LatestCourses', 1], { queryParams: component.queryParams,
       relativeTo: fakeActivatedRoute});
  });
});
