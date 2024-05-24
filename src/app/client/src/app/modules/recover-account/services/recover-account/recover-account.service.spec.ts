import { RecoverAccountService } from './recover-account.service';
import { TenantService } from '@sunbird/core';
import { of } from 'rxjs';
import { LearnerService } from '../../../core';
import { ConfigService } from '../../../shared';

describe('RecoverAccountService', () => {
  let component: RecoverAccountService;

  const mockLearnerService: Partial<LearnerService> = {
    post: jest.fn()
  };
  const mockTenantService: Partial<TenantService> = {
    tenantData$: of({ tenantData: { titleName: 'sample-favicon', logo: "logo-path" } }) as any
  };
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        ACCOUNT_RECOVERY: {
          FUZZY_SEARCH: "user/v1/fuzzy/search",
          RESET_PASSWORD: "user/v1/password/reset"
        },
        OTP: {
          GENERATE: "otp/v2/generate",
          VERIFY: "otp/v2/verify",
          ANONYMOUS: {
            GENERATE: "anonymous/otp/v2/generate",
          },
        },
      }
    }
  };

  beforeAll(() => {
    component = new RecoverAccountService(
      mockTenantService as TenantService,
      mockLearnerService as LearnerService,
      mockConfigService as ConfigService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call resetPassword API',
    () => {
      const params = { 'request': { 'type': 'user', 'key': 'testKey', 'userId': 'testUserId' } };
      jest.spyOn(mockLearnerService, 'post');

      component.resetPassword(params);
      const options = { url: 'user/v1/password/reset', data: params };
      expect(mockLearnerService.post).toHaveBeenCalledWith(options);
    });

  it('should call generateOTP API', () => {
    const params = { 'request': { 'type': 'user', 'key': 'testKey', 'userId': 'testUserId' } };
    jest.spyOn(mockLearnerService, 'post');
    component.generateOTP(params);
    const options = { url: 'anonymous/otp/v2/generate?captchaResponse=undefined', data: params };
    expect(mockLearnerService.post).toHaveBeenCalledWith(options);
  });

  it('should call verifyOTP API', () => {
    const params = { 'request': { 'type': 'user', 'key': 'testKey', 'userId': 'testUserId' } };
    jest.spyOn(mockLearnerService, 'post');
    component.verifyOTP(params);
    const options = { url: 'otp/v2/verify', data: params };
    expect(mockLearnerService.post).toHaveBeenCalledWith(options);
  });

  it('should call fuzzyUserSearch API for email', () => {
    const params = {
      'request': {
        'filters': {
          'isDeleted': 'false',
          'fuzzy': {
            'firstName': undefined
          },
          $or: {
            'email': undefined,
            'prevUsedEmail': undefined
          }
        }
      }
    };
    jest.spyOn(mockLearnerService, 'post');
    component.fuzzyUserSearch(params);
    const options = { url: 'user/v1/fuzzy/search?captchaResponse=undefined', data: params };
    expect(mockLearnerService.post).toHaveBeenCalledWith(options);
  });

  it('should call fuzzyUserSearch API for phone', () => {
    const params = {
      'identifier': 9000000000,
      'request': {
        'filters': {
          'isDeleted': 'false',
          'fuzzy': {
            'firstName': undefined
          },
          $or: {
            'phone': 9000000000,
            'prevUsedPhone': 9000000000
          }
        }
      }
    };
    jest.spyOn(mockLearnerService, 'post');
    component.fuzzyUserSearch(params);
    const options = { url: 'user/v1/fuzzy/search?captchaResponse=undefined', data: params };
    expect(mockLearnerService.post).toHaveBeenCalled();
  });
});
