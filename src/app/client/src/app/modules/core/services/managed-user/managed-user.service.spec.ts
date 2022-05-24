import { of, throwError } from "rxjs";
import { ConfigService } from '../../../shared/services/config/config.service';
import { HttpClient } from "@angular/common/http";
import { ManagedUserService } from './managed-user.service';
import { LearnerService, UserService } from '../../../core';
import { CacheService } from 'ng2-cache-service';
import { TelemetryService } from '../../../telemetry/services';

describe('ManagedUserService', () => {
  let managedUserService: ManagedUserService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        LEARNER_PREFIX: '/learner/'
      }
    }
  };
  const mockHttpClient: Partial<HttpClient> = {
  };
  const mockLearnerService: Partial<LearnerService> = {
    post: jest.fn().mockImplementation(() => { })
  };
  const mockUserService: Partial<UserService> = {
    userData$: of({
      userProfile: {
        userId: 'sample-uid',
        rootOrgId: 'sample-root-id',
        rootOrg: {},
        hashTagIds: ['id'],
        profileUserType: {
          type: 'student'
        }
      } as any
    }) as any,
    slug: jest.fn() as any
  };
  const mockTelemetryService: Partial<TelemetryService> = {};
  const mockCacheService: Partial<CacheService> = {
    set: jest.fn()
  };
  beforeAll(() => {
    managedUserService = new ManagedUserService(
      mockConfigService as ConfigService,
      mockHttpClient as HttpClient,
      mockLearnerService as LearnerService,
      mockUserService as UserService,
      mockTelemetryService as TelemetryService,
      mockCacheService as CacheService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of ManagedUserService', () => {
    expect(managedUserService).toBeTruthy();
    expect(managedUserService.instance).toBe('SUNBIRD');
  });
});