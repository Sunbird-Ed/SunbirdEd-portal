import { SlickModule } from 'ngx-slick';
import { BehaviorSubject, throwError, of, of as observableOf } from 'rxjs';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ResourceService, ToasterService, SharedModule, LayoutService, UtilService } from '@sunbird/shared';
import { SearchService, OrgDetailsService, CoreModule, UserService, FormService, CoursesService, PlayerService, ObservationUtilService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PublicPlayerService } from '@sunbird/public';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RESPONSE, categoryData, EventPillData } from './explore-page.component.spec.data';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { ExplorePageComponent } from './explore-page.component';
import { ContentSearchService } from '@sunbird/content-search';
import { configureTestSuite } from '@sunbird/test-util';
import { ContentManagerService } from '../../../public/module/offline/services';
import { CacheService } from 'ng2-cache-service';
import { ProfileService } from '@sunbird/profile';
import { SegmentationTagService } from '../../../core/services/segmentation-tag/segmentation-tag.service';
import {ObservationModule} from '../../../observation/observation.module';

// Old One
xdescribe('ExplorePageComponent', () => {
  let component: ExplorePageComponent;
  let fixture: ComponentFixture<ExplorePageComponent>;
  let toasterService, userService, pageApiService, orgDetailsService, cacheService, segmentationTagService, observationUtilService;
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
      },
      'smsg': {
        'm0058': 'Success'
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
        },
        board: 'Board',
        browseBy: 'Browse by',
        targetCategory: 'Category',
        browseOther: 'Browse Other'
      }
    },
    tbk: {
      trk: { frmelmnts: { lbl: { mytrainings: 'My Digital Textbook' } } }
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
      imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot(), SlickModule, ObservationModule],
      declarations: [ExplorePageComponent],
      providers: [PublicPlayerService, { provide: ResourceService, useValue: resourceBundle },
        FormService, ProfileService, ContentManagerService, TelemetryService, ObservationUtilService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: FakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorePageComponent);
    component = fixture.componentInstance;
    toasterService = TestBed.inject(ToasterService);
    userService = TestBed.inject(UserService);
    pageApiService = TestBed.inject(SearchService);
    orgDetailsService = TestBed.inject(OrgDetailsService);
    cacheService = TestBed.inject(CacheService);
    segmentationTagService = TestBed.inject(SegmentationTagService);
    observationUtilService = TestBed.inject(ObservationUtilService);
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
      return of(RESPONSE.searchResult);
    });
  });
  xit('should get channel id if slug is not available', done => {
    spyOn(component, 'isUserLoggedIn').and.returnValue(false);
    const formService:any = TestBed.inject(FormService);
    spyOn(formService, 'getFormConfig').and.returnValue(observableOf(RESPONSE.mockCurrentPageData));
    const contentSearchService = TestBed.inject(ContentSearchService);
    component.activatedRoute.snapshot.params.slug = '';
    spyOn<any>(orgDetailsService, 'getCustodianOrgDetails').and.returnValue(of(RESPONSE.withoutSlugGetChannelResponse));
    spyOn<any>(contentSearchService, 'initialize').and.returnValues(of({}));
    component['fetchChannelData']().subscribe(_ => {
      expect(component.initFilter).toBeTruthy();
      done();
    });
  });

  xit('should get channel id if slug is available', done => {
    spyOn(component, 'isUserLoggedIn').and.returnValue(false);
    const formService:any = TestBed.inject(FormService);
    spyOn(formService, 'getFormConfig').and.returnValue(observableOf(RESPONSE.mockCurrentPageData));
    spyOn(localStorage, 'getItem').and.returnValue('{\'framework\':{\'board\':\'CBSE\'}}');
    const contentSearchService = TestBed.inject(ContentSearchService);
    component.activatedRoute.snapshot.params.slug = 'tn';
    spyOnProperty(userService, 'slug', 'get').and.returnValue('tn');
    sendOrgDetails = true;
    spyOn<any>(contentSearchService, 'initialize').and.returnValues(of({}));
    component['fetchChannelData']().subscribe(_ => {
      expect(component.initFilter).toBeTruthy();
      expect(component.defaultFilters).toBe({ 'board': 'CBSE' });
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
    const formService:any = TestBed.inject(FormService);
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
    const router = TestBed.inject(Router);
    component.navigateToExploreContent();
    expect(router.navigate).toHaveBeenCalledWith(['explore', 1], {
      queryParams: {
        ...component.selectedFilters,
        pageTitle: undefined,
        appliedFilters: false,
        softConstraints: JSON.stringify({ badgeAssertions: 100, channel: 99, gradeLevel: 98, medium: 97, board: 96 })
      }
    });
  });

  it('should navigate to search page if user is logged in', () => {
    spyOn(component, 'isUserLoggedIn').and.returnValue(true);
    component.selectedFilters = RESPONSE.selectedFilters;
    const router = TestBed.inject(Router);
    component.navigateToExploreContent();
    expect(router.navigate).toHaveBeenCalledWith(['search/Library', 1], {
      queryParams: {
        ...component.selectedFilters,
        appliedFilters: false,
      }
    });
  });

  it('should play content', () => {
    const publicPlayerService:any = TestBed.inject(PublicPlayerService);
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
    const coursesService:any = TestBed.inject(CoursesService);
    const playerService:any = TestBed.inject(PlayerService);
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
    const coursesService:any = TestBed.inject(CoursesService);
    const playerService:any = TestBed.inject(PlayerService);
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
    const coursesService:any = TestBed.inject(CoursesService);
    const playerService:any = TestBed.inject(PlayerService);
    const toasterService:any = TestBed.inject(ToasterService);
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
    spyOn(component, 'getCurrentPageData').and.returnValue(RESPONSE.explorePageData);
    const fetchContentsSpy = spyOn<any>(component['fetchContents$'], 'next');
    component.ngOnInit();
    component.redoLayout();
    component.layoutConfiguration = null;
    component.redoLayout();
    expect(component.isFilterEnabled).toBe(true);
    component['fetchContents$'].next(RESPONSE.explorePageData);
    expect(fetchContentsSpy).toHaveBeenCalled();
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
    const activatedRoute:any = TestBed.inject(ActivatedRoute);
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
    const layoutService:any = TestBed.inject(LayoutService);
    spyOn(layoutService, 'switchableLayout').and.returnValue(of({ layout: {} }));
    spyOn(component, 'redoLayout');
    component['initLayout']().subscribe(res => {
      expect(component.layoutConfiguration).toBeDefined();
      expect(component.redoLayout).toHaveBeenCalled();
      done();
    });
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
    const route = TestBed.inject(Router);
    route['url' as any] = '/explore-page?selectedTab=explore-page';
    spyOn(component, 'logTelemetry').and.callThrough();
    spyOn(component, 'playContent');
    component.hoverActionClicked(RESPONSE.hoverActionsData);
    expect(component.playContent).toHaveBeenCalledWith(RESPONSE.hoverActionsData);
    expect(component.logTelemetry).toHaveBeenCalledWith(component.contentData, 'play-content');
    expect(component.contentData).toBeDefined();
  });

  it('should call download content with success ', () => {
    const contentManagerService = TestBed.inject(ContentManagerService);
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
    const contentManagerService = TestBed.inject(ContentManagerService);
    spyOn(contentManagerService, 'startDownload').and.returnValue(throwError({ error: { params: { err: 'ERROR' } } }));
    component.ngOnInit();
    component.downloadContent('123');
    expect(component.showDownloadLoader).toBeFalsy();
  });

  it('should call addHoverData', () => {
    component.contentDownloadStatus = { 'do_id': true };
    component.pageSections = [{ name: 'English', contents: [{ identifier: 'do_id' }] }];
    const utilService:any = TestBed.inject(UtilService);
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
    const layoutService:any = TestBed.inject(LayoutService);
    const utilService:any = TestBed.inject(UtilService);
    const userService:any = TestBed.inject(UserService);
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


  it('should fetch contents', done => {
    sendPageApi = false;
    spyOn(component, 'redoLayout');
    component['fetchContents']().subscribe(res => {
      expect(component.showLoader).toBeFalsy();
      expect(component.apiContentList).toBeDefined();
      expect(component.pageSections).toBeDefined();
      expect(pageApiService.contentSearch).toHaveBeenCalled();
      expect(component.apiContentList.length).toBe(4);
      expect(component.redoLayout).toHaveBeenCalled();
      expect(component.isFilterEnabled).toBe(true);
      expect(component.svgToDisplay).toBe('courses-banner-img.svg');
      done();
    });
    component['fetchContents$'].next(RESPONSE.mockCurrentPageData);
  });

  it('should fetch explore page sections data', done => {
    sendPageApi = false;
    spyOn(component, 'redoLayout');
    spyOn(component, 'getCurrentPageData').and.returnValue(RESPONSE.explorePageData);
    spyOn(component, 'getExplorePageSections').and.callThrough();
    component['fetchContents']().subscribe(res => {
      expect(component.redoLayout).toHaveBeenCalled();
      expect(component.isFilterEnabled).toBe(false);
      expect(component.svgToDisplay).toBe('courses-banner-img.svg');
      done();
    });
    component['fetchContents$'].next(RESPONSE.explorePageData);
  });

  it('should fetch enrolled courses for logged in users', done => {
    const utilService:any = TestBed.inject(UtilService);
    const coursesService:any = TestBed.inject(CoursesService);
    spyOn(utilService, 'processContent').and.callThrough();
    spyOn(component, 'getCurrentPageData').and.returnValue({ contentType: 'course', filter: { isEnabled: false } });
    spyOn(component, 'isUserLoggedIn').and.returnValue(true);
    component['fetchEnrolledCoursesSection']().subscribe(res => {
      expect(utilService.processContent).toHaveBeenCalled();
      expect(component.enrolledSection).toBeDefined();
      expect(component.isFilterEnabled).toBe(true);
      done();
    }, err => {
      done();
    });
    coursesService['_enrolledCourseData$'].next({ enrolledCourses: RESPONSE.enrolledCourses, err: null });
  });

  it('should redirect to viewall page with queryparams', () => {
    const router = TestBed.inject(Router);
    const searchQuery = '{"request":{"query":"","filters":{"status":"1"},"limit":10,"sort_by":{"createdDate":"desc"}}}';
    spyOn(component, 'viewAll').and.callThrough();
    spyOn(component, 'getCurrentPageData').and.returnValue({});
    spyOn(cacheService, 'set').and.stub();
    router['url' as any] = '/explore-course?selectedTab=course';
    component.viewAll({ searchQuery: searchQuery, name: 'Featured-courses' });
    expect(router.navigate).toHaveBeenCalledWith(['/explore-course/view-all/Featured-courses', 1],
      { queryParams: { 'status': '1', 'defaultSortBy': '{"createdDate":"desc"}', 'exists': undefined, isContentSection: false
     }, state: { currentPageData: {}} });
    expect(cacheService.set).toHaveBeenCalled();
  });

  it('should generate visit telemetry impression event', () => {
    component.telemetryImpression = { edata: {} } as IImpressionEventInput;
    const event = {
      data: {
        metaData: {
          identifier: 'do_21307528604532736012398',
          contentType: 'Course'
        },
        section: 'Featured courses'
      }
    };
    component.prepareVisits(event);
    expect(component.telemetryImpression).toBeDefined();
  });

  describe('it should play content', () => {
    let publicPlayerService, courseService, playerService;
    beforeEach(() => {
      publicPlayerService = TestBed.inject(PublicPlayerService);
      courseService = TestBed.inject(CoursesService);
      playerService = TestBed.inject(PlayerService);
      spyOn(publicPlayerService, 'playContent').and.callThrough();
    });
    const event = {
      data: {
        metaData: {
          identifier: 'do_21307528604532736012398'
        }
      }
    };

    it('for non loggedin user', () => {
      component.playEnrolledContent(event);
      expect(publicPlayerService.playContent).toHaveBeenCalled();
    });

    describe('for loggedin user', () => {

      beforeEach(() => {
        spyOn(component, 'isUserLoggedIn').and.returnValue(true);
        spyOn(playerService, 'playContent');
      });

      it('with 0 expired and ongoing batches', () => {
        spyOn(courseService, 'findEnrolledCourses').and.returnValue({
          onGoingBatchCount: 0,
          expiredBatchCount: 0
        });
        component.playEnrolledContent(event);
        expect(playerService.playContent).toHaveBeenCalled();
        expect(component.showBatchInfo).toBeFalsy();
      });

      it('with 0 expired and ongoing batches', () => {
        const courseService:any = TestBed.inject(CoursesService);
        spyOn(courseService, 'findEnrolledCourses').and.returnValue({
          onGoingBatchCount: 2,
          expiredBatchCount: 0
        });
        component.playEnrolledContent(event);
        expect(playerService.playContent).not.toHaveBeenCalled();
        expect(component.showBatchInfo).toBeTruthy();
      });

      it('with 1 ongoing batches', () => {
        const courseService:any = TestBed.inject(CoursesService);
        spyOn(courseService, 'findEnrolledCourses').and.returnValue({
          onGoingBatchCount: 1,
          expiredBatchCount: 0,
          openBatch: { ongoing: [], expired: [] }, inviteOnlyBatch: { ongoing: [], expired: [] }
        });
        component.playEnrolledContent(event);
        expect(playerService.playContent).toHaveBeenCalled();
        expect(component.showBatchInfo).toBeFalsy();
      });

      it('with 1 expired batches', () => {
        const courseService:any = TestBed.inject(CoursesService);
        spyOn(courseService, 'findEnrolledCourses').and.returnValue({
          onGoingBatchCount: 0,
          expiredBatchCount: 1,
          openBatch: { ongoing: [], expired: [] }, inviteOnlyBatch: { ongoing: [], expired: [] }
        });
        component.playEnrolledContent(event);
        expect(playerService.playContent).toHaveBeenCalled();
        expect(component.showBatchInfo).toBeFalsy();
      });
    });

    it('should fetch query Params', done => {
      spyOn(component, 'isUserLoggedIn').and.returnValue(true);
      const prepareVisitsSpy = spyOn(component, 'prepareVisits');
      component['getQueryParams']().subscribe(res => {
        expect(component.queryParams).toEqual({ subject: ['English'], selectedTab: 'textbook' });
        expect(prepareVisitsSpy).toHaveBeenCalled();
        done();
      });
    });

    it('should get the section name based on current tab', () => {
      expect(component['getSectionName']('textbook')).toBe('tbk.trk.frmelmnts.lbl.mytrainings');
      expect(component['getSectionName']('course')).toBe('crs.trk.frmelmnts.lbl.mytrainings');
      expect(component['getSectionName']('tvProgram')).toBe('tvc.trk.frmelmnts.lbl.mytrainings');
      expect(component['getSectionName']('random')).toBe('frmelmnts.lbl.myEnrolledCollections');
    });

    it('should redirect to sectionViewAll page with queryparams', () => {
      const router = TestBed.inject(Router);
      const searchQuery = '{"request":{"query":"","filters":{"status":"1"},"limit":10,"sort_by":{"createdDate":"desc"}}}';
      spyOn(component, 'sectionViewAll').and.callThrough();
      component._currentPageData = RESPONSE.currentPageData;
      spyOn(component, 'getCurrentPageData').and.returnValue(RESPONSE.currentPageData);
      component.selectedFacet = {
        facet: 'se_boards',
        value: 'State (Tamil Nadu)'
      };
      component.queryParams = { id: 'sunbird', 'se_boards': ['State (Tamil Nadu)'] };
      spyOn(cacheService, 'set').and.stub();
      router['url' as any] = '/view-all/suggested';
      component.sectionViewAll();
      expect(router.navigate).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalled();
    });

    it('should update profile for non logged in users', () => {
      component.showEdit = true;
      spyOn(component, 'setUserPreferences').and.callThrough();
      spyOn(component, 'isUserLoggedIn').and.returnValue(false);
      const event = { board: ['CBSE'], medium: ['English'], gradeLevel: ['Class 1'], subject: ['English'] };
      component.userPreference = { framework: {} };
      component.updateProfile(event);
      // expect(component.setUserPreferences).toHaveBeenCalled();
    });

    it('should get selected tab', () => {
      const activatedRoute:any = TestBed.inject(ActivatedRoute);
      activatedRoute.changeSnapshotQueryParams({ subject: ['English'], key: 'test', selectedTab: 'explore' });
      const selectedTab = component.getSelectedTab();
      expect(selectedTab).toEqual('explore');
    });

    it('should prepare page sections data array', () => {
      component._currentPageData = RESPONSE.explorePageData;
      spyOn(component, 'getCurrentPageData').and.returnValue(RESPONSE.explorePageData);
      const sectionData = component.getExplorePageSections();
      sectionData.subscribe((data) => {
        expect(data.length).toEqual(2);
      });
    });

    it('should return section page title', () => {
      const sectionTitle = component.getSectionTitle('frmelmnts.lbl.board');
      expect(sectionTitle).toEqual('Browse by Board');
    });

    it('should return category title', () => {
      spyOn(component, 'getSectionCategoryTitle').and.callThrough();
      const getSectionCategoryTitle = component.getSectionCategoryTitle('frmelmnts.lbl.targetCategory');
      expect(getSectionCategoryTitle).toEqual('Browse Other Category');
    });

    it('should update profile for logged in users', () => {
      component.showEdit = true;
      spyOn(component, 'setUserPreferences').and.callThrough();
      spyOn(component, 'isUserLoggedIn').and.returnValue(true);
      const profileService:any = TestBed.inject(ProfileService);
      spyOn(profileService, 'updateProfile').and.returnValue(of({}));
      const toasterService:any = TestBed.inject(ToasterService);
      spyOn(toasterService, 'success');
      const event = { board: ['CBSE'], medium: ['English'], gradeLevel: ['Class 1'], subject: ['English'] };
      component.userPreference = { framework: {} };
      component.updateProfile(event);
      expect(profileService.updateProfile).toHaveBeenCalled();
      // expect(component.setUserPreferences).toHaveBeenCalled();
      expect(toasterService.success).toHaveBeenCalledWith(resourceBundle.messages.smsg.m0058);
    });

    it('should fetch contents with section', done => {
      sendPageApi = false;
      const utilService:any = TestBed.inject(UtilService);
      spyOn(component, 'redoLayout');
      spyOn(utilService, 'processCourseFacetData').and.returnValue({primaryCategory: [{name: 'etextbook', count: 3}]});
      component['fetchContents']().subscribe(res => {
        expect(component.showLoader).toBeFalsy();
        expect(component.apiContentList).toBeDefined();
        expect(component.pageSections).toBeDefined();
        expect(pageApiService.contentSearch).toHaveBeenCalled();
        expect(component.apiContentList.length).toBe(4);
        expect(component.redoLayout).toHaveBeenCalled();
        expect(component.isFilterEnabled).toBe(false);
        expect(component.svgToDisplay).toBe('courses-banner-img.svg');
        done();
      });
      component['fetchContents$'].next(RESPONSE.currentPageData);
    });

    it('call the converttoString method', () => {
      const convertedString = component.convertToString(['English', 'Tamil', 'Hindi', 'Kannada']);
      const convertedStringundefined = component.convertToString('English');
      expect(convertedString).toEqual('English, Tamil, Hindi, Kannada');
      expect(convertedStringundefined).toEqual(undefined);
    });

    it('call the handlePillSelect method', () => {
      const router = TestBed.inject(Router);
      const output = component.handlePillSelect({}, 'subject');
      expect(output).toEqual(undefined);
      component.handlePillSelect({ data: [{ value: { value: 'english', name: 'english' } }] }, 'subject');
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should show banner', () => {
      segmentationTagService.exeCommands = RESPONSE.bannerData;
      component.showorHideBanners();
      expect(component.displayBanner).toEqual(true);
    });

    it('should hide banner', () => {
      segmentationTagService.exeCommands = [];
      component.showorHideBanners();
      expect(component.displayBanner).toEqual(false);
    });

    it('should log the telemetry on banner click', () => {
      const data = {
          'code': 'banner_search',
          'ui': {
              'background': 'https://cdn.pixabay.com/photo/2015/10/29/14/38/web-1012467_960_720.jpg',
              'text': 'Sample Search'
          },
          'action': {
              'type': 'navigate',
              'subType': 'search',
              'params': {
                  'query': 'limited attempt course',
                  'filter': {
                      'offset': 0,
                      'filters': {
                          'audience': [],
                          'objectType': [
                              'Content'
                          ]
                      }
                  }
              }
          },
          'expiry': '1653031067'
      };
      const telemetryService:any = TestBed.inject(TelemetryService);
      spyOn(telemetryService, 'interact');
      const activatedRoute:any = TestBed.inject(ActivatedRoute);
      const telemetryData = {
        context: {
          env:  activatedRoute.snapshot.data.telemetry.env,
          cdata: [{
            id: 'banner_search',
            type: 'Banner'
          }]
        },
        edata: {
          id: 'banner_search',
          type: 'click',
          pageid: activatedRoute.snapshot.data.telemetry.pageid
        }
      };
      component.handleBannerClick(data);
      expect(telemetryService.interact).toHaveBeenCalledWith(telemetryData);
    });

    it('Route url should available to the logged in user', () => {
      spyOn(component, 'isUserLoggedIn').and.returnValue(true);
      const router = TestBed.inject(Router);
      const data = {
          'code': 'banner_internal_url',
          'ui': {
              'background': 'https://cdn.pixabay.com/photo/2015/10/29/14/38/web-1012467_960_720.jpg',
              'text': 'Sample Internal Url'
          },
          'action': {
              'type': 'navigate',
              'subType': 'internalUrl',
              'params': {
                  'route': 'profile',
                  'anonymousRoute': 'guest-profile'
              }
          },
          'expiry': '1653031067'
      };
      component.navigateToSpecificLocation(data);
      expect(router.navigate).toHaveBeenCalledWith(['profile']);
    });

    it('anonymousRoute url should available to the non logged in user', () => {
      spyOn(component, 'isUserLoggedIn').and.returnValue(false);
      const router = TestBed.inject(Router);
      const data = {
          'code': 'banner_internal_url',
          'ui': {
              'background': 'https://cdn.pixabay.com/photo/2015/10/29/14/38/web-1012467_960_720.jpg',
              'text': 'Sample Internal Url'
          },
          'action': {
              'type': 'navigate',
              'subType': 'internalUrl',
              'params': {
                  'route': 'profile',
                  'anonymousRoute': 'guest-profile'
              }
          },
          'expiry': '1653031067'
      };
      component.navigateToSpecificLocation(data);
      expect(router.navigate).toHaveBeenCalledWith(['guest-profile']);
    });

    it('should return persistence filters from cache service', () => {
      spyOn(cacheService, 'get').and.returnValue(RESPONSE.persistFilters);
      spyOn(cacheService, 'exists').and.returnValue(true);
      spyOn(component, 'isUserLoggedIn').and.returnValue(false);
      const res = component.getPersistFilters(true);
      expect(Object.keys(res)).toContain('board');
      expect(Object.keys(res)).toContain('gradeLevel');
      expect(Object.keys(res)).toContain('medium');
    });

    it('it should call move to top window scroll', () => {
      spyOn(global['window'], 'scroll').and.callFake((options) => {
        return {};
      });
      component.moveToTop();
      expect(global['window']['scroll']).toHaveBeenCalled();
      expect(global['window']['scroll']).toHaveBeenCalledWith({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    });
  });

    it('should call the getFormConfigs to get form category if loggin', () => {
      component.selectedTab = 'home';
      component.userType = 'undefined';
      spyOn(component, 'isUserLoggedIn').and.returnValue(true);
      spyOn(component, 'setUserPreferences').and.callThrough();
      userService.userData$ = observableOf({
        profileData: {
        userProfile: {
          profileUserType: {
            subType: null,
            type: 'teacher',
          },
        },
        },
      });
      spyOn(component, 'getFormConfigs').and.callThrough();
      component.userPreference = { framework: {id: ['tn_k-12_5']}};
      const data = {
        cbse: {
          teacher: {
            name: 'observation',
            icon: {
              web: 'assets/images/mask-image/observation.png'
            }
          }
        }
      };
      spyOn(observationUtilService, 'browseByCategoryForm').and.callFake(() => {
        return Promise.resolve(data);
      });
      component.showTargetedCategory = true;
      component.getFormConfigs();
      expect(component.getFormConfigs).toHaveBeenCalled();
    });

    it('should call the getFormConfigs to get form category if not login', () => {
      spyOn(component, 'isUserLoggedIn').and.returnValue(false);
      spyOn(component, 'setUserPreferences').and.callThrough();
      component.selectedTab = 'home';
      component.userType = 'undefined';
      spyOn(component, 'getFormConfigs').and.callThrough();
      component.userType = 'teacher';
      component.userPreference = { framework: {id: 'tn_k-12_5'}};
      spyOn(observationUtilService, 'browseByCategoryForm').and.callFake(() => {
        return Promise.resolve(categoryData);
      });
      component.showTargetedCategory = true;
      component.getFormConfigs();
      expect(component.getFormConfigs).toHaveBeenCalled();
    });

    it('should call the getFormConfigs to get form category if not login', () => {
      spyOn(component, 'isUserLoggedIn').and.returnValue(false);
      component.userType = 'teacher';
      spyOn(component, 'setUserPreferences').and.callThrough();
      component.selectedTab = 'home';
      spyOn(component, 'getFormConfigs').and.callThrough();
      component.userType = 'teacher';
      component.userPreference = { framework: {id: 'tn_k-12_5'}};
      const data = {
        cbse: {
          student: {
            name: 'observation',
            icon: {
              web: 'assets/images/mask-image/observation.png'
            }
          }
        }
      };
      spyOn(observationUtilService, 'browseByCategoryForm').and.callFake(() => {
        return Promise.resolve(data);
      });
      component.showTargetedCategory = false;
      component.getFormConfigs();
      expect(component.getFormConfigs).toHaveBeenCalled();
    });

    it('should call the getFormConfigs to get form category when selected is not home', () => {
      spyOn(component, 'getFormConfigs').and.callThrough();
      component.selectedTab = 'explore';
      component.getFormConfigs();
      expect(component.getFormConfigs).toHaveBeenCalled();
      expect(component.showTargetedCategory).toEqual(false);
    });

  it('shoulc call the handleTargetedpillSelected when the browse by category clicked', () => {
    spyOn(component, 'isUserLoggedIn').and.returnValue(true);
    spyOn(component, 'handleTargetedpillSelected').and.callThrough();
    const router = TestBed.inject(Router);
    component.handleTargetedpillSelected(EventPillData);
    router['url' as any] = '/observation';
    expect(component.handleTargetedpillSelected).toHaveBeenCalled();
  });

});
