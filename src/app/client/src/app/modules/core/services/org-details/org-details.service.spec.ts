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
  const mockPublicDataService: Partial<PublicDataService> = {
    postWithHeaders: jest.fn(),
    post: jest.fn().mockImplementation(() => {})
  };

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

  it('should set and get orgInfo correctly', () => {
    const orgdata = { id: 'org123', name: 'Organization' };
    orgDetailsService.setOrg(orgdata);
    const retrievedOrg = orgDetailsService.getOrg();
    expect(retrievedOrg).toEqual(orgdata);
  });

  it('should return coming soon message for orgids', () => {
    const orgids = ['org1', 'org2'];
    const systemSetting = {
      url: 'sample-url'
    };
    const contentComingSoon = {
      result: {
        response: {
          value: JSON.stringify({
            org1: 'Coming soon for org1',
            org2: 'Coming soon for org2'
          })
        }
      }
    };

    jest.spyOn(orgDetailsService['learnerService'] as any, 'get').mockReturnValue(of(contentComingSoon));
    const cacheSetSpy = jest.spyOn(orgDetailsService['cacheService'], 'set');
    const expectedMessage = {
      org1: 'Coming soon for org1',
      org2: 'Coming soon for org2'
    };

    orgDetailsService.getCommingSoonMessage(orgids).subscribe((message) => {
      expect(message).toEqual(expectedMessage);
      expect(cacheSetSpy).toHaveBeenCalledWith('contentComingSoon', expectedMessage, {
        maxAge: expect.any(Number)
      });
    });
  });

  it('should return an empty object if orgids are not provided', () => {
    const orgids = null;

    orgDetailsService.getCommingSoonMessage(orgids).subscribe((message) => {
      expect(message).toEqual({});
    });
  });

  it('should return an empty object if system setting response is empty', () => {
    const orgids = ['org1', 'org2'];
    const systemSetting = {
      url: 'sample-url'
    };
    const contentComingSoon = {
      result: {}
    };

    jest.spyOn(orgDetailsService['learnerService'] as any, 'get').mockReturnValue(of(contentComingSoon));

    orgDetailsService.getCommingSoonMessage(orgids).subscribe((message) => {
      expect(message).toEqual({});
    });
  });

  it('should return an empty object if system setting response value is not valid JSON', () => {
    const orgids = ['org1', 'org2'];
    const systemSetting = {
      url: 'sample-url'
    };
    const contentComingSoon = {
      result: {
        response: {
          value: 'invalid-json'
        }
      }
    };

    jest.spyOn(orgDetailsService['learnerService'] as any, 'get').mockReturnValue(of(contentComingSoon));

    orgDetailsService.getCommingSoonMessage(orgids).subscribe((message) => {
      expect(message).toEqual({});
    });
  });

  it('should return an empty object if learnerService.get fails', () => {
    const orgids = ['org1', 'org2'];
    const systemSetting = {
      url: 'sample-url'
    };

    jest.spyOn(orgDetailsService['learnerService'], 'get').mockReturnValue(throwError('Error'));

    orgDetailsService.getCommingSoonMessage(orgids).subscribe((message) => {
      expect(message).toEqual({});
    });
  });

  it('should return custodian org details', () => {
    orgDetailsService._custodianOrg$ = 'mock' as any;
    const custodianOrgDetails = orgDetailsService.getCustodianOrgDetails();
    expect(custodianOrgDetails).toEqual('mock');
  });

  it('should process org data', () => {
    const channels = [{ name: 'orgId1' }, { name: 'orgId2' }];
    const rootOrgIds = orgDetailsService.processOrgData(channels);
    expect(rootOrgIds).toEqual(['orgId1', 'orgId2']);
  });

   it('should return the server time difference', () => {
    const timeDiff = orgDetailsService.getServerTimeDiff;
    expect(timeDiff).toBeUndefined();
  });

  it('should return the root org ID', () => {
    const rootOrgId = orgDetailsService.getRootOrgId;
    expect(rootOrgId).toBeUndefined();
  });

  it('should return the comming soon message object for a given rootOrgId', () => {
    const data = [
        { rootOrgId: 'org1', message: 'Message 1' },
        { rootOrgId: 'org2', message: 'Message 2' },
        { rootOrgId: 'org3', message: 'Message 3' }
    ];
    const orgids = ['org2'];
    const result = orgDetailsService.getCommingSoonMessageObj(data, orgids);

    expect(result).toEqual({ rootOrgId: 'org2', message: 'Message 2' });
  });

  it('should return an empty object if data is empty', () => {
      const data = [];
      const orgids = ['org1'];

      const result = orgDetailsService.getCommingSoonMessageObj(data, orgids);

      expect(result).toEqual({});
  });

  it('should return an empty object if no matching rootOrgId is found', () => {
    jest.spyOn(orgDetailsService, 'getCommingSoonMessageObj').mockReturnValue({});
      const data = [
          { rootOrgId: 'org1', message: 'Message 1' },
          { rootOrgId: 'org2', message: 'Message 2' }
      ];
      const orgids = ['org3'];
      const result = orgDetailsService.getCommingSoonMessageObj(data, orgids);
      expect(result).toEqual({});
  });

  it('should handle error when API call fails', () => {
    const getElementByIdMock = jest.spyOn(document, 'getElementById');
    getElementByIdMock.mockReturnValue({ value: 'mockedValue' } as HTMLInputElement);
    jest.spyOn(mockPublicDataService as any,'postWithHeaders').mockReturnValue(throwError({}));

    orgDetailsService.getOrgDetails().subscribe({
      error: (err) => {
        expect(err).toBeDefined();
      }
    });
  });
});