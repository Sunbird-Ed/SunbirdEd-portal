import {
  PaginationService, ResourceService, ConfigService, ToasterService, OfflineCardService, ILoaderMessage, UtilService, NavigationHelperService, IPagination, LayoutService, COLUMN_TYPE
} from '@sunbird/shared';
import { SearchService, OrgDetailsService, UserService, FrameworkService, SchemaService } from '@sunbird/core';
import { PublicPlayerService } from '../../../../services';
import { combineLatest, Subject, of, throwError } from 'rxjs';
import { Component, OnInit, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { takeUntil, map, mergeMap, first, debounceTime, tap, delay } from 'rxjs/operators';
import { CacheService } from '../../../../../shared/services/cache-service/cache.service';
import { ContentManagerService } from '../../../offline/services';
import {omit, groupBy, get, uniqBy, toLower, find, map as _map, forEach, each} from 'lodash-es';
import { CslFrameworkService } from '../../../../services/csl-framework/csl-framework.service';
import { ExploreContentComponent } from './explore-content.component';
import { ServerResponse } from '@project-sunbird/sunbird-questionset-editor/lib/interfaces/serverResponse';

describe('ExploreContentComponent', () => {
  let component: ExploreContentComponent;

  const mockSearchService: Partial<SearchService> = {
    getContentTypes: jest.fn(),
    contentSearch: jest.fn()
  };
  const mockRouter: Partial<Router> = {
    url: '/current/2',
    navigate: jest.fn(),
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    queryParams: of({}),
    snapshot: {
        data: {
            telemetry: {
              env: 'certs',
              pageid: 'certificate-configuration',
              type: 'view',
              subtype: 'paginate',
              ver: '1.0'
            }
        }
    } as any
  };
  const mockPaginationService: Partial<PaginationService> = {
    getPager: jest.fn(),
  };
  const mockResourceService: Partial<ResourceService> = {};
  const mockToasterService: Partial<ToasterService> = {
    error: jest.fn
  };
  const mockConfigService: Partial<ConfigService> = {
    appConfig: {
      SEARCH: { PAGE_LIMIT: 10 },
      explore: {
       filterType: 'yourFilterType'
      }
    },
  };
  const mockUtilService: Partial<UtilService> = {};
  const mockOrgDetailsService: Partial<OrgDetailsService> = {
    getOrgDetails: jest.fn(() => of({ hashTagId: 'MockedHashTagId' })) as any,
  };
  const mockNavigationHelperService: Partial<NavigationHelperService> = {
    goBack: jest.fn(),
  };
  const mockPublicPlayerService: Partial<PublicPlayerService> = {
    playContent: jest.fn(),
  };
  const mockUserService: Partial<UserService> = {
    slug: 'mockedSlug',
  };
  const mockFrameworkService: Partial<FrameworkService> = {
    channelData$: of({ channelData: { defaultFramework: 'yourMockedFrameworkId' }, err: null }),
  };
  const mockCacheService: Partial<CacheService> = {};
  const mockLayoutService: Partial<LayoutService> = {
    initlayoutConfig: jest.fn(),
    redoLayoutCSS: jest.fn(),
    switchableLayout: jest.fn(() => of([{ layout: 'demo' }])),

  };
  const mockContentManagerService: Partial<ContentManagerService> = {
    startDownload: jest.fn().mockReturnValue({}),
    contentDownloadStatus$: of({ enrolledCourses: [{ identifier: 'COMPLETED' }] }),
    } as any;
  const mockOfflineCardService: Partial<OfflineCardService> = {
    isYoutubeContent: jest.fn(),
  };
  const mockTelemetryService: Partial<TelemetryService> = {
    interact: jest.fn(),
  };
  const mockSchemaService: Partial<SchemaService> = {
    getSchema: jest.fn(),
    schemaValidator: jest.fn()
  };
  const mockCslFrameworkService: Partial<CslFrameworkService> = {
        setDefaultFWforCsl: jest.fn(),
        getAllFwCatName: jest.fn(),
        getAlternativeCodeForFilter: jest.fn(),
        transformDataForCC: jest.fn(),
  };

  beforeEach(() => {
    component = new ExploreContentComponent(
      mockSearchService as SearchService,
      mockRouter as Router,
      mockActivatedRoute as ActivatedRoute,
      mockPaginationService as PaginationService,
      mockResourceService as ResourceService,
      mockToasterService as ToasterService,
      mockConfigService as ConfigService,
      mockUtilService as UtilService,
      mockOrgDetailsService as OrgDetailsService,
      mockNavigationHelperService as NavigationHelperService,
      mockPublicPlayerService as PublicPlayerService,
      mockUserService as UserService,
      mockFrameworkService as FrameworkService,
      mockCacheService as CacheService,
      mockNavigationHelperService as NavigationHelperService,
      mockLayoutService as LayoutService,
      mockContentManagerService as ContentManagerService,
      mockOfflineCardService as OfflineCardService,
      mockTelemetryService as TelemetryService,
      mockSchemaService as SchemaService,
      mockCslFrameworkService as CslFrameworkService,
    );
  });

  beforeEach(() => {
    window.scroll = jest.fn() as any;
    jest.clearAllMocks();
  });

  it('component should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties on ngOnInit', () => {
    jest.spyOn(mockCslFrameworkService, 'getAllFwCatName' as any).mockReturnValue(of({}));
    jest.spyOn(mockCslFrameworkService, 'getAlternativeCodeForFilter' as any).mockReturnValue(of({}));
    jest.spyOn(mockCslFrameworkService, 'transformDataForCC' as any).mockReturnValue(['key1', 'key2']);
    const mockFormData = [
      { title: 'frmelmnts.tab.all', search: { facets: 'yourMockedFacets' } },
    ];    
    const mockContentResponse: ServerResponse = {
      id: 'id',
      params: { resmsgid: '', status: ''},
      responseCode: 'OK',
      result: { count: 0, content: [], facets: [], QuestionSet: [] },
      ts: '',
      ver: ''
    };
    component.paginationDetails = { currentPage: 5 } as any;
    component.configService.appConfig.ExplorePage = { contentApiQueryParams: "" } as any;
    jest.spyOn(mockSchemaService, 'getSchema' as any).mockReturnValue(of({}));
    jest.spyOn(mockSchemaService, 'schemaValidator' as any).mockReturnValue(of({}));
    jest.spyOn(mockSearchService, 'contentSearch').mockReturnValue(of(mockContentResponse));
    jest.spyOn(mockSearchService, 'getContentTypes').mockReturnValue(of(mockFormData));
    const goBackSpy = jest.spyOn(mockNavigationHelperService, 'goBack');
    component.ngOnInit();
    expect(jest.spyOn(component.cslFrameworkService, 'getAllFwCatName')).toHaveBeenCalled();
    expect(jest.spyOn(component.cslFrameworkService, 'getAlternativeCodeForFilter')).toHaveBeenCalled();
    expect(jest.spyOn(component.cslFrameworkService, 'transformDataForCC')).toHaveBeenCalled();
    expect(jest.spyOn(mockSearchService, 'getContentTypes')).toHaveBeenCalled();
    expect(goBackSpy).not.toHaveBeenCalled();
    expect(component.hashTagId).toEqual('MockedHashTagId');
    expect(component.initFilters).toBeTruthy();
    expect(component.cslFrameworkService?.getAlternativeCodeForFilter).toHaveBeenCalled();
    expect(component.cslFrameworkService.transformDataForCC).toHaveBeenCalled();
    expect(component.cslFrameworkService.getAllFwCatName).toHaveBeenCalled();
  });

  it('should call goBack if navigation history length is greater than 1', () => {
    mockNavigationHelperService['_history'] = [1, 2];
    component.goback();
    expect(mockNavigationHelperService.goBack).toHaveBeenCalled();
  });

  it('should not call goBack if navigation history length is 1 or less', () => {
    mockNavigationHelperService['_history'] = [1];
    component.goback();
    expect(mockNavigationHelperService.goBack).not.toHaveBeenCalled();
  });


  it('should handle filterData without channel or facets', () => {
    component.frameworkCategoriesList = ['mock-framework'];
    const filters = { filters: { otherFilter: 'someValue' } };
    component.getFilters(filters);
    expect(component.selectedFilters).toEqual({ otherFilter: 'someValue' });
  });

  it('should emit default filters', () => {
      component.frameworkCategoriesList = ['mock-framework'];
      const filters =  { filters: { otherFilter: 'someValue' } };
      const emitSpy = jest.spyOn(component.dataDrivenFilterEvent, 'emit');
      component.getFilters(filters);
      expect(emitSpy).toHaveBeenCalled();
  });

  it('should handle filters without channel', () => {
    const mockFrameworkCategoriesList = ['framework1','framework2'];
    jest.spyOn(component.cslFrameworkService,'getAllFwCatName').mockReturnValue(mockFrameworkCategoriesList);
    component.frameworkCategoriesList = mockFrameworkCategoriesList;
    const filters = {
      filters: {
        filter: 'mock-filter'
      }
    };
    const expectedDefaultFilters = {
      [component.frameworkCategoriesList[0]]: ''
    };
    jest.spyOn(component.dataDrivenFilterEvent,'emit');
    component.getFilters(filters);
    expect(component.selectedFilters).toEqual(filters.filters);
    expect(component.dataDrivenFilterEvent.emit).toHaveBeenCalled();
  });

   it('should redo layout when layout configuration is not null', () => {
    component.layoutConfiguration = { };
    component.redoLayout();
    expect(mockLayoutService.redoLayoutCSS).toHaveBeenCalledWith(0, component.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
    expect(mockLayoutService.redoLayoutCSS).toHaveBeenCalledWith(1, component.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
  });

  it('should redo layout with full layout when layout configuration is null', () => {
    component.layoutConfiguration = null;
    component.redoLayout();
    expect(mockLayoutService.redoLayoutCSS).toHaveBeenCalledWith(0, null, COLUMN_TYPE.fullLayout);
    expect(mockLayoutService.redoLayoutCSS).toHaveBeenCalledWith(1, null, COLUMN_TYPE.fullLayout);
  });

  it('should handle filters correctly', () => {
    const filters = {
      filters: {
        channel: ['value1']
      }
    };
    component.frameworkCategoriesList = ['category1', 'category2'];
    jest.spyOn(component.dataDrivenFilterEvent, 'emit').mockReturnValue()
    component.getFilters(filters);
    expect(component.selectedFilters).toEqual({ channel: ['value1'] });
    expect(component.dataDrivenFilterEvent.emit).toHaveBeenCalledWith({})
  });

it('should navigate to the specified page', () => {
    const page = 2;
    component.paginationDetails = { totalPages: 5 } as any;
    component.queryParams = {  };
    component.navigateToPage(page);
    const expectedUrl = '/current/2';
    expect(mockRouter.navigate).toHaveBeenCalledWith([expectedUrl], { queryParams: component.queryParams });
  });

  it('should not navigate if the page is out of range', () => {
    const page = 10;
    component.paginationDetails = { totalPages: 5 } as any;
    component.queryParams = {};
    component.navigateToPage(page);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should unsubscribe on ngOnDestroy', () => {
    jest.spyOn(component.unsubscribe$, 'complete');
    jest.spyOn(component.unsubscribe$, 'next');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
  });

  it('should call downloadContent with the correct contentId', () => {
    const contentId = 'contentId1';
    const mockResponse = {};
    jest.spyOn(mockContentManagerService as any, 'startDownload').mockReturnValueOnce(of(mockResponse));
    component.downloadIdentifier = contentId;
    component.contentData = {};
    component.contentName = 'Sample Content';
    component.callDownload();

    setTimeout(() => {
      expect(mockContentManagerService.downloadContentId).toBe(contentId);
      jest.restoreAllMocks();
    }, 0);
  });

   it('should handle successful download', () => {
    const contentId = 'contentId1';
    const mockResponse = {};

    jest.spyOn(mockContentManagerService as any, 'startDownload').mockReturnValue(of(mockResponse));

    component.downloadContent(contentId);

    expect(component.downloadIdentifier).toBe('');
    expect(mockContentManagerService.downloadContentId).toBe('');
    expect(mockContentManagerService.downloadContentData).toEqual({});
    expect(mockContentManagerService.failedContentName).toBe('');
    expect(component.showDownloadLoader).toBe(false);
  });

  it('should handle download error', () => {
    const contentId = 'contentId1';
    const mockError = { error: { params: { err: 'LOW_DISK_SPACE' } } };
    jest.spyOn(mockContentManagerService as any, 'startDownload').mockReturnValue(throwError(mockError));

    component.downloadContent(contentId);

    expect(component.downloadIdentifier).toBe('');
    expect(mockContentManagerService.downloadContentId).toBe('');
    expect(mockContentManagerService.downloadContentData).toEqual({});
    expect(mockContentManagerService.failedContentName).toBe('');
    expect(component.showDownloadLoader).toBe(false);
  });

  it('should handle open action', () => {
    const event = {
        hover: {
            type: 'OPEN'
        },
        content: {
            name: 'Sample Content',
            identifier: 'contentId1',
            mimeType: 'application/pdf'
        },
        data: {}
    };

    jest.spyOn(component, 'playContent');
    jest.spyOn(component, 'logTelemetry');

    component.hoverActionClicked(event);

    expect(component.contentName).toBe('Sample Content');
    expect(component.contentData).toEqual(event.content);
    expect(component.playContent).toHaveBeenCalledWith(event);
    expect(component.logTelemetry).toHaveBeenCalledWith(event.content, 'play-content');
  });

   describe('viewAll', () => {
    it('should navigate to view-all with correct queryParams when queryParams contain primaryCategory', () => {
      component.frameworkCategoriesList = ['category1', 'category2', 'category3', 'category4'];
      component.globalFilterCategories = { fwCategory4: { alternativeCode: 'alternative', code: 'code' } };
      const event = { name: 'TestCategory' };
      component.queryParams = { primaryCategory: ['SomeCategory'], channel: 'SomeChannel' };
      component.viewAll(event);
      expect(mockRouter.navigate).toHaveBeenCalled()
    });

    it('should navigate to view-all with correct queryParams when queryParams do not contain primaryCategory', () => {
      component.globalFilterCategories = { fwCategory4: { alternativeCode: 'alternative', code: 'code' } };
      const event = { name: 'TestCategory' };
      component.queryParams = { channel: 'SomeChannel' };
      component.viewAll(event);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/explore/view-all/TestCategory', 1], {
        queryParams: {
          defaultSortBy: JSON.stringify({ lastPublishedOn: 'desc' }),
          exists: undefined,
          primaryCategory: ['TestCategory'],
          'selectedTab': 'all',
          'channel': 'SomeChannel',
          visibility: [],
          appliedFilters: true
        },
        state: {}
      });
    });
  });

  describe('isUserLoggedIn', () => {
    it('should return false if userService is not defined', () => {
      component.globalFilterCategories = { fwCategory4: { alternativeCode: 'alternative', code: 'code' } };
      component.userService = undefined;
      const result = component.isUserLoggedIn();
      expect(result).toBeFalsy();
    });

    it('should return false if userService.loggedIn is false', () => {
      component.userService = { loggedIn: false } as any;
      const result = component.isUserLoggedIn();
      expect(result).toBeFalsy();
    });

    it('should return true if userService.loggedIn is true', () => {
      component.userService = { loggedIn: true } as any;
      const result = component.isUserLoggedIn();
      expect(result).toBeTruthy();
    });
  });

  it('should handle download action for non-Youtube content', () => {
      const event = {
          hover: {
              type: 'DOWNLOAD'
          },
          content: {
              name: 'Sample Content',
              identifier: 'contentId1',
              mimeType: 'application/pdf'
          },
          data: {}
      };

      jest.spyOn(component, 'downloadContent');
      jest.spyOn(component, 'logTelemetry');

      component.hoverActionClicked(event);

      expect(component.contentName).toBe('Sample Content');
      expect(component.contentData).toEqual(event.content);
      expect(component.showModal).toBeFalsy();
      expect(component.downloadContent).toHaveBeenCalledWith('contentId1');
      expect(component.logTelemetry).toHaveBeenCalledWith(event.content, 'download-content');
  });

});