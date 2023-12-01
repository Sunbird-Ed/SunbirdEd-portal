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

  const mockChangeDetectionRef: Partial<ChangeDetectorRef> = {};

  const mockConfigService: Partial<ConfigService> = {
    dropDownConfig: {
      FILTER: {
        RESOURCES: {
          sortingOptions: jest.fn(),
        },
      },
    },
    appConfig: {
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
    enrolledCourseData$: of({ enrolledCourses: [{ completeOn: '2022-08-03' }] })
  } as any;

  const mockPlayerService: Partial<PlayerService> = {};

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
        startDownload: jest.fn()
    } as any;

  const mockTelemetryService: Partial<TelemetryService> = {
    interact: jest.fn()
  };

	const mockOfflineCardService :Partial<OfflineCardService> ={};


  const mockCslFrameworkService: Partial<CslFrameworkService> = {
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
});


