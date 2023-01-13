import { of, throwError } from 'rxjs';
import { ConfigService } from '../../../shared/services/config/config.service';
import { HttpClient } from '@angular/common/http';
import { TenantService } from './tenant.service';
import { LearnerService, UserService } from '../../../core';
import { CacheService } from "ng2-cache-service";
import { response } from './tenant.service.spec.data';

describe('TenantService', () => {
  let tenantService: TenantService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        OTP: {
          GENERATE: 'otp/v1/generate',
          VERIFY: 'otp/v1/verify',
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
    jest.spyOn(tenantService, 'get').mockReturnValue(of(response.defaultTenant)) as any;
    const res = tenantService.get({} as any);
    expect(res).toEqual(response.defaultTenant);
  });
});