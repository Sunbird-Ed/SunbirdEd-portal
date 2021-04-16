import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule, ResourceService, ConfigService, IAction, ToasterService, NavigationHelperService, PaginationService } from '@sunbird/shared';
import { CoreModule, LearnerService, CoursesService, SearchService, PlayerService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewAllComponent } from './view-all.component';
import {throwError as observableThrowError, of as observableOf, Observable } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response } from './view-all.component.spec.data';
import { PublicPlayerService } from '@sunbird/public';
import { SuiModule } from 'ng2-semantic-ui';
import { configureTestSuite } from '@sunbird/test-util';
import * as _ from 'lodash-es';

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
    },
    'frmelmnts' : {
      'lbl' : {
        'signinenrollTitle' : 'Log in to join this course',
        'mytrainings' : 'My courses'
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
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, SharedModule.forRoot(), CoreModule, TelemetryModule.forRoot()],
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
    spyOn(document, 'getElementById').and.returnValue('true');
    component.ngOnInit();
    component.setTelemetryImpressionData();
    component.setInteractEventData();
    expect(component).toBeTruthy();
    expect(component.setTelemetryImpressionData).toHaveBeenCalled();
    expect(component.setInteractEventData).toHaveBeenCalled();
    expect(component.closeIntractEdata).toEqual(closeIntractEdata);
    expect(component.cardIntractEdata).toEqual(cardIntractEdata);
    expect(component.sortIntractEdata).toEqual(sortIntractEdata);
    expect(component.queryParams).toEqual(queryParams);
    expect(component.filters).toEqual(filters);
    expect(searchService.contentSearch).toHaveBeenCalled();
    expect(component.sectionName).toEqual('Latest Courses');
    expect(component.pageNumber).toEqual(1);
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
      edata: { type: 'view', pageid: 'course', uri: route.url, subtype: 'paginate', duration: NaN }
    };
    const closeIntractEdata = { id: 'close', type: 'click', pageid: 'course'};
    const cardIntractEdata = {  id: 'content-card',  type: 'click', pageid: 'course' };
    const sortIntractEdata = { id: 'sort', type: 'click', pageid: 'course' };
    courseService._enrolledCourseData$.next({ err: null, enrolledCourses: Response.courseSuccess.result.courses});
     spyOn(searchService, 'contentSearch').and.callFake(() => observableThrowError({}));
     spyOn(component, 'setTelemetryImpressionData').and.callThrough();
     spyOn(component, 'setInteractEventData').and.callThrough();
     spyOn(toasterService, 'error').and.callThrough();
     spyOn(document, 'getElementById').and.returnValue('true');
    component.ngOnInit();
    component.setTelemetryImpressionData();
    component.setInteractEventData();
    expect(component).toBeTruthy();
    expect(component.setTelemetryImpressionData).toHaveBeenCalled();
    expect(component.setInteractEventData).toHaveBeenCalled();
    expect(component.closeIntractEdata).toEqual(closeIntractEdata);
    expect(component.cardIntractEdata).toEqual(cardIntractEdata);
    expect(component.sortIntractEdata).toEqual(sortIntractEdata);
   expect(component.queryParams).toEqual(queryParams);
    expect(component.filters).toEqual(filters);
    expect(searchService.contentSearch).toHaveBeenCalled();
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
    expect(route.navigate).toHaveBeenCalledWith(['learn/view-all/LatestCourses/1'], { queryParams: component.queryParams,
       relativeTo: fakeActivatedRoute});
  });

  it('should call updateDownloadStatus when updateCardData is called' , () => {
    const playerService = TestBed.get(PublicPlayerService);
    spyOn(playerService, 'updateDownloadStatus');
    component.searchList = Response.successData.result.content;
    component.updateCardData(Response.download_list);
    expect(playerService.updateDownloadStatus).toHaveBeenCalled();
  });
  it('should redo layout on render', () => {
    component.layoutConfiguration = {};
    component.redoLayout();
    component.layoutConfiguration = null;
    component.redoLayout();
  });

  it('should process the data if view-all is clicked from My-Courses section', () => {
    const courseService = TestBed.get(CoursesService);
    component.sectionName = 'My courses';
    const sortedData = _.map(_.orderBy(_.get(Response, 'enrolledCourseData.enrolledCourses'), ['enrolledDate'], ['desc']), (val) => {
      const value = _.get(val, 'content');
      return value;
    });
    spyOn<any>(component, 'getContentList').and.returnValue(observableOf({
      'enrolledCourseData': Response.enrolledCourseData,
      'contentData': Response.successData
    }));
    courseService._enrolledCourseData$.next({ err: null, enrolledCourses: Response.enrolledCourseData});
    spyOn<any>(component, 'formatSearchresults').and.stub();
    component.getContents(Response.paramsData);
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeFalsy();
    expect(component.totalCount).toEqual(Response.enrolledCourseData.enrolledCourses.length);
    expect(component['formatSearchresults']).toHaveBeenCalledWith(sortedData);
  });

  it('should process the data if view-all is clicked from any of the page section other than my courses', () => {
    component.pageLimit = 20;
    component.pageNumber = 1;
    const pagenationService = TestBed.get(PaginationService);
    const courseService = TestBed.get(CoursesService);
    component.sectionName = 'Latest courses';
    spyOn<any>(component, 'getContentList').and.returnValue(observableOf({
      'enrolledCourseData': Response.enrolledCourseData,
      'contentData': Response.successData
    }));
    courseService._enrolledCourseData$.next({ err: null, enrolledCourses: Response.enrolledCourseData});
    spyOn<any>(component, 'formatSearchresults').and.stub();
    spyOn(pagenationService, 'getPager').and.stub();
    component.getContents(Response.paramsData);
    expect(component.showLoader).toBeFalsy();
    expect(component.noResult).toBeFalsy();
    expect(component.totalCount).toEqual(Response.successData.result.count);
    expect(pagenationService.getPager).toHaveBeenCalledWith(Response.successData.result.count, 1, 20);
    expect(component['formatSearchresults']).toHaveBeenCalledWith(Response.successData.result.content);
  });

  it('should show no result message if no content fount with the search query coming from other page section', () => {
    const courseService = TestBed.get(CoursesService);
    component.sectionName = 'Latest courses';
    const noResultMessages = {
      'message': 'messages.stmsg.m0007',
      'messageText': 'messages.stmsg.m0006'
    };
    spyOn<any>(component, 'getContentList').and.returnValue(observableOf({
      'enrolledCourseData': Response.enrolledCourseData,
      'contentData': { 'result': { 'content': [], 'count': 0 } }
    }));
    courseService._enrolledCourseData$.next({ err: null, enrolledCourses: Response.enrolledCourseData});
    component.getContents(Response.paramsData);
    expect(component.noResult).toBeTruthy();
    expect(component.noResultMessage).toEqual(noResultMessages);
  });

  it('should show no result message if no content fount with the search query coming from other my courses section', () => {
    const courseService = TestBed.get(CoursesService);
    component.sectionName = 'My courses';
    const noResultMessages = {
      'message': 'messages.stmsg.m0007',
      'messageText': 'messages.stmsg.m0006'
    };
    spyOn<any>(component, 'getContentList').and.returnValue(observableOf({
      'enrolledCourseData': { ' enrolledCourses': [] },
      'contentData': { 'result': { 'content': [], 'count': 0 } }
    }));
    courseService._enrolledCourseData$.next({ err: null, enrolledCourses: Response.enrolledCourseData});
    component.getContents(Response.paramsData);
    expect(component.noResult).toBeTruthy();
    expect(component.noResultMessage).toEqual(noResultMessages);
  });
  it('should handle close button click', () => {
    const route = TestBed.get(Router);
    route.url = 'learn/view-all/LatestCourses/1?contentType: course';
    component.handleCloseButton();
    expect(route.navigate).toHaveBeenCalledWith(['/learn'], { queryParams: { selectedTab: '' } });
  });
});
