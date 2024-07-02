import {
  PaginationService, ResourceService, ConfigService, ToasterService, INoResultMessage, ILoaderMessage, UtilService, BrowserCacheTtlService, NavigationHelperService, IPagination,
  LayoutService, COLUMN_TYPE, OfflineCardService
} from '@sunbird/shared';
import { SearchService, PlayerService, CoursesService, UserService, ISort, OrgDetailsService, SchemaService } from '@sunbird/core';
import { combineLatest, Subject, of, throwError } from 'rxjs';
import { Component, OnInit, OnDestroy, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { takeUntil, map, delay, debounceTime, tap, mergeMap } from 'rxjs/operators';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { ContentManagerService } from '../../../public/module/offline/services/content-manager/content-manager.service';
import {omit, groupBy, get, uniqBy, toLower, find, map as _map, forEach, each} from 'lodash-es';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service'
import { HomeSearchComponent } from './home-search.component';


describe('HomeSearch Component', () => {
  let component: HomeSearchComponent;

  const mockSearchService: Partial<SearchService> = {
    getContentTypes: jest.fn(),
    contentSearch: jest.fn(),
  };

  const mockRouter: Partial<Router> = {
    events: of({id: 1, url: 'sample-url'}) as any,
    navigate: jest.fn()
  };
    const mockActivatedRoute: Partial<ActivatedRoute> = {
      snapshot: {
          data: {
            telemetry: { env: 'course', pageid: 'validate-certificate', type: 'view' }
          },
          params: { uuid: '9545879' },
          queryParams: {
             primaryCategory: 'Asset',
             showClose: 'true'
          }
      } as any
    };

  const mockPaginationService: Partial<PaginationService> = {
    getPager: jest.fn()
  };

  const mockResourceService: Partial<ResourceService> = {
    languageSelected$: of({ language: 'en' }) as any,
  };

  const mockToasterService: Partial<ToasterService> = {
    error: jest.fn(),
  };

  const mockChangeDetectionRef: Partial<ChangeDetectorRef> = {
    detectChanges: jest.fn(),
  };

  const mockConfigService: Partial<ConfigService> = {
    dropDownConfig: {
      FILTER: {
        RESOURCES: {
          sortingOptions: jest.fn(),
        },
      },
    },
    appConfig: {
      Course: {
        contentApiQueryParams: {}
      },
      SEARCH: { PAGE_LIMIT: 10 },
      home: {
        filterType: 'yourFilterTypeValue',
      },
      ViewAll: {
        PAGE_LIMIT: 1,
        otherCourses: {
          constantData: {
            'action': {
              'onImage': {
                'eventName': 'onImage'
              }
            }
          }
        }
      }
    }
  };

  const mockUtilService: Partial<UtilService> = {
    isDesktopApp: true,
    isIos: true
  };

  const mockCoursesService: Partial<CoursesService> = {
    getSignedCourseCertificate: jest.fn(),
    findEnrolledCourses: jest.fn().mockReturnValue({
      onGoingBatchCount: 1,
      expiredBatchCount: 0,
      openBatch: { ongoing: [{ batchId: '123' }] },
      inviteOnlyBatch: { ongoing: [] }
    }),
    enrolledCourseData$: of({ enrolledCourses: [{ completeOn: '2022-08-03' }] })
  } as any;

  const mockPlayerService: Partial<PlayerService> = {
    playContent: jest.fn(),
  };

  const mockUserService: Partial<UserService> = {
    loggedIn: true,
    slug: jest.fn().mockReturnValue('tn') as any,
    userData$: of({userProfile: {
      userId: 'sample-uid',
      rootOrgId: 'sample-root-id',
      rootOrg: {},
      hashTagIds: ['id']
    } as any}) as any,
    setIsCustodianUser: jest.fn(),
    userid: 'sample-uid',
    appId: 'sample-id',
    getServerTimeDiff: '',
  };

  const mockCacheService: Partial<CacheService> = {
    set: jest.fn()
  };

  const mockBrowserCacheTtlService: Partial<BrowserCacheTtlService> = {};

  const mockOrgDetailsService: Partial<OrgDetailsService> = {};

  const mockNavigationHelperService: Partial<NavigationHelperService> = {
    goBack: jest.fn(),
  };

  const mockLayoutService: Partial<LayoutService> = {
    initlayoutConfig: jest.fn(),
    redoLayoutCSS: jest.fn(),
    switchableLayout: jest.fn(() => of([{data: 'demo'}]))
  }

  const schemaService: Partial<SchemaService>={
    getSchema: jest.fn(),
    schemaValidator: jest.fn()
  };

    const mockContentManagerService: Partial<ContentManagerService> = {
        contentDownloadStatus$: of({ enrolledCourses: [{ identifier: 'COMPLETED' }] }),
        updateContent: jest.fn(),
        exportContent: jest.fn(),
        deleteContent: jest.fn(),
        startDownload: jest.fn().mockReturnValue(of({})),
    } as any;

  const mockTelemetryService: Partial<TelemetryService> = {
    interact: jest.fn()
  };

	const mockOfflineCardService :Partial<OfflineCardService> ={
    isYoutubeContent: jest.fn(),
  };

  const mockCslFrameworkService: Partial<CslFrameworkService> = {
    transformDataForCC: jest.fn(),
    getAlternativeCodeForFilter: jest.fn(),
    getAllFwCatName: jest.fn(),
    getFrameworkCategories: jest.fn().mockReturnValue(of({})),
    getGlobalFilterCategories: jest.fn().mockReturnValue(of({ fwCategory4:{
      code: "",
    }   }))
  };

  beforeAll(() => {
    component = new HomeSearchComponent(
      mockSearchService as SearchService,
      mockRouter as Router,
      mockActivatedRoute as ActivatedRoute,
      mockPaginationService as PaginationService,
      mockResourceService as ResourceService,
      mockToasterService as ToasterService,
      mockChangeDetectionRef as ChangeDetectorRef,
      mockConfigService as ConfigService,
      mockUtilService as UtilService,
      mockCoursesService as CoursesService,
      mockPlayerService as PlayerService,
      mockUserService as UserService,
      mockCacheService as CacheService,
      mockBrowserCacheTtlService as BrowserCacheTtlService,
      mockOrgDetailsService as OrgDetailsService,
      mockNavigationHelperService as NavigationHelperService,
      mockLayoutService as LayoutService,
      schemaService as SchemaService,
			mockContentManagerService as ContentManagerService,
      mockTelemetryService as TelemetryService,
      mockOfflineCardService as OfflineCardService,
      mockCslFrameworkService as CslFrameworkService
    );
  });


  beforeEach(() => {
    jest.spyOn(component, 'moveToTop').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it('should log telemetry for view all', () => {
    const event = { name: 'test-section' };
    component.logViewAllTelemetry(event);
    expect(mockTelemetryService.interact).toHaveBeenCalledWith({
      context: {
        cdata: [{ type: 'section', id: 'test-section' }],
        env: 'library'
      },
      edata: {
        id: 'view-all',
        type: 'click',
        pageid: 'library'
      },
      object: undefined
    });
  });

  it('should get interact edata', () => {
    const event = {
      cdata: [{ type: 'section', id: 'test-section' }],
      edata: {
        id: 'test-id'
      },
      object: 'test-object'
    };
    component.getInteractEdata(event);

    expect(mockTelemetryService.interact).toHaveBeenCalledWith({
      context: {
        cdata: [{ type: 'section', id: 'test-section' }],
        env: 'library'
      },
      edata: {
        id: 'test-id',
        type: 'click',
        pageid: 'library'
      },
      object: 'test-object'
    });
  });

  it('should return true for isUserLoggedIn if userService is logged in', () => {
    component.userService = { loggedIn: true } as any;
    const result = component.isUserLoggedIn();
    expect(result).toBe(true);
  });

  it('should return false for isUserLoggedIn if userService is not logged in', () => {
    component.userService = { loggedIn: false } as any;
    const result = component.isUserLoggedIn();
    expect(result).toBe(false);
  });

  it('should set showBackButton to true if showClose is true in queryParams', () => {
      component.checkForBack();
      expect(component.showBackButton).toBe(true);
  });

  it('should not navigate to an invalid page', () => {
    const invalidPage = -1;
    component.navigateToPage(invalidPage);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(component.moveToTop).not.toHaveBeenCalled();
  });

  it('should not navigate to an invalid page', () => {
    const invalidPage = -1;
    component.paginationDetails = {
      totalPages: 5,
    } as any;
    component.navigateToPage(invalidPage);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(component.moveToTop).not.toHaveBeenCalled();
  });

  it('should navigate to the specified page', () => {
    const validPage = 2;
    const mockRouter = {
      url: '/mock-url?param1=value1',
      navigate: jest.fn(),
    };

    const mockQueryParams = { param1: 'value1' };
    component.router = mockRouter as any;
    component.queryParams = mockQueryParams;
    component.paginationDetails = {
      totalPages: 5,
    } as any;
    component.navigateToPage(validPage);
    const expectedUrl = '/2';
    expect(mockRouter.navigate).toHaveBeenCalledWith([expectedUrl], { queryParams: mockQueryParams });
    expect(component.moveToTop).toHaveBeenCalled();
  });

  it('should set noResultMessage in setNoResultMessage', () => {
    component['setNoResultMessage']();
    expect(component.noResultMessage).toEqual({
      message: 'messages.stmsg.m0007',
      messageText: 'messages.stmsg.m0006',
    });
  });

  it('should call necessary methods during initialization', () => {
    jest.spyOn(component, 'setNoResultMessage' as any);
    jest.spyOn(component, 'initLayout');
    jest.spyOn(component, 'fetchEnrolledCoursesSection' as any).mockReturnValue(of([{ sampleData: 'data' }]));
    const mockFormData = [
      { title: 'frmelmnts.tab.all', search: { facets: ['facet1', 'facet2'] } },
    ];
    jest.spyOn(mockSearchService, 'getContentTypes').mockReturnValue(of(mockFormData));
    jest.spyOn(component, 'moveToTop');
    jest.spyOn(component, 'checkForBack');
    component.ngOnInit();
    expect(mockSearchService.getContentTypes).toHaveBeenCalled();
    expect(component.allTabData).toEqual({ title: 'frmelmnts.tab.all', search: { facets: ['facet1', 'facet2'] } });
    expect(component.globalSearchFacets).toEqual(['facet1', 'facet2']);
    expect(component['setNoResultMessage']).toHaveBeenCalled();
    expect(component.initFilters).toBe(true);
    expect(component.initLayout).toHaveBeenCalled();
    expect(component['fetchEnrolledCoursesSection']).toHaveBeenCalled();
    expect(component['setNoResultMessage']).toHaveBeenCalled();
    expect(component.checkForBack).toHaveBeenCalled();
    expect(component.moveToTop).toHaveBeenCalled();
  });

  it('should initialize layout configuration correctly', () => {
    jest.spyOn(mockLayoutService, 'initlayoutConfig').mockReturnValue('sampleLayoutConfig');
    const redoLayoutSpy = jest.spyOn(component, 'redoLayout');
    component.initLayout();
    expect(mockLayoutService.initlayoutConfig).toHaveBeenCalled();
    expect(redoLayoutSpy).toHaveBeenCalledTimes(2);
  });

  it('should redo layout with layout configuration', () => {
    component.layoutConfiguration = { };
    component.redoLayout();
    expect(mockLayoutService.redoLayoutCSS).toHaveBeenCalledWith(0, component.layoutConfiguration, COLUMN_TYPE.threeToNine);
    expect(mockLayoutService.redoLayoutCSS).toHaveBeenCalledWith(1, component.layoutConfiguration, COLUMN_TYPE.threeToNine);
  });

  it('should redo layout with full layout if no configuration provided', () => {
    component.layoutConfiguration = null;
    component.redoLayout();
    expect(mockLayoutService.redoLayoutCSS).toHaveBeenCalledWith(0, null, COLUMN_TYPE.fullLayout);
    expect(mockLayoutService.redoLayoutCSS).toHaveBeenCalledWith(1, null, COLUMN_TYPE.fullLayout);
  });

  it('should play content if no enrolled batch present', () => {
    const eventData = { data: { } };
    component.playContent(eventData);
    expect(mockPlayerService.playContent).toHaveBeenCalledWith(eventData.data);
  });

  it('should update inViewLogs array correctly', () => {
    const eventData = { inview: [{ data: { metaData: { identifier: '123', contentType: 'content' } }, id: '1' }] };
    component.inView(eventData);
    expect(component.inViewLogs).toEqual([{ objid: '123', objtype: 'content', index: '1' }]);
  });

   it('should call playContent method and log telemetry when hover type is "OPEN"', () => {
    const event = {
      hover: { type: 'OPEN' },
      content: { name: 'Sample Content', identifier: '123', mimeType: 'sample/mime-type' },
      data: { name: 'Sample Content', identifier: '123', mimeType: 'sample/mime-type' }
    };
    const playContentSpy = jest.spyOn(component, 'playContent');
    const logTelemetrySpy = jest.spyOn(component, 'logTelemetry');
    component.hoverActionClicked(event);
    expect(playContentSpy).toHaveBeenCalledWith(event);
    expect(logTelemetrySpy).toHaveBeenCalledWith(event.data, 'play-content');
  });

  it('should call downloadContent method and log telemetry when hover type is "DOWNLOAD"', () => {
    const event = {
      hover: { type: 'DOWNLOAD' },
      content: { name: 'Sample Content', identifier: '123', mimeType: 'sample/mime-type' },
      data: { name: 'Sample Content', identifier: '123', mimeType: 'sample/mime-type' }
    };
    const downloadContentSpy = jest.spyOn(component, 'downloadContent');
    const logTelemetrySpy = jest.spyOn(component, 'logTelemetry');
    component.hoverActionClicked(event);
    expect(downloadContentSpy).toHaveBeenCalledWith('123');
    expect(logTelemetrySpy).toHaveBeenCalledWith(event.data, 'download-content');
  });

  it('ngAfterViewInit should set telemetryImpression after a timeout', () => {
    component.ngAfterViewInit();
    setTimeout(() => {
      expect(component.telemetryImpression).toEqual({
        context: { env: 'test-env' },
        edata: {
          type: 'test-type',
          pageid: 'test-pageid',
          uri: 'test-url',
          subtype: 'test-subtype',
          duration: 1000
        }
      });
    });
  });

  it('ngOnDestroy should unsubscribe from subscriptions', () => {
    component.ngOnInit();
    jest.spyOn(component.unsubscribe$, 'complete');
    jest.spyOn(component.unsubscribe$, 'next');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
  });

  it('should fetch contents with correct filters', () => {
  const queryParams = {
    mediaType: 'video',
  };
  component.queryParams = queryParams;
  const expectedFilters = {
    mimeType: ['value3', 'value4'],
  };
  schemaService.schemaValidator = jest.fn().mockReturnValue(expectedFilters);
  const mockContentSearchResponse = {};
  jest.spyOn(mockSearchService as any, 'contentSearch').mockReturnValue(of(mockContentSearchResponse));
  component['fetchContents']();

  expect(schemaService.schemaValidator).toHaveBeenCalledWith({
    inputObj: queryParams,
    properties: {},
    omitKeys: expect.any(Array),
  });

});

describe('viewAll',()=>{
  it('should navigate to view all with correct query params', () => {
    const mockEvent = { name: 'mock-category' };
    jest.spyOn(component,'logViewAllTelemetry');
    const mockGlobalFilterCategories = ['category1','category2','category3','category4'];
    jest.spyOn(component.cslFrameworkService,'getAlternativeCodeForFilter').mockReturnValue(mockGlobalFilterCategories);
    component.globalFilterCategories = mockGlobalFilterCategories;
    component.queryParams = {'category4': 'mock-category', 'channel': 'mock-channel'};
    component.viewAll(mockEvent);

    expect(component.moveToTop).toHaveBeenCalled();
    expect(component.logViewAllTelemetry).toHaveBeenCalledWith(mockEvent);
    expect(component.router.navigate).toHaveBeenCalledWith(
      ["/resources/view-all/mock-category", 1],
      {"queryParams": {"appliedFilters": true, "category4": "mock-category", 
      "channel": "mock-channel", "defaultSortBy": "{\"lastPublishedOn\":\"desc\"}", 
      "exists": undefined, "primaryCategory": ["mock-category"], "selectedTab": "all", 
      "visibility": []}, "state": {}}
    );
  });

  it('should navigate to view all with correct query params', () => {
    const mockEvent = { name: 'mock-category' };
    jest.spyOn(component,'logViewAllTelemetry');
    const mockFwName= ['framework1','framework2','framework3','framework4'];
    jest.spyOn(component.cslFrameworkService,'getAllFwCatName').mockReturnValue(mockFwName);
    component.frameworkCategoriesList = mockFwName;
    component.queryParams = {'primaryCategory': 'mock-primary-category', 'channel': 'mock-channel'};
    component.viewAll(mockEvent);

    expect(component.router.navigate).toHaveBeenCalledWith(
      ["/resources/view-all/mock-category", 1], 
      {"queryParams": {"appliedFilters": true, "channel": "mock-channel",
      "defaultSortBy": "{\"lastPublishedOn\":\"desc\"}", "exists": undefined, 
      "framework4": ["mock-category"], "primaryCategory": "mock-primary-category", 
      "selectedTab": "all", "visibility": []}, "state": {}}
    );
  });
});

 it('should set value and call downloadContent on callDownload',() =>{
    component.downloadIdentifier = 'mock-identifier';
    component.callDownload();

    expect(component.showDownloadLoader).toBeTruthy;
    expect(component.downloadContent).toHaveBeenCalled();
 });
});
