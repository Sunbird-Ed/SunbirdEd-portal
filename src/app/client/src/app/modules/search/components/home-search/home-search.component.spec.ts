import { HomeSearchComponent } from './home-search.component';
import { BehaviorSubject, throwError, of } from 'rxjs';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { SearchService, CoursesService, CoreModule, LearnerService, PlayerService, SchemaService} from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import * as _ from 'lodash-es';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response } from './home-search.component.spec.data';
import { Response as contentResponse } from '../../../../modules/public/module/explore/components/explore-content/explore-content.component.spec.data';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { configureTestSuite } from '@sunbird/test-util';
import { ContentManagerService } from '../../../public/module/offline/services/content-manager/content-manager.service';

describe('HomeSearchComponent', () => {
  let component: HomeSearchComponent;
  let fixture: ComponentFixture<HomeSearchComponent>;
  let toasterService, searchService, coursesService, activatedRoute, cacheService, learnerService, schemaService;
  const mockSearchData: any = Response.successData;
  let sendEnrolledCourses = true;
  let sendSearchResult = true;
  let sendFormResult = true;
  let sendFormApi = true;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }
  const resourceBundle = {
    'messages': {
      'fmsg': {},
      'emsg': {},
      'stmsg': {}
    },
    'frmelmnts': {
      'lbl': {
        'mytrainings': 'My Trainings'
      }
    },
    languageSelected$: of({})
  };
  class FakeActivatedRoute {
    queryParamsMock = new BehaviorSubject<any>({ subject: ['English'] });
    paramsMock = new BehaviorSubject<any>({ pageNumber: '1' });
    get params() { return this.paramsMock.asObservable(); }
    get queryParams() { return this.queryParamsMock.asObservable(); }
    snapshot = {
      params: {slug: 'ap'},
      data: {
        telemetry: { env: 'resource', pageid: 'resource-search', type: 'view', subtype: 'paginate'}
      }
    };
    public changeQueryParams(queryParams) { this.queryParamsMock.next(queryParams); }
    public changeParams(params) { this.paramsMock.next(params); }
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot()],
      declarations: [HomeSearchComponent],
      providers: [{ provide: ResourceService, useValue: resourceBundle },
      { provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useClass: FakeActivatedRoute },
      ContentManagerService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSearchComponent);
    component = fixture.componentInstance;
    toasterService = TestBed.get(ToasterService);
    searchService = TestBed.get(SearchService);
    activatedRoute = TestBed.get(ActivatedRoute);
    cacheService = TestBed.get(CacheService);
    learnerService = TestBed.get(LearnerService);
    coursesService = TestBed.get(CoursesService);
    schemaService = TestBed.get(SchemaService);
    sendEnrolledCourses = true;
    sendSearchResult = true;
    sendFormResult = true;
    sendFormApi = true;
    toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => {});
    spyOn(learnerService, 'get').and.callFake((options) => {
      if (sendEnrolledCourses) {
        return of({result: {courses: Response.enrolledCourses}});
      }
      return throwError({});
    });
    spyOn(searchService, 'getContentTypes').and.callFake((options) => {
      if (sendFormResult) {
        return of(Response.formData);
      }
      return throwError({});
    });
    spyOn(searchService, 'contentSearch').and.callFake((options) => {
      if (sendSearchResult) {
        return of(mockSearchData);
      }
      return throwError({});
    });
    spyOn(cacheService, 'get').and.callFake((options) => {
      return undefined;
    });
    spyOn(schemaService, 'fetchSchemas').and.returnValue([{ id: 'content', schema: { properties: [] } }]);
  });
  it('should emit filter data when getFilters is called with data', () => {
    spyOn(component.dataDrivenFilterEvent, 'emit');
    coursesService.initialize();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    expect(component.dataDrivenFilterEvent.emit).toHaveBeenCalledWith({ board: 'NCRT'});
  });
  it('should emit filter data when getFilters is called with no data', () => {
    spyOn(component.dataDrivenFilterEvent, 'emit');
    coursesService.initialize();
    component.getFilters([]);
    expect(component.dataDrivenFilterEvent.emit).toHaveBeenCalledWith({});
  });
  it('should not throw error if fetching enrolled course fails', () => {
    sendEnrolledCourses = false;
    coursesService.initialize();
    component.ngOnInit();
    component.getFilters([]);
    expect(toasterService.error).not.toHaveBeenCalled();
    expect(component.enrolledSection.contents.length).toEqual(0);
  });
  it('should fetch content after getting hashTagId and filter data and set carouselData if api returns data', fakeAsync(() => {
    coursesService.initialize();
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    // expect(component.dataDrivenFilters).toEqual({ board: 'NCRT'});
    expect(component.showLoader).toBeFalsy();
    expect(component.contentList.length).toEqual(1);
  }));
  it('should fetch content only once for when component displays content for the first time', fakeAsync(() => {
    coursesService.initialize();
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT'});
    expect(component.showLoader).toBeFalsy();
    expect(component.contentList.length).toEqual(1);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(1);
  }));
  it('should fetch content once when queryParam changes after initial content has been displayed', fakeAsync(() => {
    coursesService.initialize();
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(1);
    activatedRoute.changeQueryParams({board: ['NCRT']});
    tick(100);
    expect(component.contentList.length).toEqual(1);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(2);
  }));
  it('should fetch content once when param changes after initial content has been displayed', fakeAsync(() => {
    coursesService.initialize();
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(1);
    activatedRoute.changeParams({pageNumber: 2});
    tick(100);
    expect(component.contentList.length).toEqual(1);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(2);
  }));
  it('should fetch content once when both queryParam and params changes after initial content has been displayed', fakeAsync(() => {
    coursesService.initialize();
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(1);
    activatedRoute.changeQueryParams({board: ['NCRT']});
    activatedRoute.changeParams({pageNumber: 2});
    tick(100);
    expect(component.contentList.length).toEqual(1);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(2);
  }));
  it('should trow error when fetching content fails even after getting hashTagId and filter data', fakeAsync(() => {
    coursesService.initialize();
    sendSearchResult = false;
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT'});
    expect(component.showLoader).toBeFalsy();
    expect(component.contentList.length).toEqual(0);
    expect(toasterService.error).toHaveBeenCalled();
  }));
  it('should unsubscribe from all observable subscriptions', () => {
    coursesService.initialize();
    component.ngOnInit();
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });
  it('should redo layout on render', () => {
    component.layoutConfiguration = {};
    component.ngOnInit();
    component.redoLayout();
    component.layoutConfiguration = null;
    component.ngOnInit();
    component.redoLayout();
  });
  it('Should call searchservice -contenttypes and get error', fakeAsync(() => {
    coursesService.initialize();
    sendSearchResult = false;
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT'});
    expect(component.showLoader).toBeFalsy();
    expect(component.contentList.length).toEqual(0);
    expect(toasterService.error).toHaveBeenCalled();
  }));

  it('should call ngAfterViewInit', fakeAsync(() => {
    component.ngAfterViewInit();
    tick(100);
    expect(component.telemetryImpression).toBeDefined();
  }));

  it('should playContent without batch id', () => {
    const courseService = TestBed.get(CoursesService);
    const playerService = TestBed.get(PlayerService);
    spyOn(courseService, 'findEnrolledCourses').and.returnValue({ onGoingBatchCount: 0, expiredBatchCount: 0 });
    spyOn(playerService, 'playContent').and.callThrough();
    const data = {
      metaData: {
        identifier: '123',
      }
    };
    component.playContent({data});
    expect(playerService.playContent).toHaveBeenCalledWith(data.metaData);
  });

  it('should playContent for on going batch with batch id', () => {
    const courseService = TestBed.get(CoursesService);
    const playerService = TestBed.get(PlayerService);
    const returnValue = {
      onGoingBatchCount: 1,
      expiredBatchCount: 0,
      openBatch: {
        ongoing: [{ batchId: 1213421 }]
      },
      inviteOnlyBatch: false
    };
    spyOn(courseService, 'findEnrolledCourses').and.returnValue(returnValue);
    const data = {
      metaData: {
        identifier: '123',
      }
    };
    component.playContent({data});
  });

  it('should call navigateToPage method', () => {
    component.paginationDetails.totalPages = 20;
    const router = TestBed.get(Router);
    router.url = '/search/Courses/1?key=SB-194&selectedTab=all';
    spyOn(window, 'scroll');
    component.navigateToPage(2);
    expect(router.navigate).toHaveBeenCalled();
    expect(window.scroll).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'smooth' });
  });

  it('should call listenLanguageChange', () => {
    component.isDesktopApp = true;
    component.contentList = [{ name: 'test' }];
    spyOn(component, 'addHoverData');
    spyOn<any>(component, 'setNoResultMessage');
    component['listenLanguageChange']();
    expect(component.addHoverData).toHaveBeenCalled();
    expect(component['setNoResultMessage']).toHaveBeenCalled();
  });

  it('should call hoverActionClicked for DOWNLOAD ', () => {
    contentResponse.hoverActionsData['hover'] = {
      'type': 'download',
      'label': 'Download',
      'disabled': false
    };
    contentResponse.hoverActionsData['data'] = contentResponse.hoverActionsData.content;
    spyOn(component, 'logTelemetry');
    spyOn(component, 'downloadContent').and.callThrough();
    component.hoverActionClicked(contentResponse.hoverActionsData);
    expect(component.downloadContent).toHaveBeenCalledWith(component.downloadIdentifier);
    expect(component.logTelemetry).toHaveBeenCalledWith(component.contentData, 'download-collection');
    expect(component.showModal).toBeFalsy();
    expect(component.contentData).toBeDefined();
  });

  it('should call hoverActionClicked for Open ', () => {
    contentResponse.hoverActionsData['hover'] = {
      'type': 'Open',
      'label': 'OPEN',
      'disabled': false
    };
    contentResponse.hoverActionsData['data'] = contentResponse.hoverActionsData.content;
    const route = TestBed.get(Router);
    route.url = '/explore-page?selectedTab=explore-page';
    spyOn(component, 'logTelemetry').and.callThrough();
    spyOn(component, 'playContent');
    component.hoverActionClicked(contentResponse.hoverActionsData);
    expect(component.playContent).toHaveBeenCalledWith(contentResponse.hoverActionsData);
    expect(component.logTelemetry).toHaveBeenCalledWith(component.contentData, 'play-content');
    expect(component.contentData).toBeDefined();
  });

  it('should call download content with success ', () => {
    const contentManagerService = TestBed.get(ContentManagerService);
    spyOn(contentManagerService, 'startDownload').and.returnValue(of({}));
    component.downloadContent('123');
    expect(component.showDownloadLoader).toBeFalsy();
  });
  it('should call download content from popup ', () => {
    spyOn(component, 'downloadContent');
    component.callDownload();
    expect(component.showDownloadLoader).toBeTruthy();
    expect(component.downloadContent).toHaveBeenCalled();
  });

  it('should call download content with error ', () => {
    const contentManagerService = TestBed.get(ContentManagerService);
    spyOn(contentManagerService, 'startDownload').and.returnValue(throwError({ error: { params: { err: 'ERROR' } } }));
    component.ngOnInit();
    component.downloadContent('123');
    expect(component.showDownloadLoader).toBeFalsy();
  });

});
