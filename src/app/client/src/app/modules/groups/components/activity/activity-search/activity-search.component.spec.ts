import { CourseConsumptionService } from '@sunbird/learn';
import { FrameworkService, SearchService, FormService, UserService, OrgDetailsService } from '@sunbird/core';
import { ConfigService, ResourceService, ToasterService, PaginationService, UtilService, LayoutService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService } from '../../../../shared/services/cache-service/cache.service';
import { GroupsService } from '../../../services/groups/groups.service';
import { ActivityDashboardService } from '@sunbird/shared';
import {ActivitySearchComponent} from './activity-search.component';

xdescribe('ActivitySearchComponent', () => {
  let component: ActivitySearchComponent
  const mockResourceService: Partial<ResourceService> = {};
  const mockConfigService: Partial<ConfigService> = {
    appConfig: {
      SEARCH:{
        PAGE_LIMIT:100
      }
    },
    urlConFig: {
      URLS: {
        TELEMETRY: {
          SYNC: true
        },
        CONTENT_PREFIX: ''
      }
    }
  };
  const mockFrameworkService: Partial<FrameworkService> = {};
  const mockSearchService: Partial<SearchService> = {};
  const mockToasterService: Partial<ToasterService> = {};
  const mockFormService: Partial<FormService> = {};
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    queryParams: of({})
  };
  const mockPaginationService: Partial<PaginationService> = {
    getPager: jest.fn()
  };
  const mockUtilService: Partial<UtilService> = {
    isDesktopApp: true,
    isIos: true
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
    set: jest.fn(),
    get: jest.fn()
  };
  const mockRouter: Partial<Router> = {
    events: of({id: 1, url: 'sample-url'}) as any,
    navigate: jest.fn()
};
const mockGroupsService: Partial<GroupsService> = {
  emitMenuVisibility:jest.fn(),
  groupData: {
    id: '1'
  } as any
};
const mockGroupService: Partial<GroupsService> = {
  emitMenuVisibility:jest.fn(),
  groupData: {
    id: '1'
  } as any
};
const mockLayoutService: Partial<LayoutService> = {};
const mockCourseConsumptionService: Partial<CourseConsumptionService> = {};
const mockOrgDetailsService: Partial<OrgDetailsService> = {};
const mockActivityDashboardService: Partial<ActivityDashboardService>={};

beforeAll(async () => {
  component = await new ActivitySearchComponent(
    mockResourceService as ResourceService,
    mockConfigService as ConfigService,
    mockFrameworkService as FrameworkService,
    mockSearchService as SearchService,
    mockToasterService as ToasterService,
    mockFormService as FormService,
    mockActivatedRoute as ActivatedRoute,
    mockPaginationService as PaginationService,
    mockUtilService as UtilService,
    mockUserService as UserService,
    mockCacheService as CacheService,
    mockRouter as Router,
    mockGroupsService as GroupsService,
    mockLayoutService as LayoutService,
    mockCourseConsumptionService as CourseConsumptionService,
    mockOrgDetailsService as OrgDetailsService,
    mockGroupService as GroupsService,
    mockActivityDashboardService as ActivityDashboardService
  );
});

beforeEach(() => {
  jest.clearAllMocks();
});
 it('ActivitySearchComponent  instance has to be created',() => {
    expect(component).toBeTruthy();
 });

});
