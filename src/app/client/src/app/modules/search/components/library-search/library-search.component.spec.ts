import { LibrarySearchComponent } from './library-search.component';

import { BehaviorSubject, throwError, of } from 'rxjs';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ResourceService, ToasterService, SharedModule, UtilService } from '@sunbird/shared';
import { SearchService, CoreModule, UserService, CoursesService, PlayerService} from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import * as _ from 'lodash-es';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response } from './library-search.component.spec.data';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { ContentManagerService } from '../../../public/module/offline/services';
import { PublicPlayerService } from '@sunbird/public';

describe('LibrarySearchComponent', () => {
  let component: LibrarySearchComponent;
  let fixture: ComponentFixture<LibrarySearchComponent>;
  let toasterService, userService, searchService, activatedRoute;
  const mockSearchData: any = Response.successData;
  let sendSearchResult = true;
  let sendFormResult = true;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }
  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0027': 'Something went wrong',
        'm0090': 'Could not download. Try again later',
        'm0091': 'Could not copy content. Try again later'
      },
      'stmsg': {
        'm0009': 'error',
        'm0140': 'DOWNLOADING',
        'm0138': 'FAILED',
        'm0139': 'DOWNLOADED',
      },
      'imsg': {
       't0143': 'This content is not supported yet'
      },
      'emsg': {}
    },
    frmelmnts: {
      lbl: {
        'noBookfoundSubTitle': 'Your board is yet to add more books. Tap the button to see more books and content on {instance}',
        'noBookfoundButtonText': 'See more books and contents',
        'desktop': {
          'yourSearch': 'Your search for - "{key}"',
          'notMatchContent': 'did not match any content'
        }
      }
    },
    languageSelected$: of({})
  };
  class FakeActivatedRoute {
    queryParamsMock = new BehaviorSubject<any>({ subject: ['English'], utm_source: 'Tara' });
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
      declarations: [LibrarySearchComponent],
      providers: [{ provide: ResourceService, useValue: resourceBundle },
      { provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useClass: FakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibrarySearchComponent);
    component = fixture.componentInstance;
    toasterService = TestBed.get(ToasterService);
    userService = TestBed.get(UserService);
    searchService = TestBed.get(SearchService);
    activatedRoute = TestBed.get(ActivatedRoute);
    sendSearchResult = true;
    sendFormResult = true;
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
  });
  it('should emit filter data when getFilters is called with data', () => {
    spyOn(component.dataDrivenFilterEvent, 'emit');
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    expect(component.dataDrivenFilterEvent.emit).toHaveBeenCalledWith({ board: 'NCRT'});
  });
  it('should emit filter data when getFilters is called with no data', () => {
    spyOn(component.dataDrivenFilterEvent, 'emit');
    component.getFilters([]);
    expect(component.dataDrivenFilterEvent.emit).toHaveBeenCalledWith({});
  });
  it('should fetch filter details from data driven filter component', () => {
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT'});
  });
  it('should fetch content after getting filter data and set carouselData if api returns data', fakeAsync(() => {
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT'});
    expect(component.showLoader).toBeFalsy();
    expect(component.contentList.length).toEqual(2);
  }));
  it('should fetch content only once for when component displays content for the first time', fakeAsync(() => {
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT'});
    expect(component.showLoader).toBeFalsy();
    expect(component.contentList.length).toEqual(2);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(1);
  }));
  it('should fetch content once when queryParam changes after initial content has been displayed', fakeAsync(() => {
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(1);
    activatedRoute.changeQueryParams({board: ['NCRT']});
    tick(100);
    expect(component.contentList.length).toEqual(2);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(2);
  }));
  it('should fetch content once when param changes after initial content has been displayed', fakeAsync(() => {
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(1);
    activatedRoute.changeParams({pageNumber: 2});
    tick(100);
    expect(component.contentList.length).toEqual(2);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(2);
  }));
  it('should fetch content once when both queryParam and params changes after initial content has been displayed', fakeAsync(() => {
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(1);
    activatedRoute.changeQueryParams({board: ['NCRT']});
    activatedRoute.changeParams({pageNumber: 2});
    tick(100);
    expect(component.contentList.length).toEqual(2);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(2);
  }));
  it('should trow error when fetching content fails even after getting hashTagId and filter data', fakeAsync(() => {
    sendSearchResult = false;
    spyOn(toasterService, 'error').and.callFake(() => {});
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
    tick(100);
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT'});
    expect(component.showLoader).toBeFalsy();
    expect(component.contentList.length).toEqual(0);
    expect(toasterService.error).toHaveBeenCalled();
  }));
  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

  it('getOrderedData() should return empty[]', () => {
    const contents: [] = component.getOrderedData([]);
    expect(contents.length).toEqual(0);
   });

   it('getOrderedData() should return ordered empty[]', () => {
    component.frameworkData = {board: ['Test 2']};
    const contents: object[] = component.getOrderedData(Response.successData.result.content);
    expect(contents.length).toEqual(2);
    expect(contents[0]['board']).toEqual('Test 2');
    expect(contents[1]['board']).toEqual('Test 1');
   });

  it('Should call searchservice -contenttypes and get error', fakeAsync(() => {
    sendFormResult = false;
    spyOn(toasterService, 'error').and.callFake(() => { });
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{ index: 0, name: 'NCRT' }, { index: 1, name: 'CBSC' }] }]);
    tick(100);
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT' });
    expect(component.showLoader).toBeFalsy();
    expect(component.contentList.length).toEqual(2);
    expect(toasterService.error).toHaveBeenCalled();
  }));

  it('should play content and not show the batch popup', () => {
    const courseService = TestBed.get(CoursesService);
    const playerService = TestBed.get(PlayerService)
    const playContentSpy = spyOn(playerService, 'playContent')
    spyOn(courseService, 'findEnrolledCourses').and.returnValue({
      onGoingBatchCount: 0,
      expiredBatchCount: 0
    });
    component.playContent({ data: {} });
    expect(playContentSpy).toHaveBeenCalled();
    expect(component.showBatchInfo).toBeFalsy();
  });

  it('should play content and not show the batch popup when ongoing batch count is 1', () => {
    const courseService = TestBed.get(CoursesService);
    const playerService = TestBed.get(PlayerService);
    const playContentSpy = spyOn(playerService, 'playContent');
    spyOn(courseService, 'findEnrolledCourses').and.returnValue({
      onGoingBatchCount: 1,
      expiredBatchCount: 0
    });
    component.playContent({ data: {} });
    expect(playContentSpy).toHaveBeenCalled();
    expect(component.showBatchInfo).toBeFalsy();
  });

  it('should show the batch details popup', () => {
    const courseService = TestBed.get(CoursesService);
    const playerService = TestBed.get(PlayerService);
    const playContentSpy = spyOn(playerService, 'playContent');
    spyOn(courseService, 'findEnrolledCourses').and.returnValue({
      onGoingBatchCount: 2,
      expiredBatchCount: 0
    });
    component.playContent({ data: {} });
    expect(playContentSpy).not.toHaveBeenCalled();
    expect(component.showBatchInfo).toBeTruthy();
  });

  it('should call hoverActionClicked for DOWNLOAD ', () => {
    Response.hoverActionsData['hover'] = {
      'type': 'download',
      'label': 'Download',
      'disabled': false
    };
    Response.hoverActionsData['data'] = Response.hoverActionsData.content;
    spyOn(component, 'logTelemetry');
    spyOn(component, 'downloadContent').and.callThrough();
    component.hoverActionClicked(Response.hoverActionsData);
    expect(component.downloadContent).toHaveBeenCalledWith(component.downloadIdentifier);
    expect(component.logTelemetry).toHaveBeenCalledWith(component.contentData, 'download-collection');
    expect(component.showModal).toBeFalsy();
    expect(component.contentData).toBeDefined();
  });

  it('should call hoverActionClicked for Open ', () => {
    Response.hoverActionsData['hover'] = {
      'type': 'Open',
      'label': 'OPEN',
      'disabled': false
    };
    Response.hoverActionsData['data'] = Response.hoverActionsData.content;
    const route = TestBed.get(Router);
    route.url = '/explore-page?selectedTab=explore-page';
    spyOn(component, 'logTelemetry').and.callThrough();
    spyOn(component, 'playContent');
    component.hoverActionClicked(Response.hoverActionsData);
    expect(component.playContent).toHaveBeenCalledWith(Response.hoverActionsData);
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

  it('should set no Result message', () => {
    component.queryParams = { key: 'test' };
    component['setNoResultMessage']();
    expect(component.noResultMessage).toEqual({
      title: 'Your search for - "test" did not match any content',
      subTitle: 'Your board is yet to add more books. Tap the button to see more books and content on {instance}',
      buttonText: 'See more books and contents',
      showExploreContentButton: false
    });
  });

  it('should call download content with error ', () => {
    const contentManagerService = TestBed.get(ContentManagerService);
    spyOn(contentManagerService, 'startDownload').and.returnValue(throwError({ error: { params: { err: 'ERROR' } } }));
    component.ngOnInit();
    component.downloadContent('123');
    expect(component.showDownloadLoader).toBeFalsy();
  });

  it('should call playContent', () => {
    const playerService = TestBed.get(PlayerService);
    spyOn(playerService, 'playContent');
    component.playContent({data: {identifier: '123'}});
    expect(playerService.playContent).toHaveBeenCalled();
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

  it('should fetch content and remove course from facets for desktop app', fakeAsync(() => {
    const utilService = TestBed.get(UtilService);
    utilService._isDesktopApp = true;
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{ index: 0, name: 'NCRT' }, { index: 1, name: 'CBSC' }] }]);
    tick(100);
    expect(component.contentList.length).toEqual(2);
  }));

  it('should call the content search api with a predefined request body', () => {
    /** Arrange */
    component.hashTagId = 'g7d8dddidjd8d9d7d';
    component.queryParams = {
      mediaType: ['text/html'],
      utm_source: 'Tara',
      key: 'comic-book',
      sortType: 'asc',
      appliedFilters: [{ code: 'board', range: [{ index: 0, name: 'NCRT' }, { index: 1, name: 'CBSC' }] }],
      softConstraints: '',
      selectedTab: 'explore',
    };
    component.globalSearchFacets = [];
    component.allTabData = {
      search: {
        fields: '',
        limit: 20,
        filters: {
          mimeType: {name: 'text/html', value: 'text/html'},
          primaryCategory: 'course'
        }
      }
    };

    const option = {
      filters: {
        channel: 'g7d8dddidjd8d9d7d',
        primaryCategory: 'course',
        mimeType: undefined
      },
      fields: '',
      limit: 20,
      pageNumber: 1,
      query: 'comic-book',
      mode: 'soft',
      softConstraints: {},
      facets: [],
      params: {
        orgdetails: 'orgName,email'
      }
    };

    /** Act */
    component['fetchContents']();

    /** Assert */
    expect(searchService.contentSearch).toHaveBeenCalledWith(option);
  });
});
