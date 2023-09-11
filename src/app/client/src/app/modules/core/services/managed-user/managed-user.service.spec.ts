import { of, throwError } from "rxjs";
import { ConfigService } from '../../../shared/services/config/config.service';
import { HttpClient } from "@angular/common/http";
import { ManagedUserService } from './managed-user.service';
import { LearnerService, UserService } from '../../../core';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
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
    getUserData: jest.fn(() => of({ uid: 'sample-id' }) as any),
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
  describe('setSwitchUserData', () => {
    it('should set switch user data', () => {
      const userid = 'sample-user-id';
      const usersid = 'sample-switch-userid';
      jest.spyOn(document, 'getElementById').mockImplementation(() => {
        return {
          dir: 'dir',
          draggable: true,
          hidden: true,
          innerText: 'inner-text'
        } as any;
      });
      mockTelemetryService.setSessionIdentifier = jest.fn();
      mockUserService.setUserId = jest.fn();
      mockUserService.initialize = jest.fn();
      managedUserService.setSwitchUserData(userid, usersid);
      expect(mockTelemetryService.setSessionIdentifier).toHaveBeenCalled();
      expect(mockUserService.setUserId).toHaveBeenCalled();
      expect(mockUserService.initialize).toHaveBeenCalled();
    });
  });

  describe('getUserId', () => {
    it('should return managedby userId', () => {
      managedUserService.userService = {
        userProfile: {
          managedBy: 'sample-manage-id'
        }
      } as any;
      managedUserService.getUserId();
      expect(managedUserService.userService.userProfile.managedBy).toBeTruthy();
    });

    it('should return userId if managedBy is not available', () => {
      managedUserService.userService = {
        userProfile: {
          managedBy: false
        },
        userid: 'sample-user-id'
      } as any;
      managedUserService.getUserId();
      expect(managedUserService.userService.userProfile.managedBy).toBeFalsy();
      expect(managedUserService.userService.userid).toBe('sample-user-id');
    });
  });

  describe('getParentProfile', () => {
    it('should return userData if profile is not available in cache', () => {
      mockCacheService.get = jest.fn(() => ({userProfile: {}}));
      mockUserService.getUserData = jest.fn(() => of([{ uid: 'sample-id' }])) as any;
      jest.spyOn(managedUserService, 'getUserId').mockImplementation(() => {
        return 'sample-user-id';
      });      // act
      const profile = managedUserService.getParentProfile();
      expect(mockCacheService.get).toHaveBeenCalled();
      expect(profile).toBeTruthy();
    });

    it('should return userProfile if available in cache', () => {
      mockCacheService.get = jest.fn(() => ({
        userProfile: {
          uid: 'sample-uid',
          profileType: 'sample-type'
        }
      }));
      // act
      const profile = managedUserService.getParentProfile();
      expect(mockCacheService.get).toHaveBeenCalled();
      expect(profile).toBeTruthy();
    });
  });

  describe('fetchManagedUserList', () => {
    it('should return managed user list', () => {
      jest.spyOn(managedUserService, 'getUserId').mockImplementation(() => {
        return 'sample-user-id';
      });
      mockConfigService.urlConFig = {
        URLS: {
          USER: {
            GET_MANAGED_USER: ''
          }
        }
      };
      mockLearnerService.get = jest.fn(() => of({
        result: {
          response: {
            content: {
              id: 'sample-id'
            },
            uid: 'sample-uid',
            framework: []
          }
        }
      })) as any;
      managedUserService.fetchManagedUserList();
      expect(mockLearnerService.get).toHaveBeenCalled();
    });

    it('should not return managed user list for catch part', () => {
      jest.spyOn(managedUserService, 'getUserId').mockImplementation(() => {
        return 'sample-user-id';
      });
      mockConfigService.urlConFig = {
        URLS: {
          USER: {
            GET_MANAGED_USER: ''
          }
        }
      };
      mockLearnerService.get = jest.fn(() => throwError({
        uid: 'sample-uid',
        framework: []
      })) as any;
      managedUserService.fetchManagedUserList();
      expect(mockLearnerService.get).toHaveBeenCalled();
    });
  });

  it('should update user list', () => {
    const data = 'sample-data';
    const response = managedUserService.updateUserList(data);
    expect(response).toBeUndefined();
  });

  it('should invoked initiateSwitchUser method', () => {
    const request = {
      userId: 'sample-user-id',
      isManagedUser: true
    };
    managedUserService.configService = {
      urlConFig: {
        URLS: {
          USER: {
            SWITCH_USER: 'SWITCH_USER'
          }
        }
      }
    } as any;
    mockHttpClient.get = jest.fn();
    managedUserService.initiateSwitchUser(request);
    expect(mockHttpClient.get).toHaveBeenCalledWith('SWITCH_USER/sample-user-id?isManagedUser=true');
  });

  it('should return error message', () => {
    const message = 'sample-message';
    const name = 'sample-name';
    const errormessage = managedUserService.getMessage(message, name);
    expect(errormessage).toBe(message);
  });

  describe('processUserList', () => {
    it('should return proccess list', () => {
      const userList = [{
        firstName: ['sample-first-name', 's-f-name'],
        identifier: 'do-123'
      }];
      const currentUserId = 'do-234';
      const userlist = managedUserService.processUserList(userList, currentUserId);
      expect(userList).toEqual([
        {
          firstName: ['sample-first-name', 's-f-name'],
          identifier: 'do-123',
          initial: 'sample-first-name',
          selected: false,
          title: [
            'sample-first-name',
            's-f-name'
          ],
        }
      ]);
    });
  });
});
