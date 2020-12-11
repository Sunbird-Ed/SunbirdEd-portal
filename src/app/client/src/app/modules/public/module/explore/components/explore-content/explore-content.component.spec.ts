import { ExploreContentComponent } from './explore-content.component';
import { BehaviorSubject, throwError, of } from 'rxjs';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { SearchService, OrgDetailsService, CoreModule, UserService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import * as _ from 'lodash-es';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response } from './explore-content.component.spec.data';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { ContentManagerService } from '../../../offline/services';
import { PublicPlayerService } from '@sunbird/public';

describe('ExploreContentComponent', () => {
  let component: ExploreContentComponent;
  let fixture: ComponentFixture<ExploreContentComponent>;
  let toasterService, userService, searchService, orgDetailsService, activatedRoute;
  const mockSearchData: any = Response.successData;
  let sendOrgDetails = true;
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
      'emsg': {},
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
    queryParamsMock = new BehaviorSubject<any>({ subject: ['English'] });
    paramsMock = new BehaviorSubject<any>({ pageNumber: '1' });
    get params() { return this.paramsMock.asObservable(); }
    get queryParams() { return this.queryParamsMock.asObservable(); }
    snapshot = {
      params: { slug: 'ap' },
      data: {
        telemetry: { env: 'resource', pageid: 'resource-search', type: 'view', subtype: 'paginate' }
      }
    };
    public changeQueryParams(queryParams) { this.queryParamsMock.next(queryParams); }
    public changeParams(params) { this.paramsMock.next(params); }
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot()],
      declarations: [ExploreContentComponent],
      providers: [PublicPlayerService, { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub }, ContentManagerService,
        { provide: ActivatedRoute, useClass: FakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreContentComponent);
    component = fixture.componentInstance;
    toasterService = TestBed.get(ToasterService);
    userService = TestBed.get(UserService);
    searchService = TestBed.get(SearchService);
    orgDetailsService = TestBed.get(OrgDetailsService);
    activatedRoute = TestBed.get(ActivatedRoute);
    sendOrgDetails = true;
    sendSearchResult = true;
    sendFormResult = true;
    spyOn(orgDetailsService, 'getOrgDetails').and.callFake((options) => {
      if (sendOrgDetails) {
        return of({ hashTagId: '123' });
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
  });
  it('should emit filter data when getFilters is called with data', () => {
    spyOn(component.dataDrivenFilterEvent, 'emit');
    component.getFilters([{ code: 'board', range: [{ index: 0, name: 'NCRT' }, { index: 1, name: 'CBSC' }] }]);
    expect(component.dataDrivenFilterEvent.emit).toHaveBeenCalledWith({ board: 'NCRT' });
  });
  it('should emit filter data when getFilters is called with no data', () => {
    spyOn(component.dataDrivenFilterEvent, 'emit');
    component.getFilters([]);
    expect(component.dataDrivenFilterEvent.emit).toHaveBeenCalledWith({});
  });
  it('should fetch hashTagId from API and filter details from data driven filter component', () => {
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{ index: 0, name: 'NCRT' }, { index: 1, name: 'CBSC' }] }]);
    expect(component.hashTagId).toEqual('123');
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT' });
  });
  it('should navigate to landing page if fetching org details fails and data driven filter dint returned data', () => {
    sendOrgDetails = false;
    component.ngOnInit();
    expect(component.router.navigate).toHaveBeenCalledWith(['']);
  });
  it('should navigate to landing page if fetching org details fails and data driven filter returns data', () => {
    sendOrgDetails = false;
    component.ngOnInit();
    component.getFilters([]);
    expect(component.router.navigate).toHaveBeenCalledWith(['']);
  });
  it('should fetch content after getting hashTagId and filter data and set carouselData if api returns data', fakeAsync(() => {
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{ index: 0, name: 'NCRT' }, { index: 1, name: 'CBSC' }] }]);
    tick(100);
    expect(component.hashTagId).toEqual('123');
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT' });
    expect(component.showLoader).toBeFalsy();
    expect(component.contentList.length).toEqual(1);
  }));
  it('should fetch content only once for when component displays content for the first time', fakeAsync(() => {
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{ index: 0, name: 'NCRT' }, { index: 1, name: 'CBSC' }] }]);
    tick(100);
    expect(component.hashTagId).toEqual('123');
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT' });
    expect(component.showLoader).toBeFalsy();
    expect(component.contentList.length).toEqual(1);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(1);
  }));
  it('should fetch content once when queryParam changes after initial content has been displayed', fakeAsync(() => {
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{ index: 0, name: 'NCRT' }, { index: 1, name: 'CBSC' }] }]);
    tick(100);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(1);
    activatedRoute.changeQueryParams({ board: ['NCRT'] });
    tick(100);
    expect(component.contentList.length).toEqual(1);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(2);
  }));
  it('should fetch content once when param changes after initial content has been displayed', fakeAsync(() => {
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{ index: 0, name: 'NCRT' }, { index: 1, name: 'CBSC' }] }]);
    tick(100);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(1);
    activatedRoute.changeParams({ pageNumber: 2 });
    tick(100);
    expect(component.contentList.length).toEqual(1);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(2);
  }));
  it('should fetch content once when both queryParam and params changes after initial content has been displayed', fakeAsync(() => {
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{ index: 0, name: 'NCRT' }, { index: 1, name: 'CBSC' }] }]);
    tick(100);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(1);
    activatedRoute.changeQueryParams({ board: ['NCRT'] });
    activatedRoute.changeParams({ pageNumber: 2 });
    tick(100);
    expect(component.contentList.length).toEqual(1);
    expect(searchService.contentSearch).toHaveBeenCalledTimes(2);
  }));
  it('should trow error when fetching content fails even after getting hashTagId and filter data', fakeAsync(() => {
    sendSearchResult = false;
    spyOn(toasterService, 'error').and.callFake(() => { });
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{ index: 0, name: 'NCRT' }, { index: 1, name: 'CBSC' }] }]);
    tick(100);
    expect(component.hashTagId).toEqual('123');
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT' });
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


  it('should call updateDownloadStatus when updateCardData is called', () => {
    const playerService = TestBed.get(PublicPlayerService);
    spyOn(playerService, 'updateDownloadStatus');
    component.contentList = Response.successData.result.content;
    component.updateCardData(Response.download_list);
    expect(playerService.updateDownloadStatus).toHaveBeenCalled();
  });
  it('should redo layout on render', () => {
    component.layoutConfiguration = {};
    component.ngOnInit();
    component.redoLayout();
    component.layoutConfiguration = null;
    component.redoLayout();
  });
  it('Should call searchservice -contenttypes and get error', fakeAsync(() => {
    sendFormResult = false;
    spyOn(toasterService, 'error').and.callFake(() => { });
    component.ngOnInit();
    component.getFilters([{ code: 'board', range: [{ index: 0, name: 'NCRT' }, { index: 1, name: 'CBSC' }] }]);
    tick(100);
    expect(component.hashTagId).toEqual('123');
    expect(component.dataDrivenFilters).toEqual({ board: 'NCRT' });
    expect(component.showLoader).toBeFalsy();
    expect(component.contentList.length).toEqual(1);
    expect(toasterService.error).toHaveBeenCalled();
  }));

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

  it('should call download content with error ', () => {
    const contentManagerService = TestBed.get(ContentManagerService);
    spyOn(contentManagerService, 'startDownload').and.returnValue(throwError({ error: { params: { err: 'ERROR' } } }));
    component.ngOnInit();
    component.downloadContent('123');
    expect(component.showDownloadLoader).toBeFalsy();
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

  it('should call listenLanguageChange', () => {
    component.isDesktopApp = true;
    component.contentList = [{ name: 'test' }];
    spyOn(component, 'addHoverData');
    spyOn<any>(component, 'setNoResultMessage');
    component['listenLanguageChange']();
    expect(component.addHoverData).toHaveBeenCalled();
    expect(component['setNoResultMessage']).toHaveBeenCalled();
  });

  it('should call playContent', () => {
    const publicPlayerService = TestBed.get(PublicPlayerService);
    spyOn(publicPlayerService, 'playContent');
    component.playContent({});
    expect(publicPlayerService.playContent).toHaveBeenCalled();
  });
});
