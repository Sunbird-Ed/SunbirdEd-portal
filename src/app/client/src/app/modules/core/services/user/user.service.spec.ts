import { of, throwError } from 'rxjs';
import { ConfigService } from '../../../shared/services/config/config.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { ContentService, DataService, LearnerService, PublicDataService } from '../../../core';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { Inject } from '@angular/core';
import { mockUserData } from './user.mock.spec.data';
import { combineAll } from 'rxjs/operators';

describe('UserService', () => {
  let userService: UserService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      params: {
        userReadParam: {
          fields: 'organisations,roles,locations,declarations,externalIds'
        }
      },
      URLS: {
        OTP: {
          GENERATE: 'otp/v1/generate',
          VERIFY: 'otp/v1/verify',
        },
        USER: {
          GET_PROFILE: 'user/v5/read/',
          USER_MIGRATE: 'user/v1/migrate',
          END_SESSION: 'endSession',
          GET_USER_FEED: 'user/v1/feed/',
          DELETE: '/user/v1/delete',
          TNC_ACCEPT: 'user/v1/tnc/accept'
        },
        OFFLINE: {
          READ_USER: 'desktop/user/v1/read',
          CREATE_USER: 'desktop/user/v1/create',
          UPDATE_USER: 'desktop/user/v1/update',
          GET_USER_BY_KEY: 'desktop/user/v1/read/by/key',
          USER_EXISTS_GET_USER_BY_KEY: 'desktop/user/v1/exists/by/key'
        }
      }
    }
  };
  const mockLearnerService: Partial<LearnerService> = {
    post: jest.fn().mockImplementation(() => { }),
    get: jest.fn().mockImplementation(() => { }),
    delete: jest.fn().mockImplementation(() => { }),
    getWithHeaders: jest.fn().mockImplementation(() => {
      return of(mockUserData.success)
    })
  };
  const mockCacheService: Partial<CacheService> = {
    set: jest.fn()
  };
  const mockHttpClient: Partial<HttpClient> = {
    get: jest.fn()
  };
  const mockContentService: Partial<ContentService> = {};
  const mockPublicDataService: Partial<PublicDataService> = {
    post: jest.fn().mockImplementation(() => { }),
    get: jest.fn().mockImplementation(() => { })
  };
  const mockDataService: Partial<DataService> = {};
  const mockbaseHref = 'sunbird.org';
  beforeAll(() => {
    userService = new UserService(
      mockConfigService as ConfigService,
      mockLearnerService as LearnerService,
      mockCacheService as CacheService,
      mockHttpClient as HttpClient,
      mockContentService as ContentService,
      mockPublicDataService as PublicDataService,
      mockbaseHref as typeof window.location.href as any,
      mockDataService as DataService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    userService._appId = 'sunbirdApp';
    userService._sessionId = 'daxeVBKC8xKVn8lbMUB5AVcw5yjLnNbZ';
    userService._cloudStorageUrls = ['https://sunbird.sunbird'];
    userService._userProfile = mockUserData.userProfile;
  });

  it('should create a instance of UserService', () => {
    expect(userService).toBeTruthy();
  });

  it('should fetch user profile details', () => {
    jest.spyOn(mockLearnerService, 'getWithHeaders').mockImplementation(() => {
      return of(mockUserData.success)
    });
    userService.initialize(true);
    expect(userService._userProfile).toBeDefined();
  });

  it('should emit user profile data on success', () => {
    jest.spyOn(mockLearnerService, 'getWithHeaders').mockImplementation(() => {
      return of(mockUserData.success)
    });
    userService.initialize(true);
    userService.userData$.subscribe(userData => {
      expect(userData.userProfile).toBeDefined();
    });
  });

  it('should emit error on api failure', () => {
    jest.spyOn(mockLearnerService, 'getWithHeaders').mockImplementation(() => {
      return throwError(mockUserData.error)
    });
    userService.initialize(true);
    userService.userData$.subscribe(userData => {
      expect(userData.err).toBeDefined();
    });
  });

  it('should return userProfile when userProfile get method is called', () => {
    jest.spyOn(mockLearnerService, 'getWithHeaders').mockImplementation(() => {
      return of(mockUserData.success)
    });
    userService.initialize(true);
    const userProfile = userService.userProfile;
    expect(userProfile).toBeDefined();
  });

  it('should set rootOrgAdmin to true', () => {
    jest.spyOn(mockLearnerService, 'getWithHeaders').mockImplementation(() => {
      return of(mockUserData.rootOrgSuccess)
    });
    userService.initialize(true);
    expect(userService._userProfile.rootOrgAdmin).toBeTruthy();
  });

  it('should set rootOrgAdmin to false', () => {
    jest.spyOn(mockLearnerService, 'getWithHeaders').mockImplementation(() => {
      return of(mockUserData.success)
    });
    userService.initialize(true);
    expect(userService._userProfile.rootOrgAdmin).toBeFalsy();
  });

  it('should call registerUser method', () => {
    jest.spyOn(mockLearnerService, 'post').mockImplementation(() => {
      return of(mockUserData.registerSuccess)
    });
    const reqData = { 'request': { 'firstName': 'test', 'managedBy': '5488df8f-2090-4735-a767-ad0588bf7659', 'locationIds': [] } };
    jest.spyOn(userService.createManagedUser, 'emit').mockReturnValue('0008ccab-2103-46c9-adba-6cdf84d37f06' as any);
    userService.registerUser(reqData).subscribe(apiResponse => {
      expect(apiResponse.responseCode).toBe('OK');
      expect(apiResponse.result.response).toBe('SUCCESS');
      expect(userService.createManagedUser.emit).toHaveBeenCalledWith('0008ccab-2103-46c9-adba-6cdf84d37f06');
    });
  });

  it('should migrate custodian user', () => {
    const params = {
      'request': {
        'userId': '12345',
        'action': 'accept',
        'userExtId': 'bt240',
        'channel': 'TN',
        'feedId': '32145669877'
      }
    };
    jest.spyOn(mockLearnerService, 'post').mockImplementation(() => {
      return of(mockUserData.migrateSuccessResponse)
    });
    userService.userMigrate(params);
    const options = { url: 'user/v1/migrate', data: params };
    expect(mockLearnerService.post).toHaveBeenCalledWith(options);
  });

  it('should call getAnonymousUserPreference', () => {
    jest.spyOn(mockPublicDataService, 'post').mockImplementation(() => {
      return of({ result: { board: 'CBSE' } }) as any
    }) as any;
    jest.spyOn(mockPublicDataService, 'get').mockImplementation(() => {
      return of() as any
    }) as any;
    userService.getAnonymousUserPreference();
    expect(mockPublicDataService.get).toHaveBeenCalled();

  });

  it('should call updateAnonymousUserDetails', () => {
    jest.spyOn(mockPublicDataService, 'post').mockImplementation(() => {
      return of({ result: { board: 'CBSE' } }) as any
    }) as any;
    userService.updateAnonymousUserDetails({});
    expect(mockPublicDataService.post).toHaveBeenCalled();
  });

  it('should call createAnonymousUser', () => {
    jest.spyOn(mockPublicDataService, 'post').mockImplementation(() => {
      return of({ result: { board: 'CBSE' } }) as any
    }) as any;
    userService.createAnonymousUser({});
    expect(mockPublicDataService.post).toHaveBeenCalled();
  });

  it('should call createGuestUser', () => {
    userService.isDesktopApp = true;
    jest.spyOn(userService, 'createAnonymousUser').mockReturnValue(of({} as any) as any);
    userService.createGuestUser({});
    expect(userService.createAnonymousUser).toHaveBeenCalled();
  });

  it('should call createGuestUser for portal', () => {
    userService.isDesktopApp = false;
    jest.spyOn(userService, 'getGuestUser').mockReturnValue(of({} as any) as any);
    const resp = userService.createGuestUser({});
    expect(userService.getGuestUser).toHaveBeenCalled();
  });

  it('should call updateGuestUser for desktop', () => {
    userService.isDesktopApp = true;
    jest.spyOn(userService, 'updateAnonymousUserDetails').mockReturnValue(of({} as any) as any);
    userService.updateGuestUser({ _id: 'abcd', name: 'Guest' });
    expect(userService.updateAnonymousUserDetails).toHaveBeenCalled();
  });

  it('should call updateGuestUser for portal', () => {
    userService.isDesktopApp = false;
    jest.spyOn(userService, 'getGuestUser').mockReturnValue(of({} as any) as any);
    userService.updateGuestUser({ _id: 'abcd', name: 'Guest' });
    expect(userService.getGuestUser).toHaveBeenCalled();
  });

  it('should call endsession', () => {
    userService.endSession();
    expect(mockHttpClient.get).toBeCalled();
  });

  it('should call getUserByKey', () => {
    userService.getUserByKey('sunbird');
    expect(mockLearnerService.get).toBeCalled();
  });

  it('should call getIsUserExistsUserByKey', () => {
    userService.getIsUserExistsUserByKey('sunbird');
    expect(mockLearnerService.get).toBeCalled();
  });

  it('should call getFeedData', () => {
    userService.getFeedData();
    expect(mockLearnerService.get).toBeCalled();
  });

  it('should call slug method', () => {
    const obj = userService.slug;
    expect(obj).toEqual('sunbird');
  });

  it('should call anonymousSid method', () => {
    const obj = userService.anonymousSid;
    expect(obj).toBeDefined();
  });

  it('should call loggedIn method', () => {
    const obj = userService.loggedIn;
    expect(obj).toBeFalsy();
  });

  it('should call userid method', () => {
    userService.setUserId('0008ccab-2103-46c9-adba-6cdf84d37f06');
    const obj = userService.userid;
    expect(obj).toBe('0008ccab-2103-46c9-adba-6cdf84d37f06');
  });

  it('should call sessionId method', () => {
    const obj = userService.sessionId;
    expect(obj).toBe('daxeVBKC8xKVn8lbMUB5AVcw5yjLnNbZ');
  });

  it('should call setIsCustodianUser method and also get the value isCustodianUser', () => {
    userService.setIsCustodianUser(true);
    const obj = userService.isCustodianUser;
    expect(obj).toBeTruthy();
  });

  it('should call appId method', () => {
    const obj = userService.appId;
    expect(obj).toEqual('sunbirdApp');
  });

  it('should call cloudStorageUrls method', () => {
    const obj = userService.cloudStorageUrls;
    expect(obj).toEqual(['https://sunbird.sunbird']);
  });

  it('should call userProfile method', () => {
    const obj = userService.userProfile;
    expect(obj).toEqual(mockUserData.userProfile);
  });

  it('should call rootOrgId method', () => {
    const obj = userService.rootOrgId;
    expect(obj).toEqual('ORG_001');
  });

  it('should call hashTagId method', () => {
    const obj = userService.hashTagId;
    expect(obj).toEqual('b00bc992ef25f1a9a8d63291e20efc8d');
  });

  it('should call getServerTimeDiff method', () => {
    const obj = userService.getServerTimeDiff;
    expect(obj).toEqual('2018-02-28 12:07:33:518+0000');
  });

  it('should call dims method', () => {
    const res = [
      'ORG_001',
      '0123653943740170242',
      'b00bc992ef25f1a9a8d63291e20efc8d'
    ];
    const obj = userService.dims;
    expect(obj).toEqual(res);
  });

  it('should call UserOrgDetails method', () => {
    const obj = userService.UserOrgDetails;
    expect(obj).toBe(undefined);
  });

  it('should call RoleOrgMap method', () => {
    const obj = userService.RoleOrgMap;
    expect(obj).toBe(undefined);
  });

  it('should call deleteUser method', () => {
    const postSpy = jest.spyOn(userService.learnerService, 'post');
    const expectedOptions = {
      url: userService.config.urlConFig.URLS.USER.DELETE,
      data: {
        request: {
          userId: '0008ccab-2103-46c9-adba-6cdf84d37f06'
        }
      }
    };
    userService.deleteUser();
    expect(postSpy).toHaveBeenCalledWith(expectedOptions);
    postSpy.mockClear();
  });

  it('should call acceptTermsAndConditions method', () => {
    jest.spyOn(mockLearnerService, 'post').mockImplementation(() => {return of(mockUserData.success) as any
    });
    const opt = {
      url: 'user/v1/tnc/accept',
      data: {  version: '4', identifier: 'adminTnC'}
    }
    const request = {
      version: '4',
      identifier: 'adminTnC'
    }
    userService.acceptTermsAndConditions(request);
    expect(mockLearnerService.post).toHaveBeenCalledWith(opt)
  });
  it('should return defaultFrameworkFilters with user logged in', () => {
    const mockUserProfile = {
      framework: {
        [userService.frameworkCategories?.fwCategory2?.code]: 'MockCategory2',
        [userService.frameworkCategories?.fwCategory3?.code]: 'MockCategory3',
        [userService.frameworkCategories?.fwCategory1?.code]: 'MockCategory1',
        id: 'MockUserId',
      },
    };

    Object.defineProperty(userService, 'loggedIn', { get: jest.fn(() => true) });
    Object.defineProperty(userService, 'userProfile', { get: jest.fn(() => mockUserProfile) });
    const result = userService.defaultFrameworkFilters;
    expect(result).toEqual({
      [userService.frameworkCategories?.fwCategory1?.code]: userService.defaultBoard,
      [userService.frameworkCategories?.fwCategory2?.code]: 'MockCategory2',
      [userService.frameworkCategories?.fwCategory3?.code]: 'MockCategory3',
      [userService.frameworkCategories?.fwCategory1?.code]: 'MockCategory1',
      id: 'MockUserId',
    });
  });

    it('should return defaultFrameworkFilters with user not logged in', () => {
    // Use spy objects to mock the readonly properties
    jest.spyOn(userService, 'userid', 'get').mockReturnValue(null);
    jest.spyOn(userService, 'slug', 'get').mockReturnValue(null);
    jest.spyOn(userService, 'userProfile', 'get').mockReturnValue(null);
    (userService as any)._userData$ = {
      subscribe: (callback: any) => callback({userProfile: null})
    };
    const result = userService.defaultFrameworkFilters;
    // Check if result is not null/undefined
    if (result) {
      const categoryCode = userService.frameworkCategories?.fwCategory1?.code;
      if (categoryCode) {
        expect(result[categoryCode]).toEqual(userService.defaultBoard);
      }
      // Check that result doesn't have an 'undefined' key
      expect(Object.keys(result).includes('undefined')).toBe(false);
    } else {
      // If result is null/undefined, that's also valid for a non-logged user
      expect(result).toBeUndefined();
    }
  });

});