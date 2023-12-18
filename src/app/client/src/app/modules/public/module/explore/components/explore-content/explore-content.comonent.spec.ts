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
import { CslFrameworkService } from '../../../../../public/services/csl-framework/csl-framework.service';
import { ExploreContentComponent } from './explore-content.component';

describe('ExploreContentComponent', () => {
  let component: ExploreContentComponent;

  const mockSearchService: Partial<SearchService> = {
    getContentTypes: jest.fn(),
  };
  const mockRouter: Partial<Router> = {};
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    queryParams: of({}),
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
  const mockPublicPlayerService: Partial<PublicPlayerService> = {};
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
    contentDownloadStatus$: of({ enrolledCourses: [{ identifier: 'COMPLETED' }] }),
    } as any;
  const mockOfflineCardService: Partial<OfflineCardService> = {};
  const mockTelemetryService: Partial<TelemetryService> = {};
  const mockSchemaService: Partial<SchemaService> = {};
  const mockCslFrameworkService: Partial<CslFrameworkService> = {
        getFrameworkCategories: jest.fn(),
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
    jest.spyOn(mockCslFrameworkService, 'getFrameworkCategories' as any).mockReturnValue(of({}));
    jest.spyOn(mockCslFrameworkService, 'getAlternativeCodeForFilter' as any).mockReturnValue(of({}));
    jest.spyOn(mockCslFrameworkService, 'transformDataForCC' as any).mockReturnValue(['key1', 'key2']);
    const mockFormData = [
      { title: 'frmelmnts.tab.all', search: { facets: 'yourMockedFacets' } },
    ];
    jest.spyOn(mockSearchService, 'getContentTypes').mockReturnValue(of(mockFormData));
    const goBackSpy = jest.spyOn(mockNavigationHelperService, 'goBack');
    component.ngOnInit();
    expect(jest.spyOn(component.cslFrameworkService, 'getFrameworkCategories')).toHaveBeenCalled();
    expect(jest.spyOn(component.cslFrameworkService, 'getAlternativeCodeForFilter')).toHaveBeenCalled();
    expect(jest.spyOn(component.cslFrameworkService, 'transformDataForCC')).toHaveBeenCalled();
    expect(jest.spyOn(mockSearchService, 'getContentTypes')).toHaveBeenCalled();
    expect(goBackSpy).not.toHaveBeenCalled();
    expect(component.hashTagId).toEqual('MockedHashTagId');
    expect(component.initFilters).toBeTruthy();
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
    const filters = { filters: { otherFilter: 'someValue' } };
    component.getFilters(filters);
    expect(component.selectedFilters).toEqual({ otherFilter: 'someValue' });
  });

  it('should emit default filters', () => {
    const filters =  { filters: { otherFilter: 'someValue' } };
    const emitSpy = jest.spyOn(component.dataDrivenFilterEvent, 'emit');
    component.getFilters(filters);
    expect(emitSpy).toHaveBeenCalled();
  });

});
