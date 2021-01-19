import { SlickModule } from 'ngx-slick';
import { BehaviorSubject, throwError, of, of as observableOf } from 'rxjs';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ResourceService, ToasterService, SharedModule, LayoutService, UtilService } from '@sunbird/shared';
import { SearchService, OrgDetailsService, CoreModule, UserService, FormService, CoursesService, PlayerService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PublicPlayerService } from '@sunbird/public';
import { SuiModule } from 'ng2-semantic-ui';
import * as _ from 'lodash-es';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RESPONSE } from './explore-page.component.spec.data';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { ExplorePageComponent } from './explore-page.component';
import { ContentSearchService } from '@sunbird/content-search';
import { configureTestSuite } from '@sunbird/test-util';
import { ContentManagerService } from '../../../public/module/offline/services';

describe('ExplorePageComponent', () => {
  let component: ExplorePageComponent;
  let fixture: ComponentFixture<ExplorePageComponent>;
  let toasterService, userService, pageApiService, orgDetailsService;
  const mockPageSection: any = RESPONSE.searchResult;
  let sendOrgDetails = true;
  let sendPageApi = true;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }
  const resourceBundle = {
    'messages': {
      'stmsg': {
        'm0009': 'error',
        'm0140': 'DOWNLOADING',
        'm0138': 'FAILED',
        'm0139': 'DOWNLOADED',
      },
      'emsg': {},
      'fmsg': {
        'm0027': 'Something went wrong',
        'm0090': 'Could not download. Try again later',
        'm0091': 'Could not copy content. Try again later',
        'm0004': 'Could not fetch data, try again later...',
        'm0051': 'Something went wrong, try again later'
      }
    },
    frmelmnts: {
      lbl: {
        fetchingContentFailed: 'Fetching content failed. Please try again later.',
        noBookfoundTitle: 'Board is adding courses',
        title: 'title',
        buttonText: 'Board is adding TV class',
        noContentfoundTitle: 'Board is adding content',
        noContentfoundSubTitle: 'Your board is yet to add more content. Click the button below to explore other content on {instance}',
        noContentfoundButtonText: 'Explore more content',
        desktop: {
          yourSearch: 'Your search for - "{key}"',
          notMatchContent: 'did not match any content'
        }
      },

    },
    languageSelected$: of({})
  };
  class FakeActivatedRoute {
    queryParamsMock = new BehaviorSubject<any>({ subject: ['English'], selectedTab: 'textbook' });
    params = of({});
    get queryParams() { return this.queryParamsMock.asObservable(); }
    snapshot = {
      params: { slug: 'ap' },
      data: {
        telemetry: { env: 'explore', pageid: 'explore', type: 'view', subtype: 'paginate' }
      },
      queryParams: {}
    };
    public changeQueryParams(queryParams) { this.queryParamsMock.next(queryParams); }
    public changeSnapshotQueryParams(queryParams) { this.snapshot.queryParams = queryParams; }
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot(), SlickModule],
      declarations: [ExplorePageComponent],
      providers: [PublicPlayerService, { provide: ResourceService, useValue: resourceBundle },
        FormService, ContentManagerService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: FakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorePageComponent);
    component = fixture.componentInstance;
    toasterService = TestBed.get(ToasterService);
    userService = TestBed.get(UserService);
    pageApiService = TestBed.get(SearchService);
    orgDetailsService = TestBed.get(OrgDetailsService);
    sendOrgDetails = true;
    sendPageApi = true;
    spyOn(orgDetailsService, 'getOrgDetails').and.callFake((options) => {
      if (sendOrgDetails) {
        return of({ hashTagId: '123' });
      }
      return throwError({});
    });
    spyOn(pageApiService, 'contentSearch').and.callFake((options) => {
      if (sendPageApi) {
        return of(mockPageSection);
      }
      return throwError({});
    });
  });
  it('should get channel id if slug is not available', done => {
    spyOn(component, 'isUserLoggedIn').and.returnValue(false);
    const formService = TestBed.get(FormService);
    spyOn(formService, 'getFormConfig').and.returnValue(observableOf(RESPONSE.mockCurrentPageData));
    const contentSearchService = TestBed.get(ContentSearchService);
    component.activatedRoute.snapshot.params.slug = '';
    spyOn<any>(orgDetailsService, 'getCustodianOrgDetails').and.returnValue(of(RESPONSE.withoutSlugGetChannelResponse));
    spyOn<any>(contentSearchService, 'initialize').and.returnValues(of({}));
    component['fetchChannelData']().subscribe(_ => {
      expect(component.initFilter).toBeTruthy();
      done();
    });
  });

  it('should get channel id if slug is available', done => {
    spyOn(component, 'isUserLoggedIn').and.returnValue(false);
    const formService = TestBed.get(FormService);
    spyOn(formService, 'getFormConfig').and.returnValue(observableOf(RESPONSE.mockCurrentPageData));
    const contentSearchService = TestBed.get(ContentSearchService);
    component.activatedRoute.snapshot.params.slug = 'tn';
    spyOnProperty(userService, 'slug', 'get').and.returnValue('tn');
    sendOrgDetails = true;
    spyOn<any>(contentSearchService, 'initialize').and.returnValues(of({}));
    component['fetchChannelData']().subscribe(_ => {
      expect(component.initFilter).toBeTruthy();
      done();
    });
  });

  it('should show error if contentSearchService is not initialized and slug is available', done => {
    spyOn<any>(component, 'getChannelId').and.returnValue(of({ channelId: {}, custodianOrg: {} }));
    spyOn<any>(component, 'getFormConfig').and.returnValue(throwError({}));
    spyOn<any>(toasterService, 'error');
    spyOn(component['navigationhelperService'], 'goBack');
    component['fetchChannelData']().subscribe(null, err => {
      expect(toasterService.error).toHaveBeenCalledWith('Fetching content failed. Please try again later.');
      expect(component['navigationhelperService'].goBack).toHaveBeenCalled();
      done();
    });
  });

  it('should fetch the filters and set to default values', () => {
    const formService = TestBed.get(FormService);
    component.formData = RESPONSE.formData;
    spyOn(formService, 'getFormConfig').and.returnValue(observableOf(RESPONSE.mockCurrentPageData));
    const fetchContentsSpy = spyOn<any>(component['fetchContents$'], 'next');
    component.getFilters({ filters: RESPONSE.selectedFilters, status: 'FETCHED' });
    expect(component.showLoader).toBe(true);
    expect(component.apiContentList).toEqual([]);
    expect(component.pageSections).toEqual([]);
    expect(fetchContentsSpy).toHaveBeenCalled();
  });

  it('should navigate to search page if user is not logged in', () => {
    spyOn(component, 'isUserLoggedIn').and.returnValue(false);
    component.selectedFilters = RESPONSE.selectedFilters;
    component.pageTitle = RESPONSE.selectedFilters.pageTitle;
    const router = TestBed.get(Router);
    component.navigateToExploreContent();
    expect(router.navigate).toHaveBeenCalledWith(['explore', 1], {
      queryParams: {
        ...component.selectedFilters,
        pageTitle: RESPONSE.selectedFilters.pageTitle,
        appliedFilters: false,
        softConstraints: JSON.stringify({ badgeAssertions: 100, channel: 99, gradeLevel: 98, medium: 97, board: 96 })
      }
    });
  });

  it('should navigate to search page if user is logged in', () => {
    spyOn(component, 'isUserLoggedIn').and.returnValue(true);
    component.selectedFilters = RESPONSE.selectedFilters;
    const router = TestBed.get(Router);
    component.navigateToExploreContent();
    expect(router.navigate).toHaveBeenCalledWith(['search/Library', 1], {
      queryParams: {
        ...component.selectedFilters,
        appliedFilters: false,
      }
    });
  });

  it('should play content', () => {
    const publicPlayerService = TestBed.get(PublicPlayerService);
    spyOn<any>(publicPlayerService, 'playContent');
    spyOn(component, 'getInteractEdata');
    component.playContent(RESPONSE.playContentEvent, 'test');
    expect(publicPlayerService.playContent).toHaveBeenCalledWith(RESPONSE.playContentEvent);
    expect(component.getInteractEdata).toHaveBeenCalled();
  });


  it('should call telemetry.interact()', () => {
    spyOn(component.telemetryService, 'interact');
    const data = {
      cdata: [{ type: 'card', id: 'course' }],
      edata: { id: 'test' },
      object: {},
    };
    const cardClickInteractData = {
      context: {
        cdata: data.cdata,
        env: 'explore',
      },
      edata: {
        id: data.edata.id,
        type: 'click',
        pageid: 'explore'
      },
      object: data.object
    };
    component.getInteractEdata(data);
    expect(component.telemetryService.interact).toHaveBeenCalledWith(cardClickInteractData);
  });

  it('should call getInteractEdata() from navigateToCourses', () => {
    const event = { data: { title: 'test', contents: [{ identifier: '1234' }] } };
    const data = {
      cdata: [{ type: 'library-courses', id: 'test' }],
      edata: { id: 'course-card' },
      object: {},
    };
    spyOn(component, 'getInteractEdata');
    component.navigateToCourses(event);
    expect(component.getInteractEdata).toHaveBeenCalledWith(data);
    expect(component['router'].navigate).toHaveBeenCalledWith(['explore-course/course', '1234']);
  });

  it('should call explore/list/curriculum-courses from navigateToCourses if user is not logged in', () => {
    const event = { data: { title: 'test', contents: [{ identifier: '1234' }, { identifier: '23456' }] } };
    component.navigateToCourses(event);
    expect(component['router'].navigate).toHaveBeenCalledWith(['explore/list/curriculum-courses'], {
      queryParams: { title: 'test' }
    });
    expect(component['searchService'].subjectThemeAndCourse).toEqual(event.data);
  });

  it('should call resources/curriculum-courses from navigateToCourses if user is logged in', () => {
    spyOn(component, 'isUserLoggedIn').and.returnValue(true);
    const event = { data: { title: 'test', contents: [{ identifier: '1234' }, { identifier: '23456' }] } };
    component.navigateToCourses(event);
    expect(component['router'].navigate).toHaveBeenCalledWith(['resources/curriculum-courses'], {
      queryParams: { title: 'test' }
    });
    expect(component['searchService'].subjectThemeAndCourse).toEqual(event.data);
  });

  it('should open course-details page with the enrolled batch when user is loggedIn', () => {
    spyOn(component, 'isUserLoggedIn').and.returnValue(true);
    const coursesService = TestBed.get(CoursesService);
    const playerService = TestBed.get(PlayerService);
    spyOn(playerService, 'playContent');
    spyOn(coursesService, 'findEnrolledCourses').and.returnValue({
      onGoingBatchCount: 1, expiredBatchCount: 0, openBatch: {
        ongoing: [{ batchId: 15332323 }]
      }, inviteOnlyBatch: {}
    });
    const event = { data: { title: 'test', contents: [{ identifier: '1234' }] } };
    component.navigateToCourses(event);
    expect(playerService.playContent).toHaveBeenCalled();
  });

  it('should open course-details page with the invited batch', () => {
    spyOn(component, 'isUserLoggedIn').and.returnValue(true);
    const coursesService = TestBed.get(CoursesService);
    const playerService = TestBed.get(PlayerService);
    spyOn(playerService, 'playContent');
    spyOn(coursesService, 'findEnrolledCourses').and.returnValue({
      onGoingBatchCount: 1, expiredBatchCount: 0, openBatch: { ongoing: [] }, inviteOnlyBatch: { ongoing: [{ batchId: 15332323 }] }
    });
    const event = { data: { title: 'test', contents: [{ identifier: '1234' }] } };
    component.navigateToCourses(event);
    expect(playerService.playContent).toHaveBeenCalled();
  });

  it('Should show error message when multiple ongoing batches are present', () => {
    spyOn(component, 'isUserLoggedIn').and.returnValue(true);
    const coursesService = TestBed.get(CoursesService);
    const playerService = TestBed.get(PlayerService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(playerService, 'playContent');
    spyOn(toasterService, 'error');
    spyOn(coursesService, 'findEnrolledCourses').and.returnValue({
      onGoingBatchCount: 2, expiredBatchCount: 0, openBatch: { ongoing: [] }, inviteOnlyBatch: { ongoing: [] }
    });
    const event = { data: { title: 'test', contents: [{ identifier: '1234' }] } };
    component.navigateToCourses(event);
    expect(toasterService.error).toHaveBeenCalledWith('Something went wrong, try again later');
  });


  it('should redo layout on render', () => {
    component.layoutConfiguration = {};
    component.ngOnInit();
    component.redoLayout();
    component.layoutConfiguration = null;
    component.redoLayout();
  });

  xit('should call the getFilter Method and set audience type as filters', () => {
    const data = {
      filters: {},
      status: 'NotFetching'
    };
    spyOn(component, 'getPageData').and.returnValues(RESPONSE.mockCurrentPageData);
    spyOn(localStorage, 'getItem').and.returnValue('teacher');
    component.getFilters(data);
    expect(component.selectedFilters).toEqual({ audience: ['Teacher'] });
  });

  it('should set no Result message', () => {
    component['setNoResultMessage']();
    expect(component.noResultMessage).toEqual({
      title: 'Board is adding content',
      subTitle: 'Your board is yet to add more content. Click the button below to explore other content on {instance}',
      buttonText: 'Explore more content',
      showExploreContentButton: true
    });
  });

  it('should set no Result message ', () => {
    const activatedRoute = TestBed.get(ActivatedRoute);
    activatedRoute.changeSnapshotQueryParams({ subject: ['English'], key: 'test', selectedTab: 'all' });
    component['setNoResultMessage']();
    expect(component.noResultMessage).toEqual({
      title: 'Your search for - "test" did not match any content',
      subTitle: 'Board is adding courses',
      buttonText: 'Board is adding courses',
      showExploreContentButton: true
    });
  });

  it('should init layout and call redoLayout method', done => {
    const layoutService = TestBed.get(LayoutService);
    spyOn(layoutService, 'switchableLayout').and.returnValue(of({ layout: {} }));
    spyOn(component, 'redoLayout');
    component['initLayout']().subscribe(res => {
      expect(component.layoutConfiguration).toBeDefined();
      expect(component.redoLayout).toHaveBeenCalled();
      done();
    });
  });

  xit('should fetch contents', done => {
    component['fetchContents']().subscribe(res => {
      expect(component.showLoader).toBeFalsy();
      expect(component.apiContentList).toBeDefined();
      expect(component.pageSections).toBeDefined();
      done();
    });
    component['fetchContents$'].next(RESPONSE.mockCurrentPageData);
  });

  it('should call hoverActionClicked for DOWNLOAD ', () => {
    RESPONSE.hoverActionsData['hover'] = {
      'type': 'download',
      'label': 'Download',
      'disabled': false
    };
    RESPONSE.hoverActionsData['data'] = RESPONSE.hoverActionsData.content;
    spyOn(component, 'logTelemetry');
    spyOn(component, 'downloadContent').and.callThrough();
    component.hoverActionClicked(RESPONSE.hoverActionsData);
    expect(component.downloadContent).toHaveBeenCalledWith(component.downloadIdentifier);
    expect(component.logTelemetry).toHaveBeenCalledWith(component.contentData, 'download-collection');
    expect(component.showModal).toBeFalsy();
    expect(component.contentData).toBeDefined();
  });
  it('should call listenLanguageChange', () => {
    component.isDesktopApp = true;
    component.pageSections = [{ name: 'test' }];
    spyOn(component, 'addHoverData');
    spyOn<any>(component, 'setNoResultMessage');
    component['listenLanguageChange']();
    expect(component.addHoverData).toHaveBeenCalled();
    expect(component['setNoResultMessage']).toHaveBeenCalled();
  });


  it('should call hoverActionClicked for Open ', () => {
    RESPONSE.hoverActionsData['hover'] = {
      'type': 'Open',
      'label': 'OPEN',
      'disabled': false
    };
    RESPONSE.hoverActionsData['data'] = RESPONSE.hoverActionsData.content;
    const route = TestBed.get(Router);
    route.url = '/explore-page?selectedTab=explore-page';
    spyOn(component, 'logTelemetry').and.callThrough();
    spyOn(component, 'playContent');
    component.hoverActionClicked(RESPONSE.hoverActionsData);
    expect(component.playContent).toHaveBeenCalledWith(RESPONSE.hoverActionsData);
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

  it('should call addHoverData', () => {
    component.contentDownloadStatus = { 'do_id': true };
    component.pageSections = [{ name: 'English', contents: [{ identifier: 'do_id' }] }];
    const utilService = TestBed.get(UtilService);
    spyOn(utilService, 'addHoverData');
    component.addHoverData();
    expect(utilService.addHoverData).toHaveBeenCalled();
  });

  it('should call setTelemetryData', () => {
    component['setTelemetryData']();
    expect(component.exploreMoreButtonEdata).toBeDefined();
    expect(component.telemetryImpression).toBeDefined();
  });

  it('should called ngAfterViewInit', fakeAsync(() => {
    spyOn<any>(component, 'setTelemetryData');
    component.ngAfterViewInit();
    tick(1);
    expect(component['setTelemetryData']).toHaveBeenCalled();
  }));

  it('should return slideConfig', () => {
    const response = component.slideConfig;
    expect(response).toBeDefined();
  });

  it('should update cards on scroll', () => {
    component.pageSections.length = 5;
    component.apiContentList.length = 50;
    spyOn(component, 'addHoverData');
    const scrollEvent = document.createEvent('CustomEvent'); // MUST be 'CustomEvent'
    scrollEvent.initCustomEvent('scroll', false, false, null);

    const expectedLeft = 123;
    const expectedTop = 6000;

    document.body.style.minHeight = '9000px';
    document.body.style.minWidth = '9000px';
    scrollTo(expectedLeft, expectedTop);
    dispatchEvent(scrollEvent);
    expect(component.addHoverData).toHaveBeenCalled();
  });

  it('should call initConfiguration', () => {
    const layoutService = TestBed.get(LayoutService);
    const utilService = TestBed.get(UtilService);
    const userService = TestBed.get(UserService);
    userService.anonymousUserPreference = {
      framework: {
        'id': '01268904781886259221',
        'board': 'State (Maharashtra)',
        'medium': [
          'English',
          'Hindi'
        ],
        'gradeLevel': [
          'Class 3',
          'Class 4'
        ]
      }
    };
    spyOn(layoutService, 'initlayoutConfig');
    spyOn(component, 'redoLayout');
    utilService._isDesktopApp = true;
    component['initConfiguration']();
    expect(layoutService.initlayoutConfig).toHaveBeenCalled();
    expect(component.redoLayout).toHaveBeenCalled();
  });
});
