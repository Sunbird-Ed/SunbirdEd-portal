import { ConfigService, ToasterService, ResourceService, BrowserCacheTtlService } from '@sunbird/shared';
import { Router } from '@angular/router';
import { ContentService } from '../content/content.service';
import { PublicDataService } from '../public-data/public-data.service';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { LearnerService } from '../learner/learner.service';
import { OrgDetailsService } from './org-details.service';
import { of, throwError } from 'rxjs';

describe('OrgDetailsService', () => {
  let orgDetailsService: OrgDetailsService;
  const mockConfig: Partial<ConfigService> = {
    appConfig: {
      layoutConfiguration: 'joy',
      TELEMETRY: {
        PID: 'sample-page-id'
      }
    },
    urlConFig: {
      URLS: {
        ADMIN: {
          ORG_SEARCH: 'org/v2/search'
        },
        SYSTEM_SETTING: {
          CUSTODIAN_ORG: 'data/v1/system/settings/get/custodianOrgId',
        }
      }
    }
  };
  const mockCacheService: Partial<CacheService> = {
    set: jest.fn(),
    get: jest.fn()
  };
  const obj = {
    ServerResponse: {
      'id': 'org.search',
      'ver': 'v2',
      'ts': '',
      'responseCode': 'OK',
      'result': {
        'response': {
          'count': 1,
          'content': [
            {
              'keys': {},
              'channel': 'ntp',
              'description': 'NTP Pre-prod Organization',
              'updatedDate': null,
              'organisationType': 5,
              'isTenant': true,
              'provider': null,
              'id': '01268904781886259221',
              'hashTagId': '01268904781886259221',
              'status': 1
            }
          ]
        }
      }
    }
  };
  const mockBrowserCacheTtlService: Partial<BrowserCacheTtlService> = {};
  const mockContentService: Partial<ContentService> = {};
  const mockRouter: Partial<Router> = {};
  const mockToasterService: Partial<ToasterService> = {};
  const mockResourceService: Partial<ResourceService> = {};
  const mockLearnerService: Partial<LearnerService> = {
    post: jest.fn().mockImplementation(() => { }),
    get: jest.fn().mockImplementation(() => { of({}) })
  };
  const mockPublicDataService: Partial<PublicDataService> = {};

  beforeAll(() => {
    orgDetailsService = new OrgDetailsService(
      mockConfig as ConfigService,
      mockCacheService as CacheService,
      mockBrowserCacheTtlService as BrowserCacheTtlService,
      mockContentService as ContentService,
      mockRouter as Router,
      mockToasterService as ToasterService,
      mockResourceService as ResourceService,
      mockLearnerService as LearnerService,
      mockPublicDataService as PublicDataService
    );
    orgDetailsService['getCustodianOrg'] = jest.fn(() => of(obj.ServerResponse)) as any;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should be create a instance of org-details Service', () => {
    expect(orgDetailsService).toBeTruthy();
  });

  describe('searchOrg', () => {
    it('should call the search org method', () => {
      mockPublicDataService.post = jest.fn(() => of(obj.ServerResponse)) as any;
      orgDetailsService.searchOrg().subscribe((data) => {
        expect(mockPublicDataService.get).toHaveBeenCalled();
      });
    });
    it('should call the search org method get from the cacheService', () => {
      mockPublicDataService.post = jest.fn(() => of(obj.ServerResponse)) as any;
      orgDetailsService.searchOrg().subscribe((data) => {
        expect(data).toBe(of(obj));
      });
    });
    it('should call the search org method get the data', () => {
      mockPublicDataService.post = jest.fn(() => of(obj.ServerResponse)) as any;
      orgDetailsService.searchOrgDetails({}).subscribe((data) => {
        expect(data).toBe(of(obj));
      });
    });
  });

  describe('setOrgDetailsToRequestHeaders', () => {
    it('should call set org details to request headers method ', () => {
      const obj = {
        id: '123456789',
        hashTagId: '9876543210',
      };
      orgDetailsService.orgDetails = obj;
      orgDetailsService.setOrgDetailsToRequestHeaders();
      expect(orgDetailsService['learnerService'].rootOrgId).toBe(obj.id);
      expect(orgDetailsService['learnerService'].channelId).toBe(obj.hashTagId);
      expect(orgDetailsService['contentService'].rootOrgId).toBe(obj.id);
      expect(orgDetailsService['contentService'].channelId).toBe(obj.hashTagId);
      expect(orgDetailsService['publicDataService'].rootOrgId).toBe(obj.id);
      expect(orgDetailsService['publicDataService'].channelId).toBe(obj.hashTagId);
    });
  });

});