import { ConfigService, ToasterService, ResourceService, BrowserCacheTtlService } from '@sunbird/shared';
import { Router } from '@angular/router';
import { ContentService } from '../content/content.service';
import { PublicDataService } from '../public-data/public-data.service';
import { CacheService } from 'ng2-cache-service';
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
        SYSTEM_SETTING: {
          'CUSTODIAN_ORG': 'data/v1/system/settings/get/custodianOrgId',
        },
        TELEMETRY: {
          SYNC: true
        },
        CONTENT_PREFIX: ''
      }
    }
  };
  const mockCacheService: Partial<CacheService> = {
    set: jest.fn()
  };
  const mockBrowserCacheTtlService: Partial<BrowserCacheTtlService> = {};
  const mockContentService: Partial<ContentService> = {};
  const mockRouter: Partial<Router> = {};
  const mockToasterService: Partial<ToasterService> = {};
  const mockResourceService: Partial<ResourceService> = {};
  const mockLearnerService: Partial<LearnerService> = {
    post: jest.fn().mockImplementation(() => { }),
    get: jest.fn().mockImplementation(() => { of({})})
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
      const obj = {
        ServerResponse : {
        id: 'api',
        params: {
          status: 'success',
        },
        responseCode: 'OK',
        result: {
          response: {
            id: 'tncConfig',
            field: 'tncConfig',
            value: '{"latestVersion":"v4","v4":{"url":}}'
          }
        }
        }
      };
      orgDetailsService['getCustodianOrg'] = jest.fn(() => of(obj.ServerResponse)) as any;
  });

  beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
  });

  it('should be create a instance of org-details Service', () => {
      expect(orgDetailsService).toBeTruthy();
  });
});