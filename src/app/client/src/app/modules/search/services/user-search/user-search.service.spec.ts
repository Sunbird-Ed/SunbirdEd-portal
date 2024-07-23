import {map} from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ConfigService } from '@sunbird/shared';
import { LearnerService } from '@sunbird/core';
import { UserSearchService } from './user-search.service';

describe('HomeSearch Component', () => {
  let component: UserSearchService;

  const mockconfig: Partial<ConfigService> = {
    constants: {
      SIZE: {
        SMALL: 1
      },
      VIEW: {
        VERTICAL: {
        }
      }
    },
    appConfig: {
    },
    rolesConfig: {
      headerDropdownRoles: {
        adminDashboard: '',
        myActivityRole: '',
        orgSetupRole: '',
        orgAdminRole: '',
      }
    },
    urlConFig: {
      URLS: {
        ADMIN: {
          DELETE_USER: '/explore/admin/delete/user'
        },
        OFFLINE: {
          LOGIN: '/explore'
        },
        USER: {
          GET_PROFILE: '/explore/user/getProfile/',
          GET_PROFILE_V5: '/explore/user/getProfileV5/',
          TYPE: '/explore/user/type'
        }
      }
    }
  };

  const mockLearnerService: Partial<LearnerService> = {
    post: jest.fn(),
    get: jest.fn(),
  };

  beforeAll(() => {
    component = new UserSearchService(
      mockLearnerService as LearnerService,
      mockconfig as ConfigService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it('should delete user', () => {
    const requestParam = { userId: 'testUserId' };
    const mockSpy = jest.spyOn(mockLearnerService, 'post').mockImplementation(() => of({}) as any);
    component.deleteUser(requestParam);

    expect(mockSpy).toHaveBeenCalledWith({
      url: '/explore/admin/delete/user',
      data: { request: { userId: 'testUserId' } }
    });
  });

  it('should update roles', () => {
    const requestParam = { userId: 'testUserId', orgId: 'testOrgId', roles: ['role1', 'role2'] };
    const mockSpy = jest.spyOn(mockLearnerService as any, 'post').mockImplementation(() => of({}) as any);
    component.updateRoles(requestParam);

    expect(mockSpy).toHaveBeenCalledWith({
      data: {
        request: {
          userId: 'testUserId',
          organisationId: 'testOrgId',
          roles: ['role1', 'role2']
        }
      }
    });
  });

  it('should get user by id', () => {
    const userId = 'testUserId';
    const option = {
      url: '/explore/user/getProfile/' + userId + '?fields=organisations,roles,locations'
    };
    const mockGet = jest.spyOn(mockLearnerService as any, 'get').mockImplementation(() => of({}));
    component.getUserById({ userId });

    expect(mockGet).toHaveBeenCalledWith(option);
  });

  it('should get user by id (v5)', () => {
    const userId = 'testUserId';
    const option = {
      url: '/explore/user/getProfileV5/' + userId + '?fields=organisations,roles,locations'
    };
    const mockGet = jest.spyOn(mockLearnerService as any, 'get').mockImplementation(() => of({}));
    component.getUserByIdV5({ userId });

    expect(mockGet).toHaveBeenCalledWith(option);
  });

  it('should get user type', () => {
    const option = {
      url: '/explore/user/type'
    };
    const mockGet = jest.spyOn(mockLearnerService as any, 'get').mockImplementation(() => of({}));
    component.getUserType();

    expect(mockGet).toHaveBeenCalledWith(option);
  });

});
