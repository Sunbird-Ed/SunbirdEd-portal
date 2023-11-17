import { of, EMPTY } from 'rxjs';
import { ConfigService } from '../../../shared/services/config/config.service';
import { HttpClient } from "@angular/common/http";
import { FormService } from './form.service';
import { UserService } from '../../services/user/user.service';
import { PublicDataService } from '../../services/public-data/public-data.service';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { BrowserCacheTtlService } from '../../../shared/services/browser-cache-ttl/browser-cache-ttl.service'
import { mockFormData } from './form.mock.spec.data';
import { OrgDetailsService } from '../org-details/org-details.service';
describe('FormService', () => {
  let formService: FormService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        dataDrivenForms: {
          READ: 'data/v1/form/read'
        }
      }
    },
    appConfig:{
      formApiTypes:{

      }
    }
  };
  const mockCacheService: Partial<CacheService> = {
    set: jest.fn(),
    get: jest.fn().mockReturnValue(of({
      id: 'id',
      params: {
        resmsgid: '',
        status: 'staus'
      },
      responseCode: 'OK',
      result: {},
      ts: '',
      ver: ''
    }))
  };
  const mockBrowserCacheTtlService: Partial<BrowserCacheTtlService> = {};
  const mockOrgDetailsService: Partial<OrgDetailsService> = {
        getCustodianOrgDetails: jest.fn(),
        getOrgDetails: jest.fn()
  };
  const mockPublicDataService: Partial<PublicDataService> = {
    get: jest.fn().mockImplementation(() => { }),
    post: jest.fn(() => of(mockFormData.success))
  };
  function createMockUserService(loggedIn: boolean, hashTagId: string, slug: string): Partial<UserService> {
  return {
    loggedIn,
    slug: slug,
      userData$: of({
        userProfile: {
          userId: 'sample-uid',
          rootOrgId: 'sample-root-id',
          rootOrg: {},
          hashTagIds: ['id']
        } as any
      }) as any,
      setIsCustodianUser: jest.fn(),
      userid: 'sample-uid',
      appId: 'sample-id',
      getServerTimeDiff: '',
      hashTagId,
    };
  }
  const mockUserService = createMockUserService(true, 'userHashTagId','sample-slug');
  const mockHttpClient: Partial<HttpClient> = {
  };
  beforeAll(() => {
    formService = new FormService(
      mockUserService as UserService,
      mockConfigService as ConfigService,
      mockPublicDataService as PublicDataService,
      mockCacheService as CacheService,
      mockBrowserCacheTtlService as BrowserCacheTtlService,
      mockOrgDetailsService as OrgDetailsService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  it('should create a instance of FormService', () => {
    expect(formService).toBeTruthy();
  });

  describe('setForm', () => {
    it('should set form data in cache with the correct key and value', () => {
      const formKey = 'exampleFormKey';
      const formData = { field1: 'value1', field2: 'value2' };
      formService.setForm(formKey, formData);
      const expectedKey = btoa(formKey);
      expect(mockCacheService.set).toHaveBeenCalledWith(expectedKey, formData, {
        maxAge: mockBrowserCacheTtlService.browserCacheTtl
      });
    });
    it('should handle errors when setting form data in cache', () => {
      const formKey = 'exampleFormKey';
      const formData = { field1: 'value1', field2: 'value2' };
      mockCacheService.set = jest.fn(() => {
        throw new Error('Cache error');
      });
      expect(() => formService.setForm(formKey, formData)).toThrowError('Cache error');
    });

  });

  describe('getHashTagID', () => {
    it('should return user hashTagId when logged in', () => {
      formService.getHashTagID().subscribe((result) => {
        expect(result).toBe('userHashTagId');
      });
    });

    it('should return hashTagId from orgDetailsService when userService has a slug', () => {
      const mockOrgDetails = {
        id: 'orgId',
        params: {
          resmsgid: '',
          status: 'status',
        },
        responseCode: 'OK',
        result: {
          hashTagId: 'orgHashTagId',
        },
        ts: '',
        ver: '',
      };
      jest.spyOn(formService['orgDetailsService'], 'getOrgDetails').mockReturnValue(of(mockOrgDetails));
      formService['userService'] = createMockUserService(false, 'userHashTagId', 'sample-slug') as UserService;
      formService.getHashTagID().subscribe((result) => {
      expect(result).toBe('orgHashTagId');
      expect(formService['orgDetailsService'].getOrgDetails).toHaveBeenCalledWith('sample-slug');
      });
    });

    it('should return hashTagId from custodian orgDetailsService when userService has no slug', () => {
      const mockCustodianOrgDetails = {
        id: 'custodianOrgId',
        params: {
          resmsgid: '',
          status: 'status',
        },
        responseCode: 'OK',
        result: {
          response: {
            value: 'custodianHashTagId',
          },
        },
        ts: '',
        ver: '',
      };
      jest.spyOn(formService['orgDetailsService'], 'getCustodianOrgDetails').mockReturnValue(of(mockCustodianOrgDetails));
      formService['userService'] = createMockUserService(false, 'sluguserHashTagId', null) as UserService;
      formService.getHashTagID().subscribe((result) => {
        expect(result).toBe('custodianHashTagId');
        expect(formService['orgDetailsService'].getCustodianOrgDetails).toHaveBeenCalled();
      });
    });
  });

});