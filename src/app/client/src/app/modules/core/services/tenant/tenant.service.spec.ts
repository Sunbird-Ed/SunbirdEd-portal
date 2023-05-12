import { of, throwError } from 'rxjs';
import { ConfigService } from '../../../shared/services/config/config.service';
import { HttpClient } from '@angular/common/http';
import { TenantService } from './tenant.service';
import { LearnerService, UserService } from '../../../core';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { response } from './tenant.service.spec.data';

describe('TenantService', () => {
  let tenantService: TenantService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        OTP: {
          GENERATE: 'otp/v1/generate',
          VERIFY: 'otp/v1/verify',
        },
        TENANT: {
          INFO: 'sunbird'
        },
        SYSTEM_SETTING: {
          TENANT_CONFIG: 'sunbird'
        }
      }
    }
  };
  const mockLearnerService: Partial<LearnerService> = {
    post: jest.fn().mockImplementation(() => { })
  };
  const mockHttpClient: Partial<HttpClient> = {
  };
  const mockUserService: Partial<UserService> = {
    loggedIn: true,
    slug: jest.fn().mockReturnValue("tn") as any,
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
  };
  const mockCacheService: Partial<CacheService> = {
    set: jest.fn()
  };
  beforeAll(() => {
    tenantService = new TenantService(
      mockHttpClient as HttpClient,
      mockConfigService as ConfigService,
      mockCacheService as CacheService,
      mockLearnerService as LearnerService,
      mockUserService as UserService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of OtpService', () => {
    expect(tenantService).toBeTruthy();
  });

  it('should call get tenant config', () => {
    tenantService.get = jest.fn().mockReturnValue(response.defaultTenant)
    response.defaultTenant
    const res = tenantService.get({} as any);
    expect(res as any).toEqual(response.defaultTenant);
  });

  it('should make api call to get tenant config invalid case', () => {
    const params = 'test';
    mockLearnerService.get = jest.fn().mockReturnValue(of(response.tenantConfigInvalid));
    tenantService.getTenantConfig(params).subscribe((result) => {
      expect(result).toEqual({});
    });
  });

  it('should make api call to get tenant config valid', () => {
    const params = 'test';
    mockLearnerService.get = jest.fn().mockReturnValue(of(response.tenantConfigValid));
    tenantService.getTenantConfig(params).subscribe((result) => {
      expect(result).toBeTruthy();
    });
  });

  it('should return api call to get tenant config', () => {
    const params = 'test';
    mockLearnerService.get = jest.fn().mockReturnValue(of(response.tenantConfigValid));
    tenantService.getSlugDefaultTenantInfo(params).subscribe((result) => {
      expect(result).toBeTruthy();
    });
  });

  it('should call initialize', () => {
    const params = 'test';
    mockLearnerService.get = jest.fn().mockReturnValue(of(response.tenantConfigValid));
    mockCacheService.exists = jest.fn().mockReturnValue(of(true));
    mockCacheService.get = jest.fn().mockReturnValue(of(response.tenantConfigValid));
    tenantService.initialize();
    tenantService._tenantSettings$.subscribe(
      data => {
        expect(data).toBeDefined();
      }
    );
  });

});
